// components/msg/dialogitem/inner/inner.js
let app = getApp()
Component({

  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    msg: {
      type: Object
    },
    senderIsMe: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playing: false,
    duration: 0, // 音视频当前播放剩余时间，单位：秒
    audioContext: null,
    videoContext: null
  },

  created() {
    setTimeout(() => {
      this.init()
    }, 100);
  },

  detached() {
    this.unInit()
  },

  /**
   * 组件的方法列表
   */
  methods: {

    init() {

      let msg = this.properties.msg
      let that = this

      if (msg == null) {
        return
      }

      switch (msg.type) {
        case 2: // 视频
          var videoContext = wx.createVideoContext('mvideo', this)
          this.data.videoContext = videoContext
          break
        case 5: // 音频
          var audioContext = wx.createInnerAudioContext()

          audioContext.src = msg.contentObj.url

          audioContext.onError((res) => {
            console.error('audioContext onError', res)
            wx.showToast({
              title: '播放错误',
              icon: 'none'
            })
            that.setData({
              playing: false
            })
          })

          audioContext.onStop(() => {
            console.log('audioContext onStop')
            that.setData({
              playing: false,
              duration: msg.contentObj.duration
            })
          })

          audioContext.onEnded(() => {
            console.log('audioContext onEnded')
            that.setData({
              playing: false,
              duration: msg.contentObj.duration
            })
          })

          audioContext.onTimeUpdate(() => {
            // console.log('onTimeUpdate', audioContext.currentTime)
          })

          wx.onAudioInterruptionBegin((res) => {
            console.error('onAudioInterruptionBegin')
            that.setData({
              playing: false
            })
          })
          wx.onAudioInterruptionEnd((res) => {
            console.error('onAudioInterruptionBegin')
            that.setData({
              playing: false
            })
          })

          this.setData({
            audioContext: audioContext,
            duration: msg.contentObj.duration
          })
          break
        default:
          break
      }

      if (msg == null || msg.contentObj == null ||
        msg.contentObj.url == null || msg.contentObj.url == undefined) {
        return
      }

      app.globalData.bus.on('playMedia', () => {
        if (msg.contentObj.url != app.globalData.playingUrl) {
          that.stopMedia()
        }
      })
    },

    unInit() {
      let audioContext = this.data.audioContext
      if (audioContext != null) {
        audioContext.destroy()
      }
    },

    tapImg(event) {
      console.log('tapImg')
      let msg = this.properties.msg
      wx.previewImage({
        urls: [msg.contentObj.url],
        current: msg.contentObj.url,
        showmenu: false,
        fail(res) {
          console.error('tapImg fail', res.errMsg)
        }
      })
    },

    tapVoice(event) {

      let msg = this.properties.msg
      let playing = this.data.playing
      let audioContext = this.data.audioContext

      console.log('tapVoice', playing, audioContext)

      if (playing) {
        audioContext.pause()
      } else {
        audioContext.play()
        app.globalData.playingUrl = msg.contentObj.url
        app.globalData.bus.emit('playMedia')
      }

      this.setData({
        playing: !playing
      })
    },

    stopMedia() {

      let audioContext = this.data.audioContext
      if (audioContext != null) {
        audioContext.stop()
      }

      let msg = this.properties.msg
      let videoContext = this.data.videoContext
      if (videoContext != null) {
        videoContext.stop()
      }

      this.setData({
        playing: false
      })
    },

    onVideoPlay(event) {
      console.log('onVideoPlay')
      let msg = this.properties.msg

      app.globalData.playingUrl = msg.contentObj.url
      app.globalData.bus.emit('playMedia')
    },

    onVideoError(event) {
      console.error('onVideoError', event)
      wx.showToast({
        title: '播放错误',
        icon: 'none'
      })
    }
  }
})