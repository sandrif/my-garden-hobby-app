const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const plantDao = require("../../dao/plant-dao.js");
const collectionDao = require("../../dao/collection-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 50 },
    type: { type: "string", maxLength: 50 },
    origin: { type: "string", maxLength: 100 },
    careRequirements: { type: "string", maxLength: 250 },
    //image: {type: "image/jpeg"},
  },
  required: ["name", "type", "origin"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let plant = req.body;

    // validate input
    const valid = ajv.validate(schema, plant);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // store plant to persistent storage
    plant = plantDao.create(plant);

    // return properly filled dtoOut
    res.json(plant);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;