import React, { useState } from 'react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Card } from '@shared/ui/Card'
import { Spinner } from '@shared/ui/Spinner'
import { useAnalytics } from '@hooks/useAnalytics'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const RANGE_OPTIONS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
]

const PIE_COLORS = {
  Full: '#4ade80',
  Partial: '#818cf8',
  Sleep: '#f59e0b',
  Fail: '#f87171',
}

const CustomTooltipStyle = {
  backgroundColor: '#1e2230',
  border: '1px solid #2a2f3d',
  borderRadius: '8px',
  padding: '8px 12px',
  color: '#e8eaf0',
  fontSize: '12px',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={CustomTooltipStyle}>
      <p style={{ color: '#7a8099', marginBottom: 4 }}>{label}</p>
      {payload.map(entry => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export function AnalyticsContent() {
  const { data, loading } = useAnalytics()
  const [range, setRange] = useState(30)

  return (
    <PageWrapper>
        <TierGate feature="analytics">
          {loading || !data ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Range selector */}
              <div className="flex gap-2">
                {RANGE_OPTIONS.map(opt => (
                  <button
                    key={opt.days}
                    onClick={() => setRange(opt.days)}
                    className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors border"
                    style={range === opt.days ? {
                      background: 'rgba(108, 99, 255, 0.15)',
                      borderColor: 'rgba(108, 99, 255, 0.4)',
                      color: 'var(--color-accent)',
                    } : {
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 text-center">
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-tier1)' }}>{data.currentStreak}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Current Streak</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-tier2)' }}>{data.longestStreak}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Longest Streak</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-tier3)' }}>{data.totalEntries}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Total Dreams</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>{data.avgLucidity}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Avg Lucidity</p>
                </Card>
              </div>

              {/* Heatmap */}
              {data.heatmapData?.length > 0 && (
                <Card className="p-4">
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Journal Heatmap (90 days)</p>
                  <div className="flex flex-wrap gap-1">
                    {data.heatmapData.map(d => (
                      <div
                        key={d.date}
                        title={`${d.label}: ${d.hasEntry ? 'Entry recorded' : 'No entry'}`}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          background: d.hasEntry ? 'var(--color-tier1)' : 'var(--color-surface-2)',
                          opacity: d.hasEntry ? 1 : 0.5,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--color-surface-2)', opacity: 0.5 }} />
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>No entry</span>
                    <div className="w-3 h-3 rounded-sm ml-2" style={{ background: 'var(--color-tier1)' }} />
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Entry</span>
                  </div>
                </Card>
              )}

              {/* Lucidity line chart */}
              {data.lucidityData?.length > 1 && (
                <Card className="p-4">
                  <p className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Lucidity Over Time</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={data.lucidityData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3d" />
                      <XAxis dataKey="date" tick={{ fill: '#7a8099', fontSize: 10 }} interval="preserveStartEnd" />
                      <YAxis domain={[0, 10]} tick={{ fill: '#7a8099', fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="lucidity"
                        name="Lucidity"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: 'var(--color-accent)' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Attempt outcomes pie */}
              {data.attemptChart?.some(d => d.value > 0) && (
                <Card className="p-4">
                  <p className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Attempt Outcomes</p>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie
                          data={data.attemptChart.filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={55}
                          dataKey="value"
                        >
                          {data.attemptChart.filter(d => d.value > 0).map(entry => (
                            <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#525770'} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2 flex-1">
                      {data.attemptChart.map(entry => (
                        <div key={entry.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[entry.name] || '#525770' }} />
                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{entry.name}</span>
                          </div>
                          <span className="text-xs font-mono font-medium" style={{ color: 'var(--color-text)' }}>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {data.successRate > 0 && (
                    <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
                      Success rate: <span style={{ color: 'var(--color-tier1)', fontWeight: 600 }}>{data.successRate}%</span>
                    </p>
                  )}
                </Card>
              )}

              {data.totalEntries === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-sm mb-1" style={{ color: 'var(--color-text)' }}>No data yet</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Start journaling and logging attempts to see your analytics.
                  </p>
                </Card>
              )}
            </div>
          )}
        </TierGate>
      </PageWrapper>
  )
}

export function AnalyticsPage() {
  return <AppShell title="Analytics"><AnalyticsContent /></AppShell>
}
