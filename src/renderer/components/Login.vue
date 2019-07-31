<template>
  <el-form label-width="100px" :model="loginForm" :rules="rules" ref="loginForm" class="center-from">
    <el-form-item label="TCP地址" prop="host">
      <el-select v-model="loginForm.host" placeholder="请选择TCP地址" :style="{display: 'block'}" @change="serverSelect">
        <el-option v-for="(item, key, index) in serverList" :label="item['name']" :value="key" :key="index"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="端口" prop="port">
      <el-input v-model.trim="loginForm.port" placeholder="请输入0~65535整数" maxlength="5"></el-input>
    </el-form-item>
    <el-form-item label="序列号" prop="serialNo">
      <el-input v-model.trim="loginForm.serialNo" maxlength="12" placeholder="请输入12位序列号" @change="serialNoChange"></el-input>
    </el-form-item>
    <el-form-item label="鉴权码" prop="authCode">
      <el-input v-model.trim="loginForm.authCode" maxlength="32" placeholder="请输入32位鉴权码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.prevent="submitForm('loginForm')">登录</el-button>
      <el-button @click.prevent="resetForm('loginForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapActions} from 'vuex'
  import {serverList} from '../../constants/config'

  export default {
    name: 'Login',
    data () {
      let validatePort = (rule, value, callback) => {
        if (!/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value.toString().trim())) {
          callback(new Error('请输入有效的端口'))
        } else {
          callback()
        }
      }
      let validateSerialNo = (rule, value, callback) => {
        if (!/^[1-9]\d{11}$/.test(value.trim())) {
          callback(new Error('请输入有效的序列号'))
        } else {
          callback()
        }
      }
      let validateAuthCode = (rule, value, callback) => {
        if (!/^[0-9a-z]{32}$/.test(value.trim())) {
          callback(new Error('请输入有效的鉴权码'))
        } else {
          callback()
        }
      }
      return {
        serverList: serverList,
        loginForm: {
          host: '',
          port: '',
          serialNo: '',
          authCode: ''
        },
        rules: {
          host: [
            {required: true, message: '请输入有效的TCP地址', trigger: 'change'}
          ],
          port: [
            {required: true, validator: validatePort, trigger: 'blur'}
          ],
          serialNo: [
            {required: true, validator: validateSerialNo, trigger: 'blur'}
          ],
          authCode: [
            {required: true, validator: validateAuthCode, trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.logout()
      this.initForm()
      this.listenIpcRenderer()
    },
    destroyed () {
      this.removeListenIpcRenderer()
    },
    methods: {
      ...mapActions(['setLoginInfo']),
      serverSelect (host) {
        this.initForm(host)
      },
      serialNoChange (serialNo) {
        let loginFormSerialNoList = this.$localStorageCache.get('loginFormSerialNoList')
        if (loginFormSerialNoList && loginFormSerialNoList[serialNo]) {
          this.loginForm.authCode = loginFormSerialNoList[serialNo]
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return
          }

          this.$loading({background: 'rgba(0, 0, 0, 0.7)'})
          this.$ipcRenderer.emit('connect-request', {
            host: this.loginForm.host.trim(),
            port: parseInt(this.loginForm.port),
            isUTC: this.serverList[this.loginForm.host]['isUTC']
          })
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      listenIpcRenderer () {
        this.$ipcRenderer.on('connect-response', this.$options.name, status => {
          if (!status) {
            this.$loading().close()
            this.$message({message: 'TCP链接失败', type: 'error'})
            return
          }

          this.$ipcRenderer.emit('login-request', {
            serialNo: this.loginForm.serialNo.trim(),
            authCode: this.loginForm.authCode.trim()
          })
        })

        this.$ipcRenderer.on('login-response', this.$options.name, res => {
          this.$loading().close()

          if (res === 0 || res === 6) {
            this.login(this.loginForm.serialNo)
            this.$router.replace({
              path: '/send'
            })
            return
          }

          switch (res) {
            case -1:
              this.$message({message: '登录超时', type: 'error'})
              break
            case 1:
              this.$message({message: '登录失败', type: 'error'})
              break
            case 2:
              this.$message({message: '登录信息有误', type: 'error'})
              break
            case 3:
              this.$message({message: '不支持登录', type: 'error'})
              break
            case 7:
              this.$message({message: '未注册', type: 'error'})
              break
            case 8:
              this.$message({message: '已注册', type: 'error'})
              break
            case 9:
              this.$message({message: 'SE密钥交换成功', type: 'error'})
              break
            case 10:
              this.$message({message: 'SE密钥交换失败', type: 'error'})
              break
            case 11:
              this.$message({message: '加密设备', type: 'error'})
              break
          }
        })
      },
      removeListenIpcRenderer () {
        this.$ipcRenderer.detach('connect-response', this.$options.name)
        this.$ipcRenderer.detach('login-response', this.$options.name)
      },
      initForm (host = '') {
        let port = ''
        let serialNo = ''
        let authCode = ''

        let loginFormInfo = this.$localStorageCache.get('loginFormInfo')

        if (loginFormInfo) {
          if ((!host && loginFormInfo['current'] && this.serverList[loginFormInfo['current']]) || (host && loginFormInfo[host])) {
            host = host || loginFormInfo['current']

            port = loginFormInfo[host]['port']
            serialNo = loginFormInfo[host]['serialNo']
            authCode = loginFormInfo[host]['authCode']
          } else if (host) {
            port = this.serverList[host]['port']
          }
        } else if (host) {
          port = this.serverList[host]['port']
        }

        this.loginForm.host = host
        this.loginForm.port = port
        this.loginForm.serialNo = serialNo
        this.loginForm.authCode = authCode
      },
      logout () {
        this.setLoginInfo({
          serialNo: null,
          isLogged: false
        })
      },
      login (serialNo) {
        this.setLoginInfo({
          serialNo: serialNo,
          isLogged: true
        })

        let loginFormInfo = this.$localStorageCache.get('loginFormInfo') || {}
        loginFormInfo['current'] = this.loginForm.host
        loginFormInfo[this.loginForm.host] = {
          port: this.loginForm.port,
          serialNo: this.loginForm.serialNo,
          authCode: this.loginForm.authCode
        }
        this.$localStorageCache.set('loginFormInfo', loginFormInfo)

        let loginFormSerialNoList = this.$localStorageCache.get('loginFormSerialNoList') || {}
        loginFormSerialNoList[this.loginForm.serialNo] = this.loginForm.authCode
        this.$localStorageCache.set('loginFormSerialNoList', loginFormSerialNoList)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .center-from {
    width: 500px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    box-sizing: border-box;
  }
</style>
