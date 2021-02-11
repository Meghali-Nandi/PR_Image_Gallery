
const pageRegx = /_page\:([0-9]+)\s?/;

parsePageOffset = (query) => {
    const res = pageRegx.exec(query);
    if (res === null) return 0;

    if (res[1] !== undefined) {
        let offset = (parseInt(res[1]) - 1) * 30;
        return offset
    }
}

parseAll = (query) => {
    console.log(query);
    let res = {
        pagex: 0
    }

    
    res.pagex = parsePageOffset(query);
    return res;
}
module.exports = parseAll;
