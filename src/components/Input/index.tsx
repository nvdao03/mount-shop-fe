import type { InputHTMLAttributes } from 'react'

interface InputPropTypes extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  customHeight?: string
  register: any
  classNameInput: string
  classNameLabel: string
  classNameError: string
  classNameErrorMessage: string
  errors?: any
  errorMessage?: string
  disabled?: boolean
  multiple?: boolean
  handleOnChangeSubmitImage?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({
  label,
  register,
  classNameInput,
  classNameLabel,
  classNameError,
  classNameErrorMessage,
  errors,
  name,
  type,
  errorMessage,
  placeholder,
  disabled,
  multiple,
  customHeight,
  handleOnChangeSubmitImage
}: InputPropTypes) {
  return (
    <div>
      <label className={classNameLabel}>{label}</label>
      <div className={`h-10 ${customHeight}`}>
        <input
          {...register(name)}
          disabled={disabled}
          multiple={multiple}
          type={type}
          placeholder={placeholder}
          className={classNameInput}
          onChange={handleOnChangeSubmitImage}
        />
      </div>
      {errors && (
        <div className={classNameError}>
          <svg xmlns='http://www.w3.org/2000/svg' width='15' height='14' viewBox='0 0 15 14' fill='none'>
            <path
              d='M7.49967 0.333252C3.81967 0.333252 0.833008 3.31992 0.833008 6.99992C0.833008 10.6799 3.81967 13.6666 7.49967 13.6666C11.1797 13.6666 14.1663 10.6799 14.1663 6.99992C14.1663 3.31992 11.1797 0.333252 7.49967 0.333252ZM8.16634 10.3333H6.83301V6.33325H8.16634V10.3333ZM8.16634 4.99992H6.83301V3.66659H8.16634V4.99992Z'
              fill='#FF3B30'
            />
          </svg>
          <p className={classNameErrorMessage}>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}
