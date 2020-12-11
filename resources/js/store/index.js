import Vue from 'vue';
import createPersistedState from "vuex-persistedstate";
import Vuex from 'vuex'
import auth from './modules/auth';


Vue.use(Vuex);

const dataState = createPersistedState({
    paths: ['auth']
});

export default new Vuex.Store({
    modules : {
        auth: auth,
    },
    plugins: [dataState]
});

