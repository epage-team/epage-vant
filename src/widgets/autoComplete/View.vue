<template lang="pug">
.epvan-widget
  epvan-field(v-if='isDisplay' :required='required' :schema='schema')
    van-field.epvan-autoComplete-field(
      type='text'
      v-model='model[schema.key]'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        input.van-field__control(
          readonly
          :placeholder='schema.placeholder'
          v-model='model[schema.key]'
        )
      span {{model[schema.key]}}
  epvan-field(v-else :required='required' :schema='schema')
    van-field.epvan-autoComplete-field(
      type='text'
      v-model='model[schema.key]'
      :rules='widgetRules'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        input.van-field__control(
          :placeholder='schema.placeholder'
          v-model='model[schema.key]'
          @focus="event('on-focus', ...arguments)"
          @blur="event('on-blur', ...arguments)"
          @input='onInput'
        )
        ul.epvan-autoComplete-options(v-show='list.length')
          li(
            v-for='(item, k) in list || []'
            :key='k + "-"'
            :value='item'
            @click="onSelect(item)"
          ) {{item}}

</template>
<script>
import { helper, Worker as EpageWorker } from 'epage-core'
import viewExtend from '../../extends/view'

const { ajax, debounce } = helper

export default {
  extends: viewExtend,
  data () {
    return {
      list: [], // 备选数据
      searchValue: '', // 过滤筛选的输入值
      worker: null
    }
  },
  computed: {
    widgetRules () {
      const rules = this.rules[this.schema.key]
      const { validator, pattern, ...props } = rules[0]
      return [props]
    }
  },
  mounted () {
    this.worker = new EpageWorker()
    this.listenerMessage()
  },
  destroyed () {
    this.worker.terminate()
  },
  methods: {
    onInput (e) {
      this.onSearch('search', e.target.value)
    },
    onSelect (item) {
      this.event('on-select', item)
      this.store.updateModel({ [this.schema.key]: item })
      this.list = []
    },
    listenerMessage () {
      this.worker.onmessage = e => {
        const { message, success, data } = e.data

        if (success) {
          // 更新获取到的动态选项
          const { key } = this.schema
          this.store.updateWidgetOption(key, { dynamicData: data })
          this.$emit('success', data)
          this.list = (data || []).filter(item => this.diffIgnoreCase(item, this.searchValue))
        } else {
          this.$emit('error', message)
        }
      }
    },

    onSearch (type, value) {
      this.searchValue = value
      this.event(type, value)
      // spf 右侧设置输入项
      const { type: dataType, data, url, adapter } = this.schema.option
      let result = []

      if (dataType === 'static') {
        result = data.filter(item => this.diffIgnoreCase(item, value))
        this.list = result
      } else if (dataType === 'dynamic' && url && value.trim()) {
        this.getDynamicData(url, value, adapter, this)
      }
    },

    getDynamicData: debounce((url, value, adapter, self) => {
      ajax(`${url}?${value}`).then(res => {
        self.worker.postMessage({
          action: 'custom',
          data: res,
          fn: adapter
        })
      }).catch(err => {
        self.$emit('error', { success: false, message: err })
      })
    }, 500 * 1),
    diffIgnoreCase (str1, str2) {
      str1 = (str1 + '').toLowerCase()
      return str1 && str2 && str1.indexOf(str2.toLowerCase()) > -1
    }
  }
}
</script>
