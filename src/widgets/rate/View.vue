<template lang="pug">
.epvan-widget.epvan-rate
  epvan-field(v-if='isDisplay' :required='required' :help='schema.help' :label='schema.label')
    van-field(
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-rate(
          readonly
          :count='schema.option.count'
          :allow-half='schema.option.allowHalf'
          :disabled='schema.disabled'
          :size='schema.size || rootSchema.size'
          v-model='model[schema.key]'
          @change="event('on-change', ...arguments)"
        )
        span.epvan-rate-text(
          v-if='schema.option.showText && model[schema.key] > 0'
          style='padding-left: 10px;'
        ) {{model[schema.key]}} 星

  epvan-field(v-else :required='required' :help='schema.help' :label='schema.label')
    van-field(
      :rules='isDisplay ? undefined : rules[schema.key]'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-rate(
          :readonly='isDisplay'
          :count='schema.option.count'
          :allow-half='schema.option.allowHalf'
          :disabled='schema.disabled'
          :size='schema.size || rootSchema.size'
          v-model='model[schema.key]'
          @change="event('on-change', ...arguments)"
        )
        span.epvan-rate-text(
          v-if='schema.option.showText && model[schema.key] > 0'
          style='padding-left: 10px;'
        ) {{model[schema.key]}} 星
    .epvan-desc {{schema.description}}
</template>
<script>
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend
}
</script>
