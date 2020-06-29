import Epage from 'epage'
import * as regexp from './regexp'

const { isArray, isFunction, isNumber } = Epage.helper

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
    // const requiredRule = rules[0]
    // const isRequired = requiredRule ? !!requiredRule.required : false

    result[key] = rules.map(rule => {
      const newRule = {}
      const { trigger, validator, type, ...others } = rule

      // reset trigger
      if (trigger && triggerMap[trigger]) {
        newRule.trigger = triggerMap[trigger]
      }

      // reset validator
      if (isFunction(validator)) {
        newRule.validator = function (value, rule) {
          return validator(rule, value, (errors, fields) => {
            return new Promise((resolve, reject) => {
              if (errors && errors.length) {
                reject(errors)
              } else {
                resolve()
              }
            })
          })
        }
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

            const minTrueFalse = !isNumber(min) || (isNumber(min) && value >= min)
            const maxTrueFalse = !isNumber(max) || (isNumber(max) && value <= max)
            return minTrueFalse && maxTrueFalse
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
