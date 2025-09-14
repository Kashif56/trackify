import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component with label, error handling, and different variants
 */
const Input = forwardRef(({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  autoComplete,
  className = '',
  labelClassName = '',
  inputClassName = '',
  fullWidth = true,
  ...props
}, ref) => {
  // Base classes for all inputs
  const baseInputClasses = 'block px-3 py-2 border-2 shadow-sm border-gray-900 rounded-md focus:outline-none transition-colors duration-200';
  
  // Error specific classes
  const errorClasses = error 
    ? 'border-status-error focus:ring-status-error focus:border-status-error' 
    : 'border-neutral-light focus:ring-primary focus:border-primary';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'bg-neutral-light opacity-50 cursor-not-allowed' : '';
  
  // Combine all classes
  const inputClasses = `
    ${baseInputClasses}
    ${errorClasses}
    ${widthClasses}
    ${disabledClasses}
    ${inputClassName}
  `.trim();

  return (
    <div className={`${className}`}>
      {label && (
        <label 
          htmlFor={id || name} 
          className={`block text-sm text-gray-600 mb-1 ${labelClassName} ${required ? 'required' : ''}`}
        >
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-status-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Input;
