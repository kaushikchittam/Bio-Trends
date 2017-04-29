import cherrypy
import os
import simplejson
import random
#import getNumOfPapersPerYear
#import getNumOfPapersPerSearch

class StringGenerator(object):
    @cherrypy.expose
    def index(self):
        return open('home.html')
    
class SubmitQuery:

    exposed = True

    def POST(self,keyword = None,keywordQualifer=None,query_type=None,notInclude=None):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        values=[]
        for i in range(21):
            values.append(random.random())
       
        message = {
                        "years": [1995,
                                1996,
                                1997,
                                1998,
                                1999,
                                2000,
                                2001,
                                2002,
                                2003,
                                2004,
                                2005,
                                2006,
                                2007,
                                2008,
                                2009,
                                2010,
                                2011,
                                2012,
                                2013,
                                2014,
                                2015],
                        "values": values
                        }
        #if id is None:
        #return simplejson.dumps(dict(message))
        print [str(x) for x in keyword]
        
        return ('kw =%s qualif =%s & type= %s & notinclude =%s' %(keyword,keywordQualifer,query_type,notInclude))
       # else:            
          # return('Song with the ID = %s & Name =%s' %(id, name))

cherrypy.config.update({'server.socket_port': 8050})
cherrypy.engine.restart()
if __name__ == '__main__':
    
    conf = {
         '/': {
            
             'tools.staticdir.root': os.path.abspath(os.getcwd())
         },
         '/css':{
             'tools.staticdir.on': True,
             'tools.staticdir.dir': 'css'
             },
         '/js':{
             'tools.staticdir.on': True,
             'tools.staticdir.dir': 'js'
             },
         '/img':{
             'tools.staticdir.on': True,
             'tools.staticdir.dir': 'img'
             },
         '/json':{
             'tools.staticdir.on': True,
             'tools.staticdir.dir': 'json'
             },
          '/formSubmit': {
             'request.dispatch': cherrypy.dispatch.MethodDispatcher()
         }
    }
  
    
                    

    webapp = StringGenerator()
    webapp.formSubmit = SubmitQuery()
    cherrypy.quickstart(webapp, '/', conf)
