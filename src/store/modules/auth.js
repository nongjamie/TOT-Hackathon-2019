import {
    SET_AUTH,
    PURGE_AUTH,
    SET_ERROR,
    SET_LOADING,
    SET_INFO
} from './../mutations.type'
import {
    LOGIN_FACEBOOK,
    LOGIN_GOOGLE,
    LOGOUT,
    UPDATE_USER,
    AUTO_LOGIN,
    LOGIN_EMAIL,
    GETPROFILE
} from './../actions.type'

import axios from "axios";
var qs = require("qs");

import firebase from '@/config/firebaseConfig'

const state = {
    user: null,
    error: '',
    loading: false,
    isAuthenticated: false,
    userInfo: null
}

const getters = {
    isAuthenticated(state) {
        return state.user !== null && state.user !== undefined
    },
    getUser(state) {
        return state.user
    },
    getError(state) {
        return state.error
    },
    isLoading(state) {
        return state.loading
    },
    getUserInfo(state){
        return state.userInfo
    },
}

const actions = {
    [GETPROFILE](context, uId) {
        axios.get('https://tot-hackathon-2019.firebaseapp.com/api/user/' + uId)
            .then(function (response) {
                console.log(uId)
                console.log("KUY " + JSON.stringify(response.data))
                context.commit(SET_INFO, response.data.result)
            })
            .catch(function (error) {
                // handle error
                console.log(error)
            })
            .then(function () {
                // always executed
            })
    },
    [LOGIN_FACEBOOK](context) {
        console.log('LOGIN CALLED!')
        context.commit(SET_LOADING, true)
        var provider = new firebase.auth.FacebookAuthProvider()
        provider.addScope('public_profile')
        firebase
            .auth()
            .signInWithPopup(provider)
            .then(function (result) {
                var token = result.credential.accessToken
                var user = result.user
                console.log(token, user)
                console.log('displayName :: ', user.displayName)
                console.log('photoURL ::', user.photoURL)
                context.commit(SET_AUTH, user)
                context.commit(SET_LOADING, false)
                context.commit(SET_ERROR, null)
            })
            .catch(function (error) {
                context.commit(SET_ERROR, error.message)
                context.commit(SET_LOADING, false)
            })
    },
    [LOGOUT](context) {
        console.log('LOGOUT CALLED!')
        context.commit(SET_LOADING, true)
        firebase
            .auth()
            .signOut()
            .then(
                function () {
                    context.commit(PURGE_AUTH)
                    context.commit(SET_ERROR, null)
                    context.commit(SET_LOADING, false)
                    window.location = "/login";
                },
                function (error) {
                    context.commit(SET_ERROR, error.message)
                    context.commit(SET_LOADING, false)
                    window.location = "/login";
                }
            )
    },
    [UPDATE_USER](context, payload) {
    },
    [AUTO_LOGIN](context, payload) {
        console.log('AUTO_LOGIN CALLED!')
        console.log(payload)
        // axios.get('https://tot-hackathon-2019.firebaseapp.com/api/user/'+uId)
        // .then(function (response) {
        //     console.log("KUY " + JSON.stringify(response.data))
        //     context.commit(SET_INFO, response.data.result)
        // })
        axios.get('https://tot-hackathon-2019.firebaseapp.com/api/user/' + payload.uid)
            .then(function (response) {
                console.log("KUY " + JSON.stringify(response.data))
                context.commit(SET_INFO, response.data)
            })
        context.commit(SET_AUTH, payload)
    },
    [LOGIN_GOOGLE](context, credentials) {
        console.log('LOGIN CALLED!')
        context.commit(SET_LOADING, true)
        var provider = new firebase.auth.GoogleAuthProvider()
        firebase
            .auth()
            .signInWithPopup(provider)
            .then(function (result) {
                var token = result.credential.accessToken
                var user = result.user
                console.log(token, user)
                console.log('displayName :: ', user.displayName)
                console.log('photoURL ::', user.photoURL)
                context.commit(SET_AUTH, user)
                context.commit(SET_LOADING, false)
                context.commit(SET_ERROR, null)
            })
            .catch(function (error) {
                context.commit(SET_ERROR, error.message)
                context.commit(SET_LOADING, false)
            })
    },
    [LOGIN_EMAIL](context, user) {
        console.log("EMAIL " + user.email)
        console.log("PASSWORD " + user.password)
        firebase
            .auth()
            .signInWithEmailAndPassword(user.email, user.password)
            .then(function (response) {
                var user = response.user
                axios.get('https://tot-hackathon-2019.firebaseapp.com/api/user/' + user.uid)
                    .then(function (response) {
                        console.log("KUY " + JSON.stringify(response.data))
                        context.commit(SET_INFO, response.data)
                    })
                console.log(user + " IS USER!")
                context.commit(SET_AUTH, user)
                context.commit(SET_LOADING, false)
                context.commit(SET_ERROR, null)
                window.location = "/";
            })
    }
}

const mutations = {
    [SET_ERROR](state, error) {
        state.errors = error
    },
    [SET_AUTH](state, user) {
        state.user = user
    },
    [PURGE_AUTH](state) {
        state.user = null
    },
    [SET_LOADING](state, isLoading) {
        state.loading = isLoading
    },
    [SET_INFO](state, userInfo) {
        state.userInfo = userInfo
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}