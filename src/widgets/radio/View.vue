<template lang="pug">
.ep-widget.epvan-radio
  van-field(
    v-if='isDisplay'
    :name='schema.name'
    :label='schema.label'
    :required='required'
    :size='rootSchema.size'
    :left-icon='schema.help ? "info-o" : undefined'
    @click-left-icon='onHelpClick'
  )
    template(#input)
      span(v-if='displayValue') {{displayValue}}
      span.epvan-placeholder(v-else) {{schema.placeholder}}

  template(v-else)
    van-field(
      :rules='rules[schema.key]'
      :name='schema.name'
      :label='schema.label'
      :required='required'
      :size='rootSchema.size'
      :left-icon='schema.help ? "info-o" : undefined'
      @click-left-icon='onHelpClick'
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
