#!/usr/bin/python



import pymysql
import sys

DATABASE = "medline"
USER = "user_medline"

years = range(1995, 2015)
kres=[]
nres=[]
res=[]
## parse the arguments
if len(sys.argv) != 3:
  print "Usage:  getNumberOfPapersPerYear.py PASSWORD keyword"
  sys.exit(1)
password = sys.argv[1]
keyword = sys.argv[2]

## connect to the database
db = pymysql.connect(host="localhost", user=USER, passwd=password,db=DATABASE)
cur = db.cursor()

## extract the total number of papers published in each year
for year in years:
  kquery="SELECT COUNT(year) FROM records JOIN articles ON records.pubmedID=articles.pubmedID WHERE records.meshID =%s AND year ="+str(year)+";"
  cur.execute(kquery,keyword)
  for row in cur:
    kres.append(row[0])
  query = "SELECT COUNT(year) FROM articles WHERE year = " +\
    str(year) + ";"
  cur.execute(query)
  for row in cur:
    nres.append(row[0])
    
for index in range(len(kres)):
   if nres[index]!= 0:
      res.append(float(kres[index])/nres[index])
   else:
      res.append(0)
print kres
print nres
print res

print "\n"

cur.close()
db.close()
