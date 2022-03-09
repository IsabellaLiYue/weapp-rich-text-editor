# weapp-rich-text-editor
自己实现的微信小程序富文本编辑器，支持文本，图片，视频，超链接，上移，下移，编辑，删除等操作。

## 效果预览
![](https://github.com/IsabellaLiYue/weapp-rich-text-editor/raw/master/images/demo.png) 

## 组件属性
属性名 | 类型 | 默认值 | 说明
--- | --- | --- | ---
placeholder | String | 输入内容 | 输入框提示语（非必填
initData | Array | [] | 初始化页面（非必填）

### initData 格式要求
```
[{type: text, content: '这是内容'}，
{type: image, src: '', caption: '这是图片描述'}，
{type: video, caption: '这是视频描述'},
{type: 'link', href: '这是超链接', title: '这是超链接标题'}]
```


## 代码示例
```
<view class="container">
  <view class="usermotto">
    <block-editor 
      placeholder="输入内容"
      initData="{{initData}}"
      bind:contentUpdated="getContentData">
    </block-editor>
  </view>
</view>
```

```
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
```

```
{
  "usingComponents": {
    "block-editor": "../../components/block-editor/index"
  }
}
```
