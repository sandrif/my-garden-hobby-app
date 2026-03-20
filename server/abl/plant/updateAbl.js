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
    name: { type: "string", maxLength: 50 },
    type: { type: "string", maxLength: 50 },
    origin: { type: "string", maxLength: 100 },
    careRequirements: { type: "string", maxLength: 250 },
   // image: {type: "image/jpeg"},
    collectionId: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let plant = req.body;

    // validate input
    console.log("Incoming DTO:", plant);
    const valid = ajv.validate(schema, plant);
    
    if (!valid) {
      console.error("Validation failed:", ajv.errors);
      
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
        
      });
   
      console.log( ajv.errors);



     
      return;
    }

    // update plant in database
    const updatedPlant = plantDao.update(plant);

    // return properly filled dtoOut
    res.json(updatedPlant);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;