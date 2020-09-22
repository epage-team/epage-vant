<template lang="pug">
.epvan-popup
  .epvan-popup-header
    .epvan-popup-title {{title}}
    .epvan-popup-btns
      .epvan-popup-btn.cancel(size='small' @click='onCancel') 取消
      .epvan-popup-btn.ok(size='small' @click='onOk') 确定
  .epvan-popup-body
    slot
</template>
<script>

export default {
  props: {
    title: {
      type: String,
      default: '标题'
    }
  },
  methods: {
    onOk () {
      this.$emit('on-ok')
    },
    onCancel () {
      this.$emit('on-cancel')
    }
  }
}
</script>
