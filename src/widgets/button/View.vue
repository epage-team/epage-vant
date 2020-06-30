<template lang="pug">
.ep-widget
  van-button(
    :icon='schema.option.icon'
    :type='getType()'
    :disabled='schema.disabled'
    :size='getSize()'
    :block='schema.option.long'
    :plain='isGhost()'
    :square='getShape().square'
    :round='getShape().round'
    @click="event('on-click', ...arguments)"
  ) {{schema.option.text}}
</template>
<script>
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend,
  methods: {
    // 兼容iview@3 按钮ghost类型
    getType () {
      const { type } = this.schema.option

      return type === 'ghost' ? 'default' : type
    },
    getSize () {
      const size = this.schema.size || this.rootSchema.size

      return (!size || size === 'default') ? 'normal' : size
    },
    getShape () {
      const { shape } = this.schema.option
      const isCircle = shape === 'circle'

      return {
        square: !isCircle,
        round: isCircle
      }
    },
    isGhost () {
      const { type, ghost } = this.schema.option

      return type === 'ghost' || Boolean(ghost)
    }
  }
}
</script>
