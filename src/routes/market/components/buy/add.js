import React from 'react'
import i18next from 'i18next'

const Form = (props) => {
  let btn = null
  let currentApprove = null
  if (props.fields.value.value !== '' && props.fields.price.value !== '') {
    const approve = props.calcApprove(
      Number(props.fields.value.value), Number(props.fields.price.value)
    );
    if (approve !== false && approve <= 0) {
      btn = <button type="submit" className="btn btn-default" disabled={props.form.submitting}>{i18next.t('market:submitBuy')}</button>
    } else if (approve !== false) {
      currentApprove = (
        <div className="text-warning" style={{ marginBottom: 10 }}>
          <span className="fa fa-exclamation" /> {i18next.t('market:nonValueApprove')}: <b>{approve} {props.quote.info.symbol}</b>, {i18next.t('market:valueApprove')}: <b>{props.approve} {props.quote.info.symbol}</b>
        </div>
      )
    }
  }
  return <div>
    <p>{i18next.t('market:addBuy')} <b>{props.base.info.name}</b></p>
    <form onSubmit={props.handleSubmit}>
      <div className={(props.fields.value.error) ? 'form-group has-error' : 'form-group'}>
        <span className="control-label">{i18next.t('market:value')}:</span>
        <div className="input-group">
          <input value={props.fields.value.value} onChange={props.handleChange} name="value" type="text" className="form-control" />
          <div className="input-group-addon">{props.base.info.symbol}</div>
        </div>
        {props.fields.value.error &&
          <span className="help-block">{props.fields.value.error}</span>
        }
      </div>
      <div className={(props.fields.price.error) ? 'form-group has-error' : 'form-group'}>
        <span className="control-label">{i18next.t('market:price')}:</span>
        <div className="input-group">
          <input value={props.fields.price.value} onChange={props.handleChange} name="price" type="text" className="form-control" />
          <div className="input-group-addon">{props.quote.info.symbol}</div>
        </div>
        {props.fields.price.error &&
          <span className="help-block">{props.fields.price.error}</span>
        }
      </div>
      {currentApprove}
      {btn}
      {props.form.success &&
        <div className="alert alert-success">{props.form.success}</div>
      }
    </form>
  </div>
}

export default Form
