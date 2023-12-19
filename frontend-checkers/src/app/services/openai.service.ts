import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiKey = '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';
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) { }

  selectPiece(board: string): Observable<any> {
    let prompt = `Vamos jogar damas.
RP representa peças vermelhas, BP significa peças pretas, RQ significa rainha vermelha e BQ significa rainha preta. O tabuleiro se encontra de lado.
Dado o seguinte tabuleiro:
${board}
Indique um espaço no tabuleiro que contenha uma peça BP ou BQ e me retorne sua pocição no formato [posição x inicial-posição y inicial]
`
    const data = {
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": prompt}]
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.post(this.apiUrl, data, { headers });
  }

}