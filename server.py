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

def scan_filesystem():
    database_handler.create_database()
    for entry in fileScanner.scan_recursive(ROOT):
        database_handler.file_entry(entry['id'], entry['name'], entry['path'], entry['ext'], entry['hashvalue'], entry['size'], entry['created'], entry['updated'],entry['changehash'], entry['isfolder'], entry['parent'])

class LoginHandler(tornado.web.RequestHandler):
    """ Handles request for the login page"""
    def post(self):
        code = self.get_argument("code")
        print(code)

class FileSystemHandler(tornado.web.RequestHandler):
    """ Queries the file structur and returns the filesystem represented as a JSON String"""
    def get(self):
        #filesystem = {"a": {"id":"a","parent": "b","type": "folder","name": "Folder-A","lastModified": "2011-07-15","children": ["f", "g"],"status":"open","user":["reem"],"owner":"mazen"},"b": {"id":"b","parent": "null","type": "folder","name": "Folder-B","lastModified": "1999-07-15","children": ["a", "c", "d"],"status":"open","user":["mazen"],"owner":"reem"},"d": {"id":"d","parent": "b","type": "folder","name": "Folder-D","lastModified": "2000-07-15","children": [],"status":"open","user":["mazen","peter"],"owner":"calle"},"f": {"id":"f","parent": "a","type": "folder","name": "folder-F","lastModified": "2017-07-15","children": ["c", "h"],"status":"closed","user":["emil"],"owner":"joushua"},"c": {"id":"c","parent": "f","type": "folder","name": "folder-C","lastModified": "2017-07-15","children": [],"status":"open","user":["mazen"],"owner":"peter"},"g": {"id":"g","parent": "a","type": "folder","name": "Folder-G","lastModified": "2017-10-15","children": [],"status":"open","user":["mazen"],"owner":"joushua"},"h": {"id":"h","parent": "f","type": "folder","name": "Folder-H","lastModified": "2017-10-15","children": ["i"],"status":"closed","user":["mazen","emil"],"owner":"peter"},"i": {"id":"i","parent": "h","type": "folder","name": "Folder-I","lastModified": "2017-10-15","children": ["j"],"status":"closed","user":[],"owner":"mazen"},"j": {"id":"j","parent": "i","type": "folder","name": "Folder-J","lastModified": "2017-10-15","children": ["k"],"status":"open","user":["reem","mazen"],"owner":"mazen"},"k": {"id":"k","parent": "j","type": "folder","name": "Folder-K","lastModified": "2017-10-12","children": ["l", "m"],"status":"closed","user":["calle","peter","mazen"],"owner":"joushua"},"l": {"id":"l","parent": "k","type": "folder","name": "Folder-L","lastModified": "2017-09-15","children": [],"status":"open","user":["mazen"],"owner":"joushua"},"m": {"id":"m","parent": "k","type": "File","name": "Folder-M","lastModified": "2017-09-15","children": [],"status":"open","user":["mazen"],"owner":"peter" ,"project_id":"project1"},"cad1": {"id":"cad1","parent": "k","type": "File","name": "CAD1-M","lastModified": "2017-09-15","children": [],"status":"open","user":["mazen"],"owner":"peter","project_id":"project1","extention": "CAD"},"stl1": {"id":"stl1","parent": "k","type": "File","name": "STL1-M","lastModified": "2017-09-15","children": [],"status":"open","user":["mazen"],"owner":"peter","project_id":"project1","extention": "STL"},"build1": {"id":"build1","parent": "k","type": "File","name": "Build1","lastModified": "2017-09-15","children": [],"status":"open","user":["mazen"],"owner":"peter","project_id":"project1","extention": "build"},"build2": {"id":"build2","parent": "k","type": "File","name": "Build2","lastModified": "2017-09-15","children": [],"status":"open","user":["mazen"],"owner":"peter","project_id":"project1","extention": "build"},"material1":{"type":"File","id": "material1","project_id":"project1" ,"build_id":"build1" ,"name":"material1","extention": "material"},"material2":{"type":"File","id": "material2","project_id":"project1" ,"build_id":"build2" ,"name":"material2","extention": "material"} ,"customer1":{"name":"Volvo","project_id":"project1","id":"customer1","extention": "customer"},"project1":{"type":"File","name":"P01","id":"project1","extention": "project"},"measure1":{"type":"File","id": "measure1","project_id":"project1","build_id":"build1","material_id":"material1","name":"material1 measure","certificate":"m","extention":"measure"},"measure2":{"type":"File","id": "measure2","project_id":"project1","build_id":"build2","material_id":"material2","name":"material2 measure","certificate":"m","extention":"measure"},"image1":{"type":"File","id": "image1","project_id":"project1","build_id":"build1","name":"image1","certificate":"m","extention":"image"},"image2":{"type":"File","id": "image2","project_id":"project1","build_id":"build2","name":"image2","certificate":"m","extention":"image"},"slm1":{"type":"File","id": "slm1","project_id":"project1","build_id":"build1","name":"SLM1","extention":"SLM"} ,"slm2":{"type":"File","id": "slm2","project_id":"project1","build_id":"build1","name":"SLM2","extention":"SLM"},"slm3":{"type":"File","id": "slm3","project_id":"project1","build_id":"build2","name":"SLM3","extention":"SLM"}}
        self.write(json.dumps({"success":True, "filesystem":database_handler.get_file_system()}))

class SubscriptionHandler(tornado.web.RequestHandler):
    def post(self):
        fileKey = self.get_argument("fileKey")
        mail_target = resolve_user_mail()        
        notifier.notify_by_mail(mail_target, "Your subscription", "Some information...")
        self.write("Check your mail!")

def resolve_user_mail():
    """Return the email address of the current user"""
    return "dummy@user.com" # TODO Lookup email in database

def make_app():
    """ Defines settings and routes. Returns an application"""
    return tornado.web.Application(static_path=os.path.join(ROOT, "static"), template_path=os.path.join(ROOT, "templates"), compress_response=True,
        handlers=[
            (r"/filesystem", FileSystemHandler),
            (r"/subscribe", SubscriptionHandler),            
            (r"/(.*)", tornado.web.StaticFileHandler, {"path": os.path.join(ROOT, "static"), "default_filename": "index.html"})
        ])

if __name__ == "__main__":
    APP = make_app()
    APP.listen(PORT)
    scan_filesystem()
    print ("Server started")
    tornado.ioloop.IOLoop.current().start()
    
