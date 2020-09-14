<template lang="pug">
.epvan-widget
  //- display mode
  epvan-field(v-if='isDisplay' :required='required' :help='schema.help' :label='schema.label')
    van-field(
      type='number'
      v-model='model[schema.key]'
      :name='schema.name'
      :placeholder='schema.placeholder'
      :disabled='schema.disabled'
      :size='rootSchema.size'
      readonly
      @change="event('on-change', ...arguments)"
      @click="event('on-click', ...arguments)"
    )
  //- edit mode
  epvan-field(v-else :required='required' :help='schema.help' :label='schema.label')
    van-field(
      type='number'
      v-model='model[schema.key]'
      :name='schema.name'
      :placeholder='schema.placeholder'
      :disabled='schema.disabled'
      :size='rootSchema.size'
      :rules='numberRules()'
      :required='required'
      @change="event('on-change', ...arguments)"
      @focus="event('on-focus', ...arguments)"
      @blur="event('on-blur', ...arguments)"
      @click="event('on-click', ...arguments)"
    )
</template>
<script>
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend,
  methods: {
    numberRules () {
      const { option, rules } = this.schema
      const { min, max } = option
      const rule = { ...rules[0] }
      return [{
        message: rule.message,
        validator: function (value, rule) {
          return (typeof value === 'number') || !!value
        }
      }, {
        message: `请输入不小于 ${min} 且 不大于 ${max}的数字`,
        validator: function (value, rule) {
          const number = parseFloat(value)
          const finalValue = isNaN(number) ? 0 : number
          return (finalValue >= min) && (finalValue <= max)
        }
      }]
    }
  }
}
</script>
