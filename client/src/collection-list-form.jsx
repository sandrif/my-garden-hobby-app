// CollectionListModal.jsx
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function CollectionListForm({ show, onClose, collectionPlants }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Plants in Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {collectionPlants.length === 0 ? (
          <p>No plants found in this collection.</p>
        ) : (
          <ul className="list-group">
            {collectionPlants.map((plant) => (
              <li key={plant.id} className="list-group-item">
                {plant.name}
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CollectionListForm;