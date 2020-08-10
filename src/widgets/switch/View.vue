<template lang="pug">
.ep-widget
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
      van-switch(
        disabled
        :size='schema.size || rootSchema.size'
        v-model='model[schema.key]'
        @change="event('on-change', ...arguments)"
      )

  template(v-else)
    van-field(
      :rules='rules[schema.key]'
      :name='schema.name'
      :label='schema.label'
      :required='required'
      :size='rootSchema.size'
      :left-icon='schema.help ? "info-o" : undefined'
      @click-left-icon='onHelpClick'
    )
      template(#input)
        van-switch(
          :disabled='schema.disabled'
          :size='schema.size || rootSchema.size'
          v-model='model[schema.key]'
          @change="event('on-change', ...arguments)"
        )
</template>
<script>
import viewExtend from '../../extends/view'

export default {
  extends: viewExtend
}
</script>
