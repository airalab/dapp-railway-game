import React, { Component } from 'react'
import BigNumber from 'bignumber.js'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      approve: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getApprove(p) {
    if (Number(p) > 0) {
      const count = new BigNumber(p);
      const approve = new BigNumber(this.props.approve);
      const price = new BigNumber(this.props.price);
      const value = count.times(price);
      this.setState({ approve: value.minus(approve).toNumber() });
    } else {
      this.setState({ approve: false });
    }
  }

  handleChange(event) {
    let value = event.target.value;
    if (value !== '') {
      value = Number(value);
      if (event.target.name === 'count') {
        value = new BigNumber(value)
        value = value.toFixed()
      }
    }
    this.setState({ [event.target.name]: value });
    this.getApprove(value);
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state);
    event.preventDefault();
  }

  render() {
    const approve = this.state.approve;
    let btn = <div className="alert alert-danger">Form is not filled out correctly</div>;
    if (this.props.is === false) {
      btn = <div className="alert alert-danger">(</div>;
    } else if (approve !== false && approve <= 0) {
      btn = <button type="submit" className="btn btn-default">Buy</button>
    } else if (approve !== false) {
      btn = (
        <button
          className="btn btn-warning"
          onClick={(e) => {
            this.props.onApprove(
              this.props.airAddress,
              this.props.address,
              approve
            );
            e.preventDefault();
          }}
        >
          Approve {approve}
        </button>
      )
    }
    return (
      <div className="panel panel-default">
        <div className="panel-heading"><h4 className="panel-title">buyMetrics</h4></div>
        <div className="panel-body">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <span className="control-label">count:</span>
              <div className="input-group">
                <input value={this.state.count} onChange={this.handleChange} name="count" type="text" className="form-control form-control-b" />
              </div>
            </div>
            {btn}
          </form>
        </div>
      </div>
    );
  }
}

export default Main
