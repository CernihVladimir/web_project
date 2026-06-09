import { Store } from './store.js';
import { Router } from './router.js';
import { Board } from './components/Board.js';
import { Archive } from './components/Archive.js';

const store = new Store();

const boardScreen = new Board('app-root', store);
const archiveScreen = new Archive('app-root', store);

const router = new Router({
    '/': boardScreen,
    '/archive': archiveScreen
});

document.addEventListener('DOMContentLoaded', () => {
    store.fetchTasks();
});