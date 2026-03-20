const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const plantDao = require("../../dao/plant-dao.js");
const collectionDao = require("../../dao/collection-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" }
  },
  required: [],
  additionalProperties: false,
};

async function ListAbl(req, res) {
  try {
    const filter = req.query?.name ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, filter);
    if (!valid) {
      res.status(400).json({
        code: "unsupportedKeys",
        message: "Unsupported Keys",
        validationError: ajv.errors,
      });
      return;
    }

    //const plantList = plantDao.list(filter);
    const plantList = plantDao.list(filter);

    // return properly filled dtoOut
    res.json({ itemList: plantList });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;