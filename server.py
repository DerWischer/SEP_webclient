import os
import tornado.ioloop
import tornado.web

ROOT = os.path.dirname(__file__)
PORT = 8888

class IndexHandler(tornado.web.RequestHandler):
    """ Handles request for the main page"""
    def get(self):
        self.render("index.html")

class LoginHandler(tornado.web.RequestHandler):
    """ Handles request for the login page"""
    def get(self):
        self.render("login.html")

class AccountHandler(tornado.web.RequestHandler):
    """ Handles requests for the account page"""
    def get(self):
        self.render("account.html")    

class FileSystemHandler(tornado.web.RequestHandler):
    """ Queries the file structur and return the filesystem represented as a JSON String"""
    def get(self):
        self.write("Under construction: Return filesystem as json string")

def make_app():
    """ Defines settings and routes. Returns an application"""
    return tornado.web.Application(
        # path to scripts, img, etc.
        static_path=os.path.join(ROOT, "static"),
        # path to html files
        template_path=os.path.join(ROOT, "templates"),
        # set routes and specify handlers
        handlers=[
            (r"/", IndexHandler),
            (r"/login", LoginHandler),
            (r"/account", AccountHandler),
            (r"/filesystem", FileSystemHandler)
        ])

if __name__ == "__main__":
    print ("Server started")
    APP = make_app()
    APP.listen(PORT)
    tornado.ioloop.IOLoop.current().start()
    