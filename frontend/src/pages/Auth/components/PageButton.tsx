import React from 'react'

type Props = {
  className: string
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

export function PageButton({ className, onClick, children, disabled }: Props) {
  return (
    <button 
      className={className} 
      onClick={onClick}
      disabled={disabled}
      style={{ opacity: disabled ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  )
}