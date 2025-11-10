const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let taskGeneratorInterval = null;
let taskProcessorInterval = null;

document.addEventListener('DOMContentLoaded', () => {

    // Adiciona uma tarefa via API e atualiza a lista de espera
    async function apiAddTask(name, priority) {
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
            
            // Atualiza a lista
            await refreshWaitingList();
            return true;

        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            alert(`Erro: ${error.message}`);
            return false;
        }
    }

    // Processa uma tarefa via API e move o item na UI.
    async function apiProcessTask() {
        try {
            const response = await fetch('/process_next_task');
            const data = await response.json();

            if (data.status === 'empty') {
                if (!taskGeneratorInterval) { // Se a simulação não estiver ativa
                    alert(data.message);
                }
            } else if (data.status === 'success') {
                const task = data.processed_task;
                const priority = data.priority;
                
                // Atualiza a lista de espera (remove o item)
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
    }
    
    // Botões 
    const addTaskBtn = document.getElementById('add-task-btn');
    const processNextBtn = document.getElementById('process-next-btn');
    const taskNameInput = document.getElementById('task-name-input');
    const taskPriorityInput = document.getElementById('task-priority-input');
    const waitingListDiv = document.getElementById('waiting-list');
    const processedListDiv = document.getElementById('processed-list');
    // Simulação
    const startSimBtn = document.getElementById('start-sim-btn');
    const stopSimBtn = document.getElementById('stop-sim-btn');
    

    addTaskBtn.addEventListener('click', async () => {
        const name = taskNameInput.value;
        const priority = taskPriorityInput.value;

        if (!name || !priority) {
            alert('Por favor, preencha o nome e a prioridade da tarefa.');
            return;
        }

        addTaskBtn.disabled = true;
        const success = await apiAddTask(name, priority); // Chama a função
        if (success) {
            taskNameInput.value = '';
            taskPriorityInput.value = '';
        }
        addTaskBtn.disabled = false;
    });

    processNextBtn.addEventListener('click', async () => {
        processNextBtn.disabled = true;
        await apiProcessTask(); // Chama a função
        processNextBtn.disabled = false;
    });

    startSimBtn.addEventListener('click', () => {
        // Alterna o estado dos botões
        startSimBtn.disabled = true;
        stopSimBtn.disabled = false;
        
        // Desabilita os controles manuais
        addTaskBtn.disabled = true;
        processNextBtn.disabled = true;
        taskNameInput.disabled = true;
        taskPriorityInput.disabled = true;
        
        // Intervalo para gerar tarefas
        taskGeneratorInterval = setInterval(() => {
            const taskNames = ["Relatório", "Backup", "Deploy", "Email", "Streaming", "Cálculo", "Log"];
            const name = taskNames[Math.floor(Math.random() * taskNames.length)];
            const priority = Math.floor(Math.random() * 100) + 1; // Prioridade de 1 a 100
            
            console.log(`Simulação: Adicionando ${name} (Prioridade ${priority})`);
            apiAddTask(name, priority); // Chama a função
        }, 2000); // A cada 2 segundos

        // Intervalo para processar tarefas
        taskProcessorInterval = setInterval(() => {
            console.log("Simulação: Processando próxima tarefa...");
            apiProcessTask(); // Chama a função
        }, 5000); // A cada 5 segundos
    });

    stopSimBtn.addEventListener('click', () => {
        // Alterna o estado dos botões
        startSimBtn.disabled = false;
        stopSimBtn.disabled = true;

        // Reabilita os controles manuais
        addTaskBtn.disabled = false;
        processNextBtn.disabled = false;
        taskNameInput.disabled = false;
        taskPriorityInput.disabled = false;

        // Limpa os intervalos
        clearInterval(taskGeneratorInterval);
        clearInterval(taskProcessorInterval);
        taskGeneratorInterval = null;
        taskProcessorInterval = null;
        console.log("Simulação parada.");
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
