import { Store } from './store.js';
import { Router } from './router.js';
import { Board } from './components/Board.js';
import { Archive } from './components/Archive.js';

// 1. Инициализируем глобальный синглтон-стор
const store = new Store();

// 2. Объявляем компоненты экранов
const boardScreen = new Board('app-root', store);
const archiveScreen = new Archive('app-root', store);

// 3. Запускаем роутер и передаем конфигурацию страниц
const router = new Router({
    '/': boardScreen,
    '/archive': archiveScreen
});

// 4. При загрузке страницы вытягиваем актуальные данные из бэкенда
document.addEventListener('DOMContentLoaded', () => {
    store.fetchTasks();
});