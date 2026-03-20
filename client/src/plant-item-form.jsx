import React from 'react';

import { useContext } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { PlantListContext } from "./plant-list-provider.jsx";

function PlantItemForm({ item, onClose, onSuccess }) {
  const { state, data, error, handlerMap } = useContext(PlantListContext);

  return (
    <Modal show={true} onHide={onClose} centered>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const formData = new FormData(e.target);
          const values = Object.fromEntries(formData);
    
          let result;
          if (item?.id) {
            result = await handlerMap.handleUpdate({
              id: item.id,
              ...values,
            });
          } else {
            result = await handlerMap.handleCreate({ ...values });
          }
          if (result.ok) {
            onClose();
            if (typeof onSuccess === "function") {
              onSuccess(); 
            }
          }
          else 
          console.error("Update/Create failed:", result);
          
          
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{item?.id ? "MODIFY EXISTING" : "REGISTER NEW"} PLANT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {state === "error" ? (
            <Alert variant={"danger"}>{error.message}</Alert>
          ) : null}
          <Form.Label></Form.Label>
          <Form.Control
           className="input-shadow"
            type="text"
            name="name"
            defaultValue={item?.name}
            disabled={state === "pending"}
            required
            placeholder="NAME"
            
          />
         
          <Form.Label></Form.Label>
          <Form.Select
           className="input-shadow"
            type="select"
            name="type"
            defaultValue={item?.type || ""}
            disabled={state === "pending"}
            required
            placeholder="TYPE"

          >
            <option value="" disabled>TYPE</option>
            <option value="Green Plant">Green Plant</option>
            <option value="Blossoming Flower">Blossoming Flower</option>
          </Form.Select>

          <Form.Label></Form.Label>
          <Form.Control
           className="input-shadow"
            type="text"
            name="origin"
            defaultValue={item?.origin}
            disabled={state === "pending"}
            required
            placeholder="ORIGIN"
            
          />

          <Form.Label></Form.Label>
          <Form.Control
            className="input-shadow"
            type="text"
            name="careRequirements"
            defaultValue={item?.careRequirements}
            disabled={state === "pending"}
            placeholder="CARE REQUIREMENTS"
          />

          {/* <Form.Label></Form.Label>
          <Form.Control
            className="input-shadow"
            type="file"
            name="image"
            disabled={state === "pending"}
            accept="image/*"  // to restrict to image files only
     
          /> */}

        </Modal.Body>
        <Modal.Footer>
        
          <Button className='btn-gradient'
            variant="primary"
            type="submit"
            disabled={state === "pending"}
          >
            {item?.id ? "MODIFY" : "CREATE"}
          </Button>

          <Button className='btn-gradient'
            variant="secondary"
            onClick={onClose}
            disabled={state === "pending"}
          >
            CANCEL
          </Button>

        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default PlantItemForm;