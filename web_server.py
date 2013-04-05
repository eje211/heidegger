import tornado.ioloop
import tornado.web
import os

# Global variables
# Yes, we need some!
CHARTS     = []
CONTROLERS = []
# We'll use the same folder for statics and templates.
static     = 'static'
cwd        = os.getcwd()
knows_exts = ('.png', '.jpg', '.gif', '.ico')

class MainHandler(tornado.web.RequestHandler):
    def get(self, page_name):
        page_name = file_resolver(page_name)
        if not os.path.exists(page_name):
            page_name = file_resolver('chart')
        try: self.write(file_get_contents(page_name))
        except FileNotFoundError: pass

# Global functions

def file_get_contents(filename):
    with open(filename) as f:
        return f.read()

def file_resolver(filename):
    if not filename.endswith(knows_exts):
	    filename += '.html'
    filename = '%s/%s' % (static, filename)

def main():
    application = tornado.web.Application([
        (r"/(.*)", MainHandler),
    ])
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()