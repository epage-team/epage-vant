import Epage from 'epage'
import { Dialog } from 'vant'
import * as regexp from '../util/regexp'

const { defaultSchema } = Epage.constant
const { isArray } = Epage.helper

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
      return this.store.getState().mode
    },
    model: {
      get () {
        return this.store.getModel()
      },
      set (model) {
        this.store.setModel(model)
      }
    },
    rules () {
      const formRules = this.store.getFormRules()
      const result = {}
      const triggerMap = {
        blur: 'onBlur',
        change: 'onChange'
      }

      for (const key in formRules) {
        const rules = formRules[key]
        if (!isArray(rules)) continue

        result[key] = rules.map(rule => {
          const newRule = {}
          const { trigger, type, ...others } = rule
          if (trigger && triggerMap[trigger]) {
            newRule[trigger] = triggerMap[trigger]
          }
          if (type in regexp) {
            newRule.pattern = regexp[type](rule)
          }
          Object.assign(newRule, others)

          return newRule
        })
        console.log(1, result)
      }
      return result
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
