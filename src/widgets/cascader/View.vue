<template lang="pug">
.epvan-widget
  epvan-field(v-if='isDisplay' :required='required' :schema='schema')
    van-field(
      readonly
      :rules='cascaderRules'
      :value='displayValue'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        span(v-if='displayValue') {{displayValue}}
        span.epvan-placeholder(v-else) {{schema.placeholder}}
  epvan-field(v-else :required='required' :schema='schema')
    van-field(
      readonly
      clickable
      :placeholder='schema.placeholder'
      :rules='cascaderRules'
      :value='displayValue'
      @click='showPicker = true'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        span(v-if='displayValue') {{displayValue}}
        span.epvan-placeholder(v-else) {{schema.placeholder}}
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
      showPicker: false
    }
  },
  computed: {
    displayValue () {
      const { delimiter = '/' } = this.schema.option
      const rawValue = this.model[this.schema.key]
      const labels = this.getListByKeys(rawValue, this.options, 'key', 'value')
      return labels.join(delimiter)
    },
    cascaderRules () {
      const rules = this.rules[this.schema.key]
      const result = rules.map(rule => {
        const { pattern, validator, ...others } = rule
        others.validator = function (value, rule) {
          if (!this.required) return true
          return !!value
        }
        return others
      })
      return result
    }
  },
  watch: {
    model: {
      handler (mod) {
        const { key } = this.schema
        const value = mod[key]
        if (value) {
          this.formModel = value
        }
      },
      deep: true
    }
  },
  methods: {
    getListByKeys (keys, options = [], name1, name2) {
      const list = []
      if (keys.length === 0) return list
      for (const item of options) {
        if (item[name1] === keys[0]) {
          list.push(item[name2])
          return list.concat(this.getListByKeys(keys.slice(1), item.children, name1, name2))
        }
      }
      return list
    },
    onConfirm (value) {
      const keys = this.getListByKeys(value, this.options, 'value', 'key')
      this.store.updateModel({ [this.schema.key]: keys })
      this.event('on-change', ...arguments)
      this.showPicker = false
    }
  }
}
</script>
