class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);

        this.taskInput = document.getElementById('taskInput');
        this.taskerInput = document.getElementById('taskerInput');
        this.taskList = document.getElementById('taskList');
        this.addTaskBtn = document.getElementById('addTask');
        this.themeToggle = document.querySelector('.theme-toggle');
        this.deleteAllBtn = document.getElementById('deleteAllTasks');
        this.saveAllBtn = document.getElementById('saveAllTasks');
        this.selectAllBtn = document.getElementById('selectAllTasks');

        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.deleteAllBtn.addEventListener('click', () => this.deleteAllTasks());
        this.saveAllBtn.addEventListener('click', () => this.saveAllTasks());
        this.selectAllBtn.addEventListener('click', () => this.selectAllTasks());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.taskerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.render();
    }

    addTask() {
        const description = this.taskInput.value.trim();
        const tasker = this.taskerInput.value.trim();

        if (!description || !tasker) {
            this.showNotification('Please fill in both fields', 'danger');
            return;
        }

        const task = {
            id: Date.now(),
            description,
            tasker,
            completed: false,
            createdAt: new Date()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.render();
        this.showNotification('Task added successfully');

        this.taskInput.value = '';
        this.taskerInput.value = '';
        this.taskInput.focus();
    }

    toggleTaskComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.render();
        this.showNotification('Task deleted');
    }

    deleteAllTasks() {
        this.tasks = [];
        this.saveTasks();
        this.render();
        this.showNotification('All tasks deleted');
    }

    saveAllTasks() {
        this.saveTasks();
        this.showNotification('All tasks saved');
    }

    selectAllTasks() {
        this.tasks.forEach(task => task.completed = true);
        this.saveTasks();
        this.render();
        this.showNotification('All tasks selected');
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.themeToggle.textContent = this.theme === 'light' ? '🌙' : '☀️';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification animate__animated animate__fadeIn`;
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.margin = '10px 0';
        
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('animate__fadeOut');
            notification.addEventListener('animationend', () => {
                notification.remove();
            });
        }, 3000);
    }

    render() {
        this.taskList.innerHTML = '';
        this.tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task ${task.completed ? 'completed' : ''}`;
            taskDiv.innerHTML = `
                <span>${task.description} (Assigned to: ${task.tasker})</span>
                <div>
                    <button class="btn btn-primary" onclick="taskManager.toggleTaskComplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="btn btn-danger" onclick="taskManager.deleteTask(${task.id})">Delete</button>
                </div>
            `;
            this.taskList.appendChild(taskDiv);
        });
    }
}

const taskManager = new TaskManager();
