import React from 'react'
import i18next from 'i18next'

const Form = (props) => {
  let btn = null
  let currentApprove = null
  if (props.fields.value.value !== '') {
    const approve = props.calcApprove(Number(props.fields.value.value));
    if (approve[0] > 0) {
      btn = <div className="alert alert-danger">
        {i18next.t('market:notEnoughTokens', { token: props.base.info.name })}
      </div>
    } else if (approve[1] <= 0) {
      btn = (
        <div>
          <span>{i18next.t('market:sum')} &asymp; {approve[2]}</span>
          &nbsp;
          <button type="submit" className="btn btn-default" disabled={props.form.submitting}>{i18next.t('market:submitBuy')}</button>
        </div>
      )
    } else {
      currentApprove = (
        <div className="text-warning" style={{ marginBottom: 10 }}>
          <span className="fa fa-exclamation" /> {i18next.t('market:nonValueApprove')}: <b>{approve[1]} {props.quote.info.symbol}</b>, {i18next.t('market:valueApprove')}: <b>{props.approve} {props.quote.info.symbol}</b>
        </div>
      )
    }
  }
  return <div>
    <p>{i18next.t('market:buyOrder')} <b>{props.base.info.name}</b></p>
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
      {currentApprove}
      {btn}
      {props.form.success &&
        <div className="alert alert-success">{props.form.success}</div>
      }
    </form>
  </div>
}

export default Form
