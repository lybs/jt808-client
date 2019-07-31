<template>
  <el-form :model="listForm" :rules="rules" ref="listForm">
    <el-form-item prop="selectedList">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="listForm.selectedList" @change="handleCheckedListChange">
        <el-row>
          <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="2" v-for="item in list" :key="item.id">
            <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.prevent="submitForm('listForm')">发送</el-button>
      <el-button @click.prevent="resetForm('listForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'JtSelectList',
    props: {
      list: {
        type: Array,
        required: true,
        validator: function (value) {
          return value.length >= 1
        }
      }
    },
    data () {
      return {
        checkAll: false,
        isIndeterminate: true,
        listForm: {
          selectedList: []
        },
        rules: {
          selectedList: [
            {type: 'array', required: true, message: '请至少勾选一个项', trigger: 'change'}
          ]
        }
      }
    },
    computed: {
      valueList () {
        return this.list.map((item) => {
          return item.id
        })
      }
    },
    methods: {
      handleCheckAllChange (val) {
        this.listForm.selectedList = val ? this.valueList : []
        this.isIndeterminate = false
      },
      handleCheckedListChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.valueList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.valueList.length
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return
          }

          this.$emit('change', this.listForm.selectedList)
        })
      },
      resetForm (formName) {
        this.checkAll = false
        this.isIndeterminate = true
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>
</style>
