import type { ComponentType, SVGProps } from 'react'
import type { RunStatus, StepStatus } from '../data/types'
import { CheckIcon, CircleIcon, ClockIcon, CrossIcon, DashIcon, SpinnerIcon } from './Icons'
import './StatusBadge.css'

type Status = RunStatus | StepStatus

// One lookup table for every status: its words, its color "tone" and its icon.
// Record<Status, …> makes TypeScript complain if a status is ever added
// without an entry here.
const META: Record<Status, { label: string; tone: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  succeeded: { label: 'Succeeded', tone: 'ok', Icon: CheckIcon },
  failed: { label: 'Failed', tone: 'fail', Icon: CrossIcon },
  running: { label: 'Running', tone: 'run', Icon: SpinnerIcon },
  scheduled: { label: 'Scheduled', tone: 'sched', Icon: ClockIcon },
  pending: { label: 'Waiting', tone: 'sched', Icon: CircleIcon },
  skipped: { label: 'Skipped', tone: 'muted', Icon: DashIcon },
}

export default function StatusBadge({ status }: { status: Status }) {
  const { label, tone, Icon } = META[status]
  return (
    <span className={`badge badge--${tone}`}>
      <Icon className={status === 'running' ? 'badge__icon badge__icon--spin' : 'badge__icon'} />
      {label}
    </span>
  )
}
