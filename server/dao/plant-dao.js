const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const plantFolderPath = path.join(
  __dirname,
  "storage",
  "plantList"
);

// Method to read an plant from a file
function get(plantId) {
  try {
    const filePath = path.join(plantFolderPath, `${plantId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadPlant", message: error.message };
  }
}

// Method to write an plant to a file
function create(plant) {
  try {
    plant.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(plantFolderPath, `${plant.id}.json`);
    const fileData = JSON.stringify(plant);
    fs.writeFileSync(filePath, fileData, "utf8");
    return plant;
  } catch (error) {
    throw { code: "failedToCreatePlant", message: error.message };
  }
}

// Method to update plant in a file
function update(plant) {
  try {
    const currentPlant = get(plant.id);
    if (!currentPlant) return null;
    const newPlant = { ...currentPlant, ...plant };
    const filePath = path.join(plantFolderPath, `${plant.id}.json`);
    const fileData = JSON.stringify(newPlant);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newPlant;
  } catch (error) {
    throw { code: "failedToUpdatePlant", message: error.message };
  }
}

// Method to list plants in a folder
function list(filter = {}) {
  try {
    const files = fs.readdirSync(plantFolderPath);
    let plantList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(plantFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    
     // Apply filter if a name is provided
    if (filter.name) {
      const filterName = filter.name.toLowerCase(); // Convert to lowercase for case-insensitive search
      plantList = plantList.filter((item) =>
        item.name.toLowerCase().includes(filterName) // Check if name includes the filter string
      );
    }

    // Sort the plant list alphabetically by name
    plantList.sort((a, b) => a.name.localeCompare(b.name));

    return plantList;
  } catch (error) {
    throw { code: "failedToListPlants", message: error.message };
  }
}

// Method to list plants by collectionId
function listByCollectionId(filter = {}) {

  try {
    const files = fs.readdirSync(plantFolderPath);
    let plantList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(plantFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });

 // return plantList.filter((item) => item.collectionId === collectionId);

 if (filter.collectionId) {
  const collectionId = filter.collectionId.toString();
  plantList = plantList.filter((item) =>
    item.collectionId && item.collectionId.toString() === collectionId
  );
}

return plantList;

  } catch (error) {
    throw { code: "failedToListPlants", message: error.message };
  }

  // const plantList = list();
  // return plantList.filter((item) => item.collectionId === collectionId);
}

module.exports = {
  get,
  create,
  update,
  list,
  listByCollectionId,
};