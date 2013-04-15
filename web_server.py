import tornado.ioloop
import tornado.web
import tornado.websocket
import os


# Global variables
# Yes, we need some!
CHARTS        = []
CONTROLERS    = []
template_path = os.path.join(os.path.dirname(__file__), "templates")
static_path   = os.path.join(os.path.dirname(__file__), "static")
messagec      = '' # For caching.


# Web event handlers.
class MainHandler(tornado.web.RequestHandler):
    '''
    Just serve the pages for now. We may need to do something with them
    in the future, but not yet.
    '''
    def get(self, page_name):
        self.write(render_template(page_name))


class IPHandler(tornado.web.RequestHandler):
    '''
    Just diplay the host's IP address.
    ''' 
    def get(self, page_name):
      import socket
      self.set_header("Content-Type", 'text/plain')
      self.write(socket.gethostbyname(socket.gethostname()))

# The main functions of the two following classes COULD be merged into
# one class from which they'd inherit, but for now, it would probably
# mostly make things more confusing. So let's leave things as they are.
class ChartHandler(tornado.websocket.WebSocketHandler):
    '''
    Set up a connection to the chart. We won't be receiving any
    information from it, just sending some.
    '''
    def open(self):
        CHARTS.append(self)
    def on_message(self, message):
        self.write(messagec if messagec != '' else
            {'e': '50', 'a': '50', 'k': '50', 's': '50'});
    def on_close(self):
        try: CHARTS.remove(self)
        except ValueError as e: print('Could not remove chart handler:', e)

class ControllerHandler(tornado.websocket.WebSocketHandler):
    '''
    Get every change from each controller and send it back to all the other
    controllers, if there are any. That way, if other controllers make a
    change, it will include the ones made by other people.
    '''
    def open(self):
        CONTROLERS.append(self)
    def on_message(self, message):
        messagec = message
        for chart in CHARTS: chart.write_message(message)
        for cont in filter(lambda x: x != self, CONTROLERS):
            cont.write_message(message)
    def on_close(self):
        try: CONTROLERS.remove(self)
        except ValueError as e: print('Could not remove controller handler:', e)

class StaticFileHandlerExtra(tornado.web.StaticFileHandler):
    '''
    A customized StaticFileHandler that fixes issues with the MIME types
    on Windows
    '''
    # def initialize(self, path, default_filename=None):
    #     import mimetypes
    #     mimetypes.init()
    #     mimetypes.add_type('image/png', '.png')
    #     tornado.web.StaticFileHandler.initialize(self, path, default_filename)
    def set_extra_headers(self, path):
        if path.endsWith('.png'): self.set_header("Content-Type", 'image/png')

# Global functions

def file_get_contents(filename):
    with open(filename) as f:
        return f.read()

# So far, there are no index files, but, just in case, plan for them.
def render_template(filename):
    '''
    Find and deliver the right HTML files. Raise the correct error if
    they're not found.
    '''
    # Is a directory.
    if os.path.isdir(os.path.join(template_path, filename)):
        filename = os.path.join(template_path, filename, 'index.html')
    # Is a page.
    else:
        filename = '%s.html' % filename
        filename = os.path.join(template_path, filename)
    filename = os.path.normpath(filename)
    try:
        return file_get_contents(filename)
    except FileNotFoundError:
        raise tornado.web.HTTPError(404)

# Get the whole thing running
def main():
    application = tornado.web.Application(
        [
            (r"/ip()",         IPHandler),
            (r"/chart_socket", ChartHandler),
            (r"/cont_socket",  ControllerHandler),
            (r"/static/(.*)",  StaticFileHandlerExtra, {"path": static_path}),
            (r"/(.*)",         MainHandler),
        ],
        template_path = template_path,
        static_path   = static_path
    )
    application.listen(8887)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
