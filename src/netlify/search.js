//called with /.netlify/functions/search
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    searchFunction = (row, searchTerms) => {
        const terms = searchTerms.split(" ");
        if(terms.length === 0) return true;
        for (let t = 0; t < terms.length; t++) {
            const term = terms[t].toLowerCase();
            return row.title.toLowerCase().includes(term) ||
                row.author.toLowerCase().includes(term) ||
                row.description.toLowerCase().includes(term) ||
                row.ISBN.toLowerCase().includes(term);
        }
    }

    return helpers.getBooks(searchFunction, event.queryStringParameters.query ? event.queryStringParameters.query : "")
    .then(response => ({
        statusCode: 200, body: JSON.stringify(response)
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}