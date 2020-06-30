<template lang="pug">
.ep-widget
  //- display mode
  van-field(
    v-if='isDisplay'
    type='text'
    v-model='model[schema.key]'
    :name='schema.name'
    :placeholder='schema.placeholder'
    :disabled='schema.disabled'
    :size='rootSchema.size'
    :label='schema.label'
    :formatter='formatter'
    readonly
    @change="event('on-change', ...arguments)"
    @focus="event('on-focus', ...arguments)"
    @blur="event('on-blur', ...arguments)"
    @click="event('on-click', ...arguments)"
    :left-icon='schema.help ? "info-o" : undefined'
    @click-left-icon='onHelpClick'
  )
  //- edit mode
  van-field(
    v-else
    type='text'
    v-model='model[schema.key]'
    :name='schema.name'
    :placeholder='schema.placeholder'
    :disabled='schema.disabled'
    :size='rootSchema.size'
    :rules='numberRules'
    :label='schema.label'
    :required='required'
    :formatter='formatter'
    :readonly='isDisplay'
    @change="event('on-change', ...arguments)"
    @focus="event('on-focus', ...arguments)"
    @blur="event('on-blur', ...arguments)"
    @click="event('on-click', ...arguments)"
  )
</template>
<script>
import viewExtend from '../../extends/view'
import { formatNumber } from '../../util/format'

export default {
  extends: viewExtend,
  computed: {
    numberRules () {
      const { key, option } = this.schema
      const { min, max } = option
      const rule = { ...this.rules[key][0] }
      const result = [rule]
      rule.validator = function (value, rule) {
        return (typeof value === 'number') || !!value
      }
      const rule2 = {
        trigger: rule.trigger,
        validator: function (value, rule) {
          const number = parseFloat(value)
          const finalValue = isNaN(number) ? 0 : number
          return (finalValue >= min) && (finalValue <= max)
        },
        message: `请输入不小于 ${min} 且 不大于 ${max}的数字`
      }

      result.push(rule2)
      return result
    }
  },
  methods: {
    formatter (value) {
      return formatNumber(value, true)
    }
  }
}
</script>
