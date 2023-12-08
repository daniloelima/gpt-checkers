import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {

  @ViewChild("board") boardElement!: ElementRef<HTMLInputElement>;
  @ViewChild("iaTurn") iaTurnElement!: ElementRef<HTMLInputElement>;
  @ViewChild("playerTurn") playerTurnElement!: ElementRef<HTMLInputElement>;

  private game: Game | any;
  private board: HTMLCollection | any;
  private iaTurn: HTMLCollection | any;
  private playerTurn: HTMLCollection | any;

  constructor(private renderer: Renderer2) {

  }
  ngAfterViewInit(): void {
    this.board = this.boardElement.nativeElement;
    this.playerTurn = this.playerTurnElement.nativeElement;
    this.iaTurn = this.iaTurnElement.nativeElement;
    this.game = new Game(this.board, this.playerTurn, this.iaTurn);
    this.defineListeners();    
  }

  defineListeners() {
    this.boardElement.nativeElement.childNodes.forEach(element => {
      element.addEventListener('click', Game.movePiece)
    });
  }

}

class Game {
  static active = '';
  static previousId = ''
  static redTurn = true;
  static canMove = false;
  static canTake = false;
  static tryingToTake = false
  static expected: string
  static board: string[][];
  static e : Element | any;
  static movements: number[][]
  static iaTurnElement: HTMLElement;
  static elementBoard: HTMLInputElement;
  static playerTurnElement: HTMLElement;
  static dict = new Map(Object.entries({
    "w": "white-square",
    "b": "blue-square",
    "RP": "red-piece",
    "BP": "black-piece",
    "RQ": "red-queen",
    "BQ": "black-queen"
  }));

  constructor(elements: HTMLInputElement, playerTurnElement: HTMLElement, iaTurnElement: HTMLElement) {
      Game.elementBoard = elements;
      Game.movements = new Array;

      Game.iaTurnElement = iaTurnElement;
      Game.playerTurnElement = playerTurnElement;

      // O jogador joga primeiro
      Game.playerTurnElement.className = "turn";

      Game.board = [
        ['w'    , 'b RP', 'w'   , 'b'   , 'w', 'b BP' , 'w'   , 'b BP'],
        ['b RP' , 'w'   , 'b RP', 'w'   , 'b', 'w'    , 'b BP', 'w'   ],
        ['w'    , 'b RP', 'w'   , 'b'   , 'w', 'b BP' , 'w'   , 'b BP'],
        ['b RP' , 'w'   , 'b RP', 'w'   , 'b', 'w'    , 'b BP', 'w'   ],
        ['w'    , 'b RP', 'w'   , 'b'   , 'w', 'b BP' , 'w'   , 'b BP'],
        ['b RP' , 'w'   , 'b RP', 'w'   , 'b', 'w'    , 'b BP', 'w'   ],
        ['w'    , 'b RP', 'w'   , 'b'   , 'w', 'b BP' , 'w'   , 'b BP'],
        ['b RP' , 'w'   , 'b RP', 'w'   , 'b', 'w'    , 'b BP', 'w'   ]
      ];

      this.displayGame();
    }

    // Adiciona as classes aos elementos para aparecer o jogo
    displayGame() {
      for(let row = 0; row < 8; row++) {
        for(let column = 0; column < 8; column++) {
          const classes = Game.getClasses(row, column);  
          const index = (row * 8) + column;
          
          Game.elementBoard.children[index].className = classes;
        }
      }
    }

    // Recupera as classes de um elemento dada o numero da linha e a coluna do grid
    static getClasses(row: number, column: number): string {
      return Game.board[row][column].split(" ").map((key:string) => {
        return Game.dict.get(key);            
      }).join(" ");
    }

    // Função principal, faz o gerenciamento da movimentação da peça
    static movePiece(event: Event) {
      Game.e = event.target as Element;
      toMove();
    }

}

const clearSquare = function(element: Element) {
  Game.e.className = removeHighlight(element);
  if(Game.expected === 'RP') {
    Game.e.className = removeRedPiece(element);
  } 
  if(Game.expected === 'BP') {
    Game.e.className = removeBlackPiece(element);
  }
}

const removeHighlight = function(element: Element): string {
  return element.classList.value.replace("highlight", "");
}

const removeRedPiece = function(element: Element): string {
  const values = getXYFromId();
  const x = values[0];
  const y = values[1];
  Game.board[x][y] = Game.board[x][y].replace("RP", "");
  return element.classList.value.replace("red-piece", "");
}

const removeBlackPiece = function(element: Element): string {
  const values = getXYFromId();
  const x = values[0];
  const y = values[1];
  Game.board[x][y] = Game.board[x][y].replace("BP", "");
  return element.classList.value.replace("black-piece", "");
}

const addMoveToBoard = function() {
  const values = getXYFromId();
  const x = values[0];
  const y = values[1];
  console.log(`toAdd ${Game.expected}`);
  console.log(`position before: ${Game.board[x][y]}`);
  Game.board[x][y] += " " + Game.expected;
  console.log(`position after: ${Game.board[x][y]}`);
}

// Seleciona quem vai jogar
const toMove = function() {
  if (Game.redTurn) {
    Game.expected = "RP"; 
    validClick();
  } else {
    Game.expected = "BP"; 
    validClick();
  }
}

// Muda a variavel que define a vez do jogador
const changeTurn = function() {
  Game.redTurn = !Game.redTurn;
  Game.playerTurnElement.className = Game.redTurn ? "turn" : "";
  Game.iaTurnElement.className = Game.redTurn ? "" : "turn";
}

// Define se o clique é valido (em uma peça da vez do jogador)
const validClick = function() {
  const piece = Game.e.classList.value.split(" ").filter((element:string) => element != '')[1];
  console.log(`Piece: '${piece}', ID: ${Game.e.id}, PreviousID: '${Game.previousId}'`);

  if (!piece || piece !== Game.dict.get(Game.expected)) {
    console.log("Clique em uma peça sua");
    return;
  }

  Game.previousId = Game.e.id;
  // TODO: logica do jogo
  possibleMoves();
}

const checkMoveRight = function(x: number, y: number, up: boolean, down: boolean): boolean {
  if ((y+1) > 7) {
    return false;
  }

  let possible = false;

  if ((x-1) >= 0 && (x-1) < 8 && up) {
    if (!checkIfPieceExistsOnPosition(x-1, y+1, up, false)) {
      Game.movements.push([x-1, y+1])
      console.log(Game.movements);
      possible = true;
    }
  }
  if ((x+1) >= 0 && (x+1) < 8 && down) {
    if (!checkIfPieceExistsOnPosition(x+1, y+1, false, down)) {
      Game.movements.push([x+1, y+1])
      console.log(Game.movements);
      possible = true;
    }    
  }

  if (possible){
    return true;
  }

  return false;
}

const checkMoveLeft = function(x: number, y: number, up: boolean, down: boolean): boolean {
  if ((y-1) < 0) {
    return false;
  }

  let possible = false;

  if ((x-1) >= 0 && (x-1) < 8 && up) {
    if (!checkIfPieceExistsOnPosition(x-1, y-1, up, false)) {
      Game.movements.push([x-1, y-1])
      possible = true
    }
  }
  if ((x+1) >= 0 && (x+1) < 8 && down) {
    if (!checkIfPieceExistsOnPosition(x+1, y-1, false, down)) {
      Game.movements.push([x+1, y-1])
      possible = true;
    }
  }

  if (possible){
    Game.canMove = true;
    return true;
  }

  return false;
}

const checkIfCanTake = function(x: number, y: number, up: boolean, down: boolean): boolean {
  let taking = false;
  Game.tryingToTake = true;
  if (Game.redTurn) {
    taking = checkMoveRight(x, y, up, down);
  } else {
    taking = checkMoveLeft(x, y, up, down);
  }
  console.log(Game.movements);
  console.log(Game.movements[0]);  
  console.log(`up: ${up}, down: ${down}, taking: ${taking}, CanTake: ${Game.canTake}, CanMove: ${Game.canMove}, TryingToTake: ${Game.tryingToTake}`);

  if (taking && down && !Game.canTake && !Game.canMove) {
    Game.canTake = true;
    Game.canMove = true;
    Game.tryingToTake = false;
    return true;
  }

  if (taking && down && !Game.canTake && Game.canMove) {
    Game.canTake = true;
    Game.canMove = true;
    Game.tryingToTake = false;
    Game.movements.splice(Game.movements.length - 2, 1);
    return true;
  }

  if (taking && up) {
    Game.canTake = true;
    Game.canMove = true;
    Game.tryingToTake = false;
    return true;
  }

  return false;
}

const checkIfPieceExistsOnPosition = function(x: number, y: number, up: boolean, down: boolean): boolean {
  console.log(Game.board[x][y].split(" ").filter(element => element != ''));
  
  const element = Game.board[x][y].split(" ").filter(element => element != '')[1]
  console.log(`X: ${x}, Y: ${y}, up: ${up}, down: ${down}, expected: ${Game.expected}, element: ${element}, canMove: ${Game.canMove}, canTake: ${Game.canTake}, tryingToTake: ${Game.tryingToTake}`);
  // Se tiver uma peça da sua cor, não pode mover lá
  if (Game.expected === element) {
   return true;
  }
  const otherPiece = Game.expected === "RP" ? "BP" : "RP";
  
  // Se tiver uma peça do adversário não pode mover lá mas checa se consegue atravesar
  if (element === otherPiece) {
    let taking = false;
    checkIfCanTake(x, y, up, down);
    if (taking) {
      Game.canTake = true;
      return false;
    }
    return true;
  }
  
  // Se não estiver tentando comer uma peça pode se mover normalmente.
  if (Game.tryingToTake) {
    Game.tryingToTake = false;
    Game.canMove = true;
    return false;
  }

  // Se nenhuma das opções puder comer pode se mover normalmente.
  if (!Game.canTake) {
    Game.canMove = true;
    return false;
  }

  // Por algum motivo não pode se mover
  return true;
}

const getXYFromId = function(): number[] {
  const index = Game.e.id.split("_");
  const x = parseInt(index[0]);
  const y = parseInt(index[1]);
  return [x, y];
}

// Seleciona os movimentos válidos que o jogador pode fazer
const possibleMoves = function() {
  Game.canTake = false;
  Game.canMove = false;
  Game.tryingToTake = false;
  const values = getXYFromId();
  const x = values[0];
  const y = values[1];

  if (Game.dict.get(Game.expected) === 'red-piece') {
    checkMoveRight(x, y, true, true);
  } else {
    checkMoveLeft(x, y, true, true);
  }
  console.log(`Final jogadas possiveis: ${Game.movements}`);
  if (Game.movements.length == 0) {
    return
  }
  
  // Da highlight nas possiveis jogadas
  activateSquare();

  // Limpa os event listentes do tabuleiro.
  clearEventListeners();

  // Recupera a referência do elemento clicado.
  Game.e = Game.elementBoard.children[x*8 + y];

  // Cria eventos para escutar a movimentação da peça
  validMoves(Game.e);
  
}

// Da highlight nas posiveis jogadas
const activateSquare = function() {
  Game.active = Game.e.id;
  Game.e.className = Game.e.classList.value + " highlight";
  Game.movements.forEach(move => {
    const classes = Game.getClasses(move[0], move[1]);
    const index = (move[0] * 8) + move[1];
    Game.elementBoard.children[index].className = classes + " highlight";
  });
}

const selectAnotherPiece = function() {
  if (Game.e.id === Game.previousId) {
    Game.e.className = removeHighlight(Game.e);
    clearPossibleMovements();
    addBoardEventListener();
    Game.previousId = '';
    return;
  }
}

// Cria eventos para escutar a movimentação da peça
const validMoves = function(e: Element) {
  // Escolher outra peça
  Game.e.addEventListener("click", selectAnotherPiece);

  // Jogadas para se mover
  Game.movements.forEach(move => {
    const index = (move[0] * 8) + move[1];
    Game.elementBoard.children[index].addEventListener("click", addMovementListener);
  })
}

const clearPossibleMovements = function() {
  Game.movements.forEach(move => {
    const index = (move[0] * 8) + move[1];
    const unusedMove = Game.elementBoard.children[index];
    Game.elementBoard.children[index].className = removeHighlight(unusedMove);
  })
  Game.movements = [];
}

const clearEventListeners = function() {
  Game.elementBoard.childNodes.forEach(element => {
    element.replaceWith(element.cloneNode(true));
  });
}

const addBoardEventListener = function() {
  // Adiciona listeners para a proxima jogada
  Game.elementBoard.childNodes.forEach(node => {
    node.addEventListener("click", Game.movePiece);
  })
}

// Limpa o campo de todos os event listeners
const resetBoard = function() {
  clearEventListeners();

  // Limpa as possiveis jogadas
  clearPossibleMovements();

  
}

// Processamento referente a movimentação da peça
function addMovementListener(clickEvent: Event) {
  // Limpa o campo de onde a peça saiu
  clearSquare(Game.e);

  // Move a peça
  Game.e = clickEvent.target as HTMLElement;
  Game.e.className = Game.e.classList + Game.dict.get(Game.expected);
  console.log(Game.e.classList);
  
  // Adiciona o movimento à representação do tabuleiro
  addMoveToBoard();
  console.log(Game.board);
  
  // Reseta os listeners do board
  resetBoard();

  // Muda a vez do jogador
  changeTurn();

  addBoardEventListener();
}
