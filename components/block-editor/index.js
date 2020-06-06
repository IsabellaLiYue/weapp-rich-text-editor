var util = require('../../utils/util.js');
Component({
  properties : {
    placeholder: {
      type: String,
      value: '输入内容'
    },
    initData: {
      type: Array,
      value: [],
    }
  },

  data: {
    supportType: {
      text: {
        name: '文本',
        type: 'text',
        icon: '../../images/text.svg',
      },
      link: {
        name: '超链接',
        type: 'link',
        icon: '../../images/link.svg',
      },
      image: {
        name: '图片',
        type: 'image',
        icon: '../../images/image.svg',
      },
      video: {
        name: '视频',
        type: 'video',
        icon: '../../images/video.svg',
      },
    },
    isShowLink: false,
    linkTitle: '',
    href: '',
    linkItem: {},
    id: 0,
    isShowVideoLink: false,
    videoLink: '',
    content: [],
    currentId: 0,
    isEditLink: false
  },

  methods: {
    addNextBlock: function(e) {
      let type = e.currentTarget.dataset.type;
      switch (type) {
        case 'image':
          this.insertImage();
          break;
        case 'text':
          let text = {
            type: 'text',
            content: '',
            id: this.getNextId(),
            isShowMore: false,
          }
          this.data.content.push(text);
          this.setData({content: this.data.content});
          this.formatContentData();
          break;
        case 'video':
          this.uploadVideo();
          break;
        case 'link':
          this.data.isEditLink = false;
          this.setData({
            linkTitle: '',
            href: '',
            isShowLink: true});
          break;
      }
    },
    switchBtn: function(e) {
      this.data.content.forEach(item => {
        if (item.id == e.currentTarget.dataset.id) {
          item.isShowMore = !item.isShowMore;
        }
      });
      this.setData({content: this.data.content});
    },
    // set 图片input的值
    changeImageInput: function(e) {
      this.data.content.forEach(item => {
        if (item.type === 'image' && item.id === e.currentTarget.dataset.id) {
          item.caption= e.detail.value;
        }
      });
      this.formatContentData();
    },
    // set 视频input的值
    changeVideoInput: function(e) {
      this.data.content.forEach(item => {
        if (item.type === 'video' && item.id === e.currentTarget.dataset.id) {
          item.caption= e.detail.value;
        }
      });
      this.formatContentData();
    },
    //set 超链接标题input的值
    changeLinkTitleInput:function (e) {
      this.setData({linkTitle: e.detail.value});

    },
    //set 超链接link input的值
    changeHrefInput:function (e) {
      this.setData({href: e.detail.value});
    },
    // set 文本input的值
    changeTextInput: function(e) {
      this.data.content.forEach(item => {
        if (item.type === 'text' && item.id == e.currentTarget.id) {
          item.content = e.detail.content;
        }
      });
      this.formatContentData();
    },
    linkSubmit: function() {
      if (!this.data.linkTitle) {
        wx.showToast({
          title: '请输入链接文本',
          icon: 'none'
        });
        return;
      }
      if (!this.data.href) {
        wx.showToast({
          title: '请输入链接地址',
          icon: 'none'
        });
        return;
      }
      if (!util.matchUrl(this.data.href)) {
        wx.showToast({
          title: '请输入正确链接地址',
          icon: 'none'
        });
        return;
      }
      this.setData({isShowLink: false});
      let linkItem = {
        id: this.getNextId(),
        type: 'link',
        isShowMore: false,
        href: this.data.href,
        title: this.data.linkTitle,
      }
      if (this.data.isEditLink) {
        this.data.content.forEach(item => {
          if (item.type === 'link' && item.id === this.data.currentId) {
            item.title = this.data.linkTitle;
            item.href = this.data.href;
            return;
          }
        });
      } else {
        this.data.content.push(linkItem);
      }
      this.setData({content: this.data.content});
      this.formatContentData();
    },
    linkCancel: function() {
      this.setData({isShowLink: false});
    },
    // 上传图片
    insertImage: function() {
      this.showLoading();
      util.uploadImage(
        9,
        (tempFilePaths) => {
          for (let i = 0; i < tempFilePaths.length; i++) {
            let item = {};
            item.id = this.getNextId();
            item.type = 'image';
            item.src = tempFilePaths[i];
            item.tempSrc = tempFilePaths[i];
            item.caption = '';
            item.isShowMore = false;
            this.data.content.push(item);
          }
          this.setData({content: this.data.content})
          this.formatContentData();
          this.hideLoading();
        },
        message => {
          this.hideLoading();
          if (message !== '') {
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 3000
            });
          }
        }
      );
    },
    // 上传视频
    uploadVideo: function() {
      this.showLoading();
      util.uploadVideo(
        (tempFilePath, thumbTempVideoPath) => {
          let video = {};
          video.id = this.getNextId();
          video.type = 'video';
          video.src = tempFilePath;
          video.tempFilePath = tempFilePath;
          video.caption = '';
          video.isShowMore = false;
          video.thumbTempVideoPath = thumbTempVideoPath;
          this.data.content.push(video);
          this.setData({content: this.data.content});
          this.formatContentData();
          this.hideLoading();
        },
        message => {
          this.hideLoading();
          if (message !== '') {
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 3000
            });
          }
        }
      );
    },
    updatedLinkContent:function(e) {
      this.data.currentId = e.currentTarget.dataset.id;
      this.data.isEditLink = true;
      this.data.content.forEach(item => {
        if (item.type === 'link' && item.id === e.currentTarget.dataset.id) {
          this.linkTitle = item.title;
          this.href = item.href;
        }
      });
      this.setData({
        linkTitle: this.linkTitle,
        href: this.href,
        isShowLink: true});
    },
    // 上移
    moveUp: function(e) {
      let index = e.currentTarget.dataset.index;
      let currentData = this.data.content[index];
      let prevData = this.data.content[index - 1];
      this.data.content[index] = prevData;
      this.data.content[index - 1] = currentData;
      this.setData({
        content: this.data.content,
      });
      this.formatContentData();
    },
    // 下移
    moveDown: function (e) {
      let index = e.currentTarget.dataset.index;
      let currentData = this.data.content[index];
      let nextData = this.data.content[index + 1];
      this.data.content[index] = nextData;
      this.data.content[index + 1] = currentData;
      this.setData({
        content: this.data.content,
      });
      this.formatContentData();
    },
    // 删除一个block
    deleteBlock: function (e) {
      let index = e.currentTarget.dataset.index;
      this.data.content.splice(index, 1);
      this.setData({
        content: this.data.content,
      });
      this.formatContentData();
    },
    // 向父组件format 数据并返回。
    formatContentData: function() {
      let content = [];
      this.data.content.forEach(item => {
        let contentItem = {};
        if (item.type === 'text' && item.content === '') {
          return;
        }
        if (item.type === 'text') {
          contentItem.type = item.type;
          contentItem.content = item.content;
        }
        if (item.type === 'image') {
          contentItem.type = item.type;
          contentItem.src = item.src;
          contentItem.caption = item.caption;
        }
        if (item.type === 'video') {
          contentItem.type = item.type;
          contentItem.src = item.src;
          contentItem.caption = item.caption;
        }
        if (item.type === 'link') {
          contentItem.type = item.type;
          contentItem.href = item.href;
          contentItem.title = item.title;
        }
        content.push(contentItem);
      });
      this.triggerEvent('contentUpdated', {content: content});
    },
    // loding
    showLoading: function() {
      wx.showLoading({
        title: '加载中',
      });
    },
    hideLoading: function() {
      wx.hideLoading();
    },
    // 预览图片
    previewImage: function(e) {
      let images = [e.currentTarget.dataset.src];
      wx.previewImage({
        current: images[0],
        urls: images
      });
    },
    getNextId: function() {
      return this.data.id++;
    },
    formatInitContent: function() {
      this.properties.initData.forEach(item => {
        let contentItem = {};
        let id = this.getNextId();
        if (!item.type) {
          contentItem.id = id;
          contentItem.isShowMore = false;
          contentItem.type = 'text';
          contentItem.content = item.content;
          this.data.content.push(contentItem);
          return;
        }
        if (item.type === 'text') {
          contentItem.id = id;
          contentItem.isShowMore = false;
          contentItem.type = item.type;
          contentItem.content = item.content;
        }
        if (item.type === 'image') {
          contentItem.id = id;
          contentItem.isShowMore = false;
          contentItem.type = item.type;
          contentItem.tempSrc = item.src;
          contentItem.src = item.src;
          contentItem.caption = item.caption;
        }
        if (item.type === 'video') {
          contentItem.id = id;
          contentItem.isShowMore = false;
          contentItem.type = item.type;
          contentItem.src = item.src;
          contentItem.tempFilePath = item.src;
          contentItem.caption = item.caption;
        }
        if (item.type === 'link') {
          contentItem.id = id;
          contentItem.isShowMore = false;
          contentItem.type = item.type;
          contentItem.href = item.href;
          contentItem.title = item.title;
        }
        this.data.content.push(contentItem);
      });
      this.setData({
        content: this.data.content,
      });
      this.formatContentData();
    }
  },
  created: function() {
    this.formatInitContent();
  },
  observers: {
    'initData': function(initData) {
      this.formatInitContent();
    }
  }
})
