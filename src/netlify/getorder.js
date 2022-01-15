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

/*
x = {
    "books":
        [{
            "id": 2,
            "title": "AESOP’S FABLES",
            "author": "Aesop",
            "price": "4",
            "ISBN": "",
            "description": "Sterling Children’s Books 1988, 2010. Hardcover with dust jacket. Folio-size, more than 12”, with large, wonderful illustrations by Charles Santore. CM Alveary. Ambleside 1. 145490495X. NOT ex-lib. Book and dust jacket Fine, small tear in dust jacket; crease in fold-out page. .",
            "imageURLS": [],
            "category": "PICTURE BOOKS - FICTION"
        }
        ] ,
    "subtotal": 4,
    "shippingcost": 3.25,
    "tax": 0.28,
    "clientId": "Ac4B2jzCvu6x7FzihCtREcRxbvNZUW6nNf9wA7Fr85yACgyItryg8Ol14OCgOWCuvbJqelkTmxtZ49ed",
    "paypalID": "420759337H668322L",
    "paymentType": "Paypal(approved). Order Number: 420759337H668322L",
    "recaptchaToken": "03AGdBq27yFUHHXp6MK-2uKxpZGEq7c6rGyleC5VIX66GOrJktPU82eUO5cboffU7LLWEzSlIIypgL26-RivU9S2bC6izIZ1qs5aPiQKgC5iUgQshe6uAtSmPXGcAxpnANjDyfCv-qHY5wUiH1AdbH28oH_W8HiZb4u_OHLpwda943cC_Arxu_hXMMV3J-aKmM_GCAu-PRLTzFX26OY4N-RgYVbP0x6VcTGafoIvwaOx3eXVW2fpSFe9KMdbzLk7DTkwS3SfA9o1R8-REuSJ0r_dV0rsXdnsLNVPRhUo_PQrHeWcxksFAOBdoFQhpEBuryfAr2gLW5RnbY8P0P0Ys7fuu2bWx0qgbgbZd-F7ZKGURrc4h3BVYnyZLMTzzNN9AuhyZxk7T6JtqRINSBgltP045dlTUpOUqC-JCyPSkZ_FXSTTZBCoUH0xZh_MM2GxxeARe_YTGjfMN0",
    "totalTaxed": 7.53,
    "totalUntaxed": 7.25,
    "shippingAddress": {
        "recipient_name": "Quinn Henckel",
        "line1": "254 Liberty St NE",
        "city": "Fridley",
        "state": "MN",
        "postal_code": "55432",
        "email": "boardman94@gmail.com",
        "phone": "818-749-2784"
    },
    "orderNumber": "228078525",
    "dateString": "Tue Jan 11 2022"
}

*/