import index from '@/components/account'
import account from '@/components/account/account'
import agreement from '@/components/account/agreement'
import contract from '@/components/account/contract'

export default {
  path: '/',
  component: index,
  children: [
    {
      path: '',
      name: 'account',
      component: account
    },
    {
      path: 'agreement',
      name: 'agreement',
      component: agreement
    },
    {
      path: 'contract',
      name: 'contract',
      component: contract
    }
  ]
}
