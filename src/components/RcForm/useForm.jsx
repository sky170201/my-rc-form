import React from "react";
import Schema from "./async-validator";

class FormStore {
  constructor(forceRootUpdate) {
    this.store = {};
    this.callbacks = {};
    this.forceRootUpdate = forceRootUpdate;
    this.fieldEntities = []
  }

  setFieldsValue = (store) => {
    this.store = store;
    this.notifyObservers()
  };
  setFieldValue = (name, value) => {
    this.store[name] = value;
    this.notifyObservers()
  };
  notifyObservers() {
    this.validateFields()
    .then(res => {
      this.fieldEntities.forEach((entity) => {
        entity.errors = []
        entity.onStoreChange()
      })
    })
    .catch(err => {
      this.fieldEntities.forEach((entity) => {
        entity.errors = err
        entity.onStoreChange()
      })
    })
  }

  getFieldValue = (name) => {
    return this.store[name];
  };
  getFieldsValue = () => {
    return this.store;
  };
  getFieldValue = (name) => {
    return this.store[name];
  };

  setCallbacks = (callbacks) => {
    this.callbacks = callbacks;
  };

  validateFields = () => {
    const values = this.getFieldsValue()
    const descriptor = this.fieldEntities.reduce((descriptor, entity) => {
      const rules = entity.props.rules
      if (rules && rules.length > 0) {
        const config = rules.reduce((prev, next) => {
          prev = {...prev, ...next}
          return prev
        }, {})
        descriptor[entity.props.name] = config
      }
      return descriptor
    }, {})
    return new Schema(descriptor).validate(values)
  }

  submit = () => {
    // const { onFinish } = this.callbacks;
    // if (onFinish) {
    //   onFinish(this.store);
    // }
    this.validateFields()
      .then(values => {
        const { onFinish } = this.callbacks;
        if (onFinish) {
          try {
            onFinish(values);
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch(e => {
        const { onFinishFailed } = this.callbacks;
        if (onFinishFailed) {
          onFinishFailed(e);
        }
      });
  };

  setInitialValues = (initialValues, init) => {
    if (!init) {
      this.store = {...initialValues}
    }
  }

  registerField = (entity) => {
    this.fieldEntities.push(entity);
  }

  getForm = () => ({
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    setFieldValue: this.setFieldValue,
    setFieldsValue: this.setFieldsValue,
    setCallbacks: this.setCallbacks,
    setInitialValues: this.setInitialValues,
    submit: this.submit,
    registerField: this.registerField,
    forceRootUpdate: this.forceRootUpdate
  });
}

function useForm(form) {
  const formRef = React.useRef();
  const [, forceUpdate] = React.useState({});

  if (!formRef.current) {
    // 单例模式
    if (form) {
      formRef.current = form;
    } else {
      const forceReRender = () => {
        forceUpdate({});
      };

      const formStore = new FormStore(forceReRender);
      // 指定FormStore要暴露的属性
      formRef.current = formStore.getForm();
    }
  }

  return [formRef.current];
}

export default useForm;
