//called with /.netlify/functions/categories
const axios = require('axios');
const helpers = require('./helperFuncs.js');

exports.handler = async function(event, context) {

    const endpoint = helpers.buildURL('select *', "categories");

    makeCategoryList = (data) => {
        const table = JSON.parse(data.replace(/^\)]\}'\n/, '')).table;
        var retobj = {categories: []};
        for (let i = 0; i < table.rows.length; i++) {
            const element = table.rows[i].c[0].v;
            retobj.categories.push(element);
        }
        return JSON.stringify(retobj);
    }

    return axios.get(endpoint, {headers: {'X-DataSource-Auth':""}})
    .then(response => ({
        statusCode: 200,
        body: makeCategoryList(response.data),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
}