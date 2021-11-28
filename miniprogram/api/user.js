const db = wx.cloud.database();
const _ = db.command;
import callback from './request.js'
/**
 * login
 * @param {*} name 
 * @param {*} avatar 
 */
export async function login(name, avatar) {
  let res = await wx.cloud.callFunction({
    name: 'Users',
    data: {
      action: 'login_v1',
      data: {
        name,
        avatar
      }
    }
  })
  return callback(res)
}

export async function getUser() {
  let res = await wx.cloud.callFunction({
    name: 'Users',
    data: {
      action: 'get_user_v1'
    }
  })
  return callback(res)
}