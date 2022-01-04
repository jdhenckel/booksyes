//called with /.netlify/functions/new
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    matchNew = (row) => {
        //TODO make this find new books
        return true;
    }

    return helpers.getBooks(matchNew)
    .then(response => ({
        statusCode: 200, body: JSON.stringify(response)
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}