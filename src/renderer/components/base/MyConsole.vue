<template>
  <div>
    <div @click="toggleConsole" :style="btnStyle" class="btn">
      <i :class="btnIcon"></i>
      console
    </div>
    <div v-show="isExpand">
      <div @mousedown="barMouseDown" ref="bar" :style="barExternalStyle" class="bar">
        <span :style="barInternalStyle"></span>
      </div>
      <div :style="containerStyle">
        <my-print></my-print>
      </div>
    </div>
  </div>
</template>

<script>
  import MyPrint from './MyPrint'

  export default {
    name: 'MyConsole',
    components: {
      MyPrint
    },
    props: {
      minHeight: {
        type: Number,
        default: 150
      },
      maxHeight: {
        type: Number,
        default: 400
      },
      lineSize: {
        type: Number,
        default: 1
      },
      linePadding: {
        type: Number,
        default: 10
      }
    },
    data () {
      return {
        isExpand: false,
        barClientY: null,
        barDragging: false,
        consoleHeight: 0,
        consoleTempHeight: null
      }
    },
    computed: {
      barHeight () {
        return this.lineSize
      },
      barPadding () {
        return this.linePadding
      },
      consoleMinHeight () {
        return this.minHeight
      },
      consoleMaxHeight () {
        return this.maxHeight
      },
      btnIcon () {
        return this.isExpand ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
      },
      btnStyle () {
        return {
          bottom: this.consoleHeight + 'px'
        }
      },
      barExternalStyle () {
        return {
          padding: this.barPadding + 'px' + ' 0',
          bottom: (this.consoleHeight - this.barPadding) + 'px'
        }
      },
      barInternalStyle () {
        return {
          height: this.barHeight + 'px'
        }
      },
      containerStyle () {
        return {
          height: this.consoleHeight + 'px'
        }
      }
    },
    methods: {
      toggleConsole () {
        this.isExpand = !this.isExpand
        this.consoleChange(this.isExpand ? this.consoleMinHeight : 0)
      },
      consoleChange (height) {
        this.consoleHeight = height
        this.$emit('console-change', this.consoleHeight)
      },
      barMouseDown (event) {
        this.barClientY = event.clientY
        this.barDragging = true
        this.consoleTempHeight = this.consoleHeight

        document.addEventListener('mousemove', this.documentMouseMove)
        document.addEventListener('mouseup', this.documentMouseUp)
      },
      documentMouseMove (event) {
        if (this.barDragging) {
          let clientY = event.clientY

          if (this.barClientY && this.consoleTempHeight) {
            let tempHeight = this.consoleTempHeight + this.barClientY - clientY
            if (this.consoleMaxHeight < tempHeight || tempHeight < this.consoleMinHeight) {
              return
            }
            this.consoleChange(tempHeight)
          }
        }
      },
      documentMouseUp () {
        this.barClientY = null
        this.barDragging = false
        this.consoleTempHeight = null

        document.removeEventListener('mousemove', this.documentMouseMove)
        document.removeEventListener('mouseup', this.documentMouseUp)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    position: absolute;
    z-index: 2;
    padding: 2px 6px;
    background-color: #e5e5e5;
    font-size: 13px;
    cursor: pointer;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid #d3d4d6;
    color: #909399;
  }

  .bar {
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 1;
    overflow: hidden;
    cursor: s-resize;

    span {
      display: block;
      background-color: #ddd;
      overflow: hidden;
    }
  }
</style>
