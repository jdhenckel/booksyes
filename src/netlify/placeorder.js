//called with /.netlify/functions/placeorder
const {SPARKPOST_API, RECAPTCHA_SECRECT} = process.env;
const helpers = require('./helperFuncs.js');
const SparkPost = require('sparkpost');
const client = new SparkPost(SPARKPOST_API);
const templates = require('./emailTemplates.js');
const { default: axios } = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async function(event, context) {
    try {
        const order = JSON.parse(event.body).body.order;
        var exscapedOrder = order;
        console.log(order);
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

        //get ordernumber
        const orderNumber = helpers.getOrderNumber();

        try {
            //write order to database
            const ordersSheet = await initOrdersSheet();
            await writeOrderToSheet(order, orderNumber, ordersSheet);
        } catch (error) {
            throw 'There was an problem completing your order. You can try resubmitting it, or contact Jan directly using the link at the bottom of the page';
        }

        //send email to jan
        await client.transmissions.send({
            content: {
                from: 'no-reply@orders.booksofyesterday.com',
                subject: 'New Books Of Yesterday Order',
                html: templates.orderNotificationTemplate(exscapedOrder, orderNumber),
            },
            recipients: settings.orderemails.split(',').map((email) => ({address: email})),
        }).then(handleSuccess).catch(handleEmailErrors);
        
        //send confirmation email to customer
        await client.transmissions.send({
            content: {
                from: 'no-reply@orders.booksofyesterday.com',
                subject: 'Books Of Yesterday Order Confirmation',
                html: templates.orderConfirmationTemplate(exscapedOrder, orderNumber),
            },
            recipients: [
                {address: order.shippingAddress.email,
                name: order.shippingAddress.recipient_name},
            ],
        }).then(handleSuccess).catch(handleEmailErrors);

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

function handleEmailErrors(error) {
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

async function initOrdersSheet() {
    const doc = new GoogleSpreadsheet(process.env.DATABASE_KEY);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsById[process.env.DATABASE_SHEET_ORDERS];
    await sheet.loadCells();
    
    return sheet;
}

async function writeOrderToSheet(order, orderNumber, sheet) {
    //resize is 1-indexed
    await sheet.resize({ rowCount: sheet.rowCount + 1, columnCount: sheet.columnCount});
    
    //load the newly created cells
    await sheet.loadCells();
    
    //getcell is 0-indexed
    sheet.getCell(sheet.rowCount - 1, 0).value = JSON.stringify(order);
    sheet.getCell(sheet.rowCount - 1, 2).value = orderNumber;

    await sheet.saveUpdatedCells();
    return;
}