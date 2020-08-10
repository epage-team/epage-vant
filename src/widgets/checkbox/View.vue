<template lang="pug">
.ep-widget
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
      div
        span(v-if='displayValue') {{displayValue}}

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
