let tasks = [];
let currentTab = 'all';
let editingTaskId = null;

function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-US', options);
}

function generateId() {
    return Date.now() + Math.random();
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: generateId(),
        text: taskText,
        completed: false,
        createdAt: new Date(),
        completedAt: null
    };

    tasks.unshift(newTask);
    input.value = '';
    updateDisplay();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date() : null;
        updateDisplay();
    }
}

function deleteTask(id) {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    
    if (confirmDelete) {
        tasks = tasks.filter(task => task.id !== id);
        updateDisplay();
    }
}

function startEdit(id) {
    editingTaskId = id;
    updateDisplay();
}

function saveEdit(id) {
    const input = document.querySelector(`#edit-input-${id}`);
    const newText = input.value.trim();
    
    if (newText === '') {
        alert('Task cannot be empty!');
        return;
    }

    const task = tasks.find(task => task.id === id);
    if (task) {
        task.text = newText;
        editingTaskId = null;
        updateDisplay();
    }
}

function cancelEdit() {
    editingTaskId = null;
    updateDisplay();
}

function showTab(tabName) {
    currentTab = tabName;
    
    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    updateDisplay();
}

function getFilteredTasks() {
    if (currentTab === 'pending') {
        return tasks.filter(task => !task.completed);
    } else if (currentTab === 'completed') {
        return tasks.filter(task => task.completed);
    } else {
        return tasks; 
    }
}


function updateStats() {
    const totalCount = tasks.length;
    const pendingCount = tasks.filter(task => !task.completed).length;
    const completedCount = tasks.filter(task => task.completed).length;

    document.getElementById('totalTasks').textContent = totalCount;
    document.getElementById('pendingTasks').textContent = pendingCount;
    document.getElementById('completedTasks').textContent = completedCount;
}

function displayTasks() {
    const container = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        container.innerHTML = '';
        container.appendChild(emptyState);

        let message = 'No tasks yet!';
        let subtitle = 'Add your first task to get started.';
        
        if (currentTab === 'pending') {
            message = 'No pending tasks!';
            subtitle = 'Great job! All tasks completed.';
        } else if (currentTab === 'completed') {
            message = 'No completed tasks yet!';
            subtitle = 'Complete some tasks to see them here.';
        }
        
        emptyState.innerHTML = `
            <h3>${message}</h3>
            <p>${subtitle}</p>
        `;
        return;
    }
    let tasksHTML = '';
    
    for (let i = 0; i < filteredTasks.length; i++) {
        const task = filteredTasks[i];
        const isEditing = editingTaskId === task.id;
        const taskClass = task.completed ? 'completed' : '';
        let taskContent = '';
        if (isEditing) {
            taskContent = `
                <div class="edit-form">
                    <input type="text" class="edit-input" id="edit-input-${task.id}" value="${task.text}">
                    <button class="btn btn-complete" onclick="saveEdit(${task.id})">Save</button>
                    <button class="btn btn-delete" onclick="cancelEdit()">Cancel</button>
                </div>
            `;
        } else {
            const completedText = task.completedAt ? 
                `<span>Completed: ${formatDateTime(task.completedAt)}</span>` : '';
            
            taskContent = `
                <div class="task-title">${task.text}</div>
                <div class="task-meta">
                    <span>Created: ${formatDateTime(task.createdAt)}</span>
                    ${completedText}
                </div>
            `;
        }
        let actionButtons = '';
        if (!isEditing) {
            const toggleButtonClass = task.completed ? 'btn-uncomplete' : 'btn-complete';
            const toggleButtonText = task.completed ? 'Undo' : 'Complete';
            
            actionButtons = `
                <div class="task-actions">
                    <button class="btn ${toggleButtonClass}" onclick="toggleTask(${task.id})">
                        ${toggleButtonText}
                    </button>
                    <button class="btn btn-edit" onclick="startEdit(${task.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
        }
        
        tasksHTML += `
            <div class="task-item ${taskClass}">
                <div class="task-content">
                    <div class="task-text">
                        ${taskContent}
                    </div>
                    ${actionButtons}
                </div>
            </div>
        `;
    }

    container.innerHTML = tasksHTML;
}

function updateDisplay() {
    updateStats();
    displayTasks();
}

function initializeApp() {
    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    updateDisplay();
}

initializeApp();