<template lang="pug">
.ep-widget.epvan-rate
  van-field(
    v-if='isDisplay'
    :name='schema.name'
    :label='schema.label'
    :required='required'
    :size='rootSchema.size'
    :left-icon='schema.help ? "info-o" : undefined'
    @click-left-icon='onHelpClick'
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

  van-field(
    v-else
    :rules='isDisplay ? undefined : rules[schema.key]'
    :name='schema.name'
    :label='schema.label'
    :required='required'
    :size='rootSchema.size'
    :left-icon='schema.help ? "info-o" : undefined'
    @click-left-icon='onHelpClick'
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
