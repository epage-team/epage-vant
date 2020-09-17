<template lang="pug">
.epvan-widget
  epvan-field(v-if='isDisplay' :required='required' :schema='schema')
    van-slider(
      :min='schema.option.min'
      :max='schema.option.max'
      :step='schema.option.step'
      :disabled='true'
      v-model='model[schema.key]'
      @change="event('on-change', ...arguments)"
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )

  epvan-field(v-else :required='required' :schema='schema')
    van-slider(
      :name='schema.name'
      :min='schema.option.min'
      :max='schema.option.max'
      :step='schema.option.step'
      :disabled='schema.disabled'
      v-model='model[schema.key]'
      :required='required'
      :rules='rules[schema.key]'
      @change="event('on-change', ...arguments)"
    )
</template>
<script>
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend
}
</script>
