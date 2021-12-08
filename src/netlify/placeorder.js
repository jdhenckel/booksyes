//called with /.netlify/functions/placeorder
const {SPARKPOST_API} = process.env;
const helpers = require('./helperFuncs.js');
const SparkPost = require('sparkpost');
const client = new SparkPost(SPARKPOST_API);
const templates = require('./emailTemplates.js');

exports.handler = async function(event, context) {
    try {
        const order = JSON.parse(event.body).body.order;
        var exscapedOrder = order;
        escapeAll(exscapedOrder);
        //write order to database
        //TODO

        //send email to jan
        client.transmissions.send({
            content: {
                from: 'no-reply@orders.booksofyesterday.com',
                subject: 'New Books Of Yesterday Order',
                html: templates.orderNotificationTemplate(exscapedOrder),
            },
            recipients: [
                {address: 'quinn.henckel@gmail.com'},
            ],
        }).then(handleSuccess).catch(handleErrors);
        
        //send confirmation email to customer
        client.transmissions.send({
            content: {
                from: 'no-reply@orders.booksofyesterday.com',
                subject: 'Books Of Yesterday Order Confirmation',
                html: templates.orderConfirmationTemplate(exscapedOrder),
            },
            recipients: [
                {address: order.shippingAddress.email,
                name: order.shippingAddress.recipient_name},
            ],
        }).then(handleSuccess).catch(handleErrors);

        //return all ok screen
        return {
            statusCode: 200,
            body: JSON.stringify({order: order}),
        }
    } catch (error) {
        return {
            statusCode: 422,
            body: String(error),
        }
    }
}

function handleErrors(error) {
    console.error(error);
}

function handleSuccess(data) {
    if(data.total_rejected_recipients > 0) {
        console.error("rejected %i recipients!", data.total_rejected_recipients);
    }
}

function escapeStr(htmlStr) {
    return String(htmlStr).replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#39;");
}

function escapeAll(object) {
    Object.keys(object).forEach(function (k) {
        if (object[k] && typeof object[k] === 'object') {
            escapeAll(object[k]);
            return;
        }
        if(typeof object[k] === 'string'){
            object[k] = escapeStr(object[k]);
        }
    })
}