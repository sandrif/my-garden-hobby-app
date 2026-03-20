const Ajv = require("ajv");
const ajv = new Ajv();
const collectionDao = require("../../dao/collection-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1, maxLength: 1 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        collection: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read collection by given id
    const collection = collectionDao.get(reqParams.id);
    if (!collection) {
      res.status(404).json({
        code: "collectionNotFound",
        collection: `collection with id ${reqParams.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(collection);
  } catch (e) {
    res.status(500).json({ collection: e.collection });
  }
}

module.exports = GetAbl;