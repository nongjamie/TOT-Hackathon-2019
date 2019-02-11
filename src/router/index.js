import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

import Login from '@/views/Login'
import Register from '@/views/Register'
import Profile from '@/views/Profile'
import Weather from '@/views/Weather'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/Weather',
      name: 'Weather',
      component: Weather
    }
  ]
})
