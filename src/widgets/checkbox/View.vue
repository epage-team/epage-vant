<template lang="pug">
.epvan-widget
  epvan-field(v-if='isDisplay' :required='required' :help='schema.help' :label='schema.label')
    van-field(
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        div
          span(v-if='displayValue') {{displayValue}}

  epvan-field(v-else :required='required' :help='schema.help' :label='schema.label')
    van-field(
      :rules='rules[schema.key]'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-checkbox-group(
          v-model='model[schema.key]'
          :direction='schema.option.direction'
          @change="event('on-change', ...arguments)"
        )
          van-checkbox(
            v-for='(item, k) in options || []'
            :disabled='schema.disabled'
            :key='k'
            :name='item.key'
            shape='square'
          ) {{item.value}}
</template>
<script>
import viewExtend from '../../extends/view'
import dynamicMixins from '../../mixins/dynamicMixins'

export default {
  extends: viewExtend,
  mixins: [dynamicMixins],
  computed: {
    displayValue () {
      const value = this.model[this.schema.key]
      let result = []

      result = value ? value.map(item => {
        const option = this.options.find(option => option.key === item)

        return !!option && option.value
      }) : []

      return result + ''
    }
  }
}
</script>
