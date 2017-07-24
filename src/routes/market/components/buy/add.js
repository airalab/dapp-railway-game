import React, { Component } from 'react'

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      price: ''
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
    if (this.state.value !== '' && this.state.price !== '') {
      if (valid) {
        const approve = this.props.calcApprove(this.state.value, this.state.price);
        if (approve !== false && approve <= 0) {
          btn = <button type="submit" className="btn btn-default">Buy</button>
        } else if (approve !== false) {
          currentApprove = (
            <div className="text-warning" style={{ marginBottom: 10 }}>
              <span className="fa fa-exclamation" /> current approve: <b>{this.props.approve} {this.props.quote.info.symbol}</b>
            </div>
          )
        }
      } else {
        error = <div className="alert alert-danger">Form is not filled out correctly</div>;
      }
    }
    return (
      <div>
        <p>Add buy <b>{this.props.base.info.name}</b></p>
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
          {error}
          {currentApprove}
          {btn}
        </form>
      </div>
    );
  }
}

export default Add
