// отвечает только за сетевые запросы к БД/серверу

export class ApiService {
    constructor(baseUrl = 'http://localhost:3000/api') {
        this.baseUrl = baseUrl;
}

// Получить все задачи из БД
async fetchTasks() {
    try {
        const response = await fetch(`${this.baseUrl}/tasks`);
        if (!response.ok)  throw new Error('Ошибка при получении данных с сервера');
        return await response.json();
    } catch (error) {
        console.error('ApiService error: ', error);
        return [];
    }
}

async updateTaskStatus(task_id, columnId) { 
    try {
        const response = await fetch(`${this.baseUrl}/tasks/${task_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ column: columnId }) 
        });
        return response.ok;
    } catch (error) {
        console.error('ApiService error: ', error);
        return false;
    }
}

// удалить задачу из БД
async deleteTask(task_id) {
    try {
        const response = await fetch(`${this.baseUrl}/tasks/${task_id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error('ApiService error: ', error);
        return false;
    }
}

// Создать новую задачу в БД
    async createTask(task) {
        try {
            const response = await fetch(`${this.baseUrl}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            return await response.json();
        } catch (error) {
            console.error('ApiService: ', error);
            return null;
        }
    }
}