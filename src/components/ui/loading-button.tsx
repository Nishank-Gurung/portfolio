import {cn} from '@/lib/utils'
import {Button} from './button'
import {IconLoader2} from '@tabler/icons-react'
import {RefObject} from 'react'

interface LoadingButtonProps extends React.ComponentProps<'button'> {
  loading: boolean
  disabled?: boolean
  className?: string
  showIconOnly?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  ref?: RefObject<HTMLButtonElement | null>
}
const LoadingButton = ({
  loading,
  disabled,
  className,
  showIconOnly,
  variant,
  ref,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      variant={variant}
      ref={ref && ref}
      disabled={loading || disabled}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {loading && <IconLoader2 className="size-5! animate-spin" />}
      {loading && showIconOnly ? '' : props.children}
    </Button>
  )
}
export default LoadingButton
