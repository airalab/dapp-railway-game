import React from 'react'
import i18next from 'i18next'

const Form = (props) => {
  let btn = null
  if (props.fields.value.value !== '') {
    btn = <button type="submit" className="btn btn-default" disabled={props.form.submitting}>{i18next.t('market:submit')}</button>
  }
  return (
    <div>
      <p>
        {i18next.t('market:balanceTokens')}: <b>{props.balance} {props.tokenInfo.info.symbol}</b>
      </p>
      <p>
        {i18next.t('market:approveBalance')}: <b>{props.approve} {props.tokenInfo.info.symbol}</b>
      </p>
      <p>{i18next.t('market:newLimit')}:</p>
      <form onSubmit={props.handleSubmit}>
        <div className={(props.fields.value.error) ? 'form-group has-error' : 'form-group'}>
          <span className="control-label">{i18next.t('market:newLimitValue')}:</span>
          <div className="input-group">
            <input value={props.fields.value.value} onChange={props.handleChange} name="value" type="text" className="form-control" />
            <div className="input-group-addon">{props.tokenInfo.info.symbol}</div>
          </div>
          {props.fields.value.error &&
            <span className="help-block">{props.fields.value.error}</span>
          }
        </div>
        {btn}
        {props.form.success &&
          <div className="alert alert-success">{props.form.success}</div>
        }
      </form>
    </div>
  )
}

export default Form
