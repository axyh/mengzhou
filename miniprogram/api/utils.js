const db = wx.cloud.database();
const _ = db.command;
import callback from './request.js'

export async function msgCheck(msg) {
  let res = await wx.cloud.callFunction({
    name: 'Utils',
    data: {
      action: 'msg_check_v1',
      msg
    }
  });
  return callback(res);
}


export async function imgCheck(fileId) {
  let res = await wx.cloud.callFunction({
    name: 'Utils',
    data: {
      action: 'img_check_v1',
      value: fileId
    }
  })
  return callback(res);
}