//called with /.netlify/functions/bycategory
const axios = require('axios');
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    matchCategory = (row, category) => {
        return row.category === category;
    }
    
    return helpers.getBooks(matchCategory, event.queryStringParameters.query)
    .then(response => ({
        statusCode: 200, body: JSON.stringify(response)
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}