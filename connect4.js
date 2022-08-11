class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1, p2]
    this.height = height
    this.width = width
    this.currPlayer = p1 //set initial player
    this.makeBoard() //always call this fuction when create New
    this.makeHtmlBoard() //always call this  funtion when create by new constructor
    this.gameOver = false
  }
  //board= arrayof rows(board[y][x])
  makeBoard() {
    this.board = [] // ???Why don't have to declare variable first??//can we use const board =[];??
    //can we declare outside of function or in constructor if it is global object
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width })) //create object-like array to array fill wit undefined
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById("board")
    board.innerHTML = "" //clear Board

    //make column Top for click and play game
    const top = document.createElement("tr")
    top.setAttribute("id", "column-top")

    //bind this object to callback function
    //top.addEventListener('click',this.handleClick.bind(this));//OR
    this.handleGameClick = this.handleClick.bind(this) //pre bind // global variable??
    top.addEventListener("click", this.handleGameClick) //already bind this;

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td")
      headCell.setAttribute("id", x)
      top.append(headCell)
    }
    board.append(top)
    //make main play area
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr")
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td")
        cell.setAttribute("id", `${y}-${x}`)
        row.append(cell)
      }
      board.append(row)
    }
  }
  //
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y
      }
    }
    return null
  }
  //update COM to place piece into Html board
  placeInTable(y, x) {
    const piece = document.createElement("div")
    piece.classList.add("piece")
    piece.style.backgroundColor = this.currPlayer.color //Inline CSS background Color
    piece.style.top = -50 * (y + 2) //inline CSS//what is it??? what Happend if we don't use this line

    const spot = document.getElementById(`${y}-${x}`)
    spot.append(piece)
  }
  endGame(msg) {
    alert(msg)
    const top = document.querySelector("#column-top")
    top.removeEventListener("click", this.handleGameClick)
  }

  handleClick(evt) {
    //get x from ID click cell
    const x = +evt.target.id //convert to number
    //get row spot in column
    const y = this.findSpotForCol(x)
    if (y === null) {
      return
    }

    this.board[y][x] = this.currPlayer //object
    this.placeInTable(y, x)

    //check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie")
    }
    //check for win
    if (this.checkForWin()) {
      this.gameOver = true
      return this.endGame(`The${this.currPlayer.color} player won!`)
    }
    //switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0]
  }
  //checkFor win
  checkForWin() {
    //function in method // function expression use once and forget limit scope keep blobal scope light
    //in this case only checkForWin function use _win();
    const _win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      )
    //sliding window algrithm
    for (let y = 0; y <= this.height; y++) {
      for (let x = 0; x <= this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ]
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ]
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ]
        const diagDL = [
          [y, x],
          [y - 1, x - 1],
          [y - 2, x - 2],
          [y - 3, x - 3],
        ]
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true
        }
      }
    }
  }
}
class Player {
  constructor(color) {
    this.color = color
  }
}
document.getElementById("start-game").addEventListener("click", () => {
  let p1 = new Player(document.getElementById("p1-color").value)
  let p2 = new Player(document.getElementById("p2-color").value)
  new Game(p1, p2)
})
