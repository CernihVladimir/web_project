import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let db;

async function initDatabase() {
    db = await open({
        filename: './todo.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            task_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            date TEXT,
            board_id INTEGER,
            column INTEGER NOT NULL,
            priority INTEGER
        )
    `);
    console.log('База данных подключена по новой схеме');
}

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await db.all('SELECT * FROM tasks');
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при чтении из БД' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { task_id, name, date, board_id, column, priority } = req.body;
        await db.run(
            'INSERT INTO tasks (task_id, name, date, board_id, column, priority) VALUES (?, ?, ?, ?, ?, ?)',
            [task_id, name, date, board_id, column, priority]
        );
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при добавлении задачи' });
    }
});

app.patch('/api/tasks/:task_id', async (req, res) => {
    try {
        const { task_id } = req.params;
        const { column } = req.body; 
        await db.run('UPDATE tasks SET column = ? WHERE task_id = ?', [column, task_id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления' });
    }
});

app.delete('/api/tasks/:task_id', async (req, res) => {
    try {
        await db.run('DELETE FROM tasks WHERE task_id = ?', [req.params.task_id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления' });
    }
});

initDatabase().then(() => {
    app.listen(PORT, () => console.log(`Сервер: http://localhost:${PORT}`));
});