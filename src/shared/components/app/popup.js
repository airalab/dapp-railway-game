import React from 'react'
import i18next from 'i18next'
import Modal from 'react-bootstrap/lib/Modal';
import { confirmable, createConfirmation } from 'react-confirm';

const ComplexConfirmation = (props) => {
  const {
    show,
    cancel,
    message
  } = props;
  return (
    <div>
      <Modal show={show} onHide={cancel} >
        <Modal.Header>
          <Modal.Title>{i18next.t('market:marketSwitch')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: message }} className="text-center" />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default createConfirmation(confirmable(ComplexConfirmation), 0);
