<template lang="pug">
.ep-widget
  template(v-if='mode === "display"')
    span(v-if='schema.option.prefix') {{schema.option.prefix}}
    span {{model[schema.key]}}
    span(v-if='schema.option.suffix') {{schema.option.suffix}}

  template(v-else)
    van-field(
      v-if='schema.key'
      v-model.trim='model[schema.key]'
      type='textarea'
      :rows='schema.option.rows'
      :label='schema.label'
      :placeholder='schema.placeholder'
      :disabled='schema.disabled'
      :size='rootSchema.size'
      :rules='rules[schema.key]'
      :required='required'
      :left-icon='schema.help ? "info-o" : undefined'
      @input="event('on-input', ...arguments)"
      @focus="event('on-focus', ...arguments)"
      @blur="event('on-blur', ...arguments)"
      @click="event('on-click', ...arguments)"
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
