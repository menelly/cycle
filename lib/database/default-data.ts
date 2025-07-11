/**
 * Default/Sample Data for Plausible Deniability
 * 
 * This data is intentionally bland and generic to provide cover for users
 * in unsafe situations. When "panic mode" is triggered, real data is replaced
 * with this innocuous sample data.
 */

export const DEFAULT_REPRODUCTIVE_HEALTH_DATA = [
  {
    id: 'sample-1',
    date: '2024-01-15',
    menstrualFlow: 'none',
    basalBodyTemp: null,
    cervicalMucus: '',
    symptoms: [],
    mood: '',
    notes: '',
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z')
  },
  {
    id: 'sample-2', 
    date: '2024-01-20',
    menstrualFlow: 'none',
    basalBodyTemp: null,
    cervicalMucus: '',
    symptoms: [],
    mood: '',
    notes: '',
    createdAt: new Date('2024-01-20T08:00:00Z'),
    updatedAt: new Date('2024-01-20T08:00:00Z')
  },
  {
    id: 'sample-3',
    date: '2024-01-25', 
    menstrualFlow: 'none',
    basalBodyTemp: null,
    cervicalMucus: '',
    symptoms: [],
    mood: '',
    notes: '',
    createdAt: new Date('2024-01-25T08:00:00Z'),
    updatedAt: new Date('2024-01-25T08:00:00Z')
  }
]

export const DEFAULT_JOURNAL_ENTRIES = [
  {
    id: 'journal-sample-1',
    date: '2024-01-10',
    title: 'Downloaded new app',
    content: 'Found this health tracking app online. Might try it out sometime. Looks like it has some basic features.',
    mood: 'neutral',
    tags: ['apps', 'health'],
    createdAt: new Date('2024-01-10T10:30:00Z'),
    updatedAt: new Date('2024-01-10T10:30:00Z')
  },
  {
    id: 'journal-sample-2',
    date: '2024-01-12',
    title: 'Busy day',
    content: 'Had a lot of work today. Didn\'t really have time to look at that app I downloaded. Maybe later.',
    mood: 'tired',
    tags: ['work', 'busy'],
    createdAt: new Date('2024-01-12T20:15:00Z'),
    updatedAt: new Date('2024-01-12T20:15:00Z')
  },
  {
    id: 'journal-sample-3',
    date: '2024-01-18',
    title: 'Weekend plans',
    content: 'Thinking about organizing my phone and deleting apps I don\'t use. Have too many downloaded things.',
    mood: 'neutral',
    tags: ['weekend', 'organizing'],
    createdAt: new Date('2024-01-18T14:20:00Z'),
    updatedAt: new Date('2024-01-18T14:20:00Z')
  }
]

export const DEFAULT_USER_SETTINGS = {
  theme: 'light',
  notifications: false,
  dataBackup: false,
  privacyMode: false,
  firstTimeSetup: false,
  lastUsed: new Date('2024-01-10T10:30:00Z'),
  appVersion: '1.0.0'
}

/**
 * Replaces all user data with bland default data for plausible deniability
 * This is the "panic button" functionality
 */
export async function loadDefaultData(db: any) {
  try {
    // Clear existing data
    await db.daily_data.clear()
    await db.user_tags.clear()

    // Convert reproductive health data to new format
    const reproHealthRecords = DEFAULT_REPRODUCTIVE_HEALTH_DATA.map(entry => ({
      date: entry.date,
      category: 'tracker',
      subcategory: 'reproductive-health',
      content: {
        menstrualFlow: entry.menstrualFlow,
        basalBodyTemp: entry.basalBodyTemp,
        cervicalMucus: entry.cervicalMucus,
        symptoms: entry.symptoms,
        mood: entry.mood,
        notes: entry.notes
      },
      tags: [],
      metadata: {
        created_at: entry.createdAt.toISOString(),
        updated_at: entry.updatedAt.toISOString(),
        user_id: 'default-user',
        version: 1
      }
    }))

    // Convert journal data to new format
    const journalRecords = DEFAULT_JOURNAL_ENTRIES.map(entry => ({
      date: entry.date,
      category: 'journal',
      subcategory: 'main',
      content: {
        title: entry.title,
        content: entry.content,
        mood: entry.mood
      },
      tags: entry.tags,
      metadata: {
        created_at: entry.createdAt.toISOString(),
        updated_at: entry.updatedAt.toISOString(),
        user_id: 'default-user',
        version: 1
      }
    }))

    // Load bland default data
    await db.daily_data.bulkAdd([...reproHealthRecords, ...journalRecords])

    console.log('Default data loaded successfully')
    return true
  } catch (error) {
    console.error('Error loading default data:', error)
    return false
  }
}

/**
 * Load realistic test data for analytics testing
 * This creates a full 3-month cycle history with realistic patterns
 */
export async function loadTestData(db: any) {
  try {
    // Clear existing data
    await db.daily_data.clear()
    await db.user_tags.clear()

    const testData = []
    const startDate = new Date('2024-10-01') // Start 3 months ago
    const endDate = new Date() // Today

    // Generate realistic cycle data
    let currentDate = new Date(startDate)
    let cycleDay = 1
    let isInPeriod = true
    let periodLength = 5
    let cycleLength = 28
    let daysSincePeriodStart = 0

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]

      // Determine flow
      let flow = 'none'
      if (isInPeriod) {
        if (daysSincePeriodStart === 0) flow = 'light'
        else if (daysSincePeriodStart <= 2) flow = 'heavy'
        else if (daysSincePeriodStart <= 3) flow = 'medium'
        else flow = 'light'
      }

      // BBT pattern (lower during period, spike at ovulation)
      let bbt = null
      if (Math.random() > 0.3) { // 70% chance of logging BBT
        const baseTemp = 97.2
        const ovulationDay = 14
        const lutealBoost = cycleDay > ovulationDay ? 0.4 : 0
        const randomVariation = (Math.random() - 0.5) * 0.3
        bbt = Math.round((baseTemp + lutealBoost + randomVariation) * 100) / 100
      }

      // Symptoms based on cycle phase
      const symptoms = []
      const mood = []

      if (isInPeriod) {
        if (Math.random() > 0.4) symptoms.push('cramps')
        if (Math.random() > 0.6) symptoms.push('bloating')
        if (Math.random() > 0.7) symptoms.push('fatigue')
        if (Math.random() > 0.5) mood.push('irritable')
        if (Math.random() > 0.6) mood.push('tired')
      } else if (cycleDay >= 12 && cycleDay <= 16) { // Ovulation window
        if (Math.random() > 0.6) symptoms.push('ovary twinge')
        if (Math.random() > 0.5) symptoms.push('breast tenderness')
        if (Math.random() > 0.4) mood.push('energetic')
        if (Math.random() > 0.6) mood.push('happy')
      } else if (cycleDay > 20) { // PMS time
        if (Math.random() > 0.5) symptoms.push('bloating')
        if (Math.random() > 0.6) symptoms.push('food cravings')
        if (Math.random() > 0.4) mood.push('moody')
        if (Math.random() > 0.7) mood.push('anxious')
      }

      // Cervical fluid pattern
      let cervicalFluid = ''
      if (cycleDay >= 10 && cycleDay <= 16) {
        const fluidTypes = ['sticky', 'creamy', 'watery', 'egg white']
        cervicalFluid = fluidTypes[Math.floor(Math.random() * fluidTypes.length)]
      }

      // Only add entry if there's something to log
      if (flow !== 'none' || bbt || symptoms.length > 0 || mood.length > 0 || cervicalFluid) {
        testData.push({
          date: dateStr,
          category: 'tracker',
          subcategory: 'reproductive-health',
          content: {
            flow,
            pain: isInPeriod ? Math.floor(Math.random() * 6) + 2 : Math.floor(Math.random() * 3),
            mood,
            symptoms,
            cervicalFluid,
            bbt,
            libido: Math.floor(Math.random() * 11),
            energyLevel: '',
            fertilitySymptoms: cycleDay >= 12 && cycleDay <= 16 ? ['increased libido'] : [],
            opk: cycleDay >= 12 && cycleDay <= 16 ? (Math.random() > 0.5 ? 'high' : 'peak') : null,
            ferning: null,
            spermEggExposure: false,
            notes: ''
          },
          tags: [],
          metadata: {
            created_at: currentDate.toISOString(),
            updated_at: currentDate.toISOString(),
            user_id: 'test-user',
            version: 1
          }
        })
      }

      // Advance cycle logic
      daysSincePeriodStart++
      cycleDay++

      if (isInPeriod && daysSincePeriodStart >= periodLength) {
        isInPeriod = false
      }

      if (cycleDay > cycleLength) {
        cycleDay = 1
        isInPeriod = true
        daysSincePeriodStart = 0
        // Vary cycle length slightly
        cycleLength = 26 + Math.floor(Math.random() * 6) // 26-31 days
        periodLength = 3 + Math.floor(Math.random() * 4) // 3-6 days
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Load the test data
    await db.daily_data.bulkAdd(testData)

    console.log(`✅ Test data loaded: ${testData.length} entries over 3 months`)
    return true
  } catch (error) {
    console.error('Error loading test data:', error)
    return false
  }
}

/**
 * Check if the database only contains default/sample data
 * Useful for determining if this is a "fresh" install vs real usage
 */
export async function isDefaultDataOnly(db: any): Promise<boolean> {
  try {
    const allData = await db.daily_data.toArray()

    // If we have exactly the default counts, it's probably default data
    if (allData.length === (DEFAULT_REPRODUCTIVE_HEALTH_DATA.length + DEFAULT_JOURNAL_ENTRIES.length)) {
      // Check if any entries have the default user ID
      return allData.some(entry => entry.metadata?.user_id === 'default-user')
    }

    return false
  } catch (error) {
    console.error('Error checking default data:', error)
    return false
  }
}
