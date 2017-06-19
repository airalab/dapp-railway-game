import React, { Component } from 'react'
import BigNumber from 'bignumber.js'

class Buy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
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
    const approve = this.props.calcApprove(this.state.value);
    let btn = <div className="alert alert-danger">Form is not filled out correctly</div>;
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
      btn = (
        <div>
          <span>Sum &asymp; {approve[2]}</span>
          &nbsp;
          <button
            className="btn btn-warning"
            onClick={(e) => {
              this.props.onApprove(
                this.props.token,
                this.props.address,
                approve[1]
              );
              e.preventDefault();
            }}
          >
            Approve {approve[1]} {this.props.quote.info.symbol}
          </button>
        </div>
      )
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
          {btn}
        </form>
      </div>
    );
  }
}

export default Buy
