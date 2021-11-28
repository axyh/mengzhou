const moment = require('./moment');
/**
 * 一个月的开始和结束时间戳
 * @param {*} y 
 * @param {*} m 
 */
export function monthStartEnd(y, m) {
  let year = y ? y : new Date().getFullYear();
  let month = m ? m : (new Date().getMonth() + 1).toString().length > 1 ?
    `${new Date().getMonth() + 1}` :
    '0' + (new Date().getMonth() + 1);
  return {
    start_time: moment(`${year}-${month}-01`).startOf('month').valueOf(),
    end_time: moment(`${year}-${month}-01`).endOf('month').valueOf(),
    text: `${year}年${month}月`
  }
}
/**
 * 一年的开始和结束时间戳
 * @param {*} y 
 */
export function yearStartEnd(y) {
  let year = y ? y : new Date().getFullYear();
  return {
    start_time: moment(`${year}-01-01`).startOf('year').valueOf(),
    end_time: moment(`${year}-01-01`).endOf('year').valueOf(),
    text: `${year}年`
  }
}
export function getNYRWeek(time) {
  let week = moment(time).day()
  switch (week) {
    case 1:
      week = '周一'
      break;
    case 2:
      week = '周二'
      break;
    case 3:
      week = '周三'
      break;
    case 4:
      week = '周四'
      break;
    case 5:
      week = '周五'
      break;
    case 6:
      week = '周六'
      break;
    case 0:
      week = '周日'
      break;
  }
  let NYR = moment(time).format('YYYY/MM/DD');
  let today_start = moment().startOf('day').format('x');
  if (time < today_start) {
    return `${NYR} ${week}`
  } else {
    return '今天'
  }
}
export async function chooseImg(count) {
  let res = await wx.chooseImage({
    count: count ?? 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
  })
  return res;
}
export async function compressImg(path) {
  return await wx.compressImage({
    src: path,
    quality: 30, // 压缩质量
  })
}
export function uploadImg(path, file_path) {
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: `${path}/${new Date().getTime()}.jpg`, // 上传至云端的路径
      filePath: file_path, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        resolve(res.fileID)
      },
      fail: err => {
        wx.showToast({
          title: '上传失败',
          icon: 'none',
        });
        reject(err)
      }
    })
  })
}