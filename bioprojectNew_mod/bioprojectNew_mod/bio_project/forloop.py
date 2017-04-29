import random
nume=[10,20,40]
denom=[10,3,6,20]
res=[]
#for i in range(2):
 #  myList.append(random.random())
 #  print myList[i]



#!/usr/bin/python

for index in range(len(nume)):
   if denom[index]!= 0:
      res.append(float(nume[index])/denom[index])
   else:
      res.append(0)

#print res
kw1=[]
kw =[u'D000002', u'D000003']
kw1= [str(x) for x in kw]
#print kw1
#for x in kw:
 #  kw1.append(str(x))
#print kw1
qualif =[u'Q000000', u'']
#print [str(x) for x in qualif]

kw2='D000002'
#print [str(x) for x in kw2]

#print list(set(nume)| set(denom))
#print list(set(nume)& set(denom))
#print list(set(nume)- set(denom))

dict={0:nume,1:denom}
dict[2]=[10,3,6,40]
dict[3]=[5,10,3,40,15]
print dict
print dict.values()

lst=[]
lst.append(nume)
lst.append(denom)
lst.append([10,3,6,40])
lst.append([5,10,3,40])
#print lst
#print dict
match='all'
notInclude='0101'
lst_diff=[]
#for indx in range(len(notInclude)):
  # if notInclude[indx]=='1':
      #lst_diff.append(lst[indx])
      #del lst[indx]
  
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
second_list=set_op(lst_diff)

print first_list
print second_list
print set(first_list)-set(second_list)




#print list(intersection)

dict_final={2001:2,2002:1}

kw_search_res=[]

years =range(1995,2015)
for year in years:
   if year in dict_final.keys():
     kw_search_res.append(dict_final[year])
   else:
      kw_search_res.append(0)

#print kw_search_res
   
  

#print set_op(lst_diff)
