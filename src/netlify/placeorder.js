//called with /.netlify/functions/placeorder
const {SPARKPOST_API, RECAPTCHA_SECRECT} = process.env;
const helpers = require('./helperFuncs.js');
const SparkPost = require('sparkpost');
const client = new SparkPost(SPARKPOST_API);
const templates = require('./emailTemplates.js');
const { default: axios } = require('axios');

exports.handler = async function(event, context) {
    try {
        const order = JSON.parse(event.body).body.order;
        var exscapedOrder = order;
        escapeAll(exscapedOrder);

        const settings = await helpers.getSettings();

        //check recaptcha
        const res = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRECT}&response=${order.recaptchaToken}`
        ).then(response => {
            //check if Recaptcha thinks this is a bot
            if(!response.data.success) {
                throw 'Invalid ReCAPTCHA, please try again.';
            };
        });

        //check all required fields are present
        var orderIsValid = true && order.shippingAddress.recipient_name;
        orderIsValid = orderIsValid && order.shippingAddress.line1;
        orderIsValid = orderIsValid && order.shippingAddress.city;
        orderIsValid = orderIsValid && order.shippingAddress.state;
        orderIsValid = orderIsValid && order.shippingAddress.postal_code;
        orderIsValid = orderIsValid && order.shippingAddress.email;
        if(!orderIsValid) {
            throw 'Missing some required contact or shipping information.  please correct it and try again.';
        }

        //write order to database
        //TODO

        //send email to jan
        await client.transmissions.send({
            content: {
                from: 'no-reply@orders.booksofyesterday.com',
                subject: 'New Books Of Yesterday Order',
                html: templates.orderNotificationTemplate(exscapedOrder),
            },
            recipients: settings.orderemails.split(',').map((email) => ({address: email})),
        }).then(handleSuccess).catch(handleErrors);
        
        //send confirmation email to customer
        await client.transmissions.send({
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
    throw "There was an problem completing your order. You can try resubmitting it, or contact Jan directly using the link at the bottom of the page";
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