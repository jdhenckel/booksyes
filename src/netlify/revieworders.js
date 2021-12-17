//called with /.netlify/functions/revieworders
const bcrypt = require('bcrypt');
const helpers = require('./helperFuncs.js');
const { default: axios } = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async function(event, context) {
    try {
        const password = JSON.parse(event.body).pass;
        //check if password matches
        await bcrypt.compare(password, process.env.ORDER_REVIEW_HASH).then(function(result) {
            if(result !== true) {
                throw 'Invalid Password';
            }
        });

        if(event.queryStringParameters.action == "view") {
            const ordersString = await getOrders(event.queryStringParameters.showDeleted && true);
            return {statusCode: 200, body: ordersString};
        }

        if(event.queryStringParameters.action == "delete") {
            return deleteOrder(event.queryStringParameters.orderNumber);
        }

        return {
            statusCode: 400,
            body: 'Invalid URL parameters',
        }
    } catch(error) {
        return {
            statusCode: 500,
            body: String(error),
        }
    }
}

async function initOrdersSheet() {
    const doc = new GoogleSpreadsheet(process.env.DATABASE_ORDERS_KEY);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsById[process.env.DATABASE_SHEET_ORDERS];
    await sheet.loadCells();
    
    return sheet;
}

async function deleteOrder(orderNumber) {
    const sheet = await initOrdersSheet();

    for (let i = 0; i < sheet.rowCount; i++) {
        const cell = sheet.getCell(i, 2);
        if(cell.value === orderNumber) {
            sheet.getCell(i, 1).value = sheet.getCell(i, 1).value === 'x' ? '' : 'x';
            await sheet.saveUpdatedCells();
            return {statusCode: 200, body: 'deleted!'};
        }
    }

    return {
        statusCode: 404,
        body: 'no such order found',
    }
}

async function getOrders(showDeleted) {
    const sheet = await initOrdersSheet();
    var orders = [];

    for (let i = 0; i < sheet.rowCount; i++) {
        const order = JSON.parse(sheet.getCell(i, 0).value);
        const isDeleted = sheet.getCell(i, 1).value === 'x';
        const orderNumber = sheet.getCell(i, 2).value;

        //must have an order and an order number
        if(!order || !orderNumber) {
            continue;
        }

        //don't put deleted rows in a regular search
        if(!showDeleted && isDeleted) {
            continue;
        }

        orders.push({
            ...order,
            isDeleted: isDeleted,
        });
    }
    
    return JSON.stringify(orders);
}