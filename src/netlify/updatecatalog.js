
const {GoogleSpreadsheet} = require('google-spreadsheet');

//const helpers = require('./helperFuncs.js');

//=================================================================
// Given input string: 'foobar: test1; foobaz="xyz"; zoop' this will 
// Return an object { foobar: 'test1', foobaz: 'xyz', zoop: true }
function parseValueList(values) {
    let result = {};
    if (values==null) return result;
    let alist = values.split(';');
    for (let a of alist) {
        let i = a.search(/[:=]/);
        let k = a.substring(0,i).trim();
        if (k==='') 
            result[a] = true;
        else if (a.charAt(i+1)=='"') 
            result[k] = a.substring(i+2,a.length-1);
        else 
            result[k] = a.substring(i+1).trim();
    }
    return result;    
}


/**
 * This parses the raw data of the catalog into columns that are expected in the Google sheets
 * @param {array of strings} lines 
 * Returns a list of objects, one per catalog entry
 * 
 * SAMPEL INPUT LINE
 * <new>Longfellow, Henry Wadsworth.  HIAWATHA'S CHILDHOOD.  Farrar Straus 1984.  Picture book ill. 
 * in color by Errol Le Cain, bringing to life one of the lyrical passages from
 * Longfellow's classic poem. 
 * 
 * SAMPLE RESULT
 * {
 *     author: 'Longfellow, Henry Wadsworth'
 * 	   title:  'HIAWATHA'S CHILDHOOD'
 *     price:  '$4'
 *     ISBN:
 *     description: 'Farrar Straus 1984.  Picture book ... poem.  Ex-lib.  G/VG.'
 *     imageURLS:
 *     category:
 * }
 * 
 * From the PHP this is the regex (.*?)([A-Z][A-Z].*?)( [A-Z]*[a-z].*?)(\$.*)
 * in which $1 is author, $2 is title, $4 is price, and $3 is the description
 * The price is REQUIRED
 */
function parseCatalog(lines) {
    let result = [];
    let errors = [];
    let category = '';
    let groupAuthor = '';
    let groupText = '';
    let groupSize = 0;
    let IMAGE_URL = [
        'http://i1103.photobucket.com/albums/g478/booksyes/',
        'http://hosting.photobucket.com/albums/g478/booksyes/'];

    for (let line of lines) {
        if (line.trim()=='') continue;
        if (line.match(/^[^a-z]+$/)) {
            // CATEGORY heading (all uppercase)
            category = line.trim();
            continue;
        }

        let isNew = line.includes('<new>') ? 'new' : '';
        if (isNew) line = line.replace('<new>','');

        let pics = line.match(/ p=(\S+)/) || '';
        if (pics) {
            line = line.replace(/ p=\S+/,'');
            pics = pics[0];
            let u = pics.startsWith('i,');
            if (u) pics = pics.substring(2);
            pics = pics.split(',').map(i => 
                IMAGE_URL[u]+i+(i.includes('.')?'':'.JPG')).join(',');
        }

        let isbn = line.match(/\d{9}[\dxX]/) || '';
        if (isbn) {
            line.replace(/\d{9}[\dxX]/,'');
            isbn = isbn[0];
        }

        // Try two matches, the first is more strict, the second more lenient
        if (line.includes('$') && (
            (m = line.match(/^(\S.*?\. ) ([A-Z].*?\. ) (.*)(\$.*)$/)) ||
            (m = line.match(/^(.*?)([A-Z][A-Z].*?)( [A-Z]*[a-z].*)(\$.*)$/)))) {
            // BOOK
            if (!line.startsWith('    ')) {   // End of Group
                if (groupSize == 1)
                    errors.push('The group has no books in it: ' + groupAuthor + ' ' + groupText);
                groupSize = 0;
            } 
            author = m[1].trim();
            group = '';
            if (groupSize) {
                ++groupSize;
                author = author || groupAuthor;
                group = groupText;
            }
            result.push({
                isNew,
                author,
                title:  m[2].trim(),
                description: m[3].trim(),
                price:  m[4].trim(),
                ISBN:   isbn,
                imageURLS: pics,
                category,
                group
            });

            // TODO - isbn ?   image URLS
        }
        else if (m = line.match(/^(.*?\. ) (.*)$/)) {
            groupAuthor = m[1].trim();
            groupText = m[2].trim();
            groupSize = 1;
        }
        else {
            errors.push('Failed to parse: ' + line);
        }

    }
    console.log(errors); // TODO ?
    return result;
}


function parseMultiPart(body, boundary) {
    let params = {};
    for (let c of body.split('--' + boundary)) {
        let lines = c.split(/\r?\n/);
        if (lines.length < 3) continue;
        let val = parseValueList(lines[1]);
        if (val.name) params[val.name] = lines.slice(lines.indexOf('',1) + 1);
    }
    return params;
}




async function initCatalogSheet() {
    DUMMY = '1937173200';
    const doc = new GoogleSpreadsheet(process.env.DATABASE_KEY);
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsById[DUMMY]; //process.env.DATABASE_SHEET_BOOKS];
    await sheet.getRows();
    return sheet;
}

async function writeCatalogToSheet(newdata, sheet) {
    //resize is 1-indexed
    await sheet.resize({ rowCount: newdata.length + 1, columnCount: 10});
    
    //load the newly created cells
    await sheet.loadCells();
    
    //getcell is 0-indexed
    sheet.getCell(sheet.rowCount - 1, 0).value = JSON.stringify(order);
    sheet.getCell(sheet.rowCount - 1, 2).value = order.orderNumber;

    await sheet.saveUpdatedCells();
    return;
}


exports.handler = async function(event, context) {
    try {

        let ctype = event.headers['content-type'];
        let cdata = parseValueList(ctype);
        if (!cdata['multipart/form-data'])
            throw new Error('content-type not correct: '+ctype);
        let body = Buffer.from(event.body,'base64').toString('utf8');
        let params = parseMultiPart(body, cdata.boundary);
        let password = params.password[0].trim();

        // await bcrypt.compare(password, process.env.ORDER_REVIEW_HASH).then(result => {
        //     if (result !== true) throw 'Incorrect Password';
        // });

        let newdata = parseCatalog(params.bookdata);

        // TODO put newdata into the sheet

        //let sheet = await initCatalogSheet();

        return {
            statusCode: 200,
            body: JSON.stringify({
                crag: params,
                newdata: newdata,
                method: event.httpMethod,
                query: event.queryStringParameters,
                path: event.path,
                //sheet: [sheet.title, sheet.rowCount, sheet.headerValues]
            }),
        };

    } catch(error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: error.message,
                name: error.name,
                stack: error.stack,
            }),
        };
    }
}
