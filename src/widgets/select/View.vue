<template lang="pug">
.ep-widget
  template(v-if="mode === 'display'")
    span {{displayValue}}
  template(v-else)
    van-field(
      readonly
      clickable
      :label='schema.label'
      :placeholder='schema.placeholder'
      :value='formModel'
      :required='required'
      @click='showPicker = true'
    )
      template(#input) 11
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
        result = !value ? value.map(item => {
          const option = this.options.find(option => option.key === item)

          return !!option && option.value
        }) : []
      } else {
        const option = this.options.find(option => option.key === value)

        result = option !== undefined ? option.value : []
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
      this.model[this.schema.key] = value.key
      this.showPicker = false
    }
  }
}
</script>
