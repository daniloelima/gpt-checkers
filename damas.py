class Damas():
    def __init__(self):
        tabuleiro = self.inicializa_tabuleiro()
        
        self.partida(tabuleiro)
        
        


    def partida(self, tabuleiro):
        while not self.fim_partida(self.tabuleiro):
            self.imprime_tabuleiro(tabuleiro)
            # read move
            # verify move - Verifica se a casa é valida, se é o player certo
            # move
            
            
    def fim_partida(self, tabuleiro):
        
        
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
            
            
    def move(self, tabuleiro, origem, dest):
        # verifica se a origem tem uma peça
        if tabuleiro[origem[0]][origem[1]] != "-":
            # verifica se o destino é valido -> move or attack
            print("valido")
        else:
            print("Origem Inválida")
            return tabuleiro, 0    
        
        
    
    
    
d = Damas()
