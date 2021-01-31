<template lang="pug">
.ep-render-container(:style='containerStyle')
  van-form.epvan-wrapper.epvan-widget-form(
    ref='epvan'
    :label-width='rootSchema.label.width'
    :label-position='rootSchema.label.position'
    :class='`epvan-mode-${mode}`'
    :colon='true'
    :style='contentStyle'
  )
    epvan-widget-item(
      v-for='(item, k) in childrenSchema'
      v-show='!item.hidden'
      :key='item.key'
      :schema='item'
      :flat-widgets='flatWidgets'
      :flat-schemas='flatSchemas'
      :root-schema='rootSchema'
      @on-event='onEvent'
      @on-dynamic-add='onDynamicAdd'
      @on-dynamic-remove='onDynamicRemove'
    )
</template>
<script>
import EpvanWidgetItem from './item'
import { Event as EpageEvent, helper, Context, Script, style } from 'epage-core'

const evt = new EpageEvent()

export default {
  on: evt.on.bind(evt),
  off: evt.off.bind(evt),
  components: {
    EpvanWidgetItem
  },

  data () {
    return {
      oldModel: {},
      oldDiffs: {},
      // 当前渲染状态
      mode: 'edit'
    }
  },

  computed: {
    childrenSchema () {
      const { store } = this.$root.$options.extension
      return helper.getRootSchemaChildren(store.getRootSchema()) || []
    },
    store () {
      return this.$root.$options.extension.store
    },
    $$store () {
      return this.$root.$options.extension.store.$$store
    },
    state () {
      return this.$$store.state
    },
    flatWidgets () {
      return this.store.getFlatWidgets()
    },
    flatSchemas () {
      return this.store.getFlatSchemas()
    },
    rootSchema () {
      return this.store.getRootSchema()
    },
    model () {
      return this.store.getModel()
    },
    containerStyle () {
      const rootStyle = this.store.getRootSchema().style || {}
      // background
      const container = rootStyle.container || {}
      const bgcolor = container['background-color']
      let bgstyle = ''

      if (Array.isArray(container.background)) {
        bgstyle = container.background.map(bg => new style.Background(bg)).join(',')
        if (bgcolor) {
          bgstyle = bgstyle ? (bgstyle + ',' + bgcolor) : bgcolor
        }
        bgstyle = 'background:' + bgstyle + ';'
      }
      return bgstyle
    },
    contentStyle () {
      const rootStyle = this.store.getRootSchema().style || {}
      const COMPLEX_STYLE = ['container', 'background']
      // other style
      const style = Object.keys(rootStyle)
        .map(attr => {
          if (COMPLEX_STYLE.indexOf(attr) > -1) return ''
          return `${attr}:${rootStyle[attr]};`
        })
        .join('')

      return style
    }
  },

  watch: {
    model: {
      handler: function (newModel, oldModel) {
        // 需要先设置schema，然后设置model，否则设置的model可能不生效
        const diffs = this.diffModel(newModel, this.oldModel)

        if (this.shouldChangeModel(diffs, this.oldDiffs)) {
          this.oldDiffs = Object.assign({}, diffs)
          this.oldModel = Object.assign({}, newModel)
          this.changeWithModel(diffs)
        }
      },
      deep: true
    }
  },

  created () {
    const { mode } = this.$root.$options.extension

    if (mode) {
      this.mode = mode
      this.changeMode(mode)
    }
  },

  methods: {
    validateFields (field) {
      return new Promise((resolve, reject) => {
        const prom = field ? this.$refs.epvan.validate(field) : this.$refs.epvan.validate()
        prom.then(res => {
          resolve(res)
        }).catch(err => {
          reject(new Error('Check Error: ' + JSON.stringify(err)))
        })
      })
    },

    resetFields () {
      this.$refs.epvan.resetValidation()
    },

    shouldChangeModel (newDiffs, oldDiffs) {
      let result = false

      if (Object.keys(newDiffs).length) {
        for (const i in newDiffs) {
          if (!(i in oldDiffs) || newDiffs[i] !== oldDiffs[i]) {
            result = true
          }
        }
      }
      return result
    },

    diffModel (newModel, oldModel) {
      const diffs = {}

      for (const k in newModel) {
        if (k in this.flatSchemas && newModel[k] !== oldModel[k]) {
          diffs[k] = newModel[k]
        }
      }
      return diffs
    },

    changeWithModel (modelDiffs) {
      const valueLogics = this.rootSchema.logics.filter(logic => logic.key && logic.type === 'value')
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

      const diffs = {}
      valueLogics.forEach(logic => {
        if (logic.key in modelDiffs && !(logic.key in diffs)) {
          diffs[logic.key] = modelDiffs[logic.key]
        }
      })
      if (Object.keys(diffs).length) {
        this.store.updateWidgetByModel(modelDiffs, callback)
      }
    },

    onEvent (key, onType, ...args) {
      this.$emit('on-event', ...arguments)
      const type = onType.indexOf('on-') === 0 ? onType.split('on-')[1] : onType

      if (key in evt.$events && type in evt.$events[key]) {
        const callbacks = evt.$events[key][type] || []
        callbacks.forEach(callback => {
          /* eslint standard/no-callback-literal: 0 */
          callback(...args)
        })
      }
    },

    onDynamicAdd (schema) {
      this.store.dynamicAddWidget(schema.key)
    },

    onDynamicRemove (schema, index) {
      this.store.dynamicRemoveWidget(schema.key, index)
    },

    changeMode (mode) {
      this.store.updateMode(mode)
    }
  }
}
</script>
