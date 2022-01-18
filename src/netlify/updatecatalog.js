//called with /.netlify/functions/update catalog
// modify the catalog

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
    let book = {};
    let group = {};
    let groupid = 0;
    let groupSize = 0;   // This is both counter and flag, 0 means no group is open.

    for (let line of lines) {
        if (line.trim()=='') continue;
        if (line.match(/^[^a-z]+$/)) {
            // CATEGORY heading (all uppercase)
            category = line.trim();
            continue;
        }
        // Try two matches, the first is more strict, the second more lenient
        if ((m = line.match(/^(.*?\. ) ([A-Z].*?\. ) (.*)(\$.*)$/)) ||
            (m = line.match(/^(.*?)([A-Z][A-Z].*?)( [A-Z]*[a-z].*)(\$.*)$/))) {
                // BOOK
            indent = line.startsWith('    ');
            if (!indent) {
                if (groupSize == 1)
                    errors.push('The group has no books in it: ' + group.author);
                groupSize = 0;
            } 
            else if (groupSize) ++groupSize;
            book = {
                author: m[1].trim(),
                title:  m[2].trim(),
                price:  m[4].trim(),
                //ISBN:   isbn,
                description: m[3].trim(),
                //imageURLS: urls,
                category: category,
                group: indent && groupSize ? groupid : '',
            };

            // TODO - isbn ?   image URLS

            result.push(book);
        }
        else if (m = line.match(/^(.*?\. ) (.*)$/)) {
            // GROUP HEADING
            ++groupid;
            groupSize = 1;
            group = {
                author: m[1].trim(),
                description: m[2].trim(),
                category: category,
                group: groupid,
            };
            result.push(group);
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


exports.handler = async function(event, context) {
    try {
        let ctype = event.headers['content-type'];
        let cdata = parseValueList(ctype);
        if (!cdata['multipart/form-data'])
            throw new Error('content-type not correct: '+ctype);
        let body = Buffer.from(event.body,'base64').toString('utf8');
        let params = parseMultiPart(body, cdata.boundary);
        if (params.password !== 'xx') { // process.env.UPDATE_CATALOG_PASSWORD) {
            return JSON.stringify({ statusCode: 200, body: 'wrong password'});
        }

        let newdata = parseCatalog(params.filename);

        return {
            statusCode: 200,
            body: JSON.stringify({
                crag: params,
                newdata: newdata,
                method: event.httpMethod,
                query: event.queryStringParameters,
                path: event.path
            },null,4),
        };

    } catch(error) {
        return {
            statusCode: 400,
            body: String(error)
        }
    }
}
