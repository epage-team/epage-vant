<template lang="pug">
.epvan-widget.epvan-select
  epvan-field(v-if='isDisplay' :required='required' :schema='schema')
    div(v-if='schema.option.multiple')
      van-tag(
        v-for='(item, key) in checkedOptions'
        :key='key'
        size='large'
        color='#eee'
        text-color='#666'
        :round='true'
        style='margin-right: 6px;margin-bottom: 6px;'
      ) {{item.value}}
    div(v-else style='font-size: 14px;') {{displayValue}}

  epvan-field(v-else :required='required' :schema='schema')
    van-field(
      v-if='schema.option.multiple'
      readonly
      clickable
      :placeholder='schema.placeholder'
      :rules='selectRules()'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-checkbox-group(v-if='Array.isArray(model[schema.key])' v-model='model[schema.key]' style='display:none;')
          van-checkbox(
            v-for='(item, key) in options'
            :key='key'
            :name='item.key'
            style='margin-bottom: 8px;'
            shape='square'
          ) {{item.value}}
        div(style='flex:1;min-height: 24px;' @click='onPopupOpen')
          .epvan-placeholder {{schema.placeholder}}
    van-field(
      v-else
      readonly
      clickable
      :placeholder='schema.placeholder'
      :rules='selectRules()'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-radio-group(v-model='model[schema.key]' style='display:none;')
          van-radio(
            v-for='(item, key) in options'
            :key='key'
            :name='item.key'
            style='margin-bottom: 8px;'
          ) {{item.value}}

        div(style='flex:1;min-height: 24px;' @click='onPopupOpen')
          span(v-if='displayValue') {{displayValue}}
          .epvan-placeholder(v-else) {{schema.placeholder}}

    div(v-if='schema.option.multiple' style='padding-top: 8px;')
      van-tag(
        v-for='(item, key) in checkedOptions'
        :key='key'
        size='large'
        :closeable='true'
        color='#eee'
        text-color='#666'
        :round='true'
        style='margin-right: 6px;margin-bottom: 6px;'
        @close='onRemoveOption(item)'
      ) {{item.value}}

  van-popup(
    v-model='popup.visible'
    round
    position='bottom'
    style='height: 50%;'
    @closed='onPopupClosed'
  )
    epvan-popup(@on-ok='onOK' :title='schema.label')
      van-checkbox-group(v-if='schema.option.multiple' v-model='popup.checkboxModel')
        van-checkbox(
          v-for='(item, key) in options'
          :key='key'
          :name='item.key'
          style='margin-bottom: 8px;'
          shape='square'
        ) {{item.value}}

      van-radio-group(v-else v-model='popup.radioModel')
        van-radio(
          v-for='(item, key) in options'
          :key='key'
          :name='item.key'
          style='margin-bottom: 8px;'
        ) {{item.value}}

</template>
<script>
import { helper } from 'epage-core'
import viewExtend from '../../extends/view'
import dynamicMixins from '../../mixins/dynamicMixins'
import EpvanPopup from '../../components/epvan-popup'

export default {
  components: {
    EpvanPopup
  },
  extends: viewExtend,
  mixins: [dynamicMixins],
  data () {
    return {
      popup: {
        visible: false,
        checkboxModel: [],
        radioModel: undefined
      },
      formModel: ''
    }
  },
  computed: {
    checkedOptions () {
      const { data, dynamicData, dynamic } = this.schema.option
      const formModel = this.formModel || []
      const _data = dynamic ? dynamicData : data
      const result = _data.filter(item => formModel.indexOf(item.key) > -1)

      return result
    },
    displayValue () {
      const { multiple } = this.schema.option
      const value = this.model[this.schema.key]
      let result = []

      if (multiple) {
        if (Array.isArray(value)) {
          result = value.map(item => {
            const option = this.options.find(o => o.key === item)

            return option ? option.value : ''
          })
        }
      } else {
        const option = this.options.find(o => o.key === value)

        result = option ? [option.value] : []
      }
      return result + ''
    }
  },
  watch: {
    model: {
      handler (mod) {
        const { key, option } = this.schema
        const { multiple } = option
        const value = mod[key]
        const opt = this.options.filter(o => {
          if (multiple) {
            if (!Array.isArray(value)) return
            return value.indexOf(o.key) > -1
          } else {
            return o.key === value
          }
        })
          .map(o => o.key)

        this.formModel = multiple ? opt : opt[0]
      },
      deep: true
    }
  },
  methods: {
    selectRules () {
      const { key, option, rules } = this.schema
      const { multiple } = option
      const rule = { ...rules[0] }
      return [{
        message: rule.message,
        required: this.required,
        validator: (value, rule) => {
          const model = this.store.getModel(key)
          if (!this.required) return true

          if (multiple) {
            return !!(Array.isArray(model) && model.length)
          } else {
            return !!model
          }
        }
      }]
    },
    onRemoveOption (option) {
      const model = this.formModel.filter(key => key !== option.key)
      this.store.updateModel({ [this.schema.key]: model })
      this.validate()
    },
    onOK () {
      const { multiple } = this.schema.option
      const { checkboxModel, radioModel } = this.popup
      const model = multiple ? helper.jsonClone(checkboxModel) : radioModel

      this.store.updateModel({ [this.schema.key]: model })
      this.event('on-change', model)
      this.popup.visible = false
      this.validate()
    },
    onPopupClosed () {
      this.popup.checkboxModel = []
      this.popup.radioModel = undefined
    },
    onPopupOpen () {
      const { data, dynamicData, dynamic, multiple } = this.schema.option
      const _data = dynamic ? dynamicData : data

      if (multiple) {
        const formModel = this.formModel || []
        const result = _data.filter(item => formModel.indexOf(item.key) > -1).map(item => item.key)
        this.popup.checkboxModel = result
      } else {
        const formModel = this.formModel
        const result = _data.filter(item => formModel === item.key).map(item => item.key)[0]
        this.popup.radioModel = result
      }
      this.popup.visible = true
    },
    validate () {
      const { $render } = this.$root.$options.extension
      $render.validateFields(this.schema.name)
    }
  }
}
</script>
