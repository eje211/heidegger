import tornado.ioloop
import tornado.web
from tornado import httpclient
import os

# Global variables
# Yes, we need some!
CHARTS              = []
CONTROLERS          = []
# We'll use the same folder for statics and templates.
cwd                 = os.getcwd()
template_path       = os.path.join(os.path.dirname(__file__), "templates")
static_path         = os.path.join(os.path.dirname(__file__), "static")

class MainHandler(tornado.web.RequestHandler):
    def get(self, page_name):
        if page_name.startswith('images'):
            self.set_header("Content-Type", "image/png")
            self._write_buffer.append(str(render_template(page_name)))
        else: self.write(render_template(page_name))


# Global functions

def file_get_contents(filename):
    with open(filename) as f:
        return f.read()

def render_template(filename):
	# Is a directory.
    if os.path.isdir(os.path.join(template_path, filename)):
        filename = os.path.join(filename, 'index.html')
    # Is a page.
    else:
        filename = '%s.html' % filename
        filename = os.path.join(template_path, filename)
    filename = os.path.normpath(filename)
    try:
        return file_get_contents(filename)
    except FileNotFoundError:
        raise tornado.web.HTTPError(404)

def main():
    application = tornado.web.Application(
        [
            (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": static_path}),
            (r"/(.*)", MainHandler),
        ],
        template_path=template_path,
        static_path=static_path
    )
    application.listen(8887)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()