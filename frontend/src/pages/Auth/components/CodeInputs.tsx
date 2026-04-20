import React from 'react'

type Props = {
  classNameGroup: string
  classNameInput: string
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
  onChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void
}

export function CodeInputs({
  classNameGroup,
  classNameInput,
  inputRefs,
  onChange,
  onKeyDown,
}: Props) {
  return (
    <div className={classNameGroup}>
      {[...Array(5)].map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className={classNameInput}
          ref={(el) => {
            inputRefs.current[i] = el
          }}
          onChange={(e) => onChange(e, i)}
          onKeyDown={(e) => onKeyDown(e, i)}
        />
      ))}
    </div>
  )
}

