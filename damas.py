class Damas():
    def __init__(self):
        tabuleiro = self.inicializa_tabuleiro()
        
        self.partida(tabuleiro)
        
        


    def partida(self, tabuleiro):
        turno = 0 
        while not self.fim_partida(tabuleiro):
            self.imprime_tabuleiro(tabuleiro)
            
            valid_move = False
            while not valid_move:
                origem, destino = input().split()
                valid_move = self.verifica_movimento(tabuleiro, origem, destino, turno)
            
            self.move(tabuleiro, origem, destino)
            
            turno += 1
            # read move
            # verify move - Verifica se a casa é valida, se é o player certo
            # move
            
            
    def fim_partida(self, tabuleiro):
        b = 0
        w = 0
        for i in range(8):
            for j in range(8):
                if tabuleiro[i][j] == 'b' or tabuleiro[i][j] == 'B':
                    b += 1
                elif tabuleiro[i][j] == 'b' or tabuleiro[i][j] == 'B':
                    w += 1
        
        if b == 0 or w == 0:
            return 1
        return 0
    
    def inicializa_tabuleiro(self):
        tab = []
        for i in range(8):
            tab.append([])
            for j in range(8):
                if i < 3 and (i+j)%2 == 0:
                    tab[i].append("b") # black pieces
                elif i > 4 and (i+j)%2 == 0:
                    tab[i].append("w") # white pieces
                else:
                    tab[i].append("-") # empty
        
        return tab
    
    
    def imprime_tabuleiro(self, tabuleiro):
        print("  A B C D E F G H")
        for i in range(8):
            print(i, end=" ")
            for j in range(8):
                print(tabuleiro[i][j], end=" ")
            print()
            
            
    def move(self, tabuleiro, origem, destino):
        # verifica se a origem tem uma peça
        if tabuleiro[origem[0]][origem[1]] != "-":
            # verifica se o destino é valido -> move or attack
            print("valido")
        else:
            print("Origem Inválida")
            return tabuleiro, 0    
    
    def get_pos(self, stringpos):
        i = int(stringpos[0])
        j = int(stringpos[1] - 'A')
        return i, j
    
    def verifica_movimento(self, tabuleiro, origem, destino, turno):
        i, j = self.get_pos(origem)
        if turno % 2 == 0: #movimento das brancas
            if tabuleiro[i][j] != "w" and tabuleiro[i][j] != "W":
                return 0
            # verificar se o destino é valido
            
        else: #movimento das pretas
            if tabuleiro[i][j] != "b" and tabuleiro[i][j] != "B":
                return 0
            
        return 1
        
        
        
    
    
    
d = Damas()

