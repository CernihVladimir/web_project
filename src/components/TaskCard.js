export class TaskCard {
    constructor(task, store) {
        this.task = task;
        this.store = store;
    }

    bindEvents(element) {
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', this.task.task_id); 
        });

        element.querySelector('.archive-btn').addEventListener('click', () => {
            this.store.archiveTask(this.task.task_id);
        });

        element.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm(`Удалить "${this.task.name}"?`)) {
                this.store.deleteTask(this.task.task_id);
            }
        });
    }

    render() {
        return `
            <div class="task-card" draggable="true" data-id="${this.task.task_id}">
                <div class="card-controls">
                    <button class="card-btn archive-btn">📁</button>
                    <button class="card-btn delete-btn">×</button>
                </div>
                <div class="task-title">${this.task.name}</div>
                <div style="font-size: 10px; color: #888;">${this.task.date}</div>
            </div>
        `;
    }
}