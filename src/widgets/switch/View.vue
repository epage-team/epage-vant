<template lang="pug">
.epvan-widget
  epvan-field(v-if='isDisplay' :required='required' :schema='schema')
    van-field(
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-switch(
          disabled
          :size='getSize()'
          v-model='model[schema.key]'
          @change="event('on-change', ...arguments)"
        )

  epvan-field(v-else :required='required' :schema='schema')
    van-field(
      :rules='rules[schema.key]'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-switch(
          :disabled='schema.disabled'
          :size='getSize()'
          v-model='model[schema.key]'
          @change="event('on-change', ...arguments)"
        )
</template>
<script>
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend,
  methods: {
    getSize () {
      const size = this.schema.size || this.rootSchema.size || 'default'
      const map = {
        small: '20px',
        default: '24px',
        large: '28px'
      }
      return map[size]
    }
  }
}
</script>
