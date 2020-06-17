<template lang="pug">
.ep-widget
  template(v-if='mode === "display"')
    span {{model[schema.key]}}

  template(v-else)
    van-field(
      :label='schema.label'
      :class='cls'
      v-if='schema.key'
      :disable='schema.disabled'
      @click='showPicker = true'
    )
      template(#input)
        div(v-if='model[schema.key]') {{model[schema.key]}}
        div.epvan-placeholder(v-else) {{schema.placeholder}}
    van-popup(
      v-model='showPicker'
      round
      position='bottom'
    )
      van-datetime-picker(
        :type='getType()'
        @cancel='showPicker = false'
        @confirm='onConfirm'
      )
</template>
<script>
import viewExtend from '../../extends/view'
import Epage from 'epage'

const { include, formatDate } = Epage.helper
const timeOptions = ['HH:mm:ss', 'HH:mm', 'mm:ss']
const monthOptions = ['yyyy-MM', 'yyyy/MM']

export default {
  extends: viewExtend,
  data () {
    return {
      showPicker: false
    }
  },
  computed: {
    cls () {
      let result = {}
      const { option } = this.schema

      if (option && option.type === 'datetimerange') {
        const size = this.schema.size || this.rootSchema.size || 'default'

        result = `ep-widget-datePicker-${size}`
      }

      return result
    }
  },
  methods: {

    hasTime (format) {
      return !!timeOptions.filter(t => include(format, t)).length
    },

    isMonth (format) {
      return !!monthOptions.filter(t => include(format, t)).length && !include(format, 'dd')
    },

    getType () {
      const { option } = this.schema
      const { range, format } = option
      let type = 'date'

      if (range) {
        type = this.hasTime(format) ? 'datetimerange' : 'daterange'
      } else {
        if (format === 'yyyy') {
          type = 'year'
        } else if (this.isMonth(format)) {
          type = 'month'
        } else if (this.hasTime(format)) {
          type = 'datetime'
        } else {
          type = 'date'
        }
      }
      return type
    },
    onConfirm (value) {
      const oldValue = this.model[this.schema.key]
      const newValue = formatDate(value, this.schema.option.format)

      if (value !== oldValue) {
        this.store.updateModel({ [this.schema.key]: newValue })
        this.event('on-change', ...arguments)
      }
      this.showPicker = false
    }
  }
}
</script>
