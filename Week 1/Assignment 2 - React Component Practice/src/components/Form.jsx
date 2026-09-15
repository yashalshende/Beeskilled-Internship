import React, { useState } from 'react';
import './Form.css';
import Button from './Button';

/**
 * Reusable Form Component
 *
 * Demonstrates:
 * - Props: title, description, fields config array, initialValues, onSubmit, submitLabel, resetOnSubmit
 * - State: values, errors, touched, isSubmitting, statusBanner (success/error alerts)
 * - Events: onChange (field change), onBlur (field touch/validation), onSubmit (form dispatch)
 * - Dynamic rendering: renders inputs (text, email, select, textarea, checkbox) via fields.map()
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {Array<{
 *   name: string,
 *   label: string,
 *   type?: 'text'|'email'|'number'|'textarea'|'select'|'checkbox',
 *   placeholder?: string,
 *   required?: boolean,
 *   options?: Array<{ label: string, value: string }>,
 *   validate?: (val: any, values: Object) => string | null,
 *   helperText?: string,
 *   rows?: number
 * }>} props.fields
 * @param {Object} [props.initialValues={}]
 * @param {Function} props.onSubmit - Callback receiving form values and helpers
 * @param {string} [props.submitLabel='Submit']
 * @param {boolean} [props.resetOnSubmit=true]
 */
export default function Form({
  title,
  description,
  fields = [],
  initialValues = {},
  onSubmit,
  submitLabel = 'Submit',
  resetOnSubmit = true,
  className = '',
}) {
  // Initialize state based on initialValues or field defaults
  const [values, setValues] = useState(() => {
    const stateObj = { ...initialValues };
    fields.forEach((field) => {
      if (stateObj[field.name] === undefined) {
        stateObj[field.name] = field.type === 'checkbox' ? false : '';
      }
    });
    return stateObj;
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusBanner, setStatusBanner] = useState(null); // { type: 'success'|'error', message: string }

  // Validation function for a single field
  const validateSingleField = (name, value, allValues) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return '';

    // Built-in required validation
    if (field.required) {
      if (field.type === 'checkbox' && !value) {
        return `${field.label || name} is required.`;
      }
      if (typeof value === 'string' && !value.trim()) {
        return `${field.label || name} is required.`;
      }
    }

    // Built-in email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address.';
      }
    }

    // Custom validator passed via props
    if (typeof field.validate === 'function') {
      const customErr = field.validate(value, allValues);
      if (customErr) return customErr;
    }

    return '';
  };

  // Event handler for input changes
  const handleChange = (name, val) => {
    setValues((prev) => {
      const updated = { ...prev, [name]: val };
      // If already touched, re-validate dynamically
      if (touched[name]) {
        const error = validateSingleField(name, val, updated);
        setErrors((prevErr) => ({ ...prevErr, [name]: error }));
      }
      return updated;
    });
  };

  // Event handler for blur (field unfocused)
  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateSingleField(name, values[name], values);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusBanner(null);

    // Validate all fields
    const newErrors = {};
    const newTouched = {};
    let hasError = false;

    fields.forEach((field) => {
      newTouched[field.name] = true;
      const error = validateSingleField(field.name, values[field.name], values);
      if (error) {
        newErrors[field.name] = error;
        hasError = true;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (hasError) {
      setStatusBanner({
        type: 'error',
        message: 'Please resolve the highlighted validation errors before submitting.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      setStatusBanner({
        type: 'success',
        message: 'Form submitted successfully!',
      });

      if (resetOnSubmit) {
        const resetState = {};
        fields.forEach((f) => {
          resetState[f.name] = f.type === 'checkbox' ? false : '';
        });
        setValues(resetState);
        setTouched({});
        setErrors({});
      }
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err?.message || 'An error occurred while submitting the form.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={`rc-form ${className}`}
      onSubmit={handleSubmit}
      noValidate
      aria-label={title || 'Form'}
    >
      {/* Optional Form Header */}
      {(title || description) && (
        <div className="rc-form-header">
          {title && <h3 className="rc-form-title">{title}</h3>}
          {description && <p className="rc-form-desc">{description}</p>}
        </div>
      )}

      {/* Status Feedback Banner */}
      {statusBanner && (
        <div
          className={`rc-form-banner rc-banner-${statusBanner.type}`}
          role="alert"
          aria-live="polite"
        >
          {statusBanner.type === 'success' ? '✓ ' : '⚠️ '}
          {statusBanner.message}
        </div>
      )}

      {/* Dynamic Fields Rendering via fields.map() */}
      <div className="rc-form-fields">
        {fields.map((field) => {
          const fieldError = touched[field.name] ? errors[field.name] : '';
          const isInvalid = Boolean(fieldError);
          const fieldId = `field-${field.name}`;

          return (
            <div
              key={field.name}
              className={`rc-form-group ${isInvalid ? 'rc-group-invalid' : ''}`}
            >
              {/* Field Label (Accessible htmlFor) */}
              {field.type !== 'checkbox' && (
                <label htmlFor={fieldId} className="rc-form-label">
                  {field.label}
                  {field.required && <span className="rc-asterisk"> *</span>}
                </label>
              )}

              {/* Dynamic Input Types */}
              {field.type === 'textarea' ? (
                <textarea
                  id={fieldId}
                  name={field.name}
                  value={values[field.name] || ''}
                  rows={field.rows || 4}
                  placeholder={field.placeholder}
                  className={`rc-form-input rc-form-textarea ${isInvalid ? 'is-invalid' : ''}`}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  aria-invalid={isInvalid}
                  aria-describedby={isInvalid ? `${fieldId}-err` : undefined}
                />
              ) : field.type === 'select' ? (
                <select
                  id={fieldId}
                  name={field.name}
                  value={values[field.name] || ''}
                  className={`rc-form-input rc-form-select ${isInvalid ? 'is-invalid' : ''}`}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  aria-invalid={isInvalid}
                  aria-describedby={isInvalid ? `${fieldId}-err` : undefined}
                >
                  <option value="">{field.placeholder || 'Select an option'}</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div className="rc-checkbox-row">
                  <input
                    type="checkbox"
                    id={fieldId}
                    name={field.name}
                    checked={Boolean(values[field.name])}
                    className="rc-form-checkbox"
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    onBlur={() => handleBlur(field.name)}
                    aria-invalid={isInvalid}
                  />
                  <label htmlFor={fieldId} className="rc-checkbox-label">
                    {field.label}
                    {field.required && <span className="rc-asterisk"> *</span>}
                  </label>
                </div>
              ) : (
                <input
                  type={field.type || 'text'}
                  id={fieldId}
                  name={field.name}
                  value={values[field.name] || ''}
                  placeholder={field.placeholder}
                  className={`rc-form-input ${isInvalid ? 'is-invalid' : ''}`}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  aria-invalid={isInvalid}
                  aria-describedby={isInvalid ? `${fieldId}-err` : undefined}
                />
              )}

              {/* Error Message rendering */}
              {isInvalid && (
                <span id={`${fieldId}-err`} className="rc-field-error" role="alert">
                  {fieldError}
                </span>
              )}

              {/* Helper text when valid */}
              {!isInvalid && field.helperText && (
                <span className="rc-field-helper">{field.helperText}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Form Submit Action using reusable Button */}
      <div className="rc-form-actions">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting}
          disabled={isSubmitting}
          fullWidth
          label={submitLabel}
        />
      </div>
    </form>
  );
}
