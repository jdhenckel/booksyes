[![Netlify Status](https://api.netlify.com/api/v1/badges/81950c7f-33d4-41c1-b955-26183712ee97/deploy-status)](https://app.netlify.com/sites/booksofyesterday/deploys)

# setting up a local dev enviroment
---
- Install npm v8.1.0 (or similar) (node version manager can help)
- Install node v16.13.0 (very important)
- Clone github repo to your local machine
- If you are using Netlify [install the CLI](https://docs.netlify.com/cli/get-started/) (add it to your path, you will be using it a lot)
- Setup the Netlify site on Netlify.com (skip if using an exsiting site)
- Use the netlify CLI to link your local folder to the site (links enviroment variables to stay updated)
- Use `npm install` to download all required packages for the project (will take 10-20 minutes)
- Create and populate all enviroment variables in the list
- Create the Google Spreadsheets per instructions below
- To run use the netlify CLI to run a dev enviroment locally (important to get netlify functions and enviroment variables working correctly)


List of sites and tools that are used in this project:
- [Netlify](https://app.netlify.com/sites/booksofyesterday)
- [Google sheets](https://docs.google.com/spreadsheets)
- [reCaptcha](https://www.google.com/recaptcha/admin)
- [Sparkpost](https://app.sparkpost.com/dashboard)
- [PayPal](https://developer.paypal.com/developer/applications/)


# List of Enviroment variables
### what they are and where to get them
---
| Variable Name  | Use | Where to get it |
| --- | --- | --- |
| DATABASE_KEY | This is part of the google sheet URL | if you look at a a google sheet: `https://docs.google.com/spreadsheets/d/{This is your databse key}/edit#gid=590913473` |
| DATABASE_LOCATION | Used as the domain for database requests | This might change but as of 2021 this should be `https://spreadsheets.google.com/` |
| DATABASE_ORDERS_KEY | Since Orders are a seperate document this is the other key | if you look at a a google sheet: `https://docs.google.com/spreadsheets/d/{This is your databse key}/edit#gid=590913473` |
| DATABASE_SHEET_BOOKS | the `gid` denoting the sheet from the database document | if you look at a a google sheet: `https://docs.google.com/spreadsheets/d/{This is your databse key}/edit#gid={This is the gid` |
| DATABASE_SHEET_CATEGORIES | the `gid` for the appriopriet sheet | see above |
| DATABASE_SHEET_ORDERS | see above | see above |
| DATABASE_SHEET_SETTINGS | see above | see above |
| GOOGLE_PRIVATE_KEY | The "password" to the google service account | See instructions in the Google service account section |
| GOOGLE_SERVICE_ACCOUNT_EMAIL | the email for the google service account | See instructions in the Google service account section |
| ORDER_REVIEW_HASH | The hash of the password used to authorize reviewing orders | Useing Bcrpyt hash your password and store the hash here |
| PAYPAL_CLIENT_ID | The id for the paypal business account that will recive payments | Get this from the [PayPal developer dashboard](https://developer.paypal.com/developer/applications/)  |
| RECAPTCHA_SECRECT | This is only for use server side to verify that the recaptcha is valid | [Recaptcha and get the secret here](https://www.google.com/recaptcha/admin) also change the `RECAPTCHA_KEY` in Cart.jsx |
| SPARKPOST_API | Used to authorize with Sparkpost to send emails | get this from your [sparkpost developer dashboard](https://app.sparkpost.com/dashboard) |



# Google Service Account
---
 
Inorder to authorize writing to a google sheet the server needs to use a Google Service Account.  This is basically a google user.

- Using [Google cloud](https://console.cloud.google.com/) create a project for the website.
- On the left hand side, under "APIS and Services" then "Credentials" you can create a service account. It doesn't need any permissions.
- Once create open the service account details, then at the top goto "keys"
- Create a new key of type JSON, this will download a JSON file.
- you can either use the JSON file (this will require some modification to the server functions)(the two files will be placeorder.js and revieworders.js)
- Or you can copy the key out of the JSON file and put in in the enviroment variable.
- To copy the key just copy and paste *everything* between the double-quotes. Include the all the '\n' and the ---BEGIN-- and --End-- lines.
- Finally copy the email address of the service account and share the google document with it. make sure it has permission to edit the file. 


# Format of the Google spreadsheets
---
This project uses two spreadsheets as a database.  There is a book catalog and an order list.  They are sperated so the orders can be private and the catalog can be public (so anyone can view).  This is done so the server can query the book catalog without authenticating.  The spreadsheets are fairly streight forward but need to be very exact.

### Orders spreadsheet
- delete all but one row and three columns. **DO NOT PUT ANY COLUMN HEADERS**
- the server ignores blank rows but if it bugs you you can go back and delete the first blank row once and order is placed.
- The server never removes rows and only marks them as deleted.

This is the format
| JSON Order object | Is deleted | Order number |
| --- | --- | --- |
|  |  |  |

Is deleted uses an 'x' to denote that row as deleted.
Order number is also included in the JSON object but written in a new column to make finding a specific row easier.
The JSON object should not be stringifyed

**IMPORTANT: Change the format of all columns to "plain text"**

### Catalog spreadsheet
This is used to store the catalog(duh) information and public settings for the orders.  When putting data in the spreadsheet remember that anyone with the link can view it.

setup:
- create a spread sheet and set sharing to "anyone with the link can view" (the server won't write to this sheet)
- Create three sheet in the document.  I call them book data, categories, and settings but the names are not important.
- book data has 10 columns but can use more if needed.
- all columns are referenced by their letters on the server helperFuncs.js has literals at the top that should be changed to match the sheet.

Descriptions of columns:
At the top of helperFuncs.js there are 4 literals that should match the columns of the sheet. All the rest are matched by the column headers.

literals from helperFuncs.js:
- searchCol: this column concatinates all the columns that should be searched. i.e. author, title, descriptions, and ISBN
- categoryCol: this column is matched with a row from the categories sheet to load books of the specific category
- imageCol: used to query for books that have images.
- isNewCol: This column must be a boolean defiend by the google spread sheet to be true if the book is new.

other columns and their names:
these are compiled into a JSON object using the column headers as keys.  They must match these exactly
- author
- title
- price
- ISBN (yes it's capitalized I hate it too but too late to change it)
- description
- imageSrc
- category

### Categories
just one column and only as long as needed to hold all the categories.  No column header.  the contents must match exactly with the book's category column to be found.

### Settings
This sheet has three columns and is used to store settings that are public.  most are used by the server and the values must match exactly.  but you can put other settings here to help with calulating isNew or something.

| setting | value | comment|
| --- | --- | --- |

- orderemails - A comma seperated list of emails that will be notified each time an order is placed. Cannot be blank and no spaces
- shppingcost - cost of shipping the first book in an order
- additionalshippingcost - cost of each additional book
- mntax - tax rate applied to orders from Minnesota (0.07 = 7%)
- freeshippingafter - if an order subtotal is greater or equal to this no shipping charge
- recaptchakey - this is the public key from your recaptcha account.

