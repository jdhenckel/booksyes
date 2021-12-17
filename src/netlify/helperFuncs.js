const axios = require('axios');

exports.searchCol = "A";
exports.categoryCol = "J";
exports.imageCol = "I";
exports.isNewCol = "B";

exports.buildBooks = (data) => {
    const table = JSON.parse(data.replace(/^\)]\}'\n/, '')).table;
    const retObj = {books: []};
    for (let r = 0; r < table.rows.length; r++) {
        const row = table.rows[r];
        const book = {id: r};

        for (let i = 0; i < table.cols.length; i++) {
            const col = table.cols[i];
            const rowValue = row.c[i] ? row.c[i].v : "undefined";
            const valueSet = JSON.parse('{"' + col.label + '": "' + rowValue + '"}');
            Object.assign(book, valueSet);
        }

        retObj.books.push(book);
    }

    return JSON.stringify(retObj);
};

const buildSettings = exports.buildSettings = (data) => {
    const table = JSON.parse(data.replace(/^\)]\}'\n/, '')).table;
    const settingObj = {};

    for (let r = 1; r < table.rows.length; r++) {
        const row = table.rows[r];
        
        const newObj = JSON.parse('{"' + row.c[0].v + '": "' + row.c[1].v + '"}');
        Object.assign(settingObj, newObj);
    }

    return settingObj;
}

const buildURL = exports.buildURL = (query, sheet) => {
    const {DATABASE_SHEET_BOOKS, DATABASE_SHEET_CATEGORIES, DATABASE_SHEET_SETTINGS} = process.env;
    const {DATABASE_LOCATION, DATABASE_KEY} = process.env;

    var id;
    switch(sheet) {
        case "books":
            id = DATABASE_SHEET_BOOKS;
            break;
        case "categories":
            id = DATABASE_SHEET_CATEGORIES;
            break;
        case "settings":
            id = DATABASE_SHEET_SETTINGS;
            
            break;
    }

    const key = "&key=" + DATABASE_KEY;
    const gid = "&gid=" + id;
    const request = "&tq=" + query;
    const endpoint = DATABASE_LOCATION + "tq?" + request + key + gid;
    return endpoint;
};

exports.getSettings = () => axios.get(buildURL("select *", "settings"), {headers: {'X-DataSource-Auth':""}}).then(response => buildSettings(response.data));

exports.getOrderNumber = () => {
    const year = (new Date()).getFullYear().toString().slice(-2);
    const digits = (new Date()).getTime().toString().slice(-6);
    return year + digits;
}