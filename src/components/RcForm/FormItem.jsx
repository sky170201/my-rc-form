import { useState } from "react";
import Field from "./Field";

const FormItem = (props) => {
  const { children, ...rest } = props;
  const [errors, setErrors] = useState([]);

  const onMetaChange = (meta) => {
    if (meta?.errors?.errorFiled) {
      const name = props.name;
      const target = meta?.errors?.errorFiled?.find(
        (item) => item.name === name
      );
      setErrors(target?.errors || []);
    } else {
      setErrors([])
    }
  };

  return (
    <div>
      <Field {...rest} onMetaChange={onMetaChange}>
        {children}
      </Field>
      {errors.map((item) => (
        <span style={{ color: "red" }}>{item}</span>
      ))}
    </div>
  );
};

export default FormItem;
