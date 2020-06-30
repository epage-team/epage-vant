<template lang="pug">
.ep-widget
  template(v-if='isDisplay')
    van-slider(
      :min='schema.option.min'
      :max='schema.option.max'
      :step='schema.option.step'
      :disabled='true'
      v-model='model[schema.key]'
      @change="event('on-change', ...arguments)"
      :name='schema.name'
      :label='schema.label'
      :required='required'
      :size='rootSchema.size'
      :left-icon='schema.help ? "info-o" : undefined'
      @click-left-icon='onHelpClick'
    )

  template(v-else)
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
