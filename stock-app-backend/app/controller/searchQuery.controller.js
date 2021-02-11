

const queryWithoutSearch = `select id,file240, name, description, createdAt
from images order by createdAt desc limit `;

exports.getWhere = (query) => {
    const pagex = query.pagex;    
    return queryWithoutSearch.concat(`${pagex},30`);
    }

