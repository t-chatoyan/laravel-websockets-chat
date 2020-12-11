import { http } from '../../../api';

const auth = {
    namespaced: true,
    state: {
        authenticated: false,
        user: null,
        blanks:[],
        access_token: null,
        favoriteCourses: null,
        refresh_token : null,
        settings : null,

    },
    actions: {
        login: ({ commit }, params) => {
           return http.post('oauth/token?grant_type=password&client_id=application-client&client_secret=1a9aaa10-662b-4660-bcfe-fac4c62ffef7&username='+ params.email +'&password='+params.code+'&scope=default').then(res => {
              commit('userLogin', res.data)
          });
        },

        loginSocialFb: ({ commit }, params) => {
           return http.post('auth/social/sigin', {token: params.token, userId: params.userId}).then(res => {
               commit('userLogin', {profile_id: res.data.id, ...res.data.jwt})
          });
        },

        loginAfterVerify: ({ commit }, params) => {
            commit('userLogin', params)
        },

        loginSocialGoogle: ({ commit }, params) => {
           return http.post('auth/social/sigin/google?token=' +  params.token).then(res => {
               commit('userLogin', {profile_id: res.data.id, ...res.data.jwt})
          });
        },

        registration: ({ commit }, params) => {
          return http.post('auth/registration?userType='+params.regUser ,params).then(res => {
            commit('setUser', res.data);
          });
        },

        getAuthUser: ({ commit }) => {
            let user_id = localStorage.profile_id;
            return http.get('profile/' + user_id).then(res => {
                commit('setUser', res.data);
          });
        },

        becomeTeacher: ({ commit }) => {
            return http.post('/profile/becomeTeacher').then(res => {
                commit('setUser', res.data);
          });
        },

        paymentCreateAccount: ({ commit },params) => {
            return http.post('/payment/createAccount?code=' + params).then(res => {

          });
        },

        updateUserProfile: ({commit},params) => {
          return http.put('profile',params).then(res => {
              commit('setUser', res.data);
          })
        },
        updateUserAvatar: ({commit}, params) => {
          return http.post('profile/avatar',params).then(res => {
              commit('setUserAvatar',res.data.url)
          })
        },

        resetPassword : ({commit}, params) => {
            return http.post('auth/password/reset',params).then(res => {
                commit('resetUserPass', res);
            });
        },
        logout : ( {commit} ) => {
            commit('userLogout');
        },
        getSettings:({ commit }, params) => {
            return http.get('profile/settings', params).then(res => {
                commit('setSettings', res.data);
            })
        },
        getBlanks:({ commit }) => {
            return http.get('blank').then(res => {
                commit('setBlanks', res.data);
            })
        },
        updateSavedMoney({ commit }, params){

        },
    },
    mutations: {
        userLogin(state, data) {
            let accessToken  = data.access_token;
            let refreshToken = data.refresh_token;
            let profileId    = data.profile_id;
            localStorage.setItem('access_token',accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('profile_id',profileId);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                state.user = data.user;
            }
            http.defaults.headers.common.Authorization = accessToken;
            state.authenticated = true;
            state.access_token = accessToken;
            state.refresh_token = refreshToken;
        },

        setTariff(state, data) {
            state.user.tariff = data;
        },

        setUser(state, data){
            state.user = data;
        },
        setSettings(state, data){
            state.settings = data;
        },

        setUserAvatar(state, data){
            state.user.avatar = data
        },

        setProfileProgress(state, data){
            state.user.avatar = data
        },

        resetUserPass(state,response) {

        },
        setBlanks(state, content) {
            state.blanks = content
        },
        userLogout(state){
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            http.defaults.headers.common.Authorization = '';
            state.authenticated = false;
            state.access_token = null;
            state.refresh_token = null;
            state.user = null;
        }
    },
    getters: {
        isAuthenticated: state => state.authenticated,
        user: state =>  state.user,
        settings: state =>  state.settings,

    }
};

export default auth;
