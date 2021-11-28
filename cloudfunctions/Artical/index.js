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
  let res = await db.collection('user').where({
    _openid
  }).get();
  let login = res.data.length > 0;
  switch (event.action) {
    case 'artical_add_v1': {
      return artical_add_v1(event, context)
    }
    case 'artical_detail_v1': {
      return artical_detail_v1(event, context)
    }
    case 'artical_list_v1': {
      return artical_list_v1(event, context)
    }
    case 'comment_add_v1': {
      return comment_add_v1(event, context)
    }
    case 'comment_add_v2': {
      return comment_add_v2(event, context)
    }
    case 'comment_list_v1': {
      return comment_list_v1(event, context)
    }
    case 'comment_detail_v1': {
      return comment_detail_v1(event, context)
    }
    case 'collect_add_v1': {
      return collect_add_v1(event, context)
    }
    case 'message_list_v1': {
      return message_list_v1(event, context)
    }
    case 'topic_list_v1': {
      return topic_list_v1(event, context)
    }
    default: {
      return {
        code: 200,
        data: {},
        msg: 'Artical函数唤醒'
      }
    }
  }
  async function artical_add_v1(event, context) {
    let res = await db.collection('artical').add({
      data: {
        _openid,
        content: event.content,
        imgs: event.imgs ? event.imgs : [],
        topic_id: event.topic_id ? event.topic_id : null,
        change_time: (new Date()).getTime(),
        create_time: (new Date()).getTime(),
        status: 0
      }
    })
    return {
      code: 200,
      data: res
    }
  }
  async function artical_detail_v1(event, context) {
    let res = (await db.collection('artical').aggregate()
      .match({
        _id: event.artical_id
      })
      .lookup({
        from: 'user',
        localField: "_openid",
        foreignField: "_openid",
        as: "author"
      })
      .lookup({
        from: 'comment',
        localField: "_id",
        foreignField: "artical_id",
        as: "comment",
      })
      .lookup({
        from: 'collect',
        localField: "_id",
        foreignField: "artical_id",
        as: "collect",
      })
      .lookup({
        from: 'topic',
        localField: "topic_id",
        foreignField: "_id",
        as: "topic",
      })
      .addFields({
        'author': $.mergeObjects([$.arrayElemAt(['$author', 0])]),
        'topic': $.mergeObjects([$.arrayElemAt(['$topic', 0])]),
        'comment_count': $.size('$comment'),
        'collect_count': $.size('$collect'),
      })
      .project({
        'comment': 0,
        'collect': 0,
        'topic_id': 0
      })
      .end()).list
    if (res.length > 0) {
      if (_openid != res[0].author._openid && res[0].status < 1) {
        return {
          code: 400,
          msg: '审核中，请稍后'
        }
      };
      let collect_current = (await db.collection('collect').where({
        _openid,
        artical_id: event.artical_id
      }).get()).data
      let detail = res[0];
      detail.collect_current = collect_current.length > 0
      return {
        code: 200,
        data: detail
      }
    } else {
      return {
        code: 400,
        msg: '没有找到任何东西'
      }
    }
  }
  async function artical_list_v1(event, context) {
    let where = event.where ? event.where : {
      _openid
    }
    let sort = event.sort ? event.sort : {
      change_time: -1
    }
    let page = event.page ? event.page : 0
    let res = await db.collection('artical')
      .aggregate()
      .match(where)
      .sort(sort)
      .skip(page * 20)
      .limit(20)
      .lookup({
        from: 'user',
        localField: "_openid",
        foreignField: "_openid",
        as: "author"
      })
      .lookup({
        from: 'comment',
        localField: "_id",
        foreignField: "artical_id",
        as: "comment",
      })
      .lookup({
        from: 'collect',
        localField: "_id",
        foreignField: "artical_id",
        as: "collect",
      })
      .lookup({
        from: 'topic',
        localField: "topic_id",
        foreignField: "_id",
        as: "topic",
      })
      .addFields({
        'author': $.mergeObjects([$.arrayElemAt(['$author', 0])]),
        'topic': $.mergeObjects([$.arrayElemAt(['$topic', 0])]),
        'comment_count': $.size('$comment'),
        'collect_count': $.size('$collect'),
      })
      .project({
        'comment': 0,
        'collect': 0,
        'topic_id': 0
      })
      .end();
    return {
      code: 200,
      data: res.list
    }
  }
  async function comment_add_v1(event, context) {
    let res = await db.collection('comment').add({
      data: {
        sender_openid: _openid,
        content: event.content,
        artical_id: event.artical_id,
        accepter_openid: event.accept_user_openid,
        type: event.type,
        change_time: (new Date()).getTime(),
        create_time: (new Date()).getTime(),
      }
    });
    return {
      code: 200,
      data: res
    }
  }
  async function comment_add_v2(event, context) {
    if (!login) {
      return {
        code: 401,
        msg: '请登陆'
      }
    }
    let res = await db.collection('comment').add({
      data: {
        artical_id: event.artical_id,
        reply_comment_id: event.reply_comment_id,
        sender_openid: _openid,
        accepter_openid: event.accepter_openid,
        content: event.content,
        type: event.type,
        change_time: (new Date()).getTime(),
        create_time: (new Date()).getTime(),
      }
    });
    if (_openid !== event.accepter_openid) {
      await db.collection('message').add({
        data: {
          type: 'comment',
          comment_id: res._id,
          artical_id: event.artical_id,
          sender_openid: _openid,
          accepter_openid: event.accepter_openid,
          read: false,
          change_time: (new Date()).getTime(),
          create_time: (new Date()).getTime(),
        }
      })
    }
    return {
      code: 200,
      data: res
    }
  }
  async function comment_list_v1(event, context) {
    let res = await db.collection('comment')
      .aggregate()
      .match({
        artical_id: event.artical_id
      })
      .sort(event.sort ? event.sort : {
        change_time: -1
      })
      .skip(event.page * 20)
      .limit(20)
      .lookup({
        from: 'user',
        localField: "sender_openid",
        foreignField: "_openid",
        as: "sender"
      })
      .lookup({
        from: 'user',
        localField: "accepter_openid",
        foreignField: "_openid",
        as: "accepter"
      })
      .lookup({
        from: 'comment',
        localField: "reply_comment_id",
        foreignField: "_id",
        as: "reply_comment"
      })
      .addFields({
        'sender': $.mergeObjects([$.arrayElemAt(['$sender', 0])]),
        'accepter': $.mergeObjects([$.arrayElemAt(['$accepter', 0])]),
        'reply_comment': $.mergeObjects([$.arrayElemAt(['$reply_comment', 0])]),
      }).end();
    return {
      code: 200,
      data: res.list
    }
  }
  async function comment_detail_v1(event, context) {
    let res = (await db.collection('comment')
      .aggregate()
      .match({
        _id: event.comment_id
      })
      .lookup({
        from: 'user',
        localField: "sender_openid",
        foreignField: "_openid",
        as: "sender"
      })
      .lookup({
        from: 'user',
        localField: "accepter_openid",
        foreignField: "_openid",
        as: "accepter"
      })
      .addFields({
        'sender': $.mergeObjects([$.arrayElemAt(['$sender', 0])]),
        'accepter': $.mergeObjects([$.arrayElemAt(['$accepter', 0])]),
      }).end()).list;
    if (res.length > 0) {
      return {
        code: 200,
        data: res[0]
      }
    } else {
      return {
        code: 400,
        msg: '没有找到任何东西'
      }
    }

  }
  async function collect_add_v1(event, context) {
    let res = (await db.collection('collect').where({
      _openid,
      artical_id: event.artical_id,
    }).get()).data;
    if (res.length > 0) {
      await db.collection('collect').where({
        _openid,
        artical_id: event.artical_id,
      }).remove();
    } else {
      await db.collection('collect').add({
        data: {
          _openid,
          artical_id: event.artical_id,
          change_time: (new Date()).getTime(),
          create_time: (new Date()).getTime(),
        }
      })

      let hasMessage = (await db.collection('message').where({
        artical_id: event.artical_id,
        sender_openid: _openid
      }).get()).data.length > 0
      if (_openid !== event.accepter_openid && !hasMessage) {
        await db.collection('message').add({
          data: {
            type: 'collect',
            artical_id: event.artical_id,
            sender_openid: _openid,
            accepter_openid: event.accepter_openid,
            read: false,
            change_time: (new Date()).getTime(),
            create_time: (new Date()).getTime(),
          }
        })
      }
    }
    return {
      code: 200,
      data: {},
      msg: '删除success',
    }

  }
  async function message_list_v1(event, context) {
    await db.collection('message').where({
      accepter_openid: _openid
    }).update({
      data: {
        read: true
      }
    })
    let res = await db.collection('message')
      .aggregate()
      .match({
        accepter_openid: _openid
      })
      .sort({
        change_time: -1
      })
      .skip(event.page * 20)
      .limit(20)
      .lookup({
        from: 'user',
        localField: "sender_openid",
        foreignField: "_openid",
        as: "sender"
      })
      .lookup({
        from: 'artical',
        localField: "artical_id",
        foreignField: "_id",
        as: "artical"
      })
      .lookup({
        from: 'comment',
        localField: "comment_id",
        foreignField: "_id",
        as: "comment"
      })
      .addFields({
        'sender': $.mergeObjects([$.arrayElemAt(['$sender', 0])]),
        'artical': $.mergeObjects([$.arrayElemAt(['$artical', 0])]),
        'comment': $.mergeObjects([$.arrayElemAt(['$comment', 0])]),
      })
      .project({
        'comment_id': 0,
        'artical_id': 0,
        'sender_openid': 0,
        'accepter_openid': 0
      })
      .end();
    return {
      code: 200,
      data: res.list
    }
  }
  async function topic_list_v1(event, context) {
    let page = event.page ? event.page : 0;
    let limit = event.limit ? event.limit : 20;
    let where = event.where ? event.where : {}
    let res = await db.collection('topic')
      .aggregate()
      .match(where)
      .sort({
        create_time: -1
      })
      .skip(page * limit)
      .limit(limit)
      .lookup({
        from: 'artical',
        localField: "_id",
        foreignField: "topic_id",
        as: "artical",
      })
      .addFields({
        'artical_count': $.size('$artical'),
      })
      .project({
        'artical': 0,
      })
      .end();
    return {
      code: 200,
      data: res.list
    }
  }

}