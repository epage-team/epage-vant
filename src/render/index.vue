<template lang="pug">
van-form.ep-widget-form(
  ref='epForm'
  :label-width='rootSchema.label.width'
  :label-position='rootSchema.label.position'
  :class='`ep-mode-${mode}`'
)
  ep-widget-item(
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
import EpWidgetItem from './item'
import Epage from 'epage'

const { helper } = Epage
const evt = new Epage.Event()

export default {
  on: evt.on.bind(evt),
  off: evt.off.bind(evt),
  components: {
    EpWidgetItem
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
    validateFields () {
      return new Promise((resolve, reject) => {
        this.$refs.epForm.validate(valid => {
          if (valid) {
            resolve(valid)
          } else {
            reject(new Error('check error'))
          }
        })
      })
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

      if (valueLogics.length) {
        this.store.updateWidgetByModel(modelDiffs)
      }
    },

    // checkEffect (effect, key) {
    //   return effect.key && key !== effect.key && Array.isArray(effect.properties)
    // },

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
