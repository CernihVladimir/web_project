import { ApiService } from "../services/ApiService.js";

export class Store {
    constructor() {
        this.api = new ApiService(); // подключил сервис  БД
        this.state = {
            tasks: [] // локальное хран-е в памяти
        };
        this.listeners = []; // список функций-подписчиков
    }

    async init() {
        const serverTasks = await this.api.fetchTasks();
        // Защита: если бэкенд пустой или лежит, можно подтянуть данные из localStorage
        if (serverTasks.length === 0) {
            const local = localStorage.getItem('kanban-tasks');
            this.state.tasks = local ? JSON.parse(local) : [];
        } else {
            this.state.tasks = serverTasks; 
        }

        this._notify();
    }
    // дает подписаться на изменения данных
    subscribe(callback) {
        this.listeners.push(callback);
    }

    // отдает текущие задачи компоненту отрисовки
    getTasks() {
        return this.state.tasks;
    }

    // Изменение статуса задачи (вызывается при Drag-and-Drop)
    async updateTaskStatus(task_id, newStatus) {
        // сначала мменяю в маняти для мгновенного отклика UI
        this.state.tasks = this.state.tasks.map(task =>
            task.task_id === task_id ? { ...task, status: newStatus } : task
        );
        this._saveToLocalStorage();
        this._notify();

        // потом отправляю запрос в БД на сервере
        await this.api.updateTaskStatus(task_id, newStatus);
    }

    async deleteTask(task_id) {
        this.state.tasks = this.state.tasks.filter(task => task.task_id !== task_id);
        this._saveToLocalStorage();
        this._notify();

        await this.api.deleteTask(task_id);
    }

    async addTask(title, description) {
        const newTask = {
            task_id: Date.now().toString(), // верменный ID
            title,
            description,
            status: 'todo'
        };

        this.state.tasks.push(newTask);
        this._saveToLocalStorage();
        this._notify();

        await this.api.createTask(newTask);
    }

    _notify() {
        this.listeners.forEach(callback => callback());
    }

    _saveToLocalStorage() {
        localStorage.setItem('kanban-tasks', JSON.stringify(this.state.tasks));
    }
}


