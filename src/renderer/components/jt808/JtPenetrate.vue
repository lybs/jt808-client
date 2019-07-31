<template>
  <el-form :model="penetrateForm" :rules="rules" ref="penetrateForm" class="penetrate-form">
    <el-form-item prop="content">
      <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 12}" placeholder="请输入透传内容" v-model.trim="penetrateForm.content"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.prevent="submitForm('penetrateForm')">发送</el-button>
      <el-button @click.prevent="resetForm('penetrateForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'JtPenetrate',
    data () {
      let validateField = (rule, value, callback) => {
        if (!/^7E[0-9A-Fa-f]+7E$/.test(value.trim())) {
          callback(new Error('请输入有效的透传内容'))
        } else {
          callback()
        }
      }

      return {
        penetrateForm: {
          content: ''
        },
        rules: {
          content: [
            {required: true, validator: validateField, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return
          }

          this.$ipcRenderer.emit('penetrate-request', {content: this.penetrateForm.content.trim()})
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .penetrate-form {
    padding-right: 10px;
  }
</style>
