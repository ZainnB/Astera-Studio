import type { ComponentType, SVGProps } from 'react'
import type { StepKind } from '../../data/types'
import { DatabaseIcon, FilterIcon, JoinIcon, OutputIcon, SheetIcon, TransformIcon } from '../Icons'

const ICONS: Record<StepKind, ComponentType<SVGProps<SVGSVGElement>>> = {
  excel: SheetIcon,
  database: DatabaseIcon,
  filter: FilterIcon,
  join: JoinIcon,
  transform: TransformIcon,
  output: OutputIcon,
}

export default function StepKindIcon({ kind, className }: { kind: StepKind; className?: string }) {
  const Icon = ICONS[kind]
  return (
    <span className={`kind-icon kind-icon--${kind} ${className ?? ''}`}>
      <Icon />
    </span>
  )
}
