import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

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
  public redPieces: number = 0;
  public blackPieces: number = 0;

  constructor() { 
    this.redPieces = Game.redPieces;
    this.blackPieces = Game.blackPieces;
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
  static redPieces = 12;
  static blackPieces = 12;
  static redTurn = true;
  static doubleJump = false;
  static tryingToTake = false;
  static expectedColor: string
  static expectedType: string
  static board: string[][];
  static e : Element | any;
  static movements: number[][];
  static possibleTake: number[][];
  static validMovements: number[][];
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
      Game.possibleTake = new Array;

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
  console.log(`LIMPANDO COR: ${Game.expectedColor}, PEÇA: ${Game.expectedType}`);
  
  Game.e.className = removeHighlight(element);

  const values = getXYFromId();
  const x = values[0];
  const y = values[1];

  if(Game.expectedColor === 'red') {
    if (Game.expectedType === 'piece') {
      Game.e.className = removeRedPiece(element, x, y);
    } else {
      Game.e.className = removeRedQueen(element, x, y);
    }
  } 
  if(Game.expectedColor === 'black') {
    if (Game.expectedType === 'piece') {
      Game.e.className = removeBlackPiece(element, x, y);
    } else {
      Game.e.className = removeBlackQueen(element, x, y);
    }
  }
}

const removeHighlight = function(element: Element): string {
  return element.classList.value.replace("highlight", "");
}

const removeRedPiece = function(element: Element, x: number, y: number): string {
  Game.board[x][y] = Game.board[x][y].replace("RP", "");
  return element.classList.value.replace("red-piece", "");
}

const removeBlackPiece = function(element: Element, x: number, y: number): string {
  Game.board[x][y] = Game.board[x][y].replace("BP", "");
  return element.classList.value.replace("black-piece", "");
}

const removeRedQueen = function(element: Element, x: number, y: number): string {
  Game.board[x][y] = Game.board[x][y].replace("RQ", "");
  return element.classList.value.replace("red-queen", "");
}

const removeBlackQueen = function(element: Element, x: number, y: number): string {
  Game.board[x][y] = Game.board[x][y].replace("BQ", "");
  return element.classList.value.replace("black-queen", "");
}

const addMoveToBoard = function() {
  const values = getXYFromId();
  const x = values[0];
  const y = values[1];
  console.log(`toAdd ${Game.expectedColor}`);
  console.log(`position before: ${Game.board[x][y]}`);
  let moveToAdd = ''
  moveToAdd += `${Game.expectedColor === 'red' ? 'R' : 'B'}${Game.expectedType === 'piece' ? 'P' : 'Q'}`
  Game.board[x][y] += " " + moveToAdd;
  console.log(`position after: ${Game.board[x][y]}`);
}

// Seleciona quem vai jogar
const toMove = function() {
  if (Game.redTurn) {
    Game.expectedColor = "red"; 
    validClick();
  } else {
    Game.expectedColor = "black"; 
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
  
  if (!piece) {
    console.log("Clique em uma peça sua");
    return;
  }
  
  const color = piece.split("-")[0];
  Game.expectedType = piece.split("-")[1];
  if (!piece || color !== Game.expectedColor) {
    console.log("Clique em uma peça sua");
    return;
  }

  Game.previousId = Game.e.id;
  possibleMoves(color);
}

const checkMoveRight = function(x: number, y: number, up: boolean, down: boolean): boolean {
  if ((y+1) > 7) {
    return false;
  }

  let possible = false;

  if ((x-1) >= 0 && (x-1) < 8 && up) {
    if (!checkIfPieceExistsOnPosition(x-1, y+1, up, false, false, true)) {
      if (Game.tryingToTake) {
        Game.possibleTake.push([x-1, y+1]);
        Game.tryingToTake = false;
        // Recursivamente checa se pode comer outra peça
        // Game.doubleJump = true;
        // TODO: Comer duas peças ou mais
        // checkMoveRight(x-1, y+1, true, true);
        // Game.doubleJump = false;
      } else {
        Game.movements.push([x-1, y+1])
      }
      possible = true;
    }
  }
  if ((x+1) >= 0 && (x+1) < 8 && down) {
    if (!checkIfPieceExistsOnPosition(x+1, y+1, false, down, false, true)) {
      if (Game.tryingToTake) {
        Game.possibleTake.push([x+1, y+1]);
        Game.tryingToTake = false;
        // Recursivamente checa se pode comer outra peça
        // Game.doubleJump = true;
        // TODO: Comer duas peças ou mais
        // checkMoveRight(x+1, y+1, true, true);
        // Game.doubleJump = false;
      } else {
        Game.movements.push([x+1, y+1])
      }
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
    if (!checkIfPieceExistsOnPosition(x-1, y-1, up, false, true, false)) {
      if (Game.tryingToTake) {
        Game.possibleTake.push([x-1, y-1]);
        Game.tryingToTake = false;
        // Recursivamente checa se pode comer outra peça
        // Game.doubleJump = true;
        // TODO: Comer duas peças ou mais
        // checkMoveLeft(x-1, y-1, true, true);
        // Game.doubleJump = false;
      } else {
        Game.movements.push([x-1, y-1])
      }
      possible = true
    }
  }
  if ((x+1) >= 0 && (x+1) < 8 && down) {
    if (!checkIfPieceExistsOnPosition(x+1, y-1, false, down, true, false)) {
      if (Game.tryingToTake) {
        Game.possibleTake.push([x+1, y-1]);
        Game.tryingToTake = false;
        // Recursivamente checa se pode comer outra peça
        // Game.doubleJump = true;
        // TODO: Comer duas peças ou mais
        // checkMoveLeft(x+1, y-1, true, true);
        // Game.doubleJump = false;
      } else {
        Game.movements.push([x+1, y-1])
      }
      possible = true;
    }
  }

  if (possible){
    Game.tryingToTake = false;
    return true;
  }

  return false;
}

const checkIfCanTake = function(x: number, y: number, up: boolean, down: boolean, left: boolean, right: boolean): boolean {
  let taking = false;
  let takingBack = false;
  Game.tryingToTake = true;
  console.log(`CHECANDO: RED: ${Game.redTurn} UP: ${up}, DOWN: ${down}, LEFT: ${left}, RIGHT: ${right}`);
  
  if (Game.redTurn) {
    if (left) {
      // Comendo voltando
      takingBack = checkMoveLeft(x, y, up, down);
    } else {
      taking = checkMoveRight(x, y, up, down);
    }
  } else {
    if (right) {
      takingBack = checkMoveRight(x, y, up, down);
    } else {
      taking = checkMoveLeft(x, y, up, down);
    }
  }

  console.log(`up: ${up}, down: ${down}, taking: ${taking}, TryingToTake: ${Game.tryingToTake}`);

  if (taking || takingBack) {
    Game.tryingToTake = false;
    return true;
  }

  return false;
}

const checkIfPieceExistsOnPosition = function(x: number, y: number, up: boolean, down: boolean, left: boolean, right: boolean): boolean {
  console.log(Game.board[x][y].split(" ").filter(element => element != ''));
  
  const element = Game.board[x][y].split(" ").filter(element => element != '')[1]
  console.log(`X: ${x}, Y: ${y}, up: ${up}, down: ${down}, expected: ${Game.expectedColor}, element: ${element}, tryingToTake: ${Game.tryingToTake}, doubleJump: ${Game.doubleJump}`);

  // Espaço vazio, pode se mover
  if (element === undefined && !Game.doubleJump) {
    return false;
  }

  const color = Game.dict.get(element)!.split("-")[0];
  const type = Game.dict.get(element)!.split("-")[1];
  console.log(`COLOR: ${color}, type: ${type}, ExpectedType: ${Game.expectedType}`);
  

  // Se tiver uma peça da sua cor, não pode mover lá
  if (Game.expectedColor === color) {
   return true;
  }
  const otherPiece = Game.expectedColor === "red" ? "black" : "red";
  
  // Se tiver uma peça do adversário não pode mover lá mas checa se consegue atravesar
  if (color === otherPiece) {
    if (Game.tryingToTake && Game.expectedType !== 'queen') {
      return true;
    }
    checkIfCanTake(x, y, up, down, left, right);
    return true;
  }
  
  // Se chegou aqui tentando comer uma peça pode se mover.
  if (Game.tryingToTake) {
    // Game.tryingToTake = false;
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
const possibleMoves = function(color: string) {
  Game.tryingToTake = false;
  const values = getXYFromId();
  const x = values[0];
  const y = values[1];

  if (color === 'red') {
    checkMoveRight(x, y, true, true);
    if (Game.expectedType === 'queen') {
      checkMoveLeft(x, y, true, true);
    }
  } else {
    checkMoveLeft(x, y, true, true);
    if (Game.expectedType === 'queen') {
      checkMoveRight(x, y, true, true);
    }
  }
  console.log(`Final movimentos possiveis: ${Game.movements}`);
  console.log(`Final ataques possiveis: ${Game.possibleTake}`);

  if (Game.movements.length == 0 && Game.possibleTake.length == 0) {
    console.log(Game.board);
    return;
  }

  if (Game.possibleTake.length > 0) {
    Game.validMovements = Game.possibleTake;
  } else {
    Game.validMovements = Game.movements;
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
  Game.validMovements.forEach(move => {
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
  Game.validMovements.forEach(move => {
    const index = (move[0] * 8) + move[1];
    Game.elementBoard.children[index].addEventListener("click", addMovementListener);
  })
}

const clearPossibleMovements = function() {
  Game.validMovements.forEach(move => {
    const index = (move[0] * 8) + move[1];
    const unusedMove = Game.elementBoard.children[index];
    Game.elementBoard.children[index].className = removeHighlight(unusedMove);
  })
  Game.movements = [];
  Game.possibleTake = [];
  Game.validMovements = [];
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

const removePieceTaken = function(originalPosition: number[]) {
  const finalPosition = getXYFromId();
  const x = (originalPosition[0] + finalPosition[0])/2;
  const y = (originalPosition[1] + finalPosition[1])/2;
  
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    return
  }

  if (Game.expectedColor == 'red') {
    Game.blackPieces -= 1;
    Game.iaTurnElement.children[1].innerHTML = `Peças ${Game.blackPieces}`;
  } else {
    Game.redPieces -= 1;
    Game.playerTurnElement.children[1].innerHTML = `Peças ${Game.redPieces}`;
  }
  
  console.log(`RED: ${Game.redPieces}, BLACK: ${Game.blackPieces}`);
  
  // TODO: Criar algum alert quando o jogo terminar

  Game.elementBoard.children[x*8 + y].className = "blue-square";
  Game.board[x][y] = 'b';
}

// Processamento referente a movimentação da peça
function addMovementListener(clickEvent: Event) {
  // Limpa o campo de onde a peça saiu
  clearSquare(Game.e);
  const originalPosition = getXYFromId();

  // Move a peça
  Game.e = clickEvent.target as HTMLElement;
  Game.e.className = Game.e.classList + " " + `${Game.expectedColor}-${Game.expectedType}`;
  console.log(Game.e.classList);
  
  // Remove a peça que foi comida
  removePieceTaken(originalPosition);
  
  // Adiciona o movimento à representação do tabuleiro
  addMoveToBoard();
  console.log(Game.board);
  
  // Reseta os listeners do board
  resetBoard();

  // Muda a vez do jogador
  changeTurn();

  addBoardEventListener();
}
