const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/collection/getAbl");
const ListAbl = require("../abl/collection/listAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);

module.exports = router;