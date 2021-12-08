//called with /.netlify/functions/getorder
// take in a booklist and return an order object.
// no error checking just trust that the books are correct.

const axios = require('axios');
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {
    try {
        const books = JSON.parse(event.body).books;

        const subtotal = books.reduce((total, book) => total + Number.parseFloat(book.price), 0);
        const tax = subtotal * .065; //mn tax is 6.5%
        const shipping = 2.5 + (0.50 *(books.length - 1)); //first book is $2.50 all other books are $0.50
        

        const order = {
            books: books,
            subtotal: subtotal,
            shippingcost: shipping,
            tax: Math.round(tax)
        };

        return {
            statusCode: 200,
            body: JSON.stringify({order: order}),
        };
    } catch(error) {
        return {
            statusCode: 422,
            body: String(error)
        }
    }
}