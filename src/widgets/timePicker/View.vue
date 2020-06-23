<template lang="pug">
.ep-widget.epvan-timePicker
  template(v-if='mode === "display"')
    span {{model[schema.key]}}

  template(v-else)
    van-field(
      v-if='schema.key'
      :label='schema.label'
      :required='required'
      :disable='schema.disabled'
    )
      template(#input)
        .epvan-timePicker-range(v-if='schema.option.range')
          template(v-if='model[schema.key]')
            .epvan-timePicker-handle(@click='onShowPicker(0)')
              div(v-if='model[schema.key][0]') {{model[schema.key][0]}}
              .epvan-placeholder(v-else) {{schema.placeholder || 'please select'}}
            span.epvan-timePicker-mid 至
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
        v-model='currentTime'
        type='time'
        :formatter='formatter'
        :filter='filter'
        @cancel='showPicker = false'
        @confirm='onConfirm'
      )
</template>
<script>
import { Toast } from 'vant'
import Epage from 'epage'
import viewExtend from '../../extends/view'

const { isNumber } = Epage.helper

const dateMap = {
  hour: '时',
  minute: '分'
}

export default {
  extends: viewExtend,
  data () {
    return {
      valueIndex: -1,
      showPicker: false,
      currentTime: '00:00'
    }
  },
  methods: {
    onShowPicker (valueIndex) {
      const { range } = this.schema.option
      const value = this.model[this.schema.key]

      if (range) {
        this.valueIndex = valueIndex
        if (valueIndex !== 0 && !value[0]) {
          Toast('请先选择开始时间')
          return
        }
      } else {
        this.valueIndex = -1
      }
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
      const oldValue = this.model[this.schema.key]

      // 时间点
      if (this.valueIndex === -1) {
        if (value !== oldValue) {
          this.store.updateModel({ [this.schema.key]: value })
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

          this.store.updateModel({ [this.schema.key]: newValueArr })
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

          this.store.updateModel({ [this.schema.key]: newValueArr })
          this.event('on-change', ...arguments)
        }
      }

      this.showPicker = false
    }
  }
}
</script>
