import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { IoClose } from "react-icons/io5";

function AddToCollectionForm({ show, onClose, onSelect }) {
  return (
    <Modal show={show} onHide={onClose} centered contentClassName="custom-modal">
{/* 
    {/* Call your collection update logic here:
     collectionHandler.addPlantToCollection({ */}
  {/* //     plantId: selectedPlant.id,
  //     type, // "own" or "want"
  //   });
  // } */}

  {/* // function addPlantToCollection({ plantId, type }) { */}
  {/* //   if (type === "own") {
  //     // e.g., increment own counter
  //     updateCollection("own", plantId);
  //   } else if (type === "want") {
  //     updateCollection("want", plantId);
  //   }
  // } */}

  {/* //When user selects "I own" or "I want"
  function handleAddToCollection(type) {
    setShowAddModal(false);
  }  */}
      <div className="modal-header-custom">
        <IoClose className="close-icon" onClick={onClose} />
        {/* <button className="modal-close-btn" onClick={onClose}>×</button> */}
      </div>
      <div className="modal-body-custom">
        <Button className="collection-btn" onClick={() => onSelect("own")}>
          I OWN
        </Button>
        {/* <div className="divider" /> */}
        <Button className="collection-btn" onClick={() => onSelect("want")}>
          I WANT
        </Button>
      </div>
    </Modal>
  );
}

export default AddToCollectionForm;