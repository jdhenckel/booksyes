#open text file


#extract data from line

#write line to new file as csv

#data to extract is:
#   image source:   
#   category ids:   
#   author:         
#   title
#   price
#   ISBN
#   Description
#   new
#<new>author. TITLE. Description. ISBN. Description. img. price.
#isbn check sum = j = ( [a b c d e f g h i] * [1 2 3 4 5 6 7 8 9] ) mod 11
# (?:(?!\s{2}).)+  select each phrase seperated by two spaces.  this incluse a leading space much of the time.
import re
import csv
import sys

lines = []
outputlines = []
columnHeaders = ['author', 'title', 'price', 'isbn', 'images', 'description', 'category']

categories = []

with open(sys.argv[1], 'r') as f:
    lines = f.readlines()
    f.close()

category = ''
nextIsCategory = False
skipline = False

for line in lines:
    if(line == '\n'):
        if(skipline):
            skipline = False
            continue
        
        nextIsCategory = True
        continue
    if(nextIsCategory):
        category = line.strip()
        categories.append(category)
        skipline = True
        nextIsCategory = False
        continue
    phrases = re.split('\s\s', line) #(?:(?!\s{2}).)+
    author = phrases[0].replace('<new>', '')[:-1].strip()
    title = phrases[1].replace('.', '').strip()
    description = ''
    price = ''
    isbn = ''
    images = ''
    
    for p in phrases[2::1]:
        #check if isbn
        search = re.compile('\d{10}').search(p)
        if(search):
            isbn = search.group(0).strip()
            p = re.sub('\d{10}', '', p)
            
        #check if price
        search = re.compile('\$\d{1,2}(\.\d{1,2})?').search(p)
        if(search):
            price = search.group(0).replace('$', '').strip()
            p = re.sub('\$\d{1,2}(\.\d{1,2})?', '', p)
            
        #check if picture link
        search = re.compile('p=i(,DSC_\d{4})+').search(p)
        if(search):
            images = search.group(0).replace('p=i,', '').strip()
            p = re.sub('p=i(,DSC_\d{4})+', '', p)
            
        #else add to description
        description = description + p

    outputline = [author, title, price, isbn, images, description.replace('.', '. ').strip(), category]
    outputlines.append(outputline)

with open('books.csv', 'wb') as csvfile:
    writer = csv.writer(csvfile, dialect='excel')
    writer.writerow(columnHeaders)
    for line in outputlines:
        writer.writerow(line)
            
        
    csvfile.close()

with open('categories.csv', 'wb') as csvfile:
    writer = csv.writer(csvfile, dialect='excel')
    writer.writerow(categories)
    csvfile.close()






















    
