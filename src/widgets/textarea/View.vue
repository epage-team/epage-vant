<template lang="pug">
.epvan-widget
  //- display mode
  epvan-field(v-if='isDisplay' :required='required' :schema='schema')
    van-field(
      readonly
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
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        div {{displayValue}}

  //- edit mode
  epvan-field(v-else :required='required' :schema='schema')
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
      :required='required'
      :size='rootSchema.size'
    )

</template>
<script>
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend,
  computed: {
    displayValue () {
      const value = this.model[this.schema.key] || ''
      return value.replace(/\n/g, '<br>')
    }
  }
}
</script>
