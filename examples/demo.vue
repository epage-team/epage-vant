<template lang="pug">
.form-demo
  div.demo-container(ref='form')
  //- van-button(type='primary' block @click='resetForm') 重置
  //- van-row
    //- van-col(span='6' offset='1')
    //-   van-button(type='primary' block @click='getFormData') 打印Form
    //- van-col(span='6' offset='1')
    //-   van-button(type='default' block @click='validateForm') 校验
    van-col(span='6' offset='1')
      van-button(type='primary' block @click='resetForm') 重置
  //- p Form Data
  //- pre {{formData}}

</template>
<script>
import widgets, { Render } from 'epage-vant'
import rootSchema from './schema.json'

export default {
  data () {
    return {
      formData: '{}',
      form: null
    }
  },
  mounted () {
    this.getRootSchema().then(schema => {
      this.form = this.formRender(schema)
      window.b = this.form
      setTimeout(() => {
        this.form.store.updateModel({
          name: 'Tom',
          email: 'tom@gmailcom',
          school: '',
          school2: ['beida'],
          city: ['hubei', 'wuhan'],
          borth: '1996-06-02',
          time: '12:24:30',
          age: 24,
          sex: 'nan',
          public: true,
          rate: 3,
          intrest: ['dance', 'cooking', 'film'],
          avatar: [{
            url: 'https://img.yzcdn.cn/vant/leaf.jpg'
          }]
        }, true)
      }, 1000)
      // this.getModel().then(model => {
      //   form.store.updateModel(model)
      // })
      // this.listenerForm(form)
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
      return new Render({ el, schema, widgets, mode: 'edit' })
      // return this.render(el, { mode: 'edit' })
    },
    getSchema (schema) {
      console.log(1, schema)
    },
    getFormData () {
      this.formData = this.form.store.getFormData()
      console.log(this.formData)
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
