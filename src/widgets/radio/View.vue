<template lang="pug">
.epvan-widget.epvan-radio
  epvan-field(v-if='isDisplay' :required='required' :schema='schema')
    van-field(
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        span(v-if='displayValue') {{displayValue}}
        span.epvan-placeholder(v-else) {{schema.placeholder}}

  epvan-field(v-else :required='required' :schema='schema')
    van-field(
      :rules='rules[schema.key]'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-radio-group(
          :disabled='schema.disabled'
          :size='schema.size || rootSchema.size'
          :direction='schema.option.direction'
          v-model='model[schema.key]'
          @change="event('on-change', ...arguments)"
        )
          van-radio(
            v-for='(item, k) in options || []'
            :key='item.key'
            :name='item.key'
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
      const result = this.options
        .filter(item => item.key === value)
        .map(item => item.value)

      return result + ''
    }
  }
}
</script>
