import React, { Component } from 'react';
import './Cell.css';

class Cell extends Component {

    render() {
        return(
            <button className="cell" color={this.props.color} onClick={this.props.onClick} />
        );
    }
}

export default Cell;