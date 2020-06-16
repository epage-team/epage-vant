import Epage from 'epage'
import { Dialog } from 'vant'
import convertRule from '../util/rule'

const { defaultSchema } = Epage.constant

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
      return convertRule(formRules, this.schema)
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
