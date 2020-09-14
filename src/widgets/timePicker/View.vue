<template lang="pug">
.epvan-widget.epvan-timePicker
  //- display mode
  epvan-field(v-if='isDisplay' :required='required' :help='schema.help' :label='schema.label')
    van-field(
      :disable='schema.disabled'
      :value='model[schema.key].toString()'
      :name='schema.name'
      :size='rootSchema.size'
    )
      template(#input)
        date-time-display(
          :schema='schema'
          :value='model[schema.key]'
        )

  //- edit mode
  epvan-field(v-else :required='required' :help='schema.help' :label='schema.label')
    van-field(
      :disable='schema.disabled'
      :rules='widgetRules'
      :value='model[schema.key].toString()'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        date-time-display(
          :schema='schema'
          :value='model[schema.key]'
          @on-show='onShowPicker'
        )
  van-popup(
    v-model='showPicker'
    round
    position='bottom'
  )
    van-datetime-picker(
      v-model='pickerTime'
      type='time'
      :formatter='formatter'
      :filter='filter'
      @cancel='showPicker = false'
      @confirm='onConfirm'
    )
</template>
<script>
import { Toast } from 'vant'
import { helper } from 'epage-core'
import viewExtend from '../../extends/view'
import DateTimeDisplay from '../../components/DateTimeDisplay'

const { isNumber, isArray } = helper

const dateMap = {
  hour: '时',
  minute: '分'
}

export default {
  components: {
    DateTimeDisplay
  },
  extends: viewExtend,
  data () {
    return {
      valueIndex: -1,
      showPicker: false,
      pickerTime: ''
    }
  },
  computed: {
    widgetRules () {
      const { key, option } = this.schema
      const rules = this.rules[key]
      const { range } = option
      const value = this.model[key]

      const newRules = rules.map(rule => {
        rule.validator = function () {
          if (!this.required) return true
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
      if (this.isDisplay) return
      const { range } = this.schema.option
      const value = this.model[this.schema.key]

      if (range && valueIndex !== 0 && !value[0]) {
        return Toast('请先选择开始时间')
      }
      this.valueIndex = range ? valueIndex : -1
      this.showPicker = true
    },

    formatter (type, val) {
      if (type in dateMap) {
        return val + dateMap[type]
      }
      return val
    },

    filter (type, options) {
      const { range } = this.schema.option
      const value = this.model[this.schema.key]

      if (!range) return options
      if (this.valueIndex !== 1) return options
      const [hour] = this.getTime(value[0])
      if (type === 'hour') {
        return options.filter((option) => parseInt(option) >= hour)
      }

      return options
    },

    getTime (timeStr = '') {
      const list = timeStr.match(/\d+[^:]/g) || []
      return list.map(v => parseInt(v))
    },

    onConfirm (value) {
      const { key } = this.schema
      const oldValue = this.model[key]

      // 时间点
      if (this.valueIndex === -1) {
        if (value !== oldValue) {
          this.store.updateModel({ [key]: value })
          this.event('on-change', ...arguments)
        }
      // 时间区间，选择开始时间时
      } else if (this.valueIndex === 0) {
        const newValueArr = [...oldValue]
        const [hour1, minute1] = this.getTime(oldValue[1])
        const [hour2, minute2] = this.getTime(value)
        if (isNumber(hour1) && isNumber(minute1)) {
          if (hour2 > hour1 || (hour2 === hour1 && minute2 > minute1)) {
            newValueArr.splice(1)
          }
        }

        if (value !== oldValue[this.valueIndex]) {
          newValueArr[this.valueIndex] = value

          this.store.updateModel({ [key]: newValueArr })
          this.event('on-change', ...arguments)
        }

      // 时间区间，选择结束时间时
      } else if (this.valueIndex === 1) {
        const newValueArr = [...oldValue]
        const minute1 = this.getTime(oldValue[0])[1]
        const minute2 = this.getTime(value)[1]
        if (minute2 < minute1) {
          Toast('结束时间不能小于开始时间')
          return
        }
        if (value !== oldValue[this.valueIndex]) {
          newValueArr[this.valueIndex] = value

          this.store.updateModel({ [key]: newValueArr })
          this.event('on-change', ...arguments)
        }
      }

      this.showPicker = false
    }
  }
}
</script>
