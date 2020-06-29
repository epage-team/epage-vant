<template lang="pug">
.ep-widget
  template(v-if='mode === "display"')
    van-slider(
      v-if='schema.key'
      :min='schema.option.min'
      :max='schema.option.max'
      :step='schema.option.step'
      :disabled='true'
      v-model='model[schema.key]'
      @change="event('on-change', ...arguments)"
    )

  template(v-else)
    van-slider(
      v-if='schema.key'
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
