const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const collectionFolderPath = path.join(__dirname, "storage", "collectionList");

// Method to read an collection from a file
function get(collectionId) {
  try {
    const filePath = path.join(collectionFolderPath, `${collectionId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadCollection", collection: error.collection };
  }
}

// Method to list collections in a folder
function list() {
  try {
    const files = fs.readdirSync(collectionFolderPath);
    const collectionList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(collectionFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return collectionList;
  } catch (error) {
    throw { code: "failedToListCollections", collection: error.collection };
  }
}

module.exports = {
  get,
  list
};