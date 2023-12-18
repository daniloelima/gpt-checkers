import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { OpenaiService } from 'src/app/services/openai.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements AfterViewInit, OnInit {
  @ViewChild('board') boardElement!: ElementRef<HTMLInputElement>;
  @ViewChild('iaTurn') iaTurnElement!: ElementRef<HTMLInputElement>;
  @ViewChild('playerTurn') playerTurnElement!: ElementRef<HTMLInputElement>;

  private game: Game | any;
  private board: HTMLCollection | any;
  private iaTurn: HTMLCollection | any;
  private playerTurn: HTMLCollection | any;
  public redPieces: number = 0;
  public blackPieces: number = 0;
  public gameOver = false;

  constructor(private openaiService: OpenaiService) {
    this.redPieces = Game.redPieces;
    this.blackPieces = Game.blackPieces;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.board = this.boardElement.nativeElement;
    this.playerTurn = this.playerTurnElement.nativeElement;
    this.iaTurn = this.iaTurnElement.nativeElement;
    this.game = new Game(
      this.board,
      this.playerTurn,
      this.iaTurn,
      this.openaiService
    );
    this.defineListeners();
  }

  defineListeners() {
    this.boardElement.nativeElement.childNodes.forEach((element) => {
      element.addEventListener('click', Game.selectPiece);
    });

    this.boardElement.nativeElement.addEventListener('GameOver', () => {
      this.gameOver = true;
    });
  }
}

class Game {
  static active = '';
  static previousId = '';
  static redPieces = 12;
  static blackPieces = 12;
  static redTurn = true;
  static doubleJump = false;
  static tryingToTake = false;
  static expectedColor: string;
  static expectedType: string;
  static board: string[][];
  static e: Element | any;
  static movements: number[][];
  static possibleTake: number[][];
  static validMovements: number[][];
  static iaTurnElement: HTMLElement;
  static elementBoard: HTMLInputElement;
  static playerTurnElement: HTMLElement;
  static dict = new Map(
    Object.entries({
      w: 'white-square',
      b: 'blue-square',
      RP: 'red-piece',
      BP: 'black-piece',
      RQ: 'red-queen',
      BQ: 'black-queen',
    })
  );
  static openAiService: OpenaiService;

  constructor(
    elements: HTMLInputElement,
    playerTurnElement: HTMLElement,
    iaTurnElement: HTMLElement,
    openAiService: OpenaiService
  ) {
    Game.elementBoard = elements;
    Game.movements = new Array();
    Game.possibleTake = new Array();
    Game.openAiService = openAiService;

    Game.iaTurnElement = iaTurnElement;
    Game.playerTurnElement = playerTurnElement;

    // O jogador joga primeiro
    Game.playerTurnElement.className = 'turn';

    Game.board = [
      ['w', 'b RP', 'w', 'b', 'w', 'b BP', 'w', 'b BP'],
      ['b RP', 'w', 'b RP', 'w', 'b', 'w', 'b BP', 'w'],
      ['w', 'b RP', 'w', 'b', 'w', 'b BP', 'w', 'b BP'],
      ['b RP', 'w', 'b RP', 'w', 'b', 'w', 'b BP', 'w'],
      ['w', 'b RP', 'w', 'b', 'w', 'b BP', 'w', 'b BP'],
      ['b RP', 'w', 'b RP', 'w', 'b', 'w', 'b BP', 'w'],
      ['w', 'b RP', 'w', 'b', 'w', 'b BP', 'w', 'b BP'],
      ['b RP', 'w', 'b RP', 'w', 'b', 'w', 'b BP', 'w'],
    ];

    this.displayGame();
  }

  // Adiciona as classes aos elementos para aparecer o jogo
  displayGame() {
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        const classes = Game.getClasses(row, column);
        const index = row * 8 + column;

        Game.elementBoard.children[index].className = classes;
      }
    }
  }

  // Recupera as classes de um elemento dada o numero da linha e a coluna do grid
  static getClasses(row: number, column: number): string {
    return Game.board[row][column]
      .split(' ')
      .map((key: string) => {
        return Game.dict.get(key);
      })
      .join(' ');
  }

  // Função principal, faz o gerenciamento da movimentação da peça
  static selectPiece(event: Event) {
    Game.e = event.target as Element;
    toMove();
  }
}

const clearSquare = function (element: Element) {
  Game.e.className = removeHighlight(element);

  const values = getXYFromId();
  const x = values[0];
  const y = values[1];

  if (Game.expectedColor === 'red') {
    if (Game.expectedType === 'piece') {
      Game.e.className = removeRedPiece(element, x, y);
    } else {
      Game.e.className = removeRedQueen(element, x, y);
    }
  }
  if (Game.expectedColor === 'black') {
    if (Game.expectedType === 'piece') {
      Game.e.className = removeBlackPiece(element, x, y);
    } else {
      Game.e.className = removeBlackQueen(element, x, y);
    }
  }
};

const removeHighlight = function (element: Element): string {
  return element.classList.value.replace('highlight', '');
};

const removeRedPiece = function (
  element: Element,
  x: number,
  y: number
): string {
  Game.board[x][y] = Game.board[x][y].replace('RP', '');
  return element.classList.value.replace('red-piece', '');
};

const removeBlackPiece = function (
  element: Element,
  x: number,
  y: number
): string {
  Game.board[x][y] = Game.board[x][y].replace('BP', '');
  return element.classList.value.replace('black-piece', '');
};

const removeRedQueen = function (
  element: Element,
  x: number,
  y: number
): string {
  Game.board[x][y] = Game.board[x][y].replace('RQ', '');
  return element.classList.value.replace('red-queen', '');
};

const removeBlackQueen = function (
  element: Element,
  x: number,
  y: number
): string {
  Game.board[x][y] = Game.board[x][y].replace('BQ', '');
  return element.classList.value.replace('black-queen', '');
};

const addMoveToBoard = function () {
  const values = getXYFromId();
  const x = values[0];
  const y = values[1];

  let moveToAdd = '';
  moveToAdd += `${Game.expectedColor === 'red' ? 'R' : 'B'}${
    Game.expectedType === 'piece' ? 'P' : 'Q'
  }`;
  Game.board[x][y] += ' ' + moveToAdd;
};

const generateStringFromBoard = function(): string {
  let board = '';
  let aux : string[];
  console.log(Game.board);
  
  for (let i=-1; i<8; i++) {
    if (i == -1) {
      board += "x/y  ";
    } else {
      board += ` ${i} `;
    }
    for (let j=0; j<8; j++) {
      if (i == -1) {
        board += `${j}   `;
      } else {
        // console.log(Game.board[i][j].split(" "));
        
        aux = Game.board[i][j].split(" ").filter(letter => letter != 'w' && letter != 'b' && letter != '');

        board += ` ${aux[0] == undefined || aux[0] == "" ? '__' : aux[0]} `; 
      }
    }
    board += "\n";
  }
  return board;
}

const parseResposta = function(resposta: string): string {
  return resposta.split('[')[1].split(']')[0];
}

const apiCall = function() {
  const board = generateStringFromBoard();
  let posicaoInicial: string = '';
  Game.openAiService.selectPiece(board).subscribe({
    next: (response: any) => {
      console.log(response);
      console.log(response.choices[0].message.content);
      console.log(parseResposta(response.choices[0].message.content));
      posicaoInicial = parseResposta(response.choices[0].message.content);
      console.log(posicaoInicial);

      let x = parseInt(posicaoInicial.split('-')[0]);
      let y = parseInt(posicaoInicial.split('-')[1]);

      if (Number.isNaN(y)) {
        y = parseInt(posicaoInicial.split(',')[1]);
      }

      if (Number.isNaN(x) || Number.isNaN(y)) {
        apiCall();
        return;
      }

      console.log(`x: ${x}, y: ${y}`);

      const index = x * 8 + y;

      console.log(Game.elementBoard.children[index]);
      
      Game.e = Game.elementBoard.children[index];
      if (!validClick()) {
        apiCall();
      }
    },
    error: (error) => {
      console.error('Erro ao chamar a API GPT-3:', error);
      // console.log("ESPERANDO 2 SEGUNDOS PARA MANDAR MAIS REQUISIÇÕES");
      
      // setTimeout(apiCall, 2000)
      // TODO: descomentar isso depois
      // apiCall();
    },
  });
}

// Seleciona quem vai jogar
const toMove = function () {
  if (Game.redTurn) {
    Game.expectedColor = 'red';
    validClick();
  } else {
    Game.expectedColor = 'black';
    apiCall()
  }
};

// Muda a variavel que define a vez do jogador
const changeTurn = function () {
  Game.redTurn = !Game.redTurn;
  Game.playerTurnElement.className = Game.redTurn ? 'turn' : '';
  Game.iaTurnElement.className = Game.redTurn ? '' : 'turn';
};

// Define se o clique é valido (em uma peça da vez do jogador)
const validClick = function (): boolean {
  const piece = Game.e.classList.value
    .split(' ')
    .filter((element: string) => element != '')[1];

  if (!piece) {
    console.log('Clique em uma peça sua');
    return false;
  }

  const color = piece.split('-')[0];
  Game.expectedType = piece.split('-')[1];
  if (!piece || color !== Game.expectedColor) {
    console.log('Clique em uma peça sua');
    return false;
  }

  Game.previousId = Game.e.id;
  return possibleMoves(color);
};

const checkMoveRight = function (
  x: number,
  y: number,
  up: boolean,
  down: boolean
): boolean {
  if (y + 1 > 7) {
    return false;
  }

  let possible = false;

  if (x - 1 >= 0 && x - 1 < 8 && up) {
    if (!checkIfPieceExistsOnPosition(x - 1, y + 1, up, false, false, true)) {
      if (Game.tryingToTake) {
        Game.possibleTake.push([x - 1, y + 1]);
        Game.tryingToTake = false;
        // Recursivamente checa se pode comer outra peça
        // Game.doubleJump = true;
        // TODO: Comer duas peças ou mais
        // checkMoveRight(x-1, y+1, true, true);
        // Game.doubleJump = false;
      } else {
        Game.movements.push([x - 1, y + 1]);
      }
      possible = true;
    }
  }
  if (x + 1 >= 0 && x + 1 < 8 && down) {
    if (!checkIfPieceExistsOnPosition(x + 1, y + 1, false, down, false, true)) {
      if (Game.tryingToTake) {
        Game.possibleTake.push([x + 1, y + 1]);
        Game.tryingToTake = false;
        // Recursivamente checa se pode comer outra peça
        // Game.doubleJump = true;
        // TODO: Comer duas peças ou mais
        // checkMoveRight(x+1, y+1, true, true);
        // Game.doubleJump = false;
      } else {
        Game.movements.push([x + 1, y + 1]);
      }
      possible = true;
    }
  }

  if (possible) {
    return true;
  }

  return false;
};

const checkMoveLeft = function (
  x: number,
  y: number,
  up: boolean,
  down: boolean
): boolean {
  if (y - 1 < 0) {
    return false;
  }

  let possible = false;

  if (x - 1 >= 0 && x - 1 < 8 && up) {
    if (!checkIfPieceExistsOnPosition(x - 1, y - 1, up, false, true, false)) {
      if (Game.tryingToTake) {
        Game.possibleTake.push([x - 1, y - 1]);
        Game.tryingToTake = false;
        // Recursivamente checa se pode comer outra peça
        // Game.doubleJump = true;
        // TODO: Comer duas peças ou mais
        // checkMoveLeft(x-1, y-1, true, true);
        // Game.doubleJump = false;
      } else {
        Game.movements.push([x - 1, y - 1]);
      }
      possible = true;
    }
  }
  if (x + 1 >= 0 && x + 1 < 8 && down) {
    if (!checkIfPieceExistsOnPosition(x + 1, y - 1, false, down, true, false)) {
      if (Game.tryingToTake) {
        Game.possibleTake.push([x + 1, y - 1]);
        Game.tryingToTake = false;
        // Recursivamente checa se pode comer outra peça
        // Game.doubleJump = true;
        // TODO: Comer duas peças ou mais
        // checkMoveLeft(x+1, y-1, true, true);
        // Game.doubleJump = false;
      } else {
        Game.movements.push([x + 1, y - 1]);
      }
      possible = true;
    }
  }

  if (possible) {
    Game.tryingToTake = false;
    return true;
  }

  return false;
};

const checkIfCanTake = function (
  x: number,
  y: number,
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean
): boolean {
  let taking = false;
  let takingBack = false;
  Game.tryingToTake = true;

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

  Game.tryingToTake = false;
  if (taking || takingBack) {
    return true;
  }

  return false;
};

const checkIfPieceExistsOnPosition = function (
  x: number,
  y: number,
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean
): boolean {
  const element = Game.board[x][y]
    .split(' ')
    .filter((element) => element != '')[1];

  // Espaço vazio, pode se mover
  if (element === undefined && !Game.doubleJump) {
    return false;
  }

  const color = Game.dict.get(element)!.split('-')[0];
  const type = Game.dict.get(element)!.split('-')[1];

  // Se tiver uma peça da sua cor, não pode mover lá
  if (Game.expectedColor === color) {
    return true;
  }
  const otherPiece = Game.expectedColor === 'red' ? 'black' : 'red';

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
};

const getXYFromId = function (): number[] {
  const index = Game.e.id.split('_');
  const x = parseInt(index[0]);
  const y = parseInt(index[1]);
  return [x, y];
};

// Seleciona os movimentos válidos que o jogador pode fazer
const possibleMoves = function (color: string) {
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

  // Sem jogadas possiveis
  if (Game.movements.length == 0 && Game.possibleTake.length == 0) {
    console.log("Sem movimentos possiveis")
    return false;
  }

  if (Game.possibleTake.length > 0) {
    Game.validMovements = Game.possibleTake;
  } else {
    Game.validMovements = Game.movements;
  }
  console.log(`Movimentos possiveis: ${Game.validMovements}`);
  

  // Da highlight nas possiveis jogadas
  activateSquare();

  // Limpa os event listentes do tabuleiro.
  clearEventListeners();

  // Recupera a referência do elemento clicado.
  Game.e = Game.elementBoard.children[x * 8 + y];

  // Cria eventos para escutar a movimentação da peça
  if (Game.redTurn) {
    validMoves(Game.e);
  } else {
    if (Game.validMovements.length == 1) {
      IaMove(Game.validMovements[0])
    } else {
      // TODO: criar função para chamar a api dando os movimentos possiveis.
      IaMove(Game.validMovements[0])
    }
  }
  return true;
};

// Da highlight nas posiveis jogadas
const activateSquare = function () {
  Game.active = Game.e.id;
  Game.e.className = Game.e.classList.value + ' highlight';
  Game.validMovements.forEach((move) => {
    const classes = Game.getClasses(move[0], move[1]);
    const index = move[0] * 8 + move[1];
    Game.elementBoard.children[index].className = classes + ' highlight';
  });
};

const selectAnotherPiece = function () {
  if (Game.e.id === Game.previousId) {
    Game.e.className = removeHighlight(Game.e);
    clearPossibleMovements();
    addBoardEventListener();
    Game.previousId = '';
    return;
  }
};

// Cria eventos para escutar a movimentação da peça
const validMoves = function (e: Element) {
  // Escolher outra peça
  Game.e.addEventListener('click', selectAnotherPiece);

  // Jogadas para se mover
  Game.validMovements.forEach((move) => {
    const index = move[0] * 8 + move[1];
    Game.elementBoard.children[index].addEventListener(
      'click',
      addMovementListener
    );
  });
};

const clearPossibleMovements = function () {
  Game.validMovements.forEach((move) => {
    const index = move[0] * 8 + move[1];
    const unusedMove = Game.elementBoard.children[index];
    Game.elementBoard.children[index].className = removeHighlight(unusedMove);
  });
  Game.movements = [];
  Game.possibleTake = [];
  Game.validMovements = [];
};

const clearEventListeners = function () {
  Game.elementBoard.childNodes.forEach((element) => {
    element.replaceWith(element.cloneNode(true));
  });
};

const addBoardEventListener = function () {
  // Adiciona listeners para a proxima jogada
  Game.elementBoard.childNodes.forEach((node) => {
    node.addEventListener('click', Game.selectPiece);
  });
};

// Limpa o campo de todos os event listeners
const resetBoard = function () {
  clearEventListeners();

  // Limpa as possiveis jogadas
  clearPossibleMovements();
};

const removePieceTaken = function (originalPosition: number[]) {
  const finalPosition = getXYFromId();
  const x = (originalPosition[0] + finalPosition[0]) / 2;
  const y = (originalPosition[1] + finalPosition[1]) / 2;

  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    return;
  }

  if (Game.expectedColor == 'red') {
    Game.blackPieces -= 1;
    Game.iaTurnElement.children[1].innerHTML = `Peças ${Game.blackPieces}`;
  } else {
    Game.redPieces -= 1;
    Game.playerTurnElement.children[1].innerHTML = `Peças ${Game.redPieces}`;
  }

  Game.elementBoard.children[x * 8 + y].className = 'blue-square';
  Game.board[x][y] = 'b';
};

const movePiece = function () {
  const position = getXYFromId();
  const x = position[0];
  const y = position[1];
  if (y == 0 || y == 7) {
    Game.expectedType = 'queen';
  }
  Game.e.className =
    Game.e.classList + ' ' + `${Game.expectedColor}-${Game.expectedType}`;
};

function IaMove(jogada: number[]) {
    // Limpa o campo de onde a peça saiu
    clearSquare(Game.e);
    const originalPosition = getXYFromId();
  
    // Move a peça
    const x = jogada[0];
    const y = jogada[1];
    const index = x * 8 + y;
    Game.e = Game.elementBoard.children[index];
    movePiece();
  
    // Remove a peça que foi comida
    removePieceTaken(originalPosition);
  
    // Adiciona o movimento à representação do tabuleiro
    addMoveToBoard();
    console.log(`Tabuleiro após jogada da IA:`)
    console.log(Game.board);
    
  
    // Reseta os listeners do board
    resetBoard();
  
    if (Game.redPieces == 0 || Game.blackPieces == 0) {
      const GameOver = new Event('GameOver');
      Game.elementBoard.dispatchEvent(GameOver);
      Game.redPieces = 12;
      Game.blackPieces = 12;
      return;
    }
  
    // Muda a vez do jogador
    changeTurn();
  
    if (!Game.redTurn) {
      toMove();
    } else {
      addBoardEventListener();
    }
}

// Processamento referente a movimentação da peça
function addMovementListener(clickEvent: Event) {
  // Limpa o campo de onde a peça saiu
  clearSquare(Game.e);
  const originalPosition = getXYFromId();

  // Move a peça
  Game.e = clickEvent.target as HTMLElement;
  movePiece();

  // Remove a peça que foi comida
  removePieceTaken(originalPosition);

  // Adiciona o movimento à representação do tabuleiro
  addMoveToBoard();
  console.log(`Tabuleiro após jogada do jogador:`)
  console.log(Game.board);

  // Reseta os listeners do board
  resetBoard();

  if (Game.redPieces == 0 || Game.blackPieces == 0) {
    const GameOver = new Event('GameOver');
    Game.elementBoard.dispatchEvent(GameOver);
    Game.redPieces = 12;
    Game.blackPieces = 12;
    return;
  }

  // Muda a vez do jogador
  changeTurn();

  if (!Game.redTurn) {
    toMove();
  } else {
    addBoardEventListener();
  }
}
