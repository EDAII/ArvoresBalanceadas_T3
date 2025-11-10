const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener('DOMContentLoaded', () => {

    const addTaskBtn = document.getElementById('add-task-btn');
    const processNextBtn = document.getElementById('process-next-btn');
    const taskNameInput = document.getElementById('task-name-input');
    const taskPriorityInput = document.getElementById('task-priority-input');
    const waitingListDiv = document.getElementById('waiting-list');
    const processedListDiv = document.getElementById('processed-list');

    addTaskBtn.addEventListener('click', async () => {
        const name = taskNameInput.value;
        const priority = taskPriorityInput.value;

        if (!name || !priority) {
            alert('Por favor, preencha o nome e a prioridade da tarefa.');
            return;
        }

        addTaskBtn.disabled = true;

        try {
            const response = await fetch('/add_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, priority: priority }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Erro desconhecido');
            }

            taskNameInput.value = '';
            taskPriorityInput.value = '';
            await refreshWaitingList();

        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            alert(`Erro: ${error.message}`);
        }

        addTaskBtn.disabled = false;
    });

    processNextBtn.addEventListener('click', async () => {
        processNextBtn.disabled = true;

        try {
            const response = await fetch('/process_next_task');
            const data = await response.json();

            if (data.status === 'empty') {
                alert(data.message);
            } else if (data.status === 'success') {
                const task = data.processed_task;
                const priority = data.priority;

                await refreshWaitingList();

                // Cria o item 
                const item = createTaskElement(task, priority);

                // Adiciona no topo da lista de processados
                processedListDiv.prepend(item);

                // Animação
                item.classList.add('processing', 'list-group-item-warning');
                await sleep(500);
                item.classList.remove('processing', 'list-group-item-warning');
            }

        } catch (error) {
            console.error('Erro ao processar tarefa:', error);
        }

        processNextBtn.disabled = false;
    });

    function createTaskElement(task, priority) {
        const item = document.createElement('div');
        // Classes base 
        item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
        item.id = `task-${task.id}`;

        // Conteúdo
        const taskName = document.createElement('span');
        taskName.textContent = task.name;

        const taskPriority = document.createElement('span');
        taskPriority.className = 'badge bg-primary rounded-pill';
        taskPriority.textContent = `Prioridade: ${priority}`;

        item.appendChild(taskName);
        item.appendChild(taskPriority);

        return item;
    }

    async function refreshWaitingList() {
        try {
            const response = await fetch('/get_all_tasks');
            const tasksByPriority = await response.json();

            waitingListDiv.innerHTML = ''; // Limpa a lista

            // Renderiza os novos itens
            tasksByPriority.forEach(group => {
                group.tasks.forEach(task => {
                    const item = createTaskElement(task, group.priority);
                    waitingListDiv.appendChild(item);
                });
            });

        } catch (error) {
            console.error('Erro ao atualizar lista de espera:', error);
        }
    }

    refreshWaitingList();
});