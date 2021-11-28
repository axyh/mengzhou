// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.env,
  traceUser: true,
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'msg_check_v1': {
      return msg_check_v1(event, context)
    }
    case 'img_check_v1': {
      return img_check_v1(event, context)
    }
    default: {
      return {
        code: 200,
        data: {},
        msg: 'utils 函数唤醒'
      }
    }

  }



  async function msg_check_v1(event, context) {
    let result = await cloud.openapi.security.msgSecCheck({
      content: event.msg
    }).then(res => {
      // console.log('检查成功',res)
      return {
        code: 200,
      }
    }).catch(err => {
      // console.log('检查失败',err)
      return {
        code: 400,
        msg: '请核查提交内容'
      }
    });
    return result;
  }

  async function img_check_v1(event, context) {
    let fileId = event.value;
    var download = await cloud.downloadFile({
      fileID: fileId
    });
    try {
      let result = await cloud.openapi.security.imgSecCheck({
        media: {
          // header: {
          //   'Content-Type': 'application/octet-stream'
          // },
          contentType: 'image/jpg',
          value: download.fileContent
        }
      });
      await cloud.deleteFile({
        fileList: [fileId]
      })
      if (result.errCode === 87014) {
        return {
          code: 400,
          msg: '内容可能潜在风险',
          data: result
        }
      } else {
        return {
          code: 200,
          msg: '内容ok',
          data: result
        }
      }
    } catch (err) {
      await cloud.deleteFile({
        fileList: [fileId]
      })
      // 错误处理
      if (err.errCode === 87014) {
        return {
          code: 400,
          msg: '内容可能潜在风险87014',
          data: err
        }
      }
      return {
        code: 400,
        msg: '图片核验出错',
        data: err
      }
    }
  }
}