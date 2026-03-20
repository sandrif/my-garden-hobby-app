const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const plantDao = require("../../dao/plant-dao.js");
const collectionDao = require("../../dao/collection-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
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
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read plant by given id
    const plant = plantDao.get(reqParams.id);
    if (!plant) {
      res.status(404).json({
        code: "plantNotFound",
        message: `plant ${reqParams.id} not found`,
      });
      return;
    }

    // get related collection
    const collection = collectionDao.get(plant.collectionId);
    plant.collection = collection;

    // return properly filled dtoOut
    res.json(plant);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;