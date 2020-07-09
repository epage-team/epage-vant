import { constant } from 'epage-core'
import { Dialog } from 'vant'
import convertRule from '../util/rule'

const { defaultSchema } = constant

export default {
  props: {
    schema: {
      type: Object,
      default: () => defaultSchema()
    }
  },
  computed: {
    store () {
      return this.$root.$options.extension.store
    },
    rootSchema: {
      get () {
        return this.store.getRootSchema()
      },
      set (rootSchema) {
        this.store.initRootSchema(rootSchema)
      }
    },
    mode () {
      return this.schema.mode || this.store.getState().mode
    },
    isDisplay () {
      return this.mode === 'display'
    },
    model: {
      get () {
        return this.store.getModel()
      },
      set (model) {
        this.store.updateModel(model)
      }
    },
    rules () {
      const formRules = this.store.getFormRules()
      return convertRule(formRules, this.schema)
    },
    required () {
      let required = false
      const rules = this.schema.rules
      // 显示模式下不展示红色星号
      if (this.isDisplay) return false
      if (rules[0]) {
        required = rules[0].required
      }
      return required
    }
  },
  methods: {
    event (type, ...options) {
      this.$emit('on-event', this.schema.key, type, ...options)
    },
    onHelpClick () {
      Dialog({ message: this.schema.help })
    }
  }
}
