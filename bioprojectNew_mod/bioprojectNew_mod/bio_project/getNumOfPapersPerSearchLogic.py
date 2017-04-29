#!/usr/bin/python



import pymysql
import sys

DATABASE = "medline"
USER = "medline"

#years = range(1995, 2015)
dict={}
kwlist=['D012172','D008156','D005727']
qlist=['Q000493','Q000378','Q000378']

## parse the arguments
if len(sys.argv) != 3:
  print "Usage:  getNumberOfPapersPerYear.py PASSWORD match"
  sys.exit(1)
password = sys.argv[1]
match = sys.argv[2]

## connect to the database
db = pymysql.connect(host="localhost", user=USER, passwd=password,db=DATABASE)
cur = db.cursor()

## extract the total number of papers published in each year
for index in range(len(kwlist)):
  kres=[]
  if qlist[index] != '': #or qlist[index]!= 'Q000000':
    kquery="SELECT pubmedID FROM records WHERE meshID=%s AND qualifID =%s;"
    cur.execute(kquery,(kwlist[index],qlist[index]))
  else:
    kquery="SELECT pubmedID FROM records WHERE meshID=%s;"
    cur.execute(kquery,kwlist[index])
  for row in cur:
    kres.append(row[0])
  dict[index]=kres
def_set=dict[0]
print dict
for x in dict.values():
   
#print tuple(union)
  
  dict_final={}
  if match == 'all':
    intersection=set(def_set) & set(x)
    all_query="SELECT year, COUNT(year) FROM articles where pubmedID in" + str(tuple(intersection))+ " GROUP BY year;"
    cur.execute(all_query)
    for row in cur:
      dict_final[row[0]]=row[1]
      #print row   
  elif match == 'any':
    union=set(def_set) | set(x)
    all_query="SELECT year, COUNT(year) FROM articles where pubmedID in" + str(tuple(union))+ " GROUP BY year;"
    cur.execute(all_query)
    for row in cur:
      dict_final[row[0]]=row[1]
print dict_final
#print list(intersection)
kw_search_res=[]
tot_papers_per_year=[]
final_res=[]
years =range(1995,2015)
for year in years:
   if year in dict_final.keys():
     kw_search_res.append(dict_final[year])
   else:
      kw_search_res.append(0)
   query = "SELECT COUNT(year) FROM articles WHERE year = " + str(year) + ";"
   cur.execute(query)
   for row in cur:
     tot_papers_per_year.append(row[0])
     
for index in range(len(kw_search_res)):
   if tot_papers_per_year[index]!= 0:
      final_res.append(float(kw_search_res[index])/tot_papers_per_year[index])
   else:
      final_res.append(0)
      
print kw_search_res
print tot_papers_per_year
print final_res

cur.close()
db.close()
