export default function rowColFinder(cellPos, boardSize) {

    let row = Math.floor(cellPos / boardSize);

    let column = cellPos % boardSize;

    return {row: row, column: column};

}