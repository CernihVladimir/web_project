import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let db;

// Функция для подключения к БД и создания таблицы
async function initDatabase() {
    db = await open({
        filename: './todo.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            task_id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL
        )
    `);

    console.log('База данных успешно подключена');
}

// получить все задачи из БД
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await db.all('SELECT * FROM tasks');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при чтении из БД' });
    }
});


// добавить новую задачу в БД
app.post('/api/tasks', async (req, res) => {
    try {
        const { task_id, title, description, status } = req.body;

        await db.run(
            'INSERT INTO tasks (task_id, title, description, status) VALUES (?, ?, ?, ?)',
            [task_id, title, description, status]
        );

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при добавлении задачи в БД' });
    }
});

// обновить статус (для Drag-and-Drop)
app.patch('/api/tasks/:task_id', async (req, res) => {
    try {
        const { task_id } = req.params;
        const { status } = req.body;

        await db.run(
            'UPDATE tasks SET status = ? WHERE task_id = ?',
            [status, task_id]
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении статуса' });
    }
});

// удалить задачу из БД
app.delete('/api/tasks/:task_id', async (req, res) => {
    try {
        const { task_id } = req.params;

        await db.run(
            'DELETE FROM tasks WHERE task_id = ?',
            [task_id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении задачи из БД' });
    }
});

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
});



