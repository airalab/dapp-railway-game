import React from 'react'
import i18next from 'i18next'
import Modal from 'react-bootstrap/lib/Modal';
import { confirmable, createConfirmation } from 'react-confirm';

const ComplexConfirmation = (props) => {
  const {
    show,
    cancel,
    proceed,
    message
  } = props;
  return (
    <div>
      <Modal show={show} onHide={cancel} >
        <Modal.Header>
          <Modal.Title>{i18next.t('market:marketSwitch')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center" dangerouslySetInnerHTML={{ __html: message }} />
          <p className="text-center">
            <br /><br />
            <button className="btn btn-default btn-xs" onClick={proceed}>
              {i18next.t('market:submit')}
            </button>
          </p>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default createConfirmation(confirmable(ComplexConfirmation), 0);
