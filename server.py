''' Swerea Server v1.0 '''
import os
import json
import uuid
import tornado.ioloop
import tornado.web
import filescanner
from tornado.httpclient import AsyncHTTPClient 
import database_handler
import notifier
import MySQLdb


ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8888

# Request Handlers ------------------------------------------------------------
class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")

class LoginHandler(BaseHandler):
    """ Handles request for the login page"""
    def get(self):        
        self.render("login.html")
    def post(self):
        code = self.get_argument("code")        
        user_info = database_handler.authenticate_user(code)
        username = user_info["name"]
        user_id = user_info["user_id"] # TODO Resolve username from code
        print("user id: "+str(user_id))
        self.set_secure_cookie("user", user_id)
        print("Secure cookie set for user: "+ username +" with code: " + code)
        self.redirect("/")

class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("user")
        self.redirect("/")    

class AccountHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        print (self.get_current_user())
        name = self.get_argument("name")
        pin = self.get_argument("code")
        success = database_handler.update_account(self.get_current_user(), name, pin)
        self.write(json.dumps({"success":success}))

class GetAccountDetails(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        details = database_handler.get_account_details(self.get_current_user())
        self.write(json.dumps({"success":True, "name":details["name"]}))
            

class FileSystemHandler(BaseHandler):
    """ Queries the file structur and returns the filesystem represented as a JSON String"""
    @tornado.web.authenticated
    def get(self):        
        self.write(json.dumps({"success":True, "filesystem":database_handler.get_file_system()}))

class SubscriptionHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        fileKey = self.get_argument("fileKey")
        mail_target = resolve_user_mail()        
        notifier.notify_by_mail(mail_target, "Your subscription", "Some information...")
        self.write("Check your mail!")

class FileInformationHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        fileId = self.get_argument("fileId")
        fileInfo= self.get_argument("fileInfo")
        print(fileInfo)
        self.write(database_handler.save_file(fileId, fileInfo))

class FileTemplateHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        fileId = self.get_argument("fileId")
        ext = database_handler.get_fileExt(fileId)
        #print('ext ' + ext)
        jsonfile = 'default.json'
        for filename in os.listdir(os.path.join(ROOT,'static','alpacatemplates')): 
            if ext == '.svg': 
               jsonfile = filename
        text = ""#'{ "title":"User Feedback", "description":"What do you think about Alpaca?", "type":"object", "properties": { "name": { "type":"string", "title":"Name" }, "feedback": { "type":"string", "title":"Feedback" }, "ranking": { "type":"string", "title":"Ranking", "enum":["excellent","ok","so so"] } } }'
        with open(os.path.join(ROOT,'static','alpacatemplates',jsonfile)) as file:
            for line in file:
                text += line
        self.write(text)

class UploadHandler(tornado.web.RequestHandler):
    def post(self):
        i=0
        filenames = self.request.arguments['filename']
        parent_folder = self.request.arguments['folder']
        print (filenames)
        for file in self.request.files['file']:
            extension = os.path.splitext(file['filename'])[1]
            filename = filenames[i].decode("utf-8")
            i += 1
            parent_path = database_handler.get_folder_path_from_id(parent_folder)
            filepath = os.path.join(parent_path, filename)
            with open(filepath, 'wb') as output_file:
                output_file.write(file['body'])
            entry = filescanner.get_file_stats(parent_folder, filepath, filename)
            database_handler.file_entry(entry['id'], entry['name'], entry['path'], entry['ext'], entry['hashvalue'], entry['size'], entry['created'], entry['updated'],entry['changehash'], entry['isfolder'], entry['parent'])
        self.finish(json.dumps({"success":True}))

class NewFolderHandler(tornado.web.RequestHandler):
    def post(self):
        name = self.get_argument("name", default=None, strip=False)
        parent =  self.get_argument("parent", default=None, strip=False)
        parent_path = database_handler.get_folder_path_from_id(parent)
        print ("parent path: " + parent_path)
        if parent_path == None:
            self.finish(json.dumps({"success":False, "reason":"parent does not exist in database"}))
            return
        elif not os.path.exists(parent_path):
            self.finish(json.dumps({"success":False, "reason":"parent does not exist on filesystem"}))
            return
        path = os.path.join(parent_path, name)
        if os.path.exists(path):
            self.finish(json.dumps({"success":False, "reason":"path already exists, please check database integrity"}))
            return
        os.mkdir(path)
        success = database_handler.create_folder(name, path, parent)
        if (success):
            self.finish(json.dumps({"success":success}))

class DownloadHandler(tornado.web.RequestHandler):
    def streaming_callback(chunk):
        self.write(chunk)
        self.flush()
    @tornado.gen.coroutine
    def get(self, fileId):
        path, name, ext = database_handler.get_file_path(fileId);
        filename = ''.join([name,ext])
        if not os.path.exists(path):
            print ("not found")
            self.finish()
        else:
            self.set_header('Content-Type', 'application/octet-stream')
            self.set_header('Content-Disposition', 'attachment; filename=%s' % filename)
            self.flush()
            with open(path, 'rb') as f:
                while True:
                    data = f.read(1024)
                    if not data:
                        break
                    self.write(data)
                    yield self.flush()
            self.finish()
    
class AuthStaticFileHandler (BaseHandler, tornado.web.StaticFileHandler):
    def set_extra_headers(self, path):
        self.set_header("Cache-control", "no-cache")

    @tornado.web.authenticated
    def get(self, path):        
        print("AuthStaticFileHandler -> " + path)
        if len(path) == 0:
            path="index"
            print("\tEmpty path. Default -> " + path)                  
        super(AuthStaticFileHandler, self).get(path + ".html")

# Create and Run app ----------------------------------------------------------
def make_app():
    """ Defines settings and routes. Returns an application"""
    return tornado.web.Application(
        static_path=os.path.join(ROOT, "static"), 
        template_path=os.path.join(ROOT, "templates"), 
        compress_response=True,
        cookie_secret="asecretmessage",
        login_url="/login",
        handlers=[            
            (r"/login", LoginHandler),
            (r"/logout", LogoutHandler),
            (r"/accountUpdate", AccountHandler),
            (r"/newFolder", NewFolderHandler),
            (r"/getAccountDetails", GetAccountDetails),
            (r"/filesystem", FileSystemHandler),
            (r"/subscribe", SubscriptionHandler),    
            (r"/fileinformation", FileInformationHandler),  
            (r"/filetemplate", FileTemplateHandler),
            (r"/upload", UploadHandler),
            (r"/download/(.*)", DownloadHandler),
            # Watch out: AuthStaticFileHandle must be the last route!
            (r"/(.*)", AuthStaticFileHandler, {"path": os.path.join(ROOT, "static")}),
        ])

# Helper methods --------------------------------------------------------------
def resolve_user_mail():
    """Return the email address of the current user"""
    return "dummy@user.com" # TODO Lookup email in database

#def scan_filesystem(): 
    #for entry in filescanner.scan_recursive(ROOT):
    #    database_handler.file_entry(entry['id'], entry['name'], entry['path'], entry['ext'], entry['hashvalue'], entry['size'], entry['created'], entry['updated'],entry['changehash'], entry['isfolder'], entry['parent'])

# Main function ---------------------------------------------------------------
if __name__ == "__main__":
    if not os.path.exists("uploads"):
            os.mkdir("uploads")
    APP = make_app()
    APP.listen(PORT)
    database_handler.create_database()    
    print ("Server started")
    tornado.ioloop.IOLoop.current().start()
    
