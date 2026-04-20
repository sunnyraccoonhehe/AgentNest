import React from 'react'

type Props = {
  classNameWrapper: string
  classNameLabel?: string
  classNameInput: string
  label?: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
}

export function LabeledInput({
  classNameWrapper,
  classNameLabel,
  classNameInput,
  label,
  type = 'text',
  placeholder,
}: Props) {
  return (
    <div className={classNameWrapper}>
      {label ? <span className={classNameLabel}>{label}</span> : null}
      <input type={type} placeholder={placeholder} className={classNameInput} />
    </div>
  )
}

