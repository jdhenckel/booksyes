//called with /.netlify/functions/update catalog
// modify the catalog

//const helpers = require('./helperFuncs.js');

/*
The body of the API should look like this.  Each line is terminated with \r\n.

------WebKitFormBoundaryKlcNm1dXeTN7NMGJ
Content-Disposition: form-data; name="password"

please
------WebKitFormBoundaryKlcNm1dXeTN7NMGJ
Content-Disposition: form-data; name="filename"; filename="fall-in-love.txt"
Content-Type: text/plain

“Fall in love with some activity, and do it! Nobody ever figures out 
what life is all about, and it doesn't matter. Explore the world. Nearly 
everything is really interesting if you go into it deeply enough. Work 
as hard and as much as you want to on the things you like to do the best.
Don't think about what you want to be, but what you want to do. Keep up 
some kind of a minimum with other things so that society doesn't stop you
from doing anything at all.”
― Richard P. Feynman
------WebKitFormBoundaryKlcNm1dXeTN7NMGJ
Content-Disposition: form-data; name="doit"

Update catalog
------WebKitFormBoundaryKlcNm1dXeTN7NMGJ--
*/


// Given input: "foobar: test1; foobaz=xyz,abc; zoop" this will return an object
// { foobar: 'test1', foobaz: 'xyz,abc', zoop: true }
function parseValueList(values) {
    result = {};
    if (values==null) return result;
    alist = values.split(';');
    for (a of alist) {
        i = a.search(/[:=]/);
        if (i == -1) result[a] = true;
        else result[a.substring(0,i).trim()] = a.substring(i+1).trim();
    }
    return result;    
}


exports.handler = async function(event, context) {
    try {
        let ctype = event.headers['content-type'];
        ctdata = parseValueList(ctype);
        if (!ctdata['multipart/form-data'])
            throw new Error('content-type not correct: '+ctype);
        let body = Buffer.from(event.body,'base64').toString('utf8');
        let chunks = body.split('--' + ctdata.boundary);
        crag = {};
        for (let c of chunks) {
            clist = c.split('\r\n');
            cdata = parseValueList(clist[0]);
            crag[cdata.name] = clist[clist.indexOf('') + 1];
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                echo_body: body,
                crag: crag,
                method: event.httpMethod,
                headers: event.headers,
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
