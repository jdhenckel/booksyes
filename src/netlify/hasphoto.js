//called with /.netlify/functions/hasphoto
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    hasImage = (row) => {
        return row.imageSrc !== '';
    }

    return helpers.getBooks(hasImage, event.queryStringParameters.query)
    .then(response => ({
        statusCode: 200, body: JSON.stringify(response)
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}