<template lang="pug">
div
  div(v-if='schema.option.range')
    template(v-if='value')
      .epvan-timePicker-handle(@click='onShowPicker(0)')
        div(v-if='value[0]') {{value[0]}}
        .epvan-placeholder(v-else) {{schema.placeholder || 'please select'}}
      .epvan-datePicker-mid 至
      .epvan-timePicker-handle(@click='onShowPicker(1)')
        div(v-if='value[1]') {{value[1]}}
        .epvan-placeholder(v-else) {{schema.placeholder || 'please select'}}
  div(v-else  @click='onShowPicker')
    div(v-if='value') {{value}}
    div.epvan-placeholder(v-else) {{schema.placeholder || 'please select'}}
</template>
<script>
export default {
  props: {
    value: {
      type: [Array, String],
      default: () => ''
    },
    schema: {
      type: Object,
      default: () => ({
        key: '',
        option: {}
      })
    }
  },
  methods: {
    onShowPicker (index) {
      this.$emit('on-show', index)
    }
  }
}
</script>
