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
  static redTurn = true;
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
    "BQ": "black-queen",

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

    // Limpa o campo de todos os event listeners
    static resetBoard() {
      Game.elementBoard.childNodes.forEach(element => {
        element.replaceWith(element.cloneNode(true));
      });
    }

    // Recupera as classes de um elemento dada o numero da linha e a coluna do grid
    static getClasses(row: number, column: number): string {
      return Game.board[row][column].split(' ').map((key:string) => {
        return Game.dict.get(key);            
      }).join(' ');
    }

    // Função principal, faz o gerenciamento da movimentação da peça
    static movePiece(event: Event) {
      Game.e = event.target as Element;
      toMove();
    }

}

const removeHighlight = function(element: Element): string {
  return element.classList.value.replace("highlight", "");
}

const removeRedPiece = function(element: Element): string {
  return element.classList.value.replace("red-piece", "");
}

// Seleciona quem vai jogar
const toMove = function() {
  
  if (Game.redTurn) {
    Game.expected = "red-piece"; 
    validCLick();
  } else {
    Game.expected = "black-piece"; 
    validCLick();
  }
}

// Muda a variavel que define a vez do jogador
const changeTurn = function() {
  Game.redTurn = !Game.redTurn;
  Game.playerTurnElement.className = Game.redTurn ? "turn" : "";
  Game.iaTurnElement.className = Game.redTurn ? "" : "turn";
}

// Define se o clique é valido (em uma peça da vez do jogador)
const validCLick = function() {
  console.log(Game.e);
  console.log(Game.redTurn);
  
  const piece = Game.e.classList.value.split(" ")[1];

  if (!piece || piece !== Game.expected) {
    console.log("clicou errado");
    return;
  }

  // TODO: logica do jogo
  possibleMoves();
}

// Seleciona os movimentos válidos que o jogador pode fazer
const possibleMoves = function() {
  
  const index = Game.e.id.split("_");
  const x = parseInt(index[0]);
  const y = parseInt(index[1]);
  
  console.log(`POSSIBLE MOVES --- x: ${x} y: ${y}`);
  

  if (Game.expected === 'red-piece') {
    if ((y+1) > 8) {
      return
    }
    if ((x-1) >= 0 && (x-1) < 8) {
      Game.movements.push([x-1, y+1])
    }
    if ((x+1) > 0 && (x+1) < 8) {
      Game.movements.push([x+1, y+1])
    }
  } else {
    if ((y-1) < 0) {
      return
    }
    if ((x-1) >= 0 && (x-1) < 8) {
      Game.movements.push([x-1, y-1])
    }
    if ((x+1) > 0 && (x+1) < 8) {
      Game.movements.push([x+1, y-1])
    }
  }
  console.log(Game.movements);
  
  // Da highlight nas possiveis jogadas
  activateSquare();

  // Limpa os event listentes do tabuleiro.
  Game.resetBoard();

  // Recupera a referência do elemento clicado.
  Game.e = Game.elementBoard.children[x*8 + y];

  // Cria eventos para escutar a movimentação da peça
  validMoves(Game.e);
  
}

// Da highlight nas posiveis jogadas
const activateSquare = function() {
  Game.active = Game.e.id;
  Game.e.className = Game.e.classList.value + ' highlight';
  Game.movements.forEach(move => {
    const classes = Game.getClasses(move[0], move[1]);
    const index = (move[0] * 8) + move[1];
    Game.elementBoard.children[index].className = classes + ' highlight';
  });
}

// Cria eventos para escutar a movimentação da peça
const validMoves = function(e: Element) {
  Game.movements.forEach(move => {
    const index = (move[0] * 8) + move[1];
    Game.elementBoard.children[index].addEventListener("click", addMovementListener);
  })
}

// Processamento referente a movimentação da peça
function addMovementListener(clickEvent: Event) {
  // Limpa o campo de onde a peça saiu
  Game.e.className = removeHighlight(Game.e);
  Game.e.className = removeRedPiece(Game.e);

  // Move a peça
  const position = clickEvent.target as HTMLElement;
  position.className = position.classList + " " + Game.expected;

  // Reseta os listeners do board
  Game.resetBoard();

  // Limpa as possiveis jogadas
  Game.movements.forEach(move => {
    const index = (move[0] * 8) + move[1];
    const unusedMove = Game.elementBoard.children[index];
    Game.elementBoard.children[index].className = removeHighlight(unusedMove);
  })
  Game.movements.length = 0;

  // Muda a vez do jogador
  changeTurn();

  // Adiciona listeners para a proxima jogada
  Game.elementBoard.childNodes.forEach(node => {
    node.addEventListener("click", Game.movePiece);
  })
}
