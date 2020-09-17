<template lang="pug">
.epvan-field(:class='`epvan-field-${rootLabel.position}`')
  .epvan-label(:style='labelStyle()')
    span.epvan-label-required(v-if='required') *
    van-icon.epvan-label-icon(v-if='help' name='info-o' @click='showHelp')
    span.epvan-label-text {{schema.label}}
    span(v-if='rootLabel.colon') :
  .epvan-value(:style='valueStyle()')
    slot
    .epvan-desc(v-if='schema.description') {{schema.description}}
</template>
<script>
import { Dialog } from 'vant'

export default {
  props: {
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    help: {
      type: String,
      default: ''
    },
    schema: {
      type: Object,
      default: () => ({
        label: '',
        help: '',
        description: ''
      })
    }
  },
  computed: {
    rootLabel () {
      return this.$root.$options.extension.store.getRootSchema().label
    }
  },
  methods: {
    showHelp () {
      Dialog({ message: this.help })
    },
    labelStyle () {
      const { width, position } = this.rootLabel
      const style = {}
      switch (position) {
        case 'right':
        case 'left':
          style.width = width + 'px'
          break
        default:
          break
      }
      return style
    },
    valueStyle () {
      const { width, position } = this.rootLabel
      const style = {}
      switch (position) {
        case 'right':
        case 'left':
          style.marginLeft = width + 'px'
          break
        default:
          break
      }
      return style
    }
  }
}
</script>
