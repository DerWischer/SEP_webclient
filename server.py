''' Swerea Server v1.0 '''
import os
import json
import uuid
import tornado.ioloop
import tornado.web
import fileScanner
import database_handler
import notifier

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
        username = "somename"; # TODO Resolve username from code        
        self.set_secure_cookie("user", username)
        print("Secure cookie set for user with code: " + code)
        self.redirect("/")      

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
        self.write(database_handler.save_file(fileId,".svg",fileInfo))

class FileUpdateInformationHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        fileId = self.get_argument("fileId")
        fileInfo= self.get_argument("fileInfo")
        print(fileInfo)
        self.write(database_handler.update_file(fileId,".svg",fileInfo))

class FileTemplateHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        fileId = self.get_argument("fileId")
        ext = database_handler.get_fileExt(fileId)
        jsondata = database_handler.get_data(fileId)
        jsonfile = 'slm.json'
        for filename in os.listdir(os.path.join(ROOT,'static','alpacatemplates')): 
            if ext == '.svg': 
               jsonfile = filename
        #text = ""#'{ "title":"User Feedback", "description":"What do you think about Alpaca?", "type":"object", "properties": { "name": { "type":"string", "title":"Name" }, "feedback": { "type":"string", "title":"Feedback" }, "ranking": { "type":"string", "title":"Ranking", "enum":["excellent","ok","so so"] } } }'
        #with open(os.path.join(ROOT,'static','alpacatemplates',jsonfile)) as file:
        #    for line in file:
        #        text += line
        #self.write(text)
        decoded_json = json.load(open(os.path.join(ROOT,'static','alpacatemplates',jsonfile)))
        print(jsondata)
        decoded_json["data"] = json.loads(jsondata.replace("'",'"'))
        self.write(decoded_json)

class ViewTemplateHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        fileId = self.get_argument("fileId")
        ext = database_handler.get_fileExt(fileId)
        jsondata = database_handler.get_data(fileId)
        jsonfile = 'default.json'
        for filename in os.listdir(os.path.join(ROOT,'static','alpacatemplates')): 
            if ext == '.svg': 
               jsonfile = filename
        decoded_json = json.load(open(os.path.join(ROOT,'static','alpacatemplates',jsonfile)))
        print(jsondata)
        decoded_json["data"] = json.loads(jsondata.replace("'",'"'))
        self.write(decoded_json)
    

class UploadHandler(tornado.web.RequestHandler):
    def post(self):
        i=0
        filenames = self.request.arguments['filename']
        print (filenames)
        for file in self.request.files['file']:
            extension = os.path.splitext(file['filename'])[1]
            fname = str(uuid.uuid4())
            final_filename= fname+extension
            output_file = open("uploads/" + filenames[i].decode("utf-8"), 'wb')
            i += 1
            output_file.write(file['body'])
        self.finish(json.dumps({"success":True}))

class AuthStaticFileHandler (BaseHandler, tornado.web.StaticFileHandler):
    def set_extra_headers(self, path):
        self.set_header("Cache-control", "no-cache")

    @tornado.web.authenticated
    def get(self, path):        
        print("AuthStaticFileHandler -> " + path)
        if len(path) == 0:
            path="index"
            print("\tEmptry path. Default -> " + path)                  
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
            (r"/filesystem", FileSystemHandler),
            (r"/subscribe", SubscriptionHandler), 
            (r"/fileupdateinformation", FileUpdateInformationHandler),     
            (r"/fileinformation", FileInformationHandler),  
            (r"/filetemplate", FileTemplateHandler),
            (r"/viewtemplate", ViewTemplateHandler),
            (r"/upload", UploadHandler),
            # Watch out: AuthStaticFileHandle must be the last route!
            (r"/(.*)", AuthStaticFileHandler, {"path": os.path.join(ROOT, "static")}),
        ])

# Helper methods --------------------------------------------------------------
def resolve_user_mail():
    """Return the email address of the current user"""
    return "dummy@user.com" # TODO Lookup email in database

def scan_filesystem():
    database_handler.create_database()    
    for entry in fileScanner.scan_recursive(ROOT):
        database_handler.file_entry(entry['id'], entry['name'], entry['path'], entry['ext'], entry['hashvalue'], entry['size'], entry['created'], entry['updated'],entry['changehash'], entry['isfolder'], entry['parent'])

# Main function ---------------------------------------------------------------
if __name__ == "__main__":
    if not os.path.exists("uploads"):
            os.mkdir("uploads")
    APP = make_app()
    APP.listen(PORT)
    scan_filesystem()
    print ("Server started")
    tornado.ioloop.IOLoop.current().start()
    
