import React, { Component } from 'react'
import i18next from 'i18next'

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(next) {
    if (next.formInfo.reset === true) {
      this.setState({ value: '' });
      this.props.formReset(false);
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state);
    event.preventDefault();
  }

  render() {
    const valid = this.props.validate(this.state);
    let error = null
    let btn = null
    let msg = null
    if (this.state.value !== '') {
      if (valid) {
        btn = <button type="submit" className="btn btn-default">{i18next.t('market:submit')}</button>
      } else {
        error = <div className="alert alert-danger">{i18next.t('market:formErrMsg')}</div>;
      }
    }
    if (this.props.formInfo.message !== '') {
      msg = <div className="alert alert-success">{this.props.formInfo.message}</div>;
    }
    return (
      <div>
        <p>
          {i18next.t('market:balanceTokens')}: <b>{this.props.balance} {this.props.tokenInfo.info.symbol}</b>
        </p>
        <p>
          {i18next.t('market:approveBalance')}: <b>{this.props.approve} {this.props.tokenInfo.info.symbol}</b>
        </p>
        <p>{i18next.t('market:newLimit')}:</p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <span className="control-label">{i18next.t('market:newLimitValue')}:</span>
            <div className="input-group">
              <input value={this.state.value} onChange={this.handleChange} name="value" type="text" className="form-control form-control-b" />
              <div className="input-group-addon">{this.props.tokenInfo.info.symbol}</div>
            </div>
          </div>
          {error}
          {msg}
          {btn}
        </form>
      </div>
    );
  }
}

export default Add
