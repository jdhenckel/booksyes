//called with /.netlify/functions/getorder
// take in a booklist and return an order object.
// no error checking just trust that the books are correct.
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {
    try {
        const books = JSON.parse(event.body).books;

        const settings = await helpers.getSettings();

        const subtotal = books.reduce((total, book) => total + Number.parseFloat(book.price), 0);
        const tax = subtotal * settings.mntax;
        const shipping = subtotal >= settings.freeshippingafter ? 0 : Number.parseFloat(settings.shippingcost) + (Number.parseFloat(settings.additionalshippingcost) * (books.length - 1));

        const {PAYPAL_CLIENT_ID} = process.env;

        const order = {
            books: books,
            subtotal: subtotal,
            shippingcost: shipping,
            tax: Math.round((tax + Number.EPSILON) * 100) / 100, //properly round to two decimal places
            clientId: PAYPAL_CLIENT_ID,
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