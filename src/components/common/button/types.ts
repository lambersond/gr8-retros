export type IconButtonProps = {
  icon: React.ElementType
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  tooltip?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  intent?: 'primary' | 'normal' | 'warning' | 'danger' | 'success'
}
