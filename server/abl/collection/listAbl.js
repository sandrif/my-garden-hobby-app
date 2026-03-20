const collectionDao = require("../../dao/collection-dao.js");

async function ListAbl(req, res) {
  try {
    const collectionList = collectionDao.list();
    res.json({ itemList: collectionList });
  } catch (e) {
    res.status(500).json({ collection: e.collection });
  }
}

module.exports = ListAbl;