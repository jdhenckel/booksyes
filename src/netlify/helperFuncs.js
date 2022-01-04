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
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsById[sheetId];
    
    return sheet;
}

const convertRowToBook = (row) => {
    return {id: row.rowNumber, title: row.title, author: row.author, price: row.price, ISBN: row.ISBN, description: row.description, imageSrc: row.imageSrc, category: row.category};
}

exports.getBooks = async function(testFunction, params) {
    const sheet = await initCatalogSheet();
    const rows = await sheet.getRows();
    var retObject = {books: []};
    for(let r = 0; r < rows.length; r++) {
        const row = rows[r];
        if(testFunction(row, params)) {
            retObject.books.push(convertRowToBook(row));
        }
    }
    
    return retObject;
}