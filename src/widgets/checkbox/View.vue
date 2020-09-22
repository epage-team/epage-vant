<template lang="pug">
.epvan-widget.epvan-checkbox
  epvan-field(v-if='isDisplay' :required='required' :schema='schema')
    van-field(
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        div
          span(v-if='displayValue') {{displayValue}}

  epvan-field(v-else :required='required' :schema='schema')
    van-field(
      :rules='rules[schema.key]'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
      :error-message='error.message'
    )
      template(#input)
        van-checkbox-group(
          v-model='model[schema.key]'
          :direction='schema.option.direction'
          @change="onChange"
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
  data () {
    return {
      error: {
        message: ''
      }
    }
  },
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
  },
  methods: {
    onChange () {
      const rule = this.schema.rules[0] || {}
      this.validate()
        .then(() => {
          this.error.message = ''
        }, () => {
          this.error.message = rule.message
        })
      this.event('on-change', ...arguments)
    },
    validate () {
      const { $render } = this.$root.$options.extension
      return $render.validateFields(this.schema.name)
    }
  }
}
</script>
