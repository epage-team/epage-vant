<template lang="pug">
.epvan-widget-item.ep-widget-item(
  :class='cls'
  :style='getStyle()'
  @click='onOriginViewSelect($event, schema)'
)
  .ep-widget-item-name(v-if='tab === "design"') {{schema.name}}
  div(v-if='tab === "design"')
    .ep-widget-btn.ep-widget-btn-delete.ep-icon.ep-icon-trash(
      title='删除'
      @click='onOriginViewDelete($event, schema)'
    )
    .ep-widget-btn.ep-widget-btn-clone.ep-icon.ep-icon-copy(
      title='复制'
      @click='onOriginViewCopy($event, schema)'
    )
  template(v-if='schema.container')
    template(v-if='!schema.dynamic || tab === "design"')
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
            template(v-if='tab !== "design"')
              epvan-widget-item(
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
            vue-drag(
              v-else
              handle='.ep-widget-item-handle'
              draggable='.ep-widget-item'
              ghost-class='ep-widget-ghost'
              v-bind='{ group: { name: "g1"}}'
              :list='item.list'
              :animation='200'
            )
              transition-group(mode='fade')
                .ep-widget-item(
                  v-if='item.list.length === 0'
                  key='placeholder'
                  :class='getPlaceholderCls()'
                )
                template(v-else)
                  epvan-widget-item(
                    v-for='(child, j) in item.list'
                    :key='child.key'
                    :schema='child'
                    :flat-widgets='flatWidgets'
                    :flat-schemas='flatSchemas'
                    :selected-schema='selectedSchema'
                    :root-schema='rootSchema'
                    :class='{"ep-widget-selected": child.key === selectedSchema.key}'
                    @on-select='onViewSelect'
                    @on-delete='onViewDelete'
                    @on-copy='onViewCopy'
                    @on-add='onViewAdd'
                    @on-event='onEvent'
                  )
    template(v-else)
      div(v-for='(sub, s) in schema.list' style='position: relative;')
        van-row(
          v-if='sub.option'
          type='flex'
          :gutter='sub.option.gutter'
          :align='sub.option.align'
          :justify='sub.option.justify'
          :class='tab !== "design" ? "ep-widget-dynamic-container" : ""'
        )
          van-col(
            v-for='(item, k) in sub.children'
            :key='k'
            :span='item.span'
            :offset='item.offset'
          )
            template(v-if='Array.isArray(item.list) && tab !== "design"')
              epvan-widget-item(
                v-for='(child, j) in item.list'
                :key='child.key'
                :schema='child'
                :flat-widgets='flatWidgets'
                :flat-schemas='flatSchemas'
                :root-schema='rootSchema'
                @on-add='onViewAdd'
                @on-event='onEvent'
                @on-dynamic-add='onDynamicAdd'
                @on-dynamic-remove='onDynamicRemove'
              )
        //- Icon.ep-widget-dynamic-remove(
        //-   title='删除'
        //-   :type='icons.remove'
        //-   @click.native='onOriginDynamicRemove($event, schema, s)'
        //- )

    //- Button(
    //-   v-show='schema.dynamic'
    //-   type='dashed'
    //-   style='margin-top: 5px;'
    //-   :size='schema.size || rootSchema.size'
    //-   @click='onOriginDynamicAdd($event, schema)'
    //- ) 添加

  //- not container
  template(v-else)
    component.ep-widget-control(
      v-if='schema.key'
      :is='flatWidgets[schema.widget].View'
      :schema='schema'
      @on-event='onEvent'
    )
</template>
<script>
import { Context, Script, drag } from 'epage-core'

export default {
  name: 'EpvanWidgetItem',
  components: {
    VueDrag: drag.VueDrag
  },
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
    selectedSchema: {
      type: Object,
      default: () => ({
        key: ''
      })
    },
    rootSchema: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {}
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
        'ep-widget-selected': this.schema && this.schema.key === this.selectedSchema.key,
        'epvan-widget-container': this.schema.container,
        'ep-widget-item-handle': this.tab === 'design'
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
    getPlaceholderCls () {
      const placeholder = !Object.keys(this.$slots).length && this.tab === 'design'
      return placeholder ? 'ep-widget-grid-placeholder' : ''
    },
    onOriginDynamicAdd (e, schema) {
      if (this.tab === 'design') return
      e.stopPropagation()
      this.$emit('on-dynamic-add', schema)
    },
    onDynamicAdd (schema) {
      this.$emit('on-dynamic-add', schema)
    },
    onOriginDynamicRemove (e, schema, index) {
      e.stopPropagation()
      this.$emit('on-dynamic-remove', schema, index)
    },
    onDynamicRemove (schema, index) {
      this.$emit('on-dynamic-remove', schema, index)
    },
    getStyle () {
      const { style, hidden } = this.schema
      let result
      if (style) {
        result = Object.keys(style)
          .filter(_ => style[_])
          .map(attr => `${attr}: ${style[attr]};`)
          .join('')
      }
      if (this.store.getTab() === 'design' && hidden) result += 'opacity: 0.7;'
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
      const { store, $el } = this
      const ctx = new Context({
        $el,
        $render: this.$root.$options.extension.$render,
        store,
        instance: this,
        state: {}
      })
      function callback (scripts) {
        scripts.forEach(script => {
          const sc = new Script(ctx)
          sc.exec(script)
        })
      }
      if (valueLogics.length) {
        this.store.updateWidgetByEvent(this.schema.key, eventType, callback)
      }
    },
    onOriginViewSelect (e, schema) {
      // 预览模式下，为了级联、下拉框菜单点击空白处收起，需要事件冒泡到document
      this.store.getTab() === 'design' && e.stopPropagation()
      this.$emit('on-select', schema)
    },
    onViewSelect (schema) {
      this.$emit('on-select', schema)
    },
    onOriginViewDelete (e, schema) {
      e.stopPropagation()
      this.$emit('on-delete', schema)
    },
    onOriginViewCopy (e, schema) {
      e.stopPropagation()
      this.$emit('on-copy', schema)
    },
    onViewDelete (schema) {
      this.$emit('on-delete', schema)
    },
    onViewCopy (schema) {
      this.$emit('on-copy', schema)
    },
    onViewAdd (schema) {
      this.$emit('on-add', schema)
    }
  }
}
</script>
