import React, { Component } from 'react'

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
        btn = <button type="submit" className="btn btn-default">Подтвердить</button>
      } else {
        error = <div className="alert alert-danger">Form is not filled out correctly</div>;
      }
    }
    if (this.props.formInfo.message !== '') {
      msg = <div className="alert alert-success">{this.props.formInfo.message}</div>;
    }
    return (
      <div>
        <p>
          Баланс токенов: <b>{this.props.balance} {this.props.tokenInfo.info.symbol}</b>
        </p>
        <p>
          Разрешено для торговли: <b>{this.props.approve} {this.props.tokenInfo.info.symbol}</b>
        </p>
        <p>Укажите новый лимит для торговли:</p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <span className="control-label">количество:</span>
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
