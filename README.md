# Árvores Balanceadas - Simulador de Fila de Prioridade (RBT)

## Alunos  
| Matrícula | Nome |  
|:----------:|:---------------------------:|  
| 20/2046229 | Kallyne Macêdo Passos |  
| 20/0022199 | Leonardo Sobrinho de Aguiar | 

## Descrição do projeto

Este projeto é um visualizador interativo que demonstra o funcionamento de uma **Árvore Red-Black (Rubro-Negra)** utilizada como uma Fila de Prioridade. A aplicação permite que o usuário adicione "tarefas" com diferentes níveis de prioridade, que são armazenadas e gerenciadas pela Árvore Red-Black no backend, com o objetivo de fornecer uma visualização da eficiência de árvores auto-balanceadas. Assim, o simulador mostra como a árvore garante performance de **$O(\log n)$** para inserções e para extrair o item de maior prioridade, mesmo sob carga constante.

A aplicação conta com dois modos de uso:
1.  **Modo Manual:** O usuário pode adicionar tarefas uma a uma e processar a próxima tarefa de maior prioridade ao clicar em um botão.
2.  **Modo de Simulação:** Inicia um "teste de estresse" que adiciona tarefas aleatórias e processa a fila automaticamente em intervalos de tempo, demonstrando visualmente a estabilidade da árvore.

## Guia de instalação

**Linguagem**: Python, HTML, CSS (Bootstrap) e JavaScript<br>
**Framework**: Flask<br>
**Pré-requisitos**: Navegador web, Python e Flask instalados no computador.

### Passo a Passo

### 1. Clonar repositório:
```bash
git clone https://github.com/EDAII/Busca_Autocomplete.git
```
### 2. Instale as Dependências:
Abra um terminal ou prompt de comando na pasta do projeto e execute:
```bash
pip install Flask 
```
### 3. Inicie o Servidor:
Digite no mesmo terminal:
```bash
python app.py
```
### 4. Acesse a Aplicação:
Abra seu navegador web e acesse o seguinte endereço: http://127.0.0.1:5000
