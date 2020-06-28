<template lang="pug">
.ep-widget
  template(v-if='mode === "display"')
    span {{model[schema.key]}}

  template(v-else)
    van-field(
      v-if='schema.key'
      type='number'
      v-model='model[schema.key]'
      :placeholder='schema.placeholder'
      :disabled='schema.disabled'
      :size='rootSchema.size'
      :rules='numberRules'
      :label='schema.label'
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
  computed: {
    numberRules () {
      const { key, option } = this.schema
      const { min, max } = option
      const rule = { ...this.rules[key][0] }
      const result = [rule]
      rule.validator = function (value) {
        return (typeof value === 'number') || !!value
      }
      const rule2 = {
        trigger: rule.trigger,
        validator: function (str) {
          const number = parseFloat(str)
          const value = isNaN(number) ? 0 : number
          return (value >= min) && (value <= max)
        },
        message: `请输入不小于 ${min} 且 不大于 ${max}的数字`
      }

      result.push(rule2)
      return result
    }
  }
}
</script>
