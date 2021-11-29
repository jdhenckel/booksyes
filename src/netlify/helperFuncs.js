exports.buildBooks = (data) => {
    const table = JSON.parse(data.replace(/^\)]\}'\n/, '')).table;
    const retObj = {books: []};
    for (let r = 0; r < table.rows.length; r++) {
        const row = table.rows[r];
        const book = {id: r};

        for (let i = 0; i < table.cols.length; i++) {
            const col = table.cols[i];
            const valueSet = JSON.parse('{"' + col.label + '": "' + row.c[i]?.v + '"}');
            Object.assign(book, valueSet);
        }

        retObj.books.push(book);
    }

    return JSON.stringify(retObj);
};

exports.buildURL = (query) => {
    const {DATABASE_LOCATION} = process.env;
    const request = "/gviz/tq?tq=";    
    const endpoint = DATABASE_LOCATION + request + query;
    return endpoint;
};