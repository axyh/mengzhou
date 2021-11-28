const db = wx.cloud.database();
const _ = db.command;
import callback from './request.js'

export async function add_artical_add({content, imgs,topic_id}) {
  let res = await wx.cloud.callFunction({
    name: 'Artical',
    data: {
      action: 'artical_add_v1',
      content,
      imgs,
      topic_id
    }
  })
  return callback(res)
}

export async function get_artical_detail(artical_id) {
  let res = await wx.cloud.callFunction({
    name: 'Artical',
    data: {
      action: 'artical_detail_v1',
      artical_id
    }
  })
  return callback(res)
}
export async function get_artical_list({
  where,
  sort,
  page
}) {
  let res = await wx.cloud.callFunction({
    name: 'Artical',
    data: {
      action: 'artical_list_v1',
      where,
      sort,
      page
    }
  })
  return callback(res)
}

export async function get_comment_list({
  artical_id,
  page
}) {
  let res = await wx.cloud.callFunction({
    name: 'Artical',
    data: {
      action: 'comment_list_v1',
      artical_id,
      page
    }
  })
  return callback(res)
}
export async function get_comment_detail({
  comment_id
}) {
  let res = await wx.cloud.callFunction({
    name: 'Artical',
    data: {
      action: 'comment_detail_v1',
      comment_id
    }
  })
  return callback(res)
}
export async function comment_add({
  artical_id,
  content,
  accepter_openid,
  type,
  reply_comment_id
}) {
  let res = await wx.cloud.callFunction({
    name: 'Artical',
    data: {
      action: 'comment_add_v2',
      artical_id,
      reply_comment_id: reply_comment_id ?? null,
      accepter_openid,
      content,
      type,
    }
  })
  return callback(res)
}

export async function collect_add({
  artical_id, accepter_openid
}) {
  let res = await wx.cloud.callFunction({
    name: 'Artical',
    data: {
      action: 'collect_add_v1',
      artical_id, accepter_openid
    }
  })
  return callback(res)
}

export async function message_list({
  page,
}) {
  let res = await wx.cloud.callFunction({
    name: 'Artical',
    data: {
      action: 'message_list_v1',
      page,
    }
  })
  return callback(res)
}

export async function topic_list({
  page, limit, where
}){
  let res = await wx.cloud.callFunction({
    name: 'Artical',
    data: {
      action: 'topic_list_v1',
      page,limit, where
    }
  })
  return callback(res)
}