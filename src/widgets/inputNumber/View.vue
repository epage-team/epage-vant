<template lang="pug">
.ep-widget
  template(v-if='mode === "display"')
    span {{model[schema.key]}}

  template(v-else)
    van-field(
      v-if='schema.key'
      type='number'
      v-model='model[schema.key]'
      :min='schema.option.min'
      :max='schema.option.max'
      :step='schema.option.step'
      :precision='schema.option.precision'
      :placeholder='schema.placeholder'
      :disabled='schema.disabled'
      :size='rootSchema.size'
      :rules='rules[schema.key]'
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
    required () {
      let required = false
      const rules = this.schema.rules

      if (rules[0]) {
        required = rules[0].required
      }
      return required
    }
  }
}
</script>
