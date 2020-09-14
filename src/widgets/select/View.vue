<template lang="pug">
.epvan-widget
  epvan-field(v-if='isDisplay' :required='required' :help='schema.help' :label='schema.label')
    van-field(
      readonly
      :value='formModel'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        div
          span(v-if='formModel') {{displayValue}}
          .epvan-placeholder(v-else) {{schema.placeholder}}
  epvan-field(v-else :required='required' :help='schema.help' :label='schema.label')
    van-field(
      readonly
      clickable
      :placeholder='schema.placeholder'
      :value='formModel'
      :rules='rules[schema.key]'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        div(@click='showPicker = true')
          span(v-if='formModel') {{displayValue}}
          .epvan-placeholder(v-else) {{schema.placeholder}}
  van-popup(
    v-model='showPicker'
    round
    position='bottom'
  )
    van-picker(
      show-toolbar
      :columns='options'
      value-key='value'
      @cancel='showPicker = false'
      @confirm='onConfirm'
    )

</template>
<script>
import viewExtend from '../../extends/view'
import dynamicMixins from '../../mixins/dynamicMixins'

export default {
  extends: viewExtend,
  mixins: [dynamicMixins],
  data () {
    return {
      formModel: '',
      showPicker: false
    }
  },
  computed: {
    displayValue () {
      const { multiple } = this.schema.option
      const value = this.model[this.schema.key]
      let result = []

      if (multiple) {
        if (Array.isArray(value)) {
          result = value.map(item => {
            const option = this.options.find(o => o.key === item)

            return option ? option.value : ''
          })
        }
      } else {
        const option = this.options.find(o => o.key === value)

        result = option ? [option.value] : []
      }
      return result + ''
    }
  },
  watch: {
    model: {
      handler (mod) {
        const { key } = this.schema
        const value = mod[key]
        const opt = this.options.filter(o => o.key === value)[0]
        if (opt) {
          this.formModel = opt.value
        }
      },
      deep: true
    }
  },
  methods: {
    onConfirm (value) {
      this.store.updateModel({ [this.schema.key]: value.key })
      this.event('on-change', ...arguments)
      this.showPicker = false
    }
  }
}
</script>
