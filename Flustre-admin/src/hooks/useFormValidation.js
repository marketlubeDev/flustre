import { useState } from "react";

const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (!validationRules[name]) return "";

    const rules = validationRules[name];

    // Required validation
    if (rules.required && !value && value !== 0) {
      return `${name} is required`;
    }

    // Number validation
    if (rules.type === "number" && value) {
      if (isNaN(value)) return "Please enter a valid number";
      if (rules.min && Number(value) < rules.min)
        return `Minimum value is ${rules.min}`;
      if (rules.max && Number(value) > rules.max)
        return `Maximum value is ${rules.max}`;
    }

    // Custom validation
    if (rules.validate) {
      return rules.validate(value, values);
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
    );
    return isValid;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setValues,
    setErrors,
    setTouched,
  };
};

export default useFormValidation;
