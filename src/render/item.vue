<template lang="pug">
.ep-widget-item(
  :class='cls'
  :style='getStyle()'
)
  template(v-if='schema.container')
    van-row(
      v-if='schema.option'
      type='flex'
      :gutter='schema.option.gutter'
      :align='schema.option.align'
      :justify='schema.option.justify'
    )
      van-col(
        v-for='(item, k) in schema.children'
        :key='k'
        :span='item.span'
        :offset='item.offset'
      )
        template(v-if='Array.isArray(item.list)')
          ep-widget-item(
            v-for='(child, j) in item.list'
            :key='child.key'
            :schema='child'
            :flat-widgets='flatWidgets'
            :flat-schemas='flatSchemas'
            :root-schema='rootSchema'
            v-show='!child.hidden'
            @on-event='onEvent'
            @on-dynamic-add='onDynamicAdd'
            @on-dynamic-remove='onDynamicRemove'
          )
    .ep-widget-description(v-if='schema.description') {{schema.description}}

  //- not container
  template(v-else)
    span(v-if='schema.help' slot='label') {{schema.label}}
    component(
      :is='flatWidgets[schema.widget].View'
      :schema='schema'
      @on-event='onEvent'
    )
    .ep-widget-description(v-if='schema.description') {{schema.description}}
</template>
<script>

export default {
  name: 'EpWidgetItem',
  props: {
    schema: {
      type: Object,
      default: () => ({})
    },
    flatWidgets: {
      type: Object,
      default: () => ({})
    },
    flatSchemas: {
      type: Object,
      default: () => ({})
    },
    rootSchema: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    store () {
      return this.$root.$options.extension.store
    },
    widgetType () {
      return this.schema.widget
    },
    cls () {
      return {
        'ep-widget-container': this.schema.container
      }
    },
    logics () {
      return this.rootSchema.logics
    },
    tab () {
      return this.store.getTab()
    }
  },
  methods: {
    onDynamicAdd (schema) {
      this.$emit('on-dynamic-add', schema)
    },
    onDynamicRemove (schema, index) {
      this.$emit('on-dynamic-remove', schema, index)
    },
    getStyle () {
      const { style } = this.schema
      let result
      if (style) {
        result = Object.keys(style)
          .filter(_ => style[_])
          .map(attr => `${attr}: ${style[attr]};`)
          .join('')
      }
      return result
    },
    onEvent (key, eventType, ...args) {
      this.dispatchEvent(key, eventType)
      this.$emit('on-event', ...arguments)
    },
    dispatchEvent (key, eventType) {
      const valueLogics = this.rootSchema.logics.filter(
        logic => (logic.key &&
        logic.key === this.schema.key &&
        logic.type === 'event'))
      if (valueLogics.length) {
        this.store.updateWidgetByEvent(this.schema.key, eventType)
      }
    }
  }
}
</script>
