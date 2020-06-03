<template lang="pug">
.form-demo
  div(ref='form')
  //- Button(type='default' @click='validateForm') 校验
  //- Button(type='default' @click='resetForm') 重置
  //- Button(type='default' @click='getFormData') getFormData
  //- Button(type='default' @click='getSchema') getSchema

</template>
<script>
import widgets, { Render } from 'epage-vant'
import rootSchema from './schema.json'

export default {
  data () {
    return {
      form: null
    }
  },
  mounted () {
    this.getRootSchema().then(schema => {
      const form = this.formRender(schema)
      this.form = form
      this.getModel().then(model => {
        form.store.updateModel(model)
      })
      this.listenerForm(form)
    })
  },
  methods: {
    validateForm (args) {
      this.form.validateFields().then(args => {
        console.log('validate: ', args)
      })
    },
    resetForm (args) {
      this.form.resetFields()
    },
    getRootSchema () {
      return Promise.resolve(rootSchema)
    },
    formRender (schema) {
      const el = this.$refs.form
      // return new Render({ el, schema, widgets: myWidgets})
      return new Render({ el, schema, widgets })
      // return this.render(el, { mode: 'edit' })
    },
    getSchema (schema) {
      console.log(1, schema)
    },
    getFormData (formData) {
      console.log(2, formData)
      // console.log(this.form.store.getFormData())
    },
    getModel () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const model = {
            k2xzhr4ry: 'Karen Davis',
            kGZLAx3Vx: '讷讷呢',
            kZwV49N9y: 2,
            kdNpYtQt5: ['A'],
            kFTWtRmbd: 'A',
            k4Yvnwqbl: '12',
            kb82OHIBH: ''
          }
          resolve(model)
        }, 1000)
      })
    },
    listenerForm (form) {
      form
        .on('k17U0aTQ4', 'change', e => {
          console.log(e.target.value, 9999)
        })
        .on('k17U0aTQ4', 'enter', e => {
          console.log(e.target.value, 'enter')
        })
        .on('w1552011657389', 'change', e => {
          console.log('chagne: ', e.target.value)
        })
        .off('w1552011619728', 'change')
    }
  }
}
</script>
<style lang='less'>
.form-demo{
  background-color:#eee;
}
</style>
