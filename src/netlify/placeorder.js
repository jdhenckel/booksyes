//called with /.netlify/functions/placeorder

const axios = require('axios');
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {
    //write order to database
    //send email to jan
    //send confirmation email to customer
    //return all ok screen
}