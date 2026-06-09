import { ApiService } from './services/ApiServices.js';

export class Store {
    constructor() {
        this.state = { tasks: [] };
        this.listeners = [];
        this.api = new ApiService(); // Используем класс для запросов [9]
    }

    subscribe(listener) { this.listeners.push(listener); }
    notify() { this.listeners.forEach(l => l(this.state)); }

    async fetchTasks() {
        this.state.tasks = await this.api.fetchTasks();
        this.notify();
    }

    async addTask(name, columnId) {
        try {
            const newTask = {
                task_id: crypto.randomUUID(), // Генерация обязательного Primary Key [3]
                name: name,
                date: new Date().toISOString().split('T'),
                board_id: 1, // Пока жестко задаем 1 доску
                column: columnId,
                priority: 1
            };

            const result = await this.api.createTask(newTask);
            if (result && result.success) {
                this.state.tasks.push(newTask);
                this.notify();
            } else {
                throw new Error("Ошибка сервера");
            }
        } catch (e) {
            alert('Не удалось добавить задачу. Проверь консоль сервера.');
        }
    }

    async moveTask(taskId, columnId) {
        const prev = [...this.state.tasks];
        // Оптимистичное обновление [10]
        this.state.tasks = this.state.tasks.map(t => 
            t.task_id === taskId ? { ...t, column: columnId } : t
        );
        this.notify();

        const success = await this.api.updateTaskStatus(taskId, columnId);
        if (!success) {
            this.state.tasks = prev;
            this.notify();
        }
    }

    async archiveTask(taskId) {
        await this.moveTask(taskId, 99); // 99 — условный ID колонки "Архив"
    }

    async deleteTask(taskId) {
        const success = await this.api.deleteTask(taskId);
        if (success) {
            this.state.tasks = this.state.tasks.filter(t => t.task_id !== taskId);
            this.notify();
        }
    }
}