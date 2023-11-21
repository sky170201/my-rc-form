import React from 'react';
import FieldContext from './FieldContext'
import useForm from './useForm';

function Form(props) {
  const { onFinish, initialValues, onFinishFailed, children, form } = props

  const [formInstance] = useForm(form);

  formInstance.setCallbacks({
    onFinish,
    onFinishFailed,
  })

  // 初次渲染时给store赋默认值
  const mountRef = React.useRef(null);
  formInstance.setInitialValues(initialValues, mountRef.current)
  if (!mountRef.current) {
    mountRef.current = true;
  }
  
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        formInstance.submit();
      }}
    >
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
      
    </form>
  );
}

export default Form;
