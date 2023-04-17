import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { ICampground, IComment } from '../interfaces';


interface Props {
  itemType: string;
  itemObj: IComment | ICampground;
  handleDelete: (itemObj: IComment | ICampground, loggedInAsAdminBool: boolean) => Promise<void>;
  loggedInAsAdminBool: boolean;
  children: string;
}

function DeleteModal({
  itemType, itemObj, handleDelete, loggedInAsAdminBool, children
}: Props) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleConfirmDelete = () => {
    handleDelete(itemObj, loggedInAsAdminBool);
    setShow(false);
  };
  const handleCancelDelete = () => {
    setShow(false);
  };

  return (
    <>
      <Button
        size="sm"
        variant="danger"
        onClick={handleShow}
        className="btn-square"
      >
        {children}
      </Button>

      <Modal show={show} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>
            {children}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this
          {' '}
          {itemType}
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

DeleteModal.propTypes = {
  children: PropTypes.string.isRequired,
  itemType: PropTypes.string.isRequired,
  itemObj: PropTypes.shape({}).isRequired,
  handleDelete: PropTypes.func.isRequired,
  loggedInAsAdminBool: PropTypes.bool.isRequired
};

export default DeleteModal;
