import {cn} from '@/lib/utils'

import React, {useState} from 'react'
import {IconEye, IconEyeOff} from '@tabler/icons-react'
import {Input} from './input'
const PasswordInput = ({
  className,
  ...props
}: React.ComponentProps<'input'>) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="relative">
      <Input
        autoComplete="off"
        type={showPassword ? 'text' : 'password'}
        className={cn('pe-10', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        title={showPassword ? 'Hide Password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground cursor-pointer"
      >
        {showPassword ? (
          <IconEyeOff className="size-5" />
        ) : (
          <IconEye className="size-5" />
        )}
      </button>
    </div>
  )
}

PasswordInput.displayName = 'PasswordInput'
export {PasswordInput}
