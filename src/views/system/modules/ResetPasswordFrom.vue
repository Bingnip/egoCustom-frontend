<template>
  <a-modal
    title="修改管理员密码"
    :width="550"
    :visible="visible"
    :confirmLoading="loading"
    okText="立即修改"
    cancelText="取消"
    @ok="submit"
    @cancel="cancel"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="登录账号">
          <a-input
            placeholder="请填写登录账号"
            :disabled="true"
            style="background: none;"
            v-decorator="['username', { rules: [{ required: true, message: '登录账号不能为空！' }] }]"
          />
        </a-form-item>
        <a-form-item label="登录密码">
          <a-input
            type="password"
            placeholder="请填写登录密码"
            v-decorator="['password', { rules: [{ required: true, message: '密码不能为空！' }] }]"
            @keyup.native.enter="submit"
          />
        </a-form-item>
        <a-form-item label="确认密码">
          <a-input
            type="password"
            placeholder="请填写确认密码"
            v-decorator="[
              'password2',
              { rules: [{ required: true, message: '确认密码不能为空！' }, { validator: compareToFirstPassword }] }
            ]"
            @keyup.native.enter="submit"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { ServeUpdateAdminPassword } from '@/api/admin'

// 表单字段
const fields = ['id', 'username', 'password', 'password2']

export default {
  name: 'ResetPassword',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      formLayout: {
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 7
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          }
        }
      },
      loading: false,
      form: this.$form.createForm(this)
    }
  },
  watch: {
    model () {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    }
  },
  created () {
    fields.forEach(v => this.form.getFieldDecorator(v))
  },
  methods: {
    submit () {
      this.loading = true
      this.form.validateFields((errors, values) => {
        if (!errors) {
          ServeUpdateAdminPassword(values)
            .then(res => {
              if (res.code == 200) {
                this.loading = false
                this.$message.success('密码修改成功')
                this.$emit('cancel')
              } else {
                this.$message.info('密码修改失败')
              }
            })
            .catch(err => {
              this.$message.error('网络异常,请稍后再试...')
              this.loading = false
            })
        } else {
          this.loading = false
        }
      })
    },
    cancel () {
      this.$emit('cancel')
    },

    // 确认密码验证事件
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('您输入的两个密码不一致！')
      } else {
        callback()
      }
    }
  }
}
</script>
