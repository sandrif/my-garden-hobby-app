const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/plant/getAbl");
const ListAbl = require("../abl/plant/listAbl");
const CreateAbl = require("../abl/plant/createAbl");
const UpdateAbl = require("../abl/plant/updateAbl");
const ListByCollectionIdAbl = require("../abl/plant/listByCollectionIdAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.get("/listByCollectionId", ListByCollectionIdAbl);

module.exports = router;