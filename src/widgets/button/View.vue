<template lang="pug">
.ep-widget
  van-button(
    :loading='loading'
    :icon='schema.option.icon'
    :type='getType()'
    :disabled='schema.disabled'
    :size='getSize()'
    :block='schema.option.long'
    :plain='isGhost()'
    :square='getShape().square'
    :round='getShape().round'
    @click="onClick"
  ) {{schema.option.text}}
</template>
<script>
import { Script, Context } from 'epage-core'
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend,
  data () {
    return {
      loading: false
    }
  },
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
    },
    onClick () {
      const { script } = this.schema.option
      const { store, $el } = this
      const { $render } = this.$root.$options.extension
      const ctx = new Context({
        $el,
        $render,
        store,
        instance: this,
        state: {
          loading: this.loading
        }
      })
      const sc = new Script(ctx)
      sc.exec(script)
      this.event('on-click', ...arguments)
    }
  }
}
</script>
