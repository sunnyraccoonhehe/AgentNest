import React from 'react'

type Props = {
  className: string
  onClick: () => void
  children: React.ReactNode
}

export function PageButton({ className, onClick, children }: Props) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )
}

