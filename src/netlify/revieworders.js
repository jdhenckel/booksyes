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
            return getOrders(event.queryStringParameters.showDeleted && true)
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

function getOrders(showDeleted) {
    var endpoint = '';
    //load orders
    if(showDeleted) {
        endpoint = helpers.buildURL('select *', "orders");
    } else {
        endpoint = helpers.buildURL('select * where B is null', "orders");
    }
    

    return axios.get(endpoint, {headers: {'X-DataSource-Auth':""}})
    .then(response => ({
        statusCode: 200,
        body: helpers.buildOrders(response.data),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}