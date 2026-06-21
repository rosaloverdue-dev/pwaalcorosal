// Получаем элементы
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearButton = document.getElementById('clearButton');

// Загружаем задачи из localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Функция для сохранения задач
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateStats();
}

// Функция обновления счётчика задач
function updateStats() {
    taskCount.textContent = `Всего: ${tasks.length}`;
}

// Функция рендеринга списка задач
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.textContent = task.completed ? '↩️' : '✅';
        toggleBtn.onclick = () => toggleTask(index);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => deleteTask(index);
        
        li.appendChild(toggleBtn);
        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
    
    updateStats();
}

// Функция добавления задачи
function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        alert('Введите текст задачи!');
        return;
    }
    
    tasks.push({
        text: text,
        completed: false
    });
    
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Функция переключения статуса задачи
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Функция удаления задачи
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Функция очистки всех задач
function clearTasks() {
    if (tasks.length === 0) return;
    
    if (confirm('Удалить все задачи?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Обработчики событий
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
clearButton.addEventListener('click', clearTasks);

// Загружаем задачи при запуске
renderTasks();
