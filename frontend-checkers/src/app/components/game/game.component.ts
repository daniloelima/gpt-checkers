import { getLocaleFirstDayOfWeek } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {

  @ViewChild("board") boardElement!: ElementRef<HTMLInputElement>;

  // public black_pieces: any;
  // public red_pieces: any; 
  private board: HTMLCollection | any;
  private game: Game | any;

  constructor(private renderer: Renderer2) {

  }
  ngAfterViewInit(): void {
    this.board = this.boardElement.nativeElement.children;
    this.game = new Game(this.board);
    this.defineListeners();
  }

  defineListeners() {
    this.boardElement.nativeElement.childNodes.forEach(element => {
      element.addEventListener('click', this.game.highlightSquare)
    });
  }

}

class Game {
  static active = '';
  static board: string[][];
  static elementBoard: HTMLCollection;
  static dict = new Map(Object.entries({
    "w": "white-square",
    "b": "blue-square",
    "RP": "red-piece",
    "BP": "black-piece",
    "RQ": "red-queen",
    "BQ": "black-queen",

  }))

  constructor(elements: HTMLCollection) {
      Game.elementBoard = elements;

      Game.board = [
        ['w', 'b RQ', 'w', 'b', 'w', 'b BP', 'w', 'b BQ'],
        ['b RP', 'w', 'b RP', 'w', 'b', 'w', 'b BP', 'w'],
        ['w', 'b RP', 'w', 'b', 'w', 'b BP', 'w', 'b BP'],
        ['b RP', 'w', 'b RP', 'w', 'b', 'w', 'b BP', 'w'],
        ['w', 'b RP', 'w', 'b', 'w', 'b BP', 'w', 'b BP'],
        ['b RP', 'w', 'b RP', 'w', 'b', 'w', 'b BP', 'w'],
        ['w', 'b RP', 'w', 'b', 'w', 'b BP', 'w', 'b BP'],
        ['b RP', 'w', 'b RP', 'w', 'b', 'w', 'b BP', 'w']
      ];

      this.displayGame();
    }

    displayGame() {
      for(let row = 0; row < 8; row++) {
        for(let column = 0; column < 8; column++) {
          let classes = Game.board[row][column].split(' ').map((key:string) => {
            return Game.dict.get(key);            
          }).join(' ');
                    
          let index = (row * 8) + column;
          
          Game.elementBoard[index].className = classes;
        }
      }
    }

    highlightSquare(event: PointerEvent) {
      const e = event.target as Element;
      
      if (Game.active == '') {
        // Primeiro click, só setta a classe
        Game.active = e.id;
        e.className = e.classList.value + ' highlight';
        return
      }

      if (Game.active === e.id) {
        // Clicou no mesmo, vai limpar o campo
        Game.active = '';
        e.className = e.classList.value.replace("highlight", "");
      } else {
        // Reseta o antigo
        let index = Game.active.split("_")
        let newIndex = parseInt(index[0]) * 8 + parseInt(index[1]);
        
        Game.elementBoard[newIndex].className = Game.elementBoard[newIndex].classList.value.replace("highlight", "");

        //Setta o novo
        Game.active = e.id;
        e.className = e.classList.value + ' highlight';
      }
    }
}