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

exports.buildURL = (query, sheet) => {
    const {DATABASE_SHEET_BOOKS} = process.env;
    const {DATABASE_SHEET_CATEGORIES} = process.env;
    const {DATABASE_LOCATION} = process.env;
    const {DATABASE_KEY} = process.env;
    
    var id;
    switch(sheet) {
        case "books":
            id = DATABASE_SHEET_BOOKS;
            break;
        case "categories":
            id = DATABASE_SHEET_CATEGORIES;
            break;
    }

    const key = "&key=" + DATABASE_KEY;
    const gid = "&gid=" + id;
    const request = "&tq=" + query;
    const endpoint = DATABASE_LOCATION + "tq?" + request + key + gid;
    return endpoint;
};