from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    authorizer = DummyAuthorizer()
    authorizer.add_user("user", "12345", 'D:/PucMinas/Redes1/gp1/ftpserver/ftp')
    authorizer.add_anonymous('D:/PucMinas/Redes1/gp1/ftpserver/ftp')
    handler = FTPHandler
    handler.authorizer = authorizer
    server = FTPServer(("127.0.0.1", 21), handler)
    server.serve_forever()
