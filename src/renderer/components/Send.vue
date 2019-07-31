<template>
  <div>
    <my-login-info></my-login-info>
    <div class="tabs-container" :style="tabsContainerStyle">
      <el-tabs tab-position="left" value="ping" class="el-tabs-height">
        <el-tab-pane label="心跳" name="ping">
          <jt-ping></jt-ping>
        </el-tab-pane>
        <el-tab-pane label="GPS信息" name="gps">
          <jt-gps></jt-gps>
        </el-tab-pane>
        <el-tab-pane label="透传" name="penetrate">
          <jt-penetrate></jt-penetrate>
        </el-tab-pane>
      </el-tabs>
    </div>
    <my-console @console-change="consoleChange" class="console"></my-console>
  </div>
</template>

<script>
  import MyLoginInfo from '@/components/base/MyLoginInfo'
  import MyConsole from '@/components/base/MyConsole'

  import JtPing from '@/components/jt808/JtPing'
  import JtGps from '@/components/jt808/JtGps'
  import JtPenetrate from '@/components/jt808/JtPenetrate'

  export default {
    name: 'Send',
    components: {
      MyLoginInfo,
      MyConsole,
      JtPing,
      JtGps,
      JtPenetrate
    },
    data () {
      return {
        tabsContainerStyle: {
          bottom: 0
        }
      }
    },
    methods: {
      consoleChange (height) {
        this.tabsContainerStyle.bottom = height + 'px'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tabs-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 50px;
    bottom: 0;
    z-index: 100;
  }

  .console {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 101;
  }

  .el-tabs-height {
    height: 100%;

    /deep/ .el-tabs__content {
      height: 100%;
      overflow: auto;
    }
  }

  .el-tabs-label-text {
    float: left;
    padding-right: 10px;
  }
</style>
