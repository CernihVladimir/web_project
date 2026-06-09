import { TaskCard } from './TaskCard.js';

export class Board {
    constructor(containerId, store) {
        this.container = document.getElementById(containerId);
        this.store = store;
        // Перерисовываем экран только если мы сейчас находимся на вкладке Доски
        this.store.subscribe(() => {
            if (window.location.pathname === '/') this.render();
        });
        
        // Жесткая конфигурация колонок (каждая доска может иметь свои ID)
        this.columns = [
            { id: 0, name: 'Бэклог' },
            { id: 1, name: 'В работе' },
            { id: 2, name: 'Готово' }
        ];
    }

    bindEvents() {
        // Вешаем события создания задач на кнопки колонок
        this.columns.forEach(col => {
            this.container.querySelector(`.add-btn-${col.id}`).addEventListener('click', () => {
                const name = prompt('Название задачи:');
                if (name) this.store.addTask(name, col.id);
            });

            // Настройка зон Drop для перетаскивания карточек
            const zone = this.container.querySelector(`.zone-${col.id}`);
            zone.addEventListener('dragover', e => e.preventDefault());
            zone.addEventListener('drop', async e => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData('text/plain'); // УБРАЛИ parseInt [1]
                this.store.moveTask(taskId, col.id); 
            });
        });

        // Просим каждую карточку привязать свои внутренние события (клики, drag)
        const activeTasks = this.store.state.tasks.filter(t => !t.is_archived);
        activeTasks.forEach(task => {
            // Ищем по task_id, а не по id [4]
            const cardEl = this.container.querySelector(`[data-id="${task.task_id}"]`); 
            if (cardEl) {
                new TaskCard(task, this.store).bindEvents(cardEl);
            }
        });
            }

    render() {
        // Фильтруем только активные (не архивированные) задачи
        const activeTasks = this.store.state.tasks.filter(t => !t.is_archived);

        const html = `
            <h2>Рабочее пространство</h2>
            <div class="kanban-container">
                ${this.columns.map(col => {
                    const colTasks = activeTasks.filter(t => t.column === col.id);
                    return `
                        <div class="column">
                            <div class="column-header">${col.name} (${colTasks.length})</div>
                            <div class="tasks-list zone-${col.id}">
                                ${colTasks.map(t => new TaskCard(t, this.store).render()).join('')}
                            </div>
                            <button class="add-task-btn add-btn-${col.id}">+ Добавить</button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        this.container.innerHTML = html;
        this.bindEvents();
    }
}