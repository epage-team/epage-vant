<template lang="pug">
.ep-widget
  template(v-if="mode === 'display'")
    span {{displayValue}}
  template(v-else)
    van-field(
      readonly
      clickable
      :label='schema.label'
      :value='model[schema.key]'
      @click='showPicker = true'
    )
    van-popup(
      v-model='showPicker'
      round
      position='bottom'
    )
      van-picker(
        show-toolbar
        :columns='columns'
        @cancel='showPicker = false'
        @confirm='onConfirm'
      )
    //- van-picker(
    //-   v-if='schema.key'
    //-   :placeholder='schema.placeholder'
    //-   :disabled='schema.disabled'
    //-   :size='schema.size || rootSchema.size'
    //-   transfer
    //-   filterable
    //-   :clearable="schema.option.clearable"
    //-   :multiple='schema.option.multiple'
    //-   v-model='model[schema.key]'
    //-   @on-change="event('on-change', ...arguments)"
    //- )
    //-   Option(
    //-     v-for='(item, k) in options'
    //-     :key='k'
    //-     :value='item.key'
    //-   ) {{item.value}}
</template>
<script>
import viewExtend from '../../extends/view'
import dynamicMixins from '../../mixins/dynamicMixins'

export default {
  extends: viewExtend,
  mixins: [dynamicMixins],
  data () {
    return {
      showPicker: false,
      columns: ['北京', '天津', '南京', '上海', '深圳', '成都', '重庆', '西双版纳']
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
  methods: {
    onConfirm (value) {
      this.model[this.schema.key] = value
      this.showPicker = false
    }
  }
}
</script>
