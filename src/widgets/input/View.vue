<template lang="pug">
.epvan-widget
  epvan-field(v-if='isDisplay' :required='required' :help='schema.help' :label='schema.label')
    van-field(
      v-model.trim='model[schema.key]'
      :type='schema.option.password ? "password" : "text"'
      :readonly='true'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
      @click="event('on-click', ...arguments)"
    )

  epvan-field(v-else :required='required' :help='schema.help' :label='schema.label')
    van-field(
      v-model.trim='model[schema.key]'
      :type='schema.option.password ? "password" : "text"'
      :placeholder='schema.placeholder'
      :disabled='schema.disabled'
      :rules='rules[schema.key]'
      @input="event('on-input', ...arguments)"
      @focus="event('on-focus', ...arguments)"
      @blur="event('on-blur', ...arguments)"
      @click="event('on-click', ...arguments)"
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
    .epvan-desc {{schema.description}}

</template>
<script>
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend
}
</script>
