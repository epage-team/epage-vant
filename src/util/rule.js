import Epage from 'epage'
import * as regexp from './regexp'

const { isArray } = Epage.helper

export default (formRules, schema = {}) => {
  const result = {}
  const triggerMap = {
    blur: 'onBlur',
    change: 'onChange'
  }
  const { min, max } = schema.option || {}

  for (const key in formRules) {
    const rules = formRules[key]
    if (!isArray(rules)) continue

    result[key] = rules.map(rule => {
      const newRule = {}
      const { trigger, type, ...others } = rule

      if (trigger && triggerMap[trigger]) {
        newRule[trigger] = triggerMap[trigger]
      }

      switch (type) {
        case 'email':
        case 'url':
        case 'string':
          newRule.pattern = regexp[type](rule)
          break
        case 'number': {
          newRule.validator = (value, rule) => {
            if (!rule.required) return true
            return (value >= min) && (value <= max)
          }
          break
        }
        default:
          break
      }
      Object.assign(newRule, others)

      return newRule
    })
  }
  return result
}
