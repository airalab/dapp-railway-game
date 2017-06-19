import React, { Component } from 'react'
import BigNumber from 'bignumber.js'

class Main extends Component {
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
    const approve = this.props.calcApprove(this.state.price);
    let btn = <div className="alert alert-danger">Form is not filled out correctly</div>;
    if (approve[0] <= 0) {
      btn = <div className="alert alert-danger">Too small a sum</div>;
    } else if (approve[1] <= 0) {
      btn = <button type="submit" className="btn btn-default">Buy</button>
    } else {
      btn = (
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
          Add to approve {approve[1]} AIR
        </button>
      )
    }
    return (
      <div className="panel panel-default">
        <div className="panel-heading"><h4 className="panel-title">Create new ASK lot for purchase ONE robot liability on Sensor market</h4></div>
        <div className="panel-body">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <span className="control-label">Amount of Air tokens to ASK one robot liability:</span>
              <div className="input-group">
                <input value={this.state.price} onChange={this.handleChange} name="price" type="text" className="form-control form-control-b" />
                <div className="input-group-addon">AIR</div>
              </div>
            </div>
            <div>
              comission {approve[0]} AIR
            </div>
            {btn}
          </form>
        </div>
      </div>
    );
  }
}

export default Main
