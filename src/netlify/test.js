//called with /.netlify/functions/test
const bcrypt = require('bcrypt');

exports.handler = async function(event, context) {
    try {
        const password = JSON.parse(event.body).pass;
        //does nothing.  use for testing
        await bcrypt.hash(password, 10).then(function(hash) {
            // Store hash in your password DB.
            console.log(hash);
        });
        return {
            statusCode: 200,
            body: JSON.stringify("clever girl"),
        }
    } catch(error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        }
    }
}