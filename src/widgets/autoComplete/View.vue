<template lang="pug">
.ep-widget
  template(v-if='mode === "display"')
    span {{model[schema.key]}}
  template(v-else)
    van-field.epvan-autocomplete-field(
      :label='schema.label'
      type='text'
      :rules='rules[schema.key]'
    )
      template(#input)
        input.van-field__control(
          :placeholder='schema.placeholder'
          v-model='model[schema.key]'
          @focus="event('on-focus', ...arguments)"
          @blur="event('on-blur', ...arguments)"
          @input='onInput'
        )
        ul.epvan-autocomplete-options(v-show='list.length')
          li(
            v-for='(item, k) in list || []'
            :key='k + "-"'
            :value='item'
            @click="onSelect(item)"
          ) {{item}}

</template>
<script>
import Epage from 'epage'
import viewExtend from '../../extends/view'

const { ajax, debounce } = Epage.helper

export default {
  extends: viewExtend,
  data () {
    return {
      list: [], // 备选数据
      searchValue: '', // 过滤筛选的输入值
      worker: null
    }
  },
  mounted () {
    this.worker = new Epage.Worker()
    this.listenerMessage()
  },
  destroyed () {
    this.worker.terminate()
  },
  methods: {
    onInput (e) {
      this.onSearch('search', e.target.value)
      console.log(e)
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
          this.list = (data || []).filter(item => {
            item = item + ''
            return item && item.indexOf(this.searchValue) > -1
          })
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
        result = data.filter(item => {
          item = item + ''
          return item && item.indexOf(value) > -1
        })
      } else if (dataType === 'dynamic' && url && value.trim()) {
        this.getDynamicData(url, value, adapter, this)
      }
      this.list = result
    },

    getDynamicData: debounce((url, value, adapter, self) => {
      ajax(`${url}${value}`).then(res => {
        this.worker.postMessage({
          action: 'fetch',
          data: res,
          fn: adapter
        })
      }).catch(err => {
        self.$emit('error', { success: false, message: err })
      })
    }, 1000 * 1)
  }
}
</script>
