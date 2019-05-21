import loginIndex from '@/components/login'
import login from '@/components/login/login'
import identity from '@/components/login/identity'

export default {
  path: '/login',
  component: loginIndex,
  children: [
    {
      path: '',
      name: 'login',
      component: login
    },
    {
      path: 'identity',
      name: 'identity',
      component: identity
    }
  ]
}