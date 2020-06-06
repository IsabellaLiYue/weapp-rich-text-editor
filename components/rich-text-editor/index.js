Component({
  properties: {
    // 静态传值
    placeholder: {
      type: String,
      value: '输入内容'
    },
    showImgSize: {
      type: Boolean,
      value: false
    },
    showImgToolbar: {
      type: Boolean,
      value: false
    },
    showImgResize: {
      type: Boolean,
      value: false
    },
    content: {
      type: String,
      value: ''
    },
    isInsertImage: {
      type: Boolean,
      value: false
    },
    id: {
      type: Number,
      value: 0
    },
    editorHeight: {
      type: Number,
      value: 0
    },
    initData: {
      type: String,
      value: ''
    }
  },

  data: {
    formats: {},
    fontSizeArray: ['默认', '小', '中', '大'],
    fontSizeContent: ['', '16px', '24px', '32px'],
    paragraphArray: ['默认', 'H1', 'H2', 'H3', 'H4', 'H5'],
    fontColorcontent: ['', '#000000', '#1296db', '#1afa29', '#d81e06', '#f4ea2a'],
    bgColorContent: ['', '#e6e6e6', '#1296db', '#1afa29', '#d81e06', '#f4ea2a', '#13227a'],
    fontSizeIndex: 0,
    selectFontColor: '',
    selectBgColor: '',
    fontColorIndex: '',
    bgColorIndex: '',
    selectFontColorIndex: [0],
    selectBgColorIndex: [0],
    isShowFontColor: false,
    isShowBgColor: false
  },

  methods: {
    format(e) {
      let { name, value } = e.currentTarget.dataset;
      if (!name) {
        return;
      } else if (name === 'color') {
        this.setData({isShowFontColor: true});
      } else if (name === 'backgroundColor') {
        this.setData({isShowBgColor: true});
      } else {
        this.editorCtx.format(name, value);
      }
    },
    onStatusChange(e) {
      this.data.formats = {};
      this.data.formats = e.detail;
      if (this.data.formats.backgroundColor && this.data.formats.backgroundColor === '#ffffff') {
        delete this.data.formats.backgroundColor;
      }
      this.setData({ formats: this.data.formats });
      console.log('formats', this.data.formats);
      if (this.data.formats.fontSize) {
          for (let i = 0; i <= this.data.fontSizeContent.length - 1; i++) {
            if (this.data.fontSizeContent[i] == this.data.formats.fontSize) {
              this.setData({fontSizeIndex: i});
              return;
            }
          }
      } else {
        this.setData({fontSizeIndex: 0});
      }
    },
    onEditorReady() {
      const that = this;
      this.createSelectorQuery()
        .select('#editor')
        .context(function(res) {
          that.editorCtx = res.context;
          res.context.setContents({
            html: that.data.content
          });
         }).exec();
    },
    onInsertImage() {
      const that = this;
      let image = '';
      let imagePath = '';
      aliyunoss.default.uploadImage(
        1,
        (urlList, tempFilePaths) => {
          image = tempFilePaths[0];
          imagePath = urlList[0];
          if (tempFilePaths.length == 0) {
            let message = '图片上传失败';
            wx.showToast({
              title: message,
              icon: none
            });
          } else {
            that.editorCtx.insertImage({
              src: imagePath,
              extClass: 'mc-img'
            });
          }
        },
        message => {
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
    changeContent(e) {
      this.data.content = e.detail.html;
      if (e.detail.text.length <= 1)  {
        this.data.content = '';
      }
      this.triggerEvent('changeTextInput', {content: this.data.content, id: this.data.id});
    },
    changeFontColor(e) {
      this.data.selectFontColor = this.data.fontColorcontent[e.detail.value[0]];
      this.data.fontColorIndex = e.detail.value[0];
    },
    changeBgColor(e) {
      this.setData({selectBgColor: this.data.bgColorContent[e.detail.value[0]]});
      this.data.bgColorIndex = e.detail.value[0];
    },
    fontColorSubmit() {
      this.data.selectFontColorIndex[0] = this.data.fontColorIndex;
      this.editorCtx.format('color', this.data.selectFontColor);
      this.setData({isShowFontColor: false});
    },
    fontColorCancel() {
      this.setData({isShowFontColor: false});
    },
    bgColorSubmit() {
      this.data.selectBgColorIndex[0] = this.data.bgColorIndex;
      this.editorCtx.format('backgroundColor', this.data.selectBgColor);
      this.setData({isShowBgColor: false});
    },
    bgColorCancel() {
      this.setData({isShowBgColor: false});
    },
    undo() {
      this.editorCtx.undo();
    },
    redo() {
      this.editorCtx.redo();
    },
    fontSizeChange(e) {
      this.setData({ fontSizeIndex: e.detail.value });
      this.editorCtx.format('fontSize', this.data.fontSizeContent[this.data.fontSizeIndex]);
    },
    paragraphChange(e) {
      let paragraphIndex = 0;
      if (e.detail.value !== '0') {
        paragraphIndex = e.detail.value;
      } else {
        paragraphIndex = undefined;
      }
      this.editorCtx.format('header', this.data.paragraphIndex);
    },
    removeFormat() {
      this.data.formats = {};
      this.editorCtx.removeFormat();
    },
    setEditorContent(content) {
      const that = this;
      that.data.content = content;
      if (that.editorCtx) {
        that.editorCtx.setContents({
          html: content
        });
      }
      this.triggerEvent('changeTextInput', {content: this.data.content, id: this.data.id});
    }
  },

  observers: {
    'initData': function(initData) {
      this.setEditorContent(initData);
    }
  }
});