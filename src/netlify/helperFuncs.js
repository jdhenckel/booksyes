const axios = require('axios');
const {GoogleSpreadsheet} = require('google-spreadsheet');

exports.getSettings = async function() {
    const sheet = await initCatalogSheet(process.env.DATABASE_SHEET_SETTINGS);
    const rows = await sheet.getRows();
    const settingsObj = {};
    rows.forEach(row => {
        const setting = JSON.parse(`{"${row.setting}": "${row.value}"}`);
        Object.assign(settingsObj, setting);
    });

    return settingsObj;
}

exports.getOrderNumber = () => {
    const year = (new Date()).getFullYear().toString().slice(-2);
    const digits = (new Date()).getTime().toString().slice(-6);
    return year + digits;
}

const initCatalogSheet = exports.initCatalogSheet = async function (sheetId = process.env.DATABASE_SHEET_BOOKS) {
    const doc = new GoogleSpreadsheet(process.env.DATABASE_KEY);
    var v0 = performance.now();
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    var v1 = performance.now();
    await doc.loadInfo();
    const sheet = doc.sheetsById[sheetId];

    var v2 = performance.now();
    //await sheet.loadCells();

    var v3 = performance.now();
    console.log(`loaded doc in: ${v1 - v0} \nloaded doc info in: ${v2 - v1} \nloaded sheet cells in: ${v3 - v2}`);
    
    return sheet;
}

const convertRowToBook = (row) => {
    return {id: row.rowNumber, title: row.title, author: row.author, price: row.price, ISBN: row.ISBN, description: row.description, imageSrc: row.imageSrc, category: row.category};
}

exports.getBooks = async function(testFunction, params) {
    var v0 = performance.now();
    const sheet = await initCatalogSheet();
    var v1 = performance.now();
    const rows = await sheet.getRows();
    var v2 = performance.now();
    var retObject = {books: []};
    for(let r = 0; r < rows.length; r++) {
        const row = rows[r];
        if(testFunction(row, params)) {
            retObject.books.push(convertRowToBook(row));
        }
    }
    var v3 = performance.now();
    console.log(`loaded sheet in: ${v1 - v0} \n loaded rows in: ${v2 - v1} \n loaded returnObj in: ${v3 - v2}`);
    return retObject;
}