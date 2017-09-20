import React, { Component } from 'react'
import i18next from 'i18next'
import Modal from 'react-bootstrap/lib/Modal';
import { confirmable, createConfirmation } from 'react-confirm';

class ComplexConfirmation extends Component {

  handleOnClick(index) {
    const { proceed } = this.props;
    return () => {
      proceed({
        button: index
      });
    }
  }

  render() {
    const {
      show,
      cancel,
      data,
      btnActive
    } = this.props;

    return (
      <div>
        <Modal show={show} onHide={cancel} >
          <Modal.Header>
            <Modal.Title>{i18next.t('market:confTitle')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-center">
              {data.type === 1 ?
                i18next.t('market:confAvailableBuy', { value: data.valueClose, symbol: data.symbol })
                :
                i18next.t('market:confAvailableSell', { value: data.valueClose, symbol: data.symbol })
              }
              <br /><br />
              <button className="btn btn-default btn-xs" onClick={this.handleOnClick(1)} disabled={(btnActive === 1)}>
                {i18next.t('market:submit')}
              </button>
            </p>
            <hr />
            <p className="text-center">
              {i18next.t('market:confAdded', { value: data.valueAdd, symbol: data.symbol })}
              <br /><br />
              <button className="btn btn-default btn-xs" onClick={this.handleOnClick(2)} disabled={(btnActive === 2)}>
                {i18next.t('market:submit')}
              </button>
            </p>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}


export default createConfirmation(confirmable(ComplexConfirmation), 0);
