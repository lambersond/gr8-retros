export type SettingsToggleProps = {
  canEdit?: boolean
  children?: React.ReactNode
  hint?: React.ReactNode
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  isEnabled?: boolean
  isUnlocked?: boolean
  onToggle: () => void
  title: string
}
