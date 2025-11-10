import os
from flask import Flask, render_template, jsonify, request
import uuid 
from rbt_priority_queue import RedBlackTree 

app = Flask(__name__)

# Instancia a RBT que gerencia a fila de prioridade
priority_queue = RedBlackTree() 

@app.route('/')
def index():
    """ Serve index.html """
    return render_template('index.html')

@app.route('/get_all_tasks', methods=['GET'])
def get_all_tasks():
    """  Busca todas as tarefas na árvore, ordenadas por prioridade. """
    tasks_list = priority_queue.get_all_tasks_in_order()
    tasks_list.reverse()  # Exibe da maior prioridade para a menor
    return jsonify(tasks_list)

@app.route('/add_task', methods=['POST'])
def add_task():
    """  Endpoint para adicionar uma nova tarefa. """
    data = request.get_json()
    task_name = data.get('name')
    
    try:
        priority = int(data.get('priority'))
    except (ValueError, TypeError):
        return jsonify({'error': 'Prioridade inválida'}), 400

    if not task_name:
        return jsonify({'error': 'Nome da tarefa não pode ser vazio'}), 400
    
    # Cria o objeto da tarefa
    new_task = {'id': str(uuid.uuid4()), 'name': task_name}
    
    # Verificação de nó existente
    node = priority_queue.get_node(priority)
    
    if node != priority_queue.TNULL:
        # adiciona a tarefa à lista de valores do nó
        node.value.append(new_task)
    else:
        # insere um novo nó na árvore como lista
        priority_queue.insert(priority, [new_task])
    
    return jsonify({'status': 'success', 'added_task': new_task, 'priority': priority})

@app.route('/process_next_task', methods=['GET'])
def process_next_task():
    """ Endpoint para remover da lista ou deletar o nó. """
    
    # Encontra o nó com a maior chave (prioridade)
    max_node = priority_queue.find_max_node()
    
    if max_node == priority_queue.TNULL:
        return jsonify({'status': 'empty', 'message': 'A fila está vazia.'})
        
    # Remove a primeira tarefa da lista de valores do nó e retorna o primeiro item
    processed_task = max_node.value.pop(0)
    priority = max_node.key
    
    # Se a lista de tarefas está vazia, remova o nó da árvore
    if not max_node.value:
        priority_queue.delete_node(priority)
    
    # Retorna a tarefa processada
    return jsonify({
        'status': 'success', 
        'processed_task': processed_task, # {id: ..., name: ...}
        'priority': priority
    })

if __name__ == '__main__':
    # Inicializa árvore
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        priority_queue = RedBlackTree()
        
    app.run(debug=True)