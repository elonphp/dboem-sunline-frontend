import auth from './auth'
import sales from './sales'
import member from './member'

export default () => {
  return {
    auth: auth(),
    sales: sales(),
    member: member(),
  }
}
