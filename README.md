# gpt-checkers

Repositório com o trabalho de disciplina de Generative Pre-Trained Transformers do professor Alberto realizado pelos alunos Danilo Erler Lima e Fernando Azevedo Peres

## Proposta

Fazer um jogo de damas usando GPT, com interface gráfica e disponibilização do estado atual do jogo a cada novo passo, para a ChatGPT ter boas chances de fazer bons movimentos. A aplicação web foi desenvolvida a partir do framework Angular e a conexão com a gpt foi feita a partir da API do chatGPT da openAI.  

A programação de funcionamento do jogo se encontra dentro de [game.component](frontend-checkers/src/app/components/game/game.component.ts), em que as requisões da api também estão dentro desse código.

![Home](media/menu.png)

## Divisão

O repositório foi dividido entre:

- a pasta de [documentos](docs): Conténdo o [artigo](docs/trabalho-gpt-danilo-fernando.pdf) realizado pelos alunos.
- a pasta de [midia](media): Contendo imagens e videos do trabalho.
- a pasta de [código](frontend-checkers): Com o código da aplicação desenvolvida.
- a pasta de [ferramentas](tools): Com ferramentas auxiliares como um script para instalação de dependencias.


## Build and Run

A fim de executar o programa é necessário seguir os seguintes passos:

- Clone o [repositório](https://github.com/daniloelima/gpt-checkers):
	```
	git clone git@github.com:daniloelima/gpt-checkers.git	
	```

- Rode o script disponivel na pasta tools para instalação das dependencias:
	```
	sudo bash install_dependences.sh
	```

- Entre na pasta com o código do programa e inicialize a aplicação:
	```
	cd frontend-checkers
 	ng serve -o
	```	

- Para jogar acesse https://localhost:4200 e inicie a partida


## Jogo e Regras

O jogo de damas tem origem aproximada no século XII mas que se populariza na Europa a partir do século XVI.

A fim de desenvolver nosso jogo determinamos uma série de regras e padrões para facilitar a interação do jogador e as respostas da máquina, estão elas:

1. O jogo termina quando todas as peças de um jogador foram eliminadas
2. O jogo é dividido em turnos entre os jogadores, onde cada jogador é obrigado a fazer um movimento
3. O tabuleiro possui dimensões de 8x8 e sua posição inicial se da por:

![Tabuleiro Inicial](https://github.com/daniloelima/gpt-checkers/blob/main/media/inicio_partida.png)

4. O movimento de uma peça se da sempre na diagonal alterando em 1 linha e uma coluna e sempre em direção oposta a sua origem, isso é, para as peças claras sempre é necessário deslocar a direita e para as peças escuras a esquerda.
5. Todos os movimentos devem se dar dentro do tamanho do tabuleiro
6. Ao chegar a borda lateral do tabuleiro a peça se torna uma Dama e agora pode se deslocar em ambos sentidos
7. Para capturar uma peça é necessário que ela esteja na direção do movimento e a próxima peça nessa direção esteja vazia, deslocando assim a peça pulando a peça "engolida" e terminando a 2 colunas e 2 linhas de sua origem. Obs. Nao foi implementada a regra de captura em cadeia, logo apenas uma peça é comida por turno.


Com as regras estabelecidas, podemos iniciar o jogo. Caso não saiba iniciar siga os passos de instalação [Build and Run](##Build-and-Run).

Com o jogo aberto voce deve clicar em alguma de suas peças e percebera que as peças em que é possivel realizar um movimento ficarão em highlight, além disso seus possiveis destinos também ficarão marcados, basta clicar em qual posição deseja levá-la e seu turno sera executado, agora basta esperar o movimento da máquina e será sua vez novamente.  Video exemplo do jogo em funcionamento:

https://github.com/daniloelima/gpt-checkers/assets/50208673/2269de31-609b-410c-a0c8-3ac3f744d4d2
