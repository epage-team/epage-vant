<template lang="pug">
.ep-widget.epvan-rate
  template(v-if='mode === "display"')
     van-rate(
      v-if='schema.key'
      :count='schema.option.count'
      :allow-half='schema.option.allowHalf'
      :disabled='true'
      :size='schema.size || rootSchema.size'
      v-model='model[schema.key]'
      @change="event('on-change', ...arguments)"
    )

  template(v-else)
    van-field(
      :name='schema.name'
      :label='schema.label'
      :rules='rules[schema.key]'
      :required='required'
    )
      template(#input)
        van-rate(
          v-if='schema.key'
          :count='schema.option.count'
          :allow-half='schema.option.allowHalf'
          :disabled='schema.disabled'
          :size='schema.size || rootSchema.size'
          v-model='model[schema.key]'
          @change="event('on-change', ...arguments)"
        )
        span.epvan-rate-text(v-if='schema.option.showText && model[schema.key] > 0' style='padding-left: 10px;') {{model[schema.key]}} 星
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
