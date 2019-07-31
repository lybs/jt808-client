<template>
  <el-form label-width="100px" :model="gpsForm" :rules="rules" ref="gpsForm">
    <el-form-item label="经度" prop="longitude">
      <el-input-number v-model="gpsForm.longitude" :precision="6" :step="0.00001" :min="0" :max="180"></el-input-number>
    </el-form-item>
    <el-form-item label="纬度" prop="latitude">
      <el-input-number v-model="gpsForm.latitude" :precision="6" :step="0.00001" :min="0" :max="90"></el-input-number>
    </el-form-item>
    <el-form-item label="海拔" prop="elevation">
      <el-input-number v-model="gpsForm.elevation" :precision="0" :step="1" :min="0" :max="10000"></el-input-number>
    </el-form-item>
    <el-form-item label="速度" prop="speed">
      <el-input-number v-model="gpsForm.speed" :precision="1" :step="0.1" :min="0" :max="240"></el-input-number>
    </el-form-item>
    <el-form-item label="方向" prop="direction">
      <el-input-number v-model="gpsForm.direction" :precision="0" :step="1" :min="0" :max="359"></el-input-number>
    </el-form-item>
    <el-form-item label="状态位" prop="statusField">
      <el-input v-model.trim="gpsForm.statusField" placeholder="请输入0和1组成的32位状态位" :maxlength="32" :style="{width: '300px'}"></el-input>
    </el-form-item>
    <el-form-item label="报警位" prop="warningFlagField">
      <el-input v-model.trim="gpsForm.warningFlagField" placeholder="请输入0和1组成的32位报警位" :maxlength="32" :style="{width: '300px'}"></el-input>
    </el-form-item>
    <el-form-item label="时间间隔(s)" prop="timeInterval">
      <el-input-number v-model="gpsForm.timeInterval" :precision="0" :step="1" :min="1" :max="86400"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.prevent="submitForm('gpsForm')">{{ sending ? '暂停': '发送' }}</el-button>
      <el-button @click.prevent="resetForm('gpsForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'JtGps',
    data () {
      let validateField = (rule, value, callback) => {
        if (!/^[0-1]{32}$/.test(value.trim())) {
          callback(new Error(rule['field'] === 'statusField' ? '请输入有效的状态位' : '请输入有效的报警位'))
        } else {
          callback()
        }
      }

      return {
        timer: null,
        sending: false,
        gpsForm: {
          timeInterval: 3,
          latitude: 22.663652,
          longitude: 114.055175,
          elevation: 60,
          speed: 50,
          direction: 180,
          statusField: '00000000000000000000000000000010',
          warningFlagField: '00000000000000000000000000000000'
        },
        rules: {
          timeInterval: [
            {required: true, message: '请输入有效的时间间隔', trigger: 'blur'}
          ],
          latitude: [
            {required: true, message: '请输入有效的纬度', trigger: 'blur'}
          ],
          longitude: [
            {required: true, message: '请输入有效的经度', trigger: 'blur'}
          ],
          elevation: [
            {required: true, message: '请输入有效的海拔', trigger: 'blur'}
          ],
          speed: [
            {required: true, message: '请输入有效的速度', trigger: 'blur'}
          ],
          direction: [
            {required: true, message: '请输入有效的方向', trigger: 'blur'}
          ],
          statusField: [
            {required: true, validator: validateField, trigger: 'blur'}
          ],
          warningFlagField: [
            {required: true, validator: validateField, trigger: 'blur'}
          ]
        }
      }
    },
    beforeDestroy () {
      this.clearSendTimer()
    },
    watch: {
      sending: 'sendTimer',
      gpsForm: {
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
      resetForm (formName) {
        this.sending = false
        this.$refs[formName].resetFields()
      },
      sendTimer () {
        this.clearSendTimer()

        if (!this.sending) {
          return
        }

        let params = {
          latitude: parseFloat(this.gpsForm.latitude),
          longitude: parseFloat(this.gpsForm.longitude),
          elevation: parseInt(this.gpsForm.elevation),
          speed: parseFloat(this.gpsForm.speed),
          direction: parseInt(this.gpsForm.direction),
          statusField: this.gpsForm.statusField.trim(),
          warningFlagField: this.gpsForm.warningFlagField.trim()
        }

        this.$ipcRenderer.emit('gps-request', params)

        this.timer = setInterval(() => {
          this.$ipcRenderer.emit('gps-request', params)
        }, this.gpsForm.timeInterval * 1000)
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
