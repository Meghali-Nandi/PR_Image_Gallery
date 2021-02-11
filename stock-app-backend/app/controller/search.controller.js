const QueryCreator = require("../util/QueryCreator");
const searchQueryController = require("../controller/searchQuery.controller");

fetchRecords = async(query) => {
    const queryCreated = await QueryCreator(query);
    console.log(queryCreated);
    const getWhere = searchQueryController.getWhere(queryCreated);
    console.log(getWhere);
    return getWhere;
}

deleteRecords =async(id) => {
    query=``
}



module.exports = {
    fetchRecords: fetchRecords,
    
};