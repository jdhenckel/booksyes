//called with /.netlify/functions/get status
// return some environment stuff

//const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {
    try {
        let ctype = event.headers['content-type'];
        let body = '(RAW BODY)'+event.body+'(END BODY)';
        try {
            if (ctype.startsWith('multipart/form-data')) {
                let buf = Buffer.from(event.body,'base64')
                body = buf.toString('utf8')
            } 
            else if (ctype == 'application/json') {
                body = JSON.parse(event.body);
            } 
        } catch (err) {   }

        return {
            statusCode: 200,
            body: JSON.stringify({
                echo_body: body,
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
