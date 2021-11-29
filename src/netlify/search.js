//called with /.netlify/functions/search
import fetch from 'node-fetch';

exports.handler = async function(event, context) {

    const {DATABASE_LOCATION} = process.env;
//https://docs.google.com/spreadsheets/d/1fMRI2ZURf6op-fd3SYvv-BKKdMvO4O5nre9xUFObU5c/gviz/tq?tq=select%20*
    const request = "/gviz/tq?tq=";
    const query = event.queryStringParameters.query;
    //select%20*
    
    const endpoint = DATABASE_LOCATION + request + query;
//responseBody.replace(/^\)]\}'\n/, '')
    return fetch(endpoint, {headers: {'X-DataSource-Auth':""}})
    .then((response) => response.text())
    .then((data) => ({
        statusCode: 200,
        body: data.replace(/^\)]\}'\n/, ''),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}