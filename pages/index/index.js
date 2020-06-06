//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    initData: [],
    contentData: []
  },
  getContentData: function(e) {
    this.contentData = e.detail.content;
  },
})
