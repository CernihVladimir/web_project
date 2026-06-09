export class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
        // Слушаем кнопки Вперед/Назад в браузере
        window.addEventListener('popstate', () => this.handleRoute());

        // Перехватываем клики по ссылкам навигации
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.getAttribute('href'));
            }
        });

        this.handleRoute();
    }

    navigateTo(url) {
        history.pushState(null, null, url);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        // Если роут не найден отправляем на главную 
        const routeComponent = this.routes[path] || this.routes['/'];
        routeComponent.render();
    }
}