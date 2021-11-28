const cloud = require('wx-server-sdk')
cloud.init({
  env: process.env.env,
  traceUser: true,
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate
exports.main = async (event, context) => {
  const _openid = cloud.getWXContext().OPENID;
  switch (event.action) {
    case 'login_v1': {
      return login_v1(event, context)
    }
    case 'get_user_v1': {
      return get_user_v1(event, context)
    }
    default: {
      return {
        code: 200,
        data: {},
        msg: 'Users函数唤醒'
      }
    }
  }
  async function login_v1(event, context) {
    let has = await db.collection('user').where({
      _openid
    }).get();
    if (has.data.length) {
      return {
        code: 200,
        data: {}
      }
    }
    await db.collection('user').add({
      data: {
        _openid,
        nickName: event.data.name,
        avatarUrl: event.data.avatar,
        change_time: (new Date()).getTime(),
        create_time: (new Date()).getTime()
      }
    });
    return {
      code: 200,
      data: []
    }
  }
  async function get_user_v1(event, context) {
    let res = await db.collection('user').where({
      _openid
    }).get();
    let message_count = (await db.collection('message').where({
      accepter_openid: _openid,
      read: false
    }).get()).data.length
    return {
      code: 200,
      data: {
        user: res.data,
        text: "",
        allowUpCount: 9,
        message_count
      }
    }
  }
}