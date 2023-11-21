import React from 'react';
import Form, {Field} from '../../components/RcForm'
import FormItem from '../../components/RcForm/FormItem';

function ReForm() {

  const passwordValidator = (rule, value) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value.length > 4) {
          resolve('密码长度不得超过4位')
        }
        resolve('')
      }, 1000)
    })
  }
  return (
    <Form
      initialValues={{
        username: '',
        password: ''
      }}
      onFinish={(values) => {
        console.log(values);
      }}
      onFinishFailed={(errorInfo) => {
        console.log('errorInfo', errorInfo)
      }}
    >
      <FormItem name='username' rules={[{required: true}, {min: 3}]}>
        <input placeholder='用户名' />
      </FormItem>
      <FormItem name='password' rules={[{min: 3}, {validator: passwordValidator}]}>
        <input placeholder='密码' />
      </FormItem>
      <button>提交</button>
    </Form>
  );
}

export default ReForm;
