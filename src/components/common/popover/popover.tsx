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
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react'
import { MoreVertIcon } from '../icons'
import type { PopoverOptions, PopoverProps, PopoverTriggerProps } from './types'

function usePopover({ placement = 'bottom', modal }: PopoverOptions = {}) {
  const [open, setOpen] = useState(false)
  const [labelId, setLabelId] = useState<string | undefined>()
  const [descriptionId, setDescriptionId] = useState<string | undefined>()

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'end',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  })

  const context = data.context

  const click = useClick(context, {
    enabled: true,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const interactions = useInteractions([click, dismiss, role])

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId],
  )
}

type ContextType =
  | (ReturnType<typeof usePopover> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>
    })
  | undefined

const PopoverContext = createContext<ContextType>(undefined)

const usePopoverContext = () => {
  const context = useContext(PopoverContext)

  return context as ReturnType<typeof usePopover>
}

function PopoverContainer({
  children,
  modal = false,
  ...restOptions
}: {
  children: React.ReactNode
} & PopoverOptions) {
  const popover = usePopover({ modal, ...restOptions })
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext()
  const childrenRef = (children as any).ref
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...(children.props as Record<string, any>),
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        'data-state': context.open ? 'open' : 'closed',
      } as any),
    )
  }

  return (
    <div
      ref={ref}
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </div>
  )
})

const PopoverContent = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent({ style, ...props }, propRef) {
  const { context: floatingContext, ...context } = usePopoverContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])

  if (!floatingContext.open) return

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          style={{ ...context.floatingStyles, ...style }}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          {...context.getFloatingProps(props)}
        >
          {props.children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  )
})

export function Popover({
  asChild,
  content,
  modal,
  placement,
  asKabab,
  children,
  hidePopover,
}: Readonly<PopoverProps>) {
  if (hidePopover) {
    return <>{children}</>
  }

  return (
    <PopoverContainer placement={placement} modal={modal}>
      <PopoverTrigger asChild={asChild}>
        {asKabab ? <Kebab /> : children}
      </PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </PopoverContainer>
  )
}

function Kebab() {
  return (
    <MoreVertIcon className='-mr-2 -mt-2 cursor-pointer rounded-full min-w-10 size-10 p-2 flex items-center justify-center text-text-secondary hover:bg-secondary/10' />
  )
}
