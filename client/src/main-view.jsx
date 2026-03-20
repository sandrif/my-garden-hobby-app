import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useContext, useState, useEffect } from "react";
import { Form, Button, InputGroup, Card, Alert, Toast } from "react-bootstrap";
import logo from './logo.svg';

import PlantItemForm from "./plant-item-form";
import { PlantListContext } from "./plant-list-provider";

import AddToCollectionForm from "./add-to-collection-form";

import FetchHelper from "./fetch-helper.js";

import CollectionListForm from "./collection-list-form";

const MainView = ({}) => {

  const { data,
    state,
    error,
    plantName,
    handlerMap,
    setPlantName, collectionPlants, setCollectionPlants} = useContext(PlantListContext);

  const [showRegisterForm, setShowRegisterForm] = useState(false); 
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Track the item to modify


  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [collectionCounts, setCollectionCounts] = useState({ own: 0, want: 0 });
  const [showCollectionList, setShowCollectionList] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const loadCollectionCounts = async () => {
    try {
      const ownResult = await FetchHelper.plant.listByCollectionId({ collectionId: "1" });
      const wantResult = await FetchHelper.plant.listByCollectionId({ collectionId: "2" });
  
      setCollectionCounts({
        own: ownResult.data.itemList.length,
        want: wantResult.data.itemList.length,
      });
    } catch (error) {
      console.error("Failed to load collection counts:", error);
    }
  };

  useEffect(() => {
    loadCollectionCounts();
  }, []);


  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setPlantName(term); // triggers useEffect -> handleLoad in context

    const filtered = data?.itemList?.filter((item) =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredItems(filtered || []);
  };

  const handleFormSuccess = () => {
    setSearchTerm("");          
    setFilteredItems([]);       
    setSelectedPlant(null);    
   // setShowForm(false);   
   
   setShowSuccessAlert(true); 
   setTimeout(() => setShowSuccessAlert(false), 3000); 
  };

    // When user clicks "Add" button
  const handleAddClick = () => {
    if (selectedPlant) {
      setShowAddModal(true);
    }
  }

  const handleCollectionSelect = async (type) => {
    //console.log("Selected:", type); 
    const collectionId = type === "own" ? "1" : "2";
    
    const updatedPlant = {
        ...selectedPlant,
        collectionId,
      };

    await handlerMap.handleUpdate(updatedPlant);
     // Reload counts after update
    await loadCollectionCounts();

    // setCollectionCounts((prev) => ({
    //   ...prev,
    //   [type]: prev[type] + 1,
    // }));
    setShowAddModal(false);
    setSearchTerm("");
    setShowToast(true); // Show the toast
  };


  const handleTileClick = async (collectionId) => {

    console.log("Clicked collection ID:", collectionId);


  const result = await FetchHelper.plant.listByCollectionId({ collectionId });

  const plants = Array.isArray(result.data?.itemList) ? result.data.itemList : [];
  setCollectionPlants(plants);
  setShowCollectionList(true);


  };

  return (
    <>
    <Card className="main-view shadow">
    <Card.Body>
      <div className="d-flex justify-content-center mb-4">
        <img src={logo} alt="MyGarden" className="App-logo" />
      </div>

      {/* FORM SECTION */}
      <Form >

        <AddToCollectionForm
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSelect={handleAddClick}
          />

      <InputGroup className="mb-3 search-bar">
        <InputGroup.Text>
          <i className="bi bi-search"></i>
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder=""
          value={searchTerm}
          onChange={handleInputChange}
      
        />
        {searchTerm && filteredItems.length > 0 && (
          <div className="autocomplete-dropdown">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="autocomplete-item"
                onClick={() => {
                  setSelectedPlant(item); 
                  setFilteredItems([item]);
                }}
              >
                {item.name} 
              </div>
            ))}
          </div>
        )}
        
      </InputGroup>

        <div className="d-flex justify-content-between mb-4">
          <Button
            className="btn-gradient w-50 me-2"
            onClick={handleAddClick}
          >
            Add
          </Button>
          <Button
            // variant="primary"
            // disabled={!selectedPlant}
            className="btn-gradient w-50 ms-2"
           // onClick={handleSelectItem}
           onClick={() => {setSelectedItem(selectedPlant); setShowModifyForm(true);}}
          >
            Modify
          </Button>
        </div>
      </Form>

      <div className="d-flex justify-content-between mb-4">
            <Card className="tile w-50 me-2 text-center custom-tile">
              <Card.Body className="d-flex flex-column justify-content-between align-items-center h-100" onClick={() => handleTileClick("1")}>
                <Card.Title>I OWN</Card.Title>
                <Card.Text className="count ms-auto">{collectionCounts.own}</Card.Text>
              </Card.Body>
            </Card>
            <Card className="tile w-50 me-2 text-center custom-tile">
              <Card.Body className="d-flex flex-column justify-content-between align-items-center h-100" onClick={() => handleTileClick("2")}>
                <Card.Title>I WANT</Card.Title>
                <Card.Text className="count ms-auto">{collectionCounts.want}</Card.Text>
              </Card.Body>
            </Card>
          </div>

      <Button className="btn-gradient w-100" onClick={() => setShowRegisterForm(true)}>
        REGISTER PLANT
      </Button>
 
    </Card.Body>
    
  </Card>
  <CollectionListForm
  show={showCollectionList}
  onClose={() => setShowCollectionList(false)}
  collectionPlants={collectionPlants}
/>

   {showRegisterForm && (
        <PlantItemForm
          item={null} // null = create mode
          onClose={() => setShowRegisterForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

        {/* Modify Plant Form */}
        {showModifyForm && (
        <PlantItemForm
          item={selectedItem} // Pass the selected item to modify
          onClose={() => {setShowModifyForm(false); setSearchTerm(""); }}
          onSuccess={handleFormSuccess}
        />
      )}
         {showSuccessAlert && (
          <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
             Success!
          </Alert>
        )}
         <Toast className="small-toast" show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide >
          <Toast.Body>Plant added to collection!</Toast.Body>
        </Toast>

    <AddToCollectionForm
      show={showAddModal}
      onClose={() => setShowAddModal(false)}
      onSelect={handleCollectionSelect} 
    />

    </>

  );
}

export default MainView;