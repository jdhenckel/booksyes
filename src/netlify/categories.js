//called with /.netlify/functions/categories
const axios = require('axios');
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    const getCategories = async function() {
        const sheet = await helpers.initCatalogSheet(process.env.DATABASE_SHEET_CATEGORIES);
        await sheet.loadCells();
        var retobj = {categories: []};
        for (let i = 0; i < sheet.rowCount; i++) {
            const element = sheet.getCell(i, 0).value;
            retobj.categories.push(element);
        }

        return retobj;
    }

    return getCategories()
    .then(response => ({
        statusCode: 200,
        body: JSON.stringify(response),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}