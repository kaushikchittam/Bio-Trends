import cherrypy
import os
import json as simplejson
import random
import pymysql
import sys

DATABASE = "medline"
USER = "medline"

years = range(1995, 2015)

def set_op(lst_diff):
    #print lst_diff
    diff_set_op=lst_diff[0]
    for x in lst_diff:
        if match == 'all':
            diff_set_op =set(diff_set_op) & set(x)
        else:
            diff_set_op=set(diff_set_op) | set(x)
    return diff_set_op

class StringGenerator(object):
    @cherrypy.expose
    def index(self):
        return open('home.html')

class SubmitQuery:
    
    exposed = True

    def POST(self, keyword = None, keywordQualifer=None, query_type=None, fromYear=None, toYear=2016, notInclude=None):

        cherrypy.response.headers['Content-Type'] = 'application/json'
        my_dict={}
        mapresult=[]
        #kwlist=['D000109','D000818','D000313']
        print fromYear
        print toYear
        if not isinstance(keyword, list):
            keyword = [keyword]
            keywordQualifer =[keywordQualifer]

        if isinstance(notInclude, list):
            notInclude = str([-1])
        else:
            notInclude = str(notInclude)

        kwlist= [str(x) for x in keyword]
        #qlist=['Q000494','','Q000166']
        qlist= [str(x) for x in keywordQualifer]

        match=query_type
        #print kwlist
        #print qlist
        #print notInclude
    ## connect to the database
        db = pymysql.connect(host="localhost", user=USER, passwd="pubmed2015",db=DATABASE)
        cur1 = db.cursor()

        ## extract the total number of papers published in each year or qlist[index] !='Q000000'
        for index in range(len(kwlist)):
            kres=[]
            if (qlist[index] != ''):
                kquery="SELECT pubmedID FROM records WHERE meshID=%s AND qualifID =%s"
                # print kwlist[index]
                # print qlist[index]
                cur1.execute(kquery,(kwlist[index],qlist[index]))
            else:
                kquery="SELECT pubmedID FROM records WHERE meshID=%s"
                cur1.execute(kquery,kwlist[index])
            for row in cur1:
                kres.append(row[0])
                # print row[0]
            my_dict[index]=kres
        #def_set=[0]
        #print my_dict

        lst_diff=[]
        # print my_dict
        for k in my_dict.keys():
            if notInclude[k]=='1':
                lst_diff.append(my_dict[k])
                del my_dict[k]

        # print my_dict
        diff_set_op=my_dict.values()[0]


        # print diff_set_op
        if match == 'all':
            for x in my_dict.values():
            	diff_set_op =set(diff_set_op) & set(x)
                pass
        elif match == 'any':
            for xx in my_dict.values():
                # pass
                diff_set_op=set(diff_set_op) | set(xx)
        # print diff_set_op
        #print "####"
        first_list=diff_set_op
        # print diff_set_op
        #print first_list
        second_list=[]
        if lst_diff:
            diff_set_op=lst_diff[0]
            for x in lst_diff:
                diff_set_op=set(diff_set_op) | set(x)
                second_list=diff_set_op
            # print second_list
        #print first_list
        #print second_list
        # print "Hello"
        # print first_list
        final_list= list(set(first_list)-set(second_list))
        #print "####"
        #print final_list

        my_dict_final={}
        if final_list:
            mapTotalResult ={}
            mapct = "SELECT COUNT(*), countries.name FROM records JOIN articles ON records.pubmedID=articles.pubmedID join countries on countries.code= articles.code and articles.year>="+str(fromYear)+" and articles.year<="+str(toYear)+"  GROUP BY articles.code;"
            cur1.execute(mapct)
            for row in cur1:
                mapTotalResult[row[1]] = row[0]
            print mapTotalResult   
            if len(final_list)!=1:
                mapresult=[]
                mapc = "SELECT COUNT(*), countries.name FROM records JOIN articles ON records.pubmedID=articles.pubmedID join countries on countries.code= articles.code WHERE articles.pubmedID in "+ str(tuple(final_list)) +"  and articles.year>="+str(fromYear)+" and articles.year<="+str(toYear)+"  GROUP BY articles.code;"
                cur1.execute(mapc)
                for row in cur1:
                    mr=[]
                    mr.append(row[1])
                    mr.append(float(row[0])/mapTotalResult[row[1]])
                    mapresult.append(mr)
                mp = {"values" : mapresult}

                final_query="SELECT year, COUNT(year) FROM articles where pubmedID in" + str(tuple(final_list))+ " GROUP BY year;"
                cur1.execute(final_query)
                for row in cur1:
                    my_dict_final[row[0]]=row[1]
            else :
                mapresult=[]
                mapc = "SELECT COUNT(*), countries.name FROM records JOIN articles ON records.pubmedID=%s join countries on countries.code= articles.code WHERE articles.pubmedID in "+str(tuple(final_list))+" and articles.year>="+str(fromYear)+" and articles.year<="+str(toYear)+"  GROUP BY articles.code;"
                cur1.execute(mapc,final_list[0])
                for row in cur1:
                    mr=[]
                    mr.append(row[1])
                    mr.append(row[0])
                    mapresult.append(mr)
                mp = {"values" : mapresult}
                final_query='SELECT year, COUNT(year) FROM yearcount where pubmedID = %s  GROUP BY year;'
                cur1.execute(final_query,final_list[0])
                for row in cur1:
                    my_dict_final[row[0]]=row[1]

        #print "####"
        #print my_dict_final
        kw_search_res=[]
        tot_papers_per_year=[]
        final_res=[]

        for year in years:
            if year in my_dict_final.keys():
                kw_search_res.append(my_dict_final[year])
            else:
                kw_search_res.append(0)
            query = "SELECT COUNT(year) FROM yearcount WHERE year = " + str(year) + " and yearcount.year>="+str(fromYear)+" and yearcount.year<="+str(toYear)+" ;"
            cur1.execute(query)
            for row in cur1:
                tot_papers_per_year.append(row[0])

        for index in range(len(kw_search_res)):
            if tot_papers_per_year[index]!= 0:
                final_res.append(float(kw_search_res[index])/tot_papers_per_year[index])
                #final_res.append(float(kw_search_res[index]))
                #final_res.append(tot_papers_per_year[index])
            else:
                final_res.append(0)

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
                        "values": final_res
                        }
        rkobj = { "gr":dict(message), "mp":dict(mapresult)}
        #if id is None:
        return simplejson.dumps(rkobj)
        cur1.close();
        #return ('kw =%s qualif =%s & type= %s & notinclude =%s' %(keyword,keywordQualifer,query_type,notInclude))
        # else:            
          # return('Song with the ID = %s & Name =%s' %(id, name))
#'server.socket_host':'137.48.184.132'
          
cherrypy.config.update({'server.socket_host':'137.48.184.132',
                       'server.socket_port':8910})
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
