import Vue from 'vue';
import Router from 'vue-router';

import Login from './components/pages/Login';
import Registration from './components/pages/Registration';
import Home from './components/pages/Home';

Vue.use(Router);

const router = new Router({
    linkActiveClass: "active",

    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/registration',
            name: 'registration',
            component: Registration,
        },
    ],
});

export default router;
