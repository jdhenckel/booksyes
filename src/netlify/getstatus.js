//called with /.netlify/functions/get status
// return some environment stuff

const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {
    try {
        const body = '(RAW BODY)'+event.body+'(END BODY)';
        try {
            body = JSON.parse(event.body);
        } catch (err) {   }

        return {
            statusCode: 200,
            body: JSON.stringify({
                echo_body: body,
                method: event.httpMethod,
                headers: event.headers,
                query: event.queryStringParameters,
                path: event.path
            }),
        };
    } catch(error) {
        return {
            statusCode: 400,
            body: String(error)
        }
    }
}
