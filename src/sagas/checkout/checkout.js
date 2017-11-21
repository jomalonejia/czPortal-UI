import { call, fork, select, put, take, takeLatest } from 'redux-saga/effects'
import { authPost } from '../../services/authHttp'
import * as checkoutActions from '../../actions/checkout'
import { removeCarts } from '../../actions/cart'
import history from '../../history'

export function* goToPay (action) {
  const addressId = select(state => state.account.addressId)
  const carts = action.payload
  carts.map(cart => cart.addressId = addressId)
  const cartIds = carts.map(cart => cart.id)
  authPost(`/api/item/item/order/add`, action.payload)
  yield put(removeCarts(cartIds))
  yield history.push('/payment')
}

function * getGoToPay () {
  yield takeLatest(checkoutActions.GO_TO_PAY, goToPay)
}

export const checkoutSagas = [
  fork(getGoToPay)
]