# gpt-checkers

Repositório com o trabalho de disciplina de Generative Pre-Trained Transformers do professor Alberto realizado pelos alunos Danilo Erler Lima e Fernando Azevedo Peres

## Proposta

Fazer um jogo de damas usando GPT, com interface gráfica e disponibilização do estado atual do jogo a cada novo passo, para a ChatGPT ter boas chances de fazer bons movimentos.

## Divisão

O repositório foi dividido entre 2 pastas:

- a pasta [docs](docs): Conténdo o [artigo](docs/trabalho-gpt-danilo-fernando.pdf) realizado pelos alunos e outros documentos e imagens.
- a pasta [front](src): Com o código desenvolvido.
- a pasta [tools](tools): Com ferramentas auxiliares.


## Build and Run

A fim de executar o programa é necessário seguir os seguintes passos:

- Clone o [repositório](https://github.com/daniloelima/gpt-checkers). 
	```
	git clone git@github.com:daniloelima/gpt-checkers.git	
	```

- Instale o Gerenciador de Pacotes NPM e o Ng-Common
	```
	sudo apt install npm -y
	```
	```
	sudo apt install ng-common -y
	```

- Entre na pasta com o código do programa
	```
	cd src/frontend-checkers
	```	
- Inicialize o servidor da aplicação
	```
	ng serve -o
	```
- Para jogar acesse https://localhost:4200 e inicie a partida


## Jogo e Regras

O jogo de damas tem origem aproximada no século XII mas que se populariza na Europa a partir do século XVI.

A fim de desenvolver nosso jogo determinamos uma série de regras e padrões para facilitar a interação do jogador e as respostas da máquina, estão elas:

1. O jogo termina quando todas as peças de um jogador foram eliminadas
2. O jogo é dividido em turnos entre os jogadores, onde cada jogador é obrigado a fazer um movimento
3. O tabuleiro possui dimensões de 8x8 e sua posição inicial se da por:

![Tabuleiro Inicial](https://github.com/daniloelima/gpt-checkers/blob/main/docs/inicio_partida.png)

4. O movimento de uma peça se da sempre na diagonal alterando em 1 linha e uma coluna e sempre em direção oposta a sua origem, isso é, para as peças claras sempre é necessário deslocar a direita e para as peças escuras a esquerda.
5. Todos os movimentos devem se dar dentro do tamanho do tabuleiro
6. Ao chegar a borda lateral do tabuleiro a peça se torna uma Dama e agora pode se deslocar em ambos sentidos
7. Para capturar uma peça é necessário que ela esteja na direção do movimento e a próxima peça nessa direção esteja vazia, deslocando assim a peça pulando a peça "engolida" e terminando a 2 colunas e 2 linhas de sua origem. Obs. Nao foi implementada a regra de captura em cadeia, logo apenas uma peça é comida por turno.


Com as regras estabelecidas, podemos iniciar o jogo. Ao seguir os passos de instalação [Build and Run](##Build-and-Run),

Com o jogo aberto voce deve clicar em alguma de suas peças e percebera que as peças em que é possivel realizar um movimento ficarão em highlight, além disso seus possiveis destinos também ficarão marcados, basta clicar em qual posição deseja levá-la e seu turno sera executado, agora basta esperar o movimento da máquina e será sua vez novamente. 
