#!/usr/bin/python



import pymysql
import sys

DATABASE = "medline"
USER = "medline"

#years = range(1995, 2015)
dict={}
kwlist=['D000109','D000818','D000313']
qlist=['Q000494','','Q000166']
notInclude='010'
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
#print dict

lst_diff=[]

for k in dict.keys():
   if notInclude[k]=='1':
      lst_diff.append(dict[k])
      del dict[k]
#print lst_diff
#print dict

def set_op(lst_diff):
   #print lst_diff
   diff_set_op=lst_diff[0]
   for x in lst_diff:
      if match == 'all':
         diff_set_op =set(diff_set_op) & set(x)
      else:
         diff_set_op=set(diff_set_op) | set(x)
   return  diff_set_op
  
first_list=set_op(dict.values())
second_list=[]
if lst_diff:
  diff_set_op=lst_diff[0]
  for x in lst_diff:
    diff_set_op=set(diff_set_op) | set(x) 
  second_list=diff_set_op

#print first_list
#print second_list
final_list= list(set(first_list)-set(second_list))

print final_list
print len(final_list)

dict_final={}

if  final_list :
  
  if len(final_list)!=1:
    final_query="SELECT year, COUNT(year) FROM articles where pubmedID in" + str(tuple(final_list))+ " GROUP BY year;"
    cur.execute(final_query)
    for row in cur:
      dict_final[row[0]]=row[1]
  else :
    final_query='SELECT year, COUNT(year) FROM articles where pubmedID = %s GROUP BY year;'
    cur.execute(final_query,final_list[0])
    for row in cur:
      dict_final[row[0]]=row[1]
print dict_final
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
