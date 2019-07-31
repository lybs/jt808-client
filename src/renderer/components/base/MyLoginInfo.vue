<template>
  <div class="info" v-if="isLogged">
    <span>序列号：{{serialNo}}</span>
    <el-button type="danger" size="mini" @click.prevent="logOut">退出</el-button>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'MyLoginInfo',
    computed: {
      ...mapGetters(['serialNo', 'isLogged'])
    },
    mounted () {
      if (!this.isLogged) {
        this.logOut()
      }
    },
    methods: {
      ...mapActions(['setLoginInfo']),
      logOut () {
        this.setLoginInfo({
          serialNo: null,
          isLogged: false
        })
        this.$ipcRenderer.emit('disconnect-request')
        this.$router.replace({
          path: '/'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .info {
    width: 100%;
    min-width: 320px;
    padding: 6px;
    box-sizing: border-box;
    background-color: #fff;
    text-align: right;
    border-bottom: 1px solid #ddd;

    & > span {
      font-size: 14px;
      padding-right: 10px;
      user-select: text;
    }
  }
</style>
