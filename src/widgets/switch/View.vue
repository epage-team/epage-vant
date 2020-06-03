<template lang="pug">
.ep-widget
  template(v-if='mode === "display"')
    span {{model[schema.key]}}

  template(v-else)
    van-cell(
      center
      :title='schema.label'
    )
      van-switch(
        v-if='schema.key'
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
