<template>
  <el-form label-width="100px" :model="pingForm" :rules="rules" :inline="true" ref="pingForm">
    <el-form-item label="时间间隔(s)" prop="timeInterval">
      <el-input-number v-model="pingForm.timeInterval" :precision="0" :step="1" :min="1" :max="86400"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.prevent="submitForm('pingForm')">{{ sending ? '暂停': '发送' }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'JtPing',
    data () {
      return {
        timer: null,
        sending: false,
        pingForm: {
          timeInterval: 10
        },
        rules: {
          timeInterval: [
            {required: true, message: '请输入有效的时间间隔', trigger: 'blur'}
          ]
        }
      }
    },
    beforeDestroy () {
      this.clearSendTimer()
    },
    watch: {
      sending: 'sendTimer',
      pingForm: {
        handler: 'sendTimer',
        deep: true
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sending = !this.sending
          }
        })
      },
      sendTimer () {
        this.clearSendTimer()

        if (!this.sending) {
          return
        }

        this.$ipcRenderer.emit('ping-request')

        this.timer = setInterval(() => {
          this.$ipcRenderer.emit('ping-request')
        }, this.pingForm.timeInterval * 1000)
      },
      clearSendTimer () {
        if (this.timer) {
          clearInterval(this.timer)
        }
      }
    }
  }
</script>

<style scoped>
</style>
