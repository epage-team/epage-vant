<template lang="pug">
.ep-widget
  //- display mode
  template(v-if='isDisplay')
    span(v-if='schema.option.prefix') {{schema.option.prefix}}
    span {{model[schema.key]}}
    span(v-if='schema.option.suffix') {{schema.option.suffix}}
  //- edit mode
  template(v-else)
    van-field(
      v-model.trim='model[schema.key]'
      type='textarea'
      :rows='schema.option.rows'
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
