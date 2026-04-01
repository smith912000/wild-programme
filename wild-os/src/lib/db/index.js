import { openDB } from 'idb'

const DB_NAME = 'wild-os-db'
const DB_VERSION = 1

let dbPromise = null

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('journal_entries')) {
          const je = db.createObjectStore('journal_entries', { keyPath: 'id' })
          je.createIndex('createdAt', 'createdAt')
          je.createIndex('isLucid', 'isLucid')
        }
        if (!db.objectStoreNames.contains('tracker_nights')) {
          db.createObjectStore('tracker_nights', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('breathing_sessions')) {
          const bs = db.createObjectStore('breathing_sessions', { keyPath: 'id' })
          bs.createIndex('startedAt', 'startedAt')
        }
        if (!db.objectStoreNames.contains('attempt_logs')) {
          const al = db.createObjectStore('attempt_logs', { keyPath: 'id' })
          al.createIndex('attemptDate', 'attemptDate')
        }
        if (!db.objectStoreNames.contains('supplement_logs')) {
          const sl = db.createObjectStore('supplement_logs', { keyPath: 'id' })
          sl.createIndex('date', 'date')
        }
        if (!db.objectStoreNames.contains('custom_protocols')) {
          db.createObjectStore('custom_protocols', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('ritual_blocks')) {
          db.createObjectStore('ritual_blocks', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('shadow_responses')) {
          const sr = db.createObjectStore('shadow_responses', { keyPath: 'id' })
          sr.createIndex('promptId', 'promptId')
        }
        if (!db.objectStoreNames.contains('incubation_entries')) {
          db.createObjectStore('incubation_entries', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

// Journal Entries
export async function getAllJournalEntries() {
  const db = await getDb()
  const entries = await db.getAll('journal_entries')
  return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
export async function getJournalEntry(id) {
  const db = await getDb()
  return db.get('journal_entries', id)
}
export async function saveJournalEntry(entry) {
  const db = await getDb()
  await db.put('journal_entries', entry)
  return entry
}
export async function deleteJournalEntry(id) {
  const db = await getDb()
  await db.delete('journal_entries', id)
}

// Tracker Nights
export async function getAllTrackerNights() {
  const db = await getDb()
  return db.getAll('tracker_nights')
}
export async function getTrackerNight(id) {
  const db = await getDb()
  return db.get('tracker_nights', id)
}
export async function saveTrackerNight(night) {
  const db = await getDb()
  await db.put('tracker_nights', night)
  return night
}

// Breathing Sessions
export async function getAllBreathingSessions() {
  const db = await getDb()
  const sessions = await db.getAll('breathing_sessions')
  return sessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
}
export async function saveBreathingSession(session) {
  const db = await getDb()
  await db.put('breathing_sessions', session)
  return session
}

// Attempt Logs
export async function getAllAttemptLogs() {
  const db = await getDb()
  const logs = await db.getAll('attempt_logs')
  return logs.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate))
}
export async function getAttemptLog(id) {
  const db = await getDb()
  return db.get('attempt_logs', id)
}
export async function saveAttemptLog(log) {
  const db = await getDb()
  await db.put('attempt_logs', log)
  return log
}
export async function deleteAttemptLog(id) {
  const db = await getDb()
  await db.delete('attempt_logs', id)
}

// Supplement Logs
export async function getSupplementLogsForDate(date) {
  const db = await getDb()
  const all = await db.getAllFromIndex('supplement_logs', 'date', date)
  return all
}
export async function getAllSupplementLogs() {
  const db = await getDb()
  return db.getAll('supplement_logs')
}
export async function saveSupplementLog(log) {
  const db = await getDb()
  await db.put('supplement_logs', log)
  return log
}
export async function deleteSupplementLog(id) {
  const db = await getDb()
  await db.delete('supplement_logs', id)
}

// Custom Protocols
export async function getAllProtocols() {
  const db = await getDb()
  return db.getAll('custom_protocols')
}
export async function getProtocol(id) {
  const db = await getDb()
  return db.get('custom_protocols', id)
}
export async function saveProtocol(protocol) {
  const db = await getDb()
  await db.put('custom_protocols', protocol)
  return protocol
}
export async function deleteProtocol(id) {
  const db = await getDb()
  await db.delete('custom_protocols', id)
}

// Ritual Blocks
export async function getAllRitualBlocks() {
  const db = await getDb()
  return db.getAll('ritual_blocks')
}
export async function saveRitualBlock(block) {
  const db = await getDb()
  await db.put('ritual_blocks', block)
  return block
}
export async function deleteRitualBlock(id) {
  const db = await getDb()
  await db.delete('ritual_blocks', id)
}

// Shadow Responses
export async function getAllShadowResponses() {
  const db = await getDb()
  const all = await db.getAll('shadow_responses')
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
export async function saveShadowResponse(response) {
  const db = await getDb()
  await db.put('shadow_responses', response)
  return response
}

// Incubation Entries
export async function getAllIncubationEntries() {
  const db = await getDb()
  const all = await db.getAll('incubation_entries')
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
export async function getIncubationEntry(id) {
  const db = await getDb()
  return db.get('incubation_entries', id)
}
export async function saveIncubationEntry(entry) {
  const db = await getDb()
  await db.put('incubation_entries', entry)
  return entry
}

// Export all data
export async function exportAllData() {
  const db = await getDb()
  const data = {}
  const stores = ['journal_entries', 'tracker_nights', 'breathing_sessions', 'attempt_logs', 'supplement_logs', 'custom_protocols', 'ritual_blocks', 'shadow_responses', 'incubation_entries']
  for (const store of stores) {
    data[store] = await db.getAll(store)
  }
  return data
}

// Clear all data
export async function clearAllData() {
  const db = await getDb()
  const stores = ['journal_entries', 'tracker_nights', 'breathing_sessions', 'attempt_logs', 'supplement_logs', 'custom_protocols', 'ritual_blocks', 'shadow_responses', 'incubation_entries']
  for (const store of stores) {
    await db.clear(store)
  }
}
