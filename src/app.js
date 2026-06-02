import { Store } from './store/Store.js';
import { KanbanBoard } from './components/KanbanBoard.js';

const store = new Store();
const appContainer = document.getElementById('app');
const table = new KanbanBoard(appContainer, store);

store.init();