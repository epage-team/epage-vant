<template lang="pug">
.ep-widget.epvan-datePicker
  template(v-if='mode === "display"')
    span {{model[schema.key]}}

  template(v-else)
    van-field(
      :name='schema.name'
      :label='schema.label'
      :required='required'
      :disable='schema.disabled'
      :value='model[schema.key].toString()'
      :rules='widgetRules'
    )
      template(#input)
        div(v-if='schema.option.range')
          template(v-if='model[schema.key]')
            .epvan-timePicker-handle(@click='onShowPicker(0)')
              div(v-if='model[schema.key][0]') {{model[schema.key][0]}}
              .epvan-placeholder(v-else) {{schema.placeholder || 'please select'}}
            .epvan-datePicker-mid 至
            .epvan-timePicker-handle(@click='onShowPicker(1)')
              div(v-if='model[schema.key][1]') {{model[schema.key][1]}}
              .epvan-placeholder(v-else) {{schema.placeholder || 'please select'}}
        div(v-else  @click='onShowPicker')
          div(v-if='model[schema.key]') {{model[schema.key]}}
          div.epvan-placeholder(v-else) {{schema.placeholder || 'please select'}}
    van-popup(
      v-model='showPicker'
      round
      position='bottom'
    )
      van-datetime-picker(
        v-model='currentDate'
        :min-date='minDate'
        :max-date='maxDate'
        :type='getType()'
        :formatter='formatter'
        :filter='filter'
        @cancel='showPicker = false'
        @confirm='onConfirm'
      )
</template>
<script>
import viewExtend from '../../extends/view'
import Epage from 'epage'

const { isArray } = Epage.helper

const { include, formatDate } = Epage.helper
const timeOptions = ['HH:mm:ss', 'HH:mm', 'mm:ss']
const monthOptions = ['yyyy-MM', 'yyyy/MM']
const dateMap = {
  year: '年',
  month: '月',
  day: '日',
  hour: '时',
  minute: '分'
}

export default {
  extends: viewExtend,
  data () {
    return {
      valueIndex: -1,
      showPicker: false,
      currentDate: new Date(),
      minDate: new Date(1949, 9, 1),
      maxDate: new Date(2035, 10, 1)
    }
  },
  computed: {
    widgetRules () {
      const { key, option } = this.schema
      const rules = this.rules[key]
      const { range } = option
      const value = this.model[key]
      if (!this.required) return true

      const newRules = rules.map(rule => {
        rule.validator = function () {
          if (!range) return !!value
          return isArray(value) ? value.filter(_ => _).length === 2 : false
        }
        return rule
      })
      return newRules
    }
  },
  methods: {
    onShowPicker (valueIndex) {
      const { range } = this.schema.option

      if (range) {
        this.valueIndex = valueIndex
      } else {
        this.valueIndex = -1
      }
      this.showPicker = true
    },
    hasTime (format) {
      return !!timeOptions.filter(t => include(format, t)).length
    },

    isMonth (format) {
      return !!monthOptions.filter(t => include(format, t)).length && !include(format, 'dd')
    },

    formatter (type, val) {
      if (type in dateMap) {
        return val + dateMap[type]
      }
      return val
    },
    filter (type, options) {
      const { format } = this.schema.option

      if (format === 'yyyy') {
        if (type === 'month') {
          return []
        }
      }
      return options
    },

    getType () {
      const { format } = this.schema.option
      let type = 'date'

      if (format === 'yyyy') {
        type = 'year-month'
      } else if (this.isMonth(format)) {
        type = 'year-month'
      } else if (this.hasTime(format)) {
        type = 'datetime'
      } else {
        type = 'date'
      }
      return type
    },
    onConfirm (value) {
      const oldValue = this.model[this.schema.key]
      const newValue = formatDate(value, this.schema.option.format)

      if (this.valueIndex === -1) {
        if (newValue !== oldValue) {
          this.store.updateModel({ [this.schema.key]: newValue })
          this.event('on-change', ...arguments)
        }
      } else {
        const newValueArr = [...oldValue]
        if (newValue !== oldValue[this.valueIndex]) {
          newValueArr[this.valueIndex] = newValue
          this.store.updateModel({ [this.schema.key]: newValueArr })
          this.event('on-change', ...arguments)
        }
      }

      this.showPicker = false
    }
  }
}
</script>
