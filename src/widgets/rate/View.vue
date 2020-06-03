<template lang="pug">
.ep-widget
  template(v-if='mode === "display"')
     van-rate(
      v-if='schema.key'
      :count='schema.option.count'
      :allow-half='schema.option.allowHalf'
      :disabled='true'
      :size='schema.size || rootSchema.size'
      v-model='model[schema.key]'
      @change="event('on-change', ...arguments)"
    )

  template(v-else)
    van-field(:name='schema.name' :label='schema.label')
      template(#input)
        van-rate(
          v-if='schema.key'
          :count='schema.option.count'
          :allow-half='schema.option.allowHalf'
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
