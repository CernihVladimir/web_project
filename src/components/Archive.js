export class Archive {
    constructor(containerId, store) {
        this.container = document.getElementById(containerId);
        this.store = store;
        this.store.subscribe(() => {
            // Перерисовываем только если активен роут архива
            if (window.location.pathname === '/archive') this.render();
        });
    }

    bindEvents() {
        // Кнопка окончательного удаления из архива
        this.container.querySelectorAll('.delete-archive-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // ИСПРАВЛЕНО: Убрали parseInt, так как ID теперь строка (UUID)
                const id = btn.dataset.id; 
                if (confirm('Удалить задачу навсегда?')) {
                    this.store.deleteTask(id);
                }
            });
        });
    }

    render() {
        // Извлекаем только задачи со статусом архивировано (колонку 99)
        const archivedTasks = this.store.state.tasks.filter(t => Number(t.column) === 99);

        let tableRows = archivedTasks.map(t => `
            <tr>
                <td>${t.task_id}</td> 
                <td>${t.name}</td>
                <td>
                    <!-- ИСПРАВЛЕНО: Используем task_id вместо id для атрибута data-id -->
                    <button class="delete-archive-btn" data-id="${t.task_id}">Удалить</button>
                </td>
            </tr>
        `).join('');

        if (archivedTasks.length === 0) {
            tableRows = `<tr><td colspan="3" style="text-align:center; color:#888;">Архив пуст</td></tr>`;
        }

        this.container.innerHTML = `
            <h2>Архив выполненных задач</h2>
            <div class="archive-container">
                <table class="archive-table">
                    <thead>
                        <tr>
                            <th>ID (UUID)</th>
                            <th>Название задачи</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
        this.bindEvents();
    }
}