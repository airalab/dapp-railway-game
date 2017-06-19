import React, { Component } from 'react'
import Add from '../../containers/addSell';
import Sell from '../../containers/orderSell';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading"><h4 className="panel-title">Sell</h4></div>
        <div className="panel-body">
          <div className="checkbox" style={{ marginLeft: 20, marginBottom: 15 }}>
            <span>
              <input
                name="isAdd"
                type="checkbox"
                checked={this.state.isAdd}
                onChange={this.handleChange}
              /> Add order market?
            </span>
          </div>
          {this.state.isAdd ?
            <Add address={this.props.address} />
            :
            <Sell address={this.props.address} />
          }
        </div>
      </div>
    );
  }
}

export default Main
