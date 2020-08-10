<template lang="pug">
.ep-widget.ep-widget-input
  template(v-if='isDisplay')
    van-field(
      v-model.trim='model[schema.key]'
      :type='schema.option.password ? "password" : "text"'
      :readonly='true'
      :name='schema.name'
      :label='schema.label'
      :required='required'
      :size='rootSchema.size'
      :left-icon='schema.help ? "info-o" : undefined'
      @click="event('on-click', ...arguments)"
      @click-left-icon='onHelpClick'
    )

  template(v-else)
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
      :label='schema.label'
      :required='required'
      :size='rootSchema.size'
      :left-icon='schema.help ? "info-o" : undefined'
      @click-left-icon='onHelpClick'
    )
    .epvan-desc {{schema.description}}

</template>
<script>
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend
}
</script>
