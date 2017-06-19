import React, { Component } from 'react'
import BigNumber from 'bignumber.js'

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      price: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let value = event.target.value;
    if (value !== '') {
      value = Number(value);
      // if (event.target.name === 'price') {
      value = new BigNumber(value)
      value = value.toFixed()
      // }
    }
    this.setState({ [event.target.name]: value });
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state);
    event.preventDefault();
  }

  render() {
    const approve = this.props.calcApprove(this.state.value, this.state.price);
    let btn = <div className="alert alert-danger">Form is not filled out correctly</div>;
    if (approve !== false && approve <= 0) {
      btn = <button type="submit" className="btn btn-default">Sell</button>
    } else if (approve !== false) {
      btn = (
        <button
          className="btn btn-warning"
          onClick={(e) => {
            this.props.onApprove(
              this.props.token,
              this.props.address,
              approve
            );
            e.preventDefault();
          }}
        >
          Add to approve {approve} {this.props.base.info.symbol}
        </button>
      )
    }
    return (
      <div>
        <p>Sell <b>{this.props.base.info.name}</b></p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <span className="control-label">value:</span>
            <div className="input-group">
              <input value={this.state.value} onChange={this.handleChange} name="value" type="text" className="form-control form-control-b" />
              <div className="input-group-addon">{this.props.base.info.symbol}</div>
            </div>
          </div>
          <div className="form-group">
            <span className="control-label">price:</span>
            <div className="input-group">
              <input value={this.state.price} onChange={this.handleChange} name="price" type="text" className="form-control form-control-b" />
              <div className="input-group-addon">{this.props.quote.info.symbol}</div>
            </div>
          </div>
          {btn}
        </form>
      </div>
    );
  }
}

export default Add
