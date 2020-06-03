<template lang="pug">
.ep-widget.ep-widget-input
  template(v-if='mode === "display"')
    span(v-if='schema.option.prefix') {{schema.option.prefix}}
    span {{model[schema.key]}}
    span(v-if='schema.option.suffix') {{schema.option.suffix}}

  template(v-else)
    van-field(
      v-if='schema.key'
      v-model.trim='model[schema.key]'
      :type='schema.option.password ? "password" : "text"'
      :label='schema.label'
      :placeholder='schema.placeholder'
      :disabled='schema.disabled'
      :size='rootSchema.size'
      :rules='rules[schema.key]'
      :required='required'
      @input="event('on-input', ...arguments)"
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
