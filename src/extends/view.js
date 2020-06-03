import Epage from 'epage'

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
          Object.assign(newRule, others)

          return newRule
        })
      }
      return result
    }
  },
  methods: {
    event (type, ...options) {
      this.$emit('on-event', this.schema.key, type, ...options)
    }
  }
}
