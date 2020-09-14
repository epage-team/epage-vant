<template lang="pug">
.epvan-widget.epvan-upload
  epvan-field(v-if='isDisplay' :required='required' :help='schema.help' :label='schema.label')
    van-field.epvan-upload-display(
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-uploader(
          :disabled='true'
          :deletable='false'
          :file-list='model[schema.key]'
        )

  epvan-field(v-else :required='required' :help='schema.help' :label='schema.label')
    van-field(
      :rules='rules[schema.key]'
      :name='schema.name'
      :required='required'
      :size='rootSchema.size'
    )
      template(#input)
        van-uploader(
          v-model='model[schema.key]'
          :disabled='schema.disabled'
          :accept='accept'
          :multiple='schema.option.multiple'
          :max-size='schema.option.maxSize'
          :before-read="beforeRead"
          @delete='onDelete'
          @oversize='onOversize'
        )
</template>
<script>
import { helper, Worker as EpageWorker } from 'epage-core'
import { Toast } from 'vant'
import viewExtend from '../../extends/view'
import { getAccept } from './constant'

const { isNotEmptyString, isArray, include, ajax } = helper

export default {
  extends: viewExtend,
  data () {
    return {
      worker: null
    }
  },
  computed: {
    accept () {
      const { format } = this.schema.option
      const ac = format.map(f => getAccept(f))
      const ext = format.map(f => ('.' + f))
      const list = ac.concat(ext)
      return list.length ? list.join(',') : getAccept(null, 'application').join(',')
    },
    headers () {
      const result = {}
      const { headers } = this.schema.option

      if (isArray(headers)) {
        headers.forEach(item => {
          if (
            isNotEmptyString(item.key) &&
            isNotEmptyString(item.value)
          ) {
            result[item.key.trim()] = item.value.trim()
          }
        })
      }
      return result
    }
  },
  mounted () {
    this.worker = new EpageWorker()
    this.listenerMessage()
  },
  methods: {
    listenerMessage () {
      const { key } = this.schema
      this.worker.onmessage = e => {
        const { message, success, data } = e.data
        if (success) {
          let files = this.store.getModel(key)
          // data => Array<Object{url, name}>
          files = files.concat(data)
          this.store.updateModel({ [key]: files })
        } else {
          this.$emit('error', message)
        }
      }
    },
    // check format
    beforeRead (file) {
      // 单选或多选
      const files = isArray(file) ? file : [file]
      const { format } = this.schema.option
      const rightFiles = files.filter(file => {
        const type = file.type.match(/.+\/([a-zA-Z\d]+)/)
        if (!isArray(type)) return false
        const mainTypes = this.accept.split(/\s*,\s*/)
          .filter(acc => acc.indexOf('/*') > -1)
          .map(s => s.split('*')[0])
        const hasMainType = mainTypes.filter(main => type[0].indexOf(main) > -1).length > 0

        return include(this.accept, type[0]) || hasMainType
      })

      if (rightFiles.length !== files.length) {
        Toast({
          message: `格式不符合，请选择以下格式文件：\n${format.join(', ')}`,
          duration: 2000
        })
        this.$emit('on-upload-format-error', files)
        return false
      }
      this.$emit('on-before-upload', files)
      const all = files.map(file => this.uploadFile(file))
      return Promise.all(all)
    },
    uploadFile (file) {
      const { option, name } = this.schema
      const { action, maxSize, data = {}, withCredentials, adapter } = option
      const formData = new FormData()
      for (const k in data) {
        formData.append(k, data[k])
      }
      formData.append(name, file)
      return new Promise((resolve, reject) => {
        ajax(action, {
          method: 'POST',
          credentials: withCredentials ? 'include' : 'same-origin',
          headers: new Headers(this.headers || {}),
          body: formData
        }).then(res => {
          if (file.size > maxSize) {
            this.onOversize(file)
            reject(new Error(file))
          } else {
            this.$emit('on-upload-success', res, file)
            this.worker.postMessage({
              action: 'custom',
              data: res,
              fn: adapter
            })
            resolve()
          }
        }).catch(err => {
          this.$emit('on-upload-error', err, file)
          reject(err)
        })
      })
      // demo
      // const { option } = this.schema
      // const { adapter, maxSize } = option
      // return new Promise((resolve, reject) => {
      //   const res = []
      //   if (file.size > maxSize) {
      //     this.onOversize(file)
      //     reject(new Error(file))
      //   } else {
      //     this.worker.postMessage({
      //       action: 'custom',
      //       data: res,
      //       fn: adapter
      //     })
      //     resolve()
      //   }
      // })
    },
    onDelete () {
      this.$emit('on-remove-file', ...arguments)
    },
    onOversize (file) {
      const { maxSize } = this.schema.option
      const size = Math.round(maxSize / 1000)
      const str = size >= 1000 ? Math.round(size / 1000) + 'M' : size + 'k'
      Toast({
        message: `文件不能超过 ${str}`,
        duration: 2000
      })
      this.$emit('on-size-error', ...arguments)
    },

    downloadFile (url, name) {
      Toast({
        message: '文件已开始下载，请勿重复点击操作！',
        duration: 2000
      })

      fetch(url)
        .then(res => res.blob())
        .then(blob => this.downloadBlob(blob, name))
    },

    // 下载文件方法
    downloadBlob (blob, name) {
      const link = document.createElement('a')
      const objectURL = new Blob([blob])

      link.download = name
      link.style.display = 'none'
      link.href = URL.createObjectURL(objectURL)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>
