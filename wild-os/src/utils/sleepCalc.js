import { addMinutes, format } from 'date-fns'

export function calculateWbtbWindows(bedtimeStr, cycleDurationMinutes = 90) {
  if (!bedtimeStr) return []

  // bedtimeStr is like "22:30"
  const [hours, minutes] = bedtimeStr.split(':').map(Number)
  const base = new Date()
  base.setHours(hours, minutes, 0, 0)

  const windows = []
  for (let cycle = 3; cycle <= 7; cycle++) {
    const minutesFromBed = cycle * cycleDurationMinutes
    const wakeTime = addMinutes(base, minutesFromBed)
    let alertLevel = 'early'
    if (cycle === 4 || cycle === 5) alertLevel = 'optimal'
    else if (cycle === 3 || cycle === 6) alertLevel = 'good'
    else alertLevel = 'early'

    windows.push({
      cycle,
      minutesFromBed,
      wakeTime: format(wakeTime, 'h:mm a'),
      hoursFromBed: (minutesFromBed / 60).toFixed(1),
      alertLevel,
    })
  }
  return windows
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Good night'
}
