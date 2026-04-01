import React from 'react'

const MOOD_TAGS = ['vivid', 'fragmented', 'peaceful', 'unsettling', 'strange', 'recurring', 'emotional', 'symbolic']

export function MoodTagPicker({ selected = [], onChange }) {
  const toggle = (tag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-text-muted text-sm font-medium">Dream Mood</label>
      <div className="flex flex-wrap gap-2">
        {MOOD_TAGS.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${
              selected.includes(tag)
                ? 'bg-accent-purple/20 border-accent-purple/50 text-accent-purple'
                : 'bg-bg-surface border-border text-text-muted hover:border-border-subtle'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
