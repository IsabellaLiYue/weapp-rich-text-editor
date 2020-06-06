//校验链接
const matchUrl = (source) => {
  if (source === null || source === undefined) {
    return false;
  }
  let result = source.match('^(https://)|(http://)');
  if (!result) {
    return false;
  }
  return true;
}

const uploadImage = (count, theSuccess, theFail) => {
  wx.chooseImage({
    count: count,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (files) {
      theSuccess && theSuccess(files.tempFilePaths)
    },
    fail: function (error) {
      console.error(error)
      let errorMessage = '';
      if (error.errMsg !== 'chooseImage:fail cancel') {
        errorMessage = '图片选择失败'
      }
      theFail && theFail(errorMessage)
    }
  })
}

// 上传视频
const uploadVideo = (theSuccess, theFail) => {
  wx.chooseVideo({
    sizeType: ['compressed'],
    sourceType: ['album'],
    maxDuration: 60,
    success: function (file) {
      if (file.duration > 180) {
        theFail && theFail('请上传3分钟以内的视频');
        return
      }
      theSuccess && theSuccess(file.tempFilePath, file.thumbTempFilePath);
    },
    fail: function (error) {
      console.error(error)
      let errorMessage = '';
      if (error.errMsg !== 'chooseVideo:fail cancel') {
        errorMessage = '视频选择失败'
      }
      theFail && theFail(errorMessage)
    }
  })
}

module.exports = {
  matchUrl: matchUrl,
  uploadImage: uploadImage,
  uploadVideo: uploadVideo
}
