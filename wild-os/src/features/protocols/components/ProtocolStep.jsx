import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Wind, Moon, Clock, AlignLeft } from 'lucide-react'

const STEP_ICONS = { breathe: Wind, meditate: Moon, rest: Clock, custom: AlignLeft }
const STEP_COLORS = { breathe: '#3b82f6', meditate: '#a855f7', rest: '#22c55e', custom: '#c9a84c' }

export function ProtocolStep({ step, onDelete, dragHandle }) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging
  } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = STEP_ICONS[step.type] || AlignLeft
  const color = STEP_COLORS[step.type] || '#c9a84c'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-bg-card border border-border rounded-xl p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-text-faint hover:text-text-muted cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: color + '22' }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-medium truncate">{step.label}</p>
        <p className="text-text-faint text-xs">{step.type} · {step.duration}m</p>
      </div>
      <button onClick={() => onDelete(step.id)} className="text-text-faint hover:text-accent-red p-1">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
