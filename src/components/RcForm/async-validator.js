class Schema {
  constructor(descriptor) {
    this.descriptor = descriptor
  }

  validate = (values) => {
    return new Promise( async(resolve, reject) => {
      const errorFiled = []
      for (const name in this.descriptor) {
        const value = values[name]
        const rules = this.descriptor[name]
        const ruleKeys = Object.keys(rules)
        const errors = []
        for (let i = 0; i < ruleKeys.length; i++) {
          const ruleKey = ruleKeys[i];
          if (ruleKey === 'required') {
            if (rules[ruleKey] && !value) {
              console.log('value', value)
              errors.push(`${name} is Required`)
            }
          } else if (ruleKey === 'validator') {
            const validator = rules[ruleKey]
            const result = await validator(rules[ruleKey], value)
            if (result.length > 0) {
              errors.push(`${name} ${result}`)
            }
          }
        }
        if (errors.length > 0) {
          errorFiled.push({name, errors})
        }
      }
      console.log('errorFiled', errorFiled)
      if (errorFiled.length > 0) {
        reject({errorFiled, values})
      } else {
        resolve(values)
      }
    })
  }

}

export default Schema