<template>
  <div id="app" class="app">
    <el-dialog :visible.sync="dialogVisible" width="35%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" top="40vh" class="el-dialog-style">
      <el-alert title="温馨提示" type="warning" :closable="false" :description="tips" show-icon></el-alert>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
  import getWorkTime from './api/getWorkTime'

  export default {
    name: 'App',
    data () {
      return {
        dialogVisible: false,
        isWorkingStatus: true,
        tips: '非工作时间，注意休息。'
      }
    },
    mounted () {
      this.workTimeLimit()
      this.listenIpcRenderer()
    },
    methods: {
      workTimeLimit () {
        getWorkTime((isWorkingTime, isExpired) => {
          if (isWorkingTime) {
            if (!this.isWorkingStatus) {
              this.isWorkingStatus = true
              this.dialogVisible = false
            }
            return
          }

          if (this.isWorkingStatus) {
            this.isWorkingStatus = false

            this.$ipcRenderer.emit('close-console-request')
            this.$ipcRenderer.emit('disconnect-request')

            this.$router.replace({
              path: '/'
            })

            if (isExpired) {
              this.tips = '软件已过期，请联系该软件拥有者索要最新安装包。'
            }
            this.dialogVisible = true
          }
        })
      },
      listenIpcRenderer () {
        this.$ipcRenderer.on('connect-response', this.$options.name, status => {
          if (this.$route.path === '/' || this.$route.path === '/console') {
            return
          }

          if (status) {
            return
          }

          this.$loading().close()
          this.$alert('TCP链接已断开', '提示', {
            type: 'error',
            confirmButtonText: '确定',
            callback: action => {
              this.$router.replace({
                path: '/'
              })
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-dialog-style {
    /deep/ .el-dialog__header {
      height: 0;
      padding: 0;
      overflow: hidden;
    }
    /deep/ .el-dialog__body {
      background-color: #fdf6ec;
    }
  }
</style>
