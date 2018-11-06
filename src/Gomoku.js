import React, { Component } from 'react';
import Cell from './Cell';
import './Gomoku.css';
import rowColFinder from './RowColFinder.js';

const BOARD_SIZE = 15;

class Gomoku extends Component {

    constructor(props) {
        super(props);
        this.state = {
          gameId: null,
          turn: null,
          cells: [],
          message: null,
          winner: null,
          round: null
        };
    }

    async handleNewClick() {

        const response = await fetch(`http://localhost:8080/game`, {
            method: 'POST',
        })

        const value = await response.json();

        this.setState({
            gameId: value,
            turn: 'BLACK',
            cells: Array(225).fill(null),
            round: 1,
            winner: null
        });
    }

    async handleCellClick(i) {

        let cellCoordinates = rowColFinder(i, BOARD_SIZE);

        let data = {
            player: this.state.turn,
            row: cellCoordinates.row,
            column: cellCoordinates.column
        };

        const response = await fetch(
            `http://localhost:8080/game/update/` + this.state.gameId, 
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(data)
            })

        const body = await response.json()
        .then( (body) => {

            if (body.error === null) {

                const cells = this.state.cells.slice();
                
                // Move was successful so save current player's color before setting new state
                cells[i] = this.state.turn;

                this.setState({
                    cells: cells,
                    message: null,
                    turn: body.whoseTurn,
                    winner: body.winner,
                    round: body.round
                })
            } else {
                this.setState({ message : body.error })
            }
        });

    }

    renderCell(i) {
        return (
        <Cell
          key={i}
          color={this.state.cells[i]}
          onClick = {() => this.handleCellClick(i)}
        />
        );
    }

    buildBoard = (boardSize) => {

        let board = [];
        let counter = 0;

        for (let i = 0; i < boardSize; i++){
            let children = [];
            for (let j = 0; j < boardSize; j++){
                children.push(this.renderCell(counter));
                counter++;
            }

            board.push( 
                <div className="board-row" key={i}>
                    {children}
                </div> 
            );
        }

        return <div className="board" winner={this.state.winner}>{board}</div>;
    }

    render() {  

        let board = null;
        if (this.state.gameId != null){
            board = this.buildBoard(BOARD_SIZE);
        }

        let turn = null;
        if( this.state.turn != null) {
            turn = this.state.turn + "'s turn";
        }

        let message = this.state.message;

        let winner;

        if (this.state.winner != null) {
            if (this.state.winner === "DRAW") {
                winner = "It's a draw!"
            }else{
                winner = this.state.winner + " wins!";
            }
        }

        let round;
        if (this.state.round != null){ 
            round = "Round " + this.state.round;
         }

        return(
        <div>
            <div>
                <button 
                    className="new" 
                    onClick={() => this.handleNewClick()}>
                    New game
                </button>
            </div>

            <div className="status">
                <p>{turn}</p>
                <p className="statusRight">{round}</p>
            </div>
            {board}
            <div className="statusBottom">
                <p>{message}</p>
                <p className="statusRight">{winner}</p>
            </div>
        </div>
        );
    }
}

export default Gomoku;