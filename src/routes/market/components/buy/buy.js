import React, { Component } from 'react'

class Buy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    let currentApprove = null
    if (this.state.value !== '') {
      if (valid) {
        const approve = this.props.calcApprove(this.state.value);
        if (approve[0] > 0) {
          btn = <div className="alert alert-danger">The market does not have enough {this.props.base.info.name} tokens</div>
        } else if (approve[1] <= 0) {
          btn = (
            <div>
              <span>Sum &asymp; {approve[2]}</span>
              &nbsp;
              <button type="submit" className="btn btn-default">Buy</button>
            </div>
          )
        } else {
          currentApprove = (
            <div className="text-warning" style={{ marginBottom: 10 }}>
              <span className="fa fa-exclamation" /> Не хватает: <b>{approve[1]} {this.props.quote.info.symbol}</b>, доступно: <b>{this.props.approve} {this.props.quote.info.symbol}</b>
            </div>
          )
        }
      } else {
        error = <div className="alert alert-danger">Form is not filled out correctly</div>;
      }
    }
    return (
      <div>
        <p>Buy Order <b>{this.props.base.info.name}</b></p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <span className="control-label">value:</span>
            <div className="input-group">
              <input value={this.state.value} onChange={this.handleChange} name="value" type="text" className="form-control form-control-b" />
              <div className="input-group-addon">{this.props.base.info.symbol}</div>
            </div>
          </div>
          {error}
          {currentApprove}
          {btn}
        </form>
      </div>
    );
  }
}

export default Buy
