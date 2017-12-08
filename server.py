''' Swerea Server v1.0 '''
import os
import json
import uuid
import tornado.ioloop
import tornado.web
import files
from tornado.httpclient import AsyncHTTPClient 
import database_handler
import notifier
import MySQLdb
import shutil
import mimetypes

DEVELOPMENT_MODE = True #WARNING:THIS WILL DELETE THE FILESYSTEM AND THE DATABASE EVERY STARTUP
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
        user_id = user_info["user_id"]
        self.set_secure_cookie("user", user_id)
        self.redirect("/")

class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("user")
        self.redirect("/")    

class AccountHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        name = self.get_argument("name")
        success = database_handler.update_account(self.get_current_user(), name)
        print(success)
        self.write(json.dumps({"success":success}))
        self.redirect("/")

class GetAccountDetails(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        details = database_handler.get_account_details(self.get_current_user())
        self.write(json.dumps({"success":True, "name":details["name"]}))

class CheckPrivilege(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        privilege_level = database_handler.check_privilege(self.get_current_user())
        self.write(json.dumps({"success":True, "privilege":privilege_level["privilege"]}))

class CreateAccoundHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        privilege_level = database_handler.check_privilege(self.get_current_user())
        check = privilege_level["privilege"]
        if(check >= "2"):
            self.render("createAccount.html")
        else:
            print("You are not permitted: Privilege -> "+check)
            self.redirect("/")
    def post(self):
        id = self.get_argument("ID")
        name = self.get_argument("name")
        code = self.get_argument("code")
        privilege = self.get_argument("privilege")
        create_account = database_handler.create_account(id, name, code, privilege)
        print(create_account)
        self.write(json.dumps({"success":create_account}))
        self.redirect("/")

class FileSystemHandler(BaseHandler):
    """ Queries the file structur and returns the filesystem represented as a JSON String"""
    @tornado.web.authenticated
    def get(self):        
        self.write(json.dumps({"success":True, "filesystem":database_handler.get_file_system()}))
    @tornado.web.authenticated
    def delete(self):
        files = json.loads(self.get_argument("files"))
        failed_files = {}
        for file in files:
            if not database_handler.delete_from_filesystem(file):
                failed_files[file] = {"reason":"Can not delete system file"}
        self.finish(json.dumps({"success":True, "failed_files":failed_files}))

        

class SubscriptionHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        fileKey = self.get_argument("fileKey")
        mail_target = resolve_user_mail()        
        notifier.notify_by_mail(mail_target, "Your subscription", "Some information...")
        self.write("Check your mail!")

class FileInformationHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        fileId = self.get_argument("fileId")
        fileinfo = database_handler.get_file_information(fileId)
        if fileinfo != None:
            self.write(json.dumps({"success":True, "data":fileinfo}))
        else:
            self.write(json.dumps({"success":False}))
        
    @tornado.web.authenticated
    def post(self):
        try:
            fileId = self.get_argument("fileId")
            fileInfo = self.get_argument("fileInfo")
            fileInfoJSON = json.loads(fileInfo)        
            success = database_handler.store_fileinformation(fileId, fileInfoJSON)
            self.write(json.dumps({"success":success}))
        except ValueError as ex:
            print (ex)
            self.write(json.dumps({"success":False}))

class FileUpdateInformationHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        fileId = self.get_argument("fileId")
        fileInfo= self.get_argument("fileInfo")
        fileExt = get_fileExt(fileId)
        self.write(database_handler.update_file(fileId,fileExt,fileInfo))

class FileTemplateHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        fileId = self.get_argument("fileId")        
        form = database_handler.generate_alpaca(fileId)
        if form == None:
            self.finish(json.dumps({"success":False}));
            return
        self.finish(json.dumps({"success":True, "form":form}))

class UploadHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        uploadtype = self.get_argument('upload-type') #powder etc.
        parent_folder = self.request.arguments['folder'] #parentfolder
        for file in self.request.files['file']: #eachfile
            filename = file['filename']
            parent_path = database_handler.get_folder_path_from_id(parent_folder)
            if parent_path == None:
                self.finish(json.dumps({"success":False, "reason":"Parent folder does not exist"}))
            filepath = os.path.join(parent_path, filename)
            with open(filepath, 'wb') as output_file:
                output_file.write(file['body'])
                output_file.flush()
            entry = files.get_file_stats(parent_folder, filepath, filename)
            if uploadtype != "file":
                newpath = get_path_for_upload_type(uploadtype, filename)
                if newpath != None:
                    manipulate_file_stats_for_upload_type(uploadtype, entry)
                    shutil.move(filepath, newpath)
            database_handler.file_entry(entry, self.get_current_user())
        self.finish(json.dumps({"success":True}))

def get_path_for_upload_type(uploadtype, filename):
        if (uploadtype == "powder"):
            return os.path.join("uploads", "powders", filename)
        elif (uploadtype == "project"):
            return os.path.join("uploads", "projects", filename)
        elif (uploadtype == "customer"):
            return os.path.join("uploads", "customers", filename)
        return None
def manipulate_file_stats_for_upload_type(uploadtype, stats):        
        if uploadtype == "powder":
            stats['form_id'] = database_handler.get_form_type_id_by_name(".powder")
            stats['parent'] = "POWDERS"
        elif uploadtype == "project":
            stats['form_id'] = database_handler.get_form_type_id_by_name("project")
            stats['parent'] = "PROJECTS"
        elif uploadtype == "customer":
            stats['form_id'] = database_handler.get_form_type_id_by_name(".customer")
            stats['parent'] = "CUSTOMERS"
class NewCustomerHandler(BaseHandler):    
    def post(self):
        """ Add a customer to the database """
        customer_name = self.get_argument("name")
        entry = files.generate_customer_file(customer_name)
        manipulate_file_stats_for_upload_type("customer", entry)
        database_handler.file_entry(entry, self.get_current_user())
        self.finish(json.dumps({"success":True}))

class NewFolderHandler(tornado.web.RequestHandler):
    def post(self):
        name = self.get_argument("name", default=None, strip=False)
        parent =  self.get_argument("parent", default=None, strip=False)
        parent_path = database_handler.get_folder_path_from_id(parent)
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
class RenameFileHandler(BaseHandler):    
    def post(self):
        """ Rename File in OS and database """
        new_file_name = self.get_argument("name")
        fileId = self.get_argument("fileId")
        print(new_file_name)
        print(fileId)
        path, name, ext = database_handler.get_file_path(fileId)
        new_file_path = path.replace(name,new_file_name)
        print(new_file_path)
        os.rename(path, new_file_path)
        database_handler.update_file_name(fileId, new_file_name)
        database_handler.update_filesystem_name(fileId, new_file_name,new_file_path)
        self.finish(json.dumps({"success":True}))
class DownloadHandler(tornado.web.RequestHandler):
    def streaming_callback(chunk):
        self.write(chunk)
        self.flush()
    @tornado.gen.coroutine
    def get(self, fileId):
        path, name, ext = database_handler.get_file_path(fileId);
        filename = ''.join([name,ext])
        if not os.path.exists(path):
            self.finish()
        else:
            self.set_header('Content-Length', os.path.getsize(path))
            self.set_header('Content-Type', mimetypes.guess_type(path)[0])
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

class TypesHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        types = database_handler.get_types();
        if (types == None):
           self.write(json.dumps({"success":False}));
        else: 
            self.write(json.dumps({"success":True, "types":types}));
        self.finish()
    
class AuthStaticFileHandler (BaseHandler, tornado.web.StaticFileHandler):
    def set_extra_headers(self, path):
        self.set_header("Cache-control", "no-cache")

    @tornado.web.authenticated
    def get(self, path):                
        if len(path) == 0:
            path="index"            
        super(AuthStaticFileHandler, self).get(path + ".html")

class CreateNewProject(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        name = self.get_argument("name")
        customer = self.get_argument("customer")
        if len(name) == 0 or len(customer) == 0:
            self.finish(json.dumps({"success":False, "reason":"Missing Values"}))
            return
        filepath = os.path.join(ROOT, "uploads", "projects", name)
        try:
            os.makedirs(filepath)
            entry = files.get_folder_stats("PROJECTS", filepath, name)
            database_handler.file_entry(entry, self.get_current_user())
            self.finish(json.dumps({"success":True, "id":entry["id"]}))
        except Exception as ex:
            print (ex)
            self.finish(json.dumps({"success":True}))

class CustomerHandler(BaseHandler):
    def get(self):
        self.finish(json.dumps({"success":True, "customers":database_handler.get_customers()}))

class PowderHandler(BaseHandler):
    def get(self):
        self.finish(json.dumps({"success":True, "powders":database_handler.get_powders()}))

class AdvancedSearchHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):        
        try:
            matchall = int(self.get_argument("matchall", default=False))
            if matchall:
                matchall = True
            else:
                matchall = False
            searchJson = self.get_argument("json")
            searchParams = json.loads(searchJson)
        except ValueError as ex:
            print (ex)
            self.finish(json.dumps({"success":False}))
        fileIds = database_handler.advanced_search(searchParams, matchall)
        if fileIds == None:
            self.finish(json.dumps({"success":False}))
        else:
            self.finish(json.dumps({"success":True, "fileIds":fileIds}))

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
            (r"/upload", UploadHandler),
            (r"/types", TypesHandler),   
            (r"/customers", CustomerHandler),        
            (r"/powders", PowderHandler),
            (r"/search", AdvancedSearchHandler),    
            (r"/logout", LogoutHandler),
            (r"/accountUpdate", AccountHandler),
            (r"/createAccount", CreateAccoundHandler),
            (r"/createNewProject", CreateNewProject),
            (r"/newFolder", NewFolderHandler),
            (r"/newCustomer", NewCustomerHandler),
            (r"/newFileName", RenameFileHandler),
            (r"/getAccountDetails", GetAccountDetails),
            (r"/checkPrivilege", CheckPrivilege),
            (r"/filesystem", FileSystemHandler),
            (r"/subscribe", SubscriptionHandler), 
            (r"/fileupdateinformation", FileUpdateInformationHandler),     
            (r"/fileinformation", FileInformationHandler),  
            (r"/filetemplate", FileTemplateHandler),
            (r"/download/(.*)", DownloadHandler),
            (r"/login", LoginHandler),
            # Watch out: AuthStaticFileHandle must be the last route!
            (r"/(.*)", AuthStaticFileHandler, {"path": os.path.join(ROOT, "static")})
        ])

# Helper methods --------------------------------------------------------------
def resolve_user_mail():
    """Return the email address of the current user"""
    return "dummy@user.com" # TODO Lookup email in database

def create_form_type_links():
    formid = database_handler.create_form_type(".material")
    #Insert default attributes for form_types
    database_handler.create_form_type_to_type_link(formid, "name")
    database_handler.create_form_type_to_type_link(formid, "grade")
    database_handler.create_form_type_to_type_link(formid, "supplier")
    database_handler.create_form_type_to_type_link(formid, "lot no")
    database_handler.create_form_type_to_type_link(formid, "amount")
    database_handler.create_form_type_to_type_link(formid, "chemical composition")
    database_handler.create_form_type_to_type_link(formid, "physical properties")
    database_handler.create_form_type_to_type_link(formid, "sieve analysis")
    
    formid = database_handler.create_form_type(".slm")
    database_handler.create_form_type_to_type_link(formid, "SLM name")
    database_handler.create_form_type_to_type_link(formid, "printing start time")
    database_handler.create_form_type_to_type_link(formid, "printing end time")
    database_handler.create_form_type_to_type_link(formid, "printing operator date")
    database_handler.create_form_type_to_type_link(formid, "type of machine")
    database_handler.create_form_type_to_type_link(formid, "powder weight at start")
    database_handler.create_form_type_to_type_link(formid, "powder weight at end")
    database_handler.create_form_type_to_type_link(formid, "powder waste weight")
    database_handler.create_form_type_to_type_link(formid, "powder used")
    database_handler.create_form_type_to_type_link(formid, "build platform material")
    database_handler.create_form_type_to_type_link(formid, "build platform weight")
    database_handler.create_form_type_to_type_link(formid, "calculated print time")
    database_handler.create_form_type_to_type_link(formid, "powder condition")
    database_handler.create_form_type_to_type_link(formid, "number of layers")
    database_handler.create_form_type_to_type_link(formid, "DBC factor")
    database_handler.create_form_type_to_type_link(formid, "min exposure time")
    database_handler.create_form_type_to_type_link(formid, "printing comments")
    database_handler.create_form_type_to_type_link(formid, "support removal")
    database_handler.create_form_type_to_type_link(formid, "Wedm")
    database_handler.create_form_type_to_type_link(formid, "Wedm comment")
    database_handler.create_form_type_to_type_link(formid, "printed image")
    database_handler.create_form_type_to_type_link(formid, "blasting")
    database_handler.create_form_type_to_type_link(formid, "blasting type")
    database_handler.create_form_type_to_type_link(formid, "blasting comment")
    database_handler.create_form_type_to_type_link(formid, "stress temperature")
    database_handler.create_form_type_to_type_link(formid, "stress time")
    database_handler.create_form_type_to_type_link(formid, "stress shielding gas")
    database_handler.create_form_type_to_type_link(formid, "stress comment")
    database_handler.create_form_type_to_type_link(formid, "hardning time")
    database_handler.create_form_type_to_type_link(formid, "hardning comment")
    database_handler.create_form_type_to_type_link(formid, "tempering temperature")
    database_handler.create_form_type_to_type_link(formid, "tempering time")
    database_handler.create_form_type_to_type_link(formid, "tempering cycle")
    database_handler.create_form_type_to_type_link(formid, "tempering comment")
    database_handler.create_form_type_to_type_link(formid, "solution time")
    database_handler.create_form_type_to_type_link(formid, "solution temperature")
    database_handler.create_form_type_to_type_link(formid, "solution comment")
    database_handler.create_form_type_to_type_link(formid, "aging temperature")
    database_handler.create_form_type_to_type_link(formid, "aging time")
    database_handler.create_form_type_to_type_link(formid, "aging cycle")
    database_handler.create_form_type_to_type_link(formid, "aging comment")

    formid = database_handler.create_form_type(".powder")
    database_handler.create_form_type_to_type_link(formid, "material")
    database_handler.create_form_type_to_type_link(formid, "quantity")
    database_handler.create_form_type_to_type_link(formid, "powder condition")
    database_handler.create_form_type_to_type_link(formid, "temperature")

    formid = database_handler.create_form_type(".customer")
    database_handler.create_form_type_to_type_link(formid, "name")
    database_handler.create_form_type_to_type_link(formid, "email")
    database_handler.create_form_type_to_type_link(formid, "phone")    

    formid = database_handler.create_form_type(".build")
    database_handler.create_form_type_to_type_link(formid, "build name")    
    database_handler.create_form_type_to_type_link(formid, "project name")
    database_handler.create_form_type_to_type_link(formid, "number of parts")
    database_handler.create_form_type_to_type_link(formid, "printing parameter")
    database_handler.create_form_type_to_type_link(formid, "comment")

    formid = database_handler.create_form_type("default")
    database_handler.create_form_type_to_type_link(formid, "comment") 

    formid = database_handler.create_form_type("project")
    database_handler.create_form_type_to_type_link(formid, "project title")
    database_handler.create_form_type_to_type_link(formid, "customer")
    database_handler.create_form_type_to_type_link(formid, "material")
    database_handler.create_form_type_to_type_link(formid, "deadline")
    
    print ("Created Default Types")

#def scan_filesystem(): 
    #for entry in files.scan_recursive(ROOT):
    #    database_handler.file_entry(entry['id'], entry['name'], entry['path'], entry['ext'], entry['hashvalue'], entry['size'], entry['created'], entry['updated'],entry['changehash'], entry['isfolder'], entry['parent'])

# Main function ---------------------------------------------------------------
if __name__ == "__main__":
    if DEVELOPMENT_MODE:
        print ("****************WARNING: DEVELOPMENT MODE IS ACTIVE*******************")
        shutil.rmtree("uploads")
        database_handler.drop_database()
    if not os.path.exists("uploads"):
        os.mkdir("uploads")
    powders_path = os.path.join("uploads", "powders")
    if not os.path.exists(powders_path):
        os.mkdir(powders_path)
    projects_path = os.path.join("uploads", "projects")
    if not os.path.exists(projects_path):
        os.mkdir(projects_path)
    customers_path = os.path.join("uploads", "customers")
    if not os.path.exists(customers_path):
        os.mkdir(customers_path)
    APP = make_app()
    APP.listen(PORT)
    database_handler.create_database()
    create_form_type_links()
    print ("Server started")
    tornado.ioloop.IOLoop.current().start()
    
