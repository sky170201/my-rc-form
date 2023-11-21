import React from "react";
import FieldContext from "./FieldContext";

class Field extends React.Component {
  static contextType = FieldContext;
  constructor() {
    super()
    this.errors = {}
  }

  componentDidMount() {
    const { registerField } = this.context;
    registerField(this);
  }

  getMeta = () => {
    return {
      errors: this.errors
    }
  }

  triggerMetaEvent = () => {
    const { onMetaChange } = this.props
    onMetaChange?.(this.getMeta())
  }

  onStoreChange = () => {
    this.triggerMetaEvent()
    this.forceUpdate()
  }

  getControlled = (childProps) => {
    const { getFieldValue, setFieldValue } = this.context;
    const { name } = this.props;

    const control = {
      ...childProps,
      // 以下两个属性是react属性，react框架会同步到元素标签的属性上
      value: getFieldValue(name),
      onChange: (event) => {
        setFieldValue(name, event.target.value);
      },
    };

    return control;
  };

  render() {
    return React.cloneElement(
      this.props.children,
      this.getControlled(this.props.children.props)
    );
  }
}

export default Field;
