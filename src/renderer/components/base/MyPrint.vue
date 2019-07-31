<template>
  <div>
    <div class="copy">
      <el-button plain type="info" size="mini" @click.prevent="doCopy">复制</el-button>
      <el-button plain type="info" size="mini" @click.prevent="doClean">清空</el-button>
    </div>
    <div class="print">
      <div class="list" ref="logContainer" @mousedown="stopScroll" @mouseup="continueScroll"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyPrint',
    data () {
      return {
        currentRecord: 0,
        maxRecord: 5000,
        delayTimer: null,
        delayTimerInterval: 1000,
        isScroll: true
      }
    },
    mounted () {
      this.listenIpcRenderer()
    },
    destroyed () {
      this.removeListenIpcRenderer()
    },
    methods: {
      stopScroll () {
        this.clearTimer()
        this.isScroll = false
      },
      continueScroll () {
        this.clearTimer()
        this.delayTimer = setTimeout(() => {
          this.isScroll = true
        }, this.delayTimerInterval)
      },
      clearTimer () {
        if (this.delayTimer) {
          clearTimeout(this.delayTimer)
        }
      },
      doCopy () {
        let text = this.$refs.logContainer.innerText

        this.$copyText(text).then((e) => {
          this.$message({message: '复制成功', type: 'success'})
        }, function (e) {
          this.$message({message: '复制失败', type: 'error'})
        })
      },
      doClean () {
        this.$refs.logContainer.innerHTML = ''
        this.currentRecord = 0
      },
      listenIpcRenderer () {
        this.$ipcRenderer.on('console-response', this.$options.name, log => {
          let p = document.createElement('p')
          p.innerHTML = log

          this.$refs.logContainer.appendChild(p)

          this.currentRecord++
          if (this.currentRecord > this.maxRecord) {
            this.currentRecord = this.maxRecord
            this.$refs.logContainer.removeChild(this.$refs.logContainer.firstChild)
          }

          if (this.isScroll) {
            this.$refs.logContainer.scrollTop = this.$refs.logContainer.scrollHeight
          }
        })
      },
      removeListenIpcRenderer () {
        this.$ipcRenderer.detach('console-response', this.$options.name)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .print {
    position: absolute;
    left: 10px;
    right: 0;
    top: 10px;
    bottom: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #555;

    .list {
      width: 100%;
      height: 100%;
      overflow: auto;
      overflow-x: hidden;
      user-select: text;

      /deep/ p {
        margin: 0;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

  .copy {
    position: absolute;
    right: 20px;
    top: 5px;
    z-index: 10;
  }
</style>
