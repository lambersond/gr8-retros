'use client'

import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  type Placement,
} from '@floating-ui/react'
import type { TooltipProps } from './types'

interface TooltipOptions {
  placement?: Placement
}

function useTooltip({ placement = 'top' }: TooltipOptions = {}) {
  const [open, setOpen] = useState(false)

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 8,
      }),
      shift({ padding: 8 }),
    ],
  })

  const context = data.context

  const hover = useHover(context, {
    move: false,
    enabled: true,
    delay: {
      open: 150,
      close: 50,
    },
  })
  const focus = useFocus(context, {
    enabled: true,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const interactions = useInteractions([hover, focus, dismiss, role])

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  )
}

type ContextType = ReturnType<typeof useTooltip> | undefined

const TooltipContext = createContext<ContextType>(undefined)

const useTooltipContext = () => {
  const context = useContext(TooltipContext)

  return context as ReturnType<typeof useTooltip>
}

function TooltipContainer({
  children,
  ...options
}: { children: React.ReactNode } & TooltipOptions) {
  const tooltip = useTooltip(options)
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext()
  const childrenRef = (children as any).ref
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...(children.props as Record<string, any>),
        'data-state': context.open ? 'open' : 'closed',
      } as any),
    )
  }

  return (
    <button
      ref={ref}
      className='w-fit'
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  )
})

const TooltipContent = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function TooltipContent({ style, ...props }, propRef) {
  const context = useTooltipContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])

  if (!context.open) return

  return (
    <FloatingPortal>
      <div
        ref={ref}
        style={{
          ...context.floatingStyles,
          ...style,
        }}
        {...context.getFloatingProps(props)}
      />
    </FloatingPortal>
  )
})

export function Tooltip({
  children,
  title,
  placement,
  contentContainerClasses = 'max-w-[calc(100vw_- _8px)] bg-neutral-300 px-3 py-1 mb-1 rounded-lg z-10000',
  asChild = false,
}: Readonly<TooltipProps>) {
  return (
    <TooltipContainer placement={placement}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent className={`tooltip ${contentContainerClasses}`}>
        {title}
      </TooltipContent>
    </TooltipContainer>
  )
}
