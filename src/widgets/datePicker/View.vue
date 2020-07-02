<template lang="pug">
.ep-widget.epvan-datePicker
  //- display mode
  van-field(
    v-if='isDisplay'
    :disable='schema.disabled'
    :name='schema.name'
    :label='schema.label'
    :required='required'
    :size='rootSchema.size'
    :left-icon='schema.help ? "info-o" : undefined'
    @click-left-icon='onHelpClick'
  )
    template(#input)
      date-time-display(
        :schema='schema'
        :value='model[schema.key]'
        @on-show='onShowPicker'
      )
  //- edit mode
  van-field(
    v-else
    :name='schema.name'
    :label='schema.label'
    :required='required'
    :disable='schema.disabled'
    :value='model[schema.key].toString()'
    :rules='widgetRules'
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
import Epage from 'epage'
import { Toast } from 'vant'
import viewExtend from '../../extends/view'
import DateTimeDisplay from '../../components/DateTimeDisplay'

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
  components: {
    DateTimeDisplay
  },
  extends: viewExtend,
  data () {
    return {
      valueIndex: -1,
      showPicker: false,
      currentDate: new Date(),
      minDate: new Date(1919, 9, 1),
      maxDate: new Date(2055, 10, 1)
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
        return Toast('请先选择开始日期')
      }
      this.valueIndex = range ? valueIndex : -1
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
      const { key, option } = this.schema
      const oldFormatedDateList = this.model[key]
      const newFormatedDate = formatDate(value, option.format)
      const newValue = this.getDateValue(value)
      const startValue = this.getDateValue(oldFormatedDateList[0])
      const endValue = this.getDateValue(oldFormatedDateList[1])

      // 非区间值
      if (this.valueIndex === -1) {
        if (newFormatedDate !== oldFormatedDateList) {
          this.store.updateModel({ [key]: newFormatedDate })
          this.event('on-change', ...arguments)
        }
      // 区间值
      } else {
        let newModel = []
        // 区间开始值
        if (this.valueIndex === 0) {
          if (newValue === startValue) return
          if (oldFormatedDateList[1]) {
            newModel = newValue > endValue
              ? [newFormatedDate]
              : [newFormatedDate, oldFormatedDateList[1]]
          } else {
            newModel = [newFormatedDate]
          }
        // 区间结束值
        } else if (this.valueIndex === 1) {
          if (newValue < startValue) return Toast('结束日期不能小于开始日期')
          if (oldFormatedDateList[1] && newValue === endValue) return
          newModel = [oldFormatedDateList[0], newFormatedDate]
        }
        this.store.updateModel({ [key]: newModel })
        this.event('on-change', ...arguments)
      }
      this.showPicker = false
    },
    getDateValue (date = '') {
      if (!date) return
      const d = (date instanceof Date) ? date : new Date(date.replace(/-/g, '-'))
      return d.valueOf()
    }
  }
}
</script>
