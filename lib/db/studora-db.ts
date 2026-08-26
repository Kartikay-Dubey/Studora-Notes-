import Dexie, { type EntityTable } from 'dexie'

export interface LocalSubject {
  id: string
  name: string
  description?: string | null
  color: string
  icon?: string | null
  sort_order: number
  archived_at?: string | null
  created_at: string
  updated_at: string
}

export interface LocalTopic {
  id: string
  subject_id: string
  parent_id?: string | null
  name: string
  sort_order: number
  archived_at?: string | null
  created_at: string
  updated_at: string
}

export interface StickyNoteData {
  id: string
  content: string
  color: 'yellow' | 'cream' | 'beige' | 'blue' | 'mint' | 'green' | 'pink' | 'lavender'
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  updated_at: string
}

export interface LocalNote {
  id: string
  subject_id?: string | null
  topic_id?: string | null
  title: string
  content: Record<string, unknown> | null // Tiptap ProseMirror JSON
  content_text?: string | null            // Plain text for search
  word_count: number
  reading_time_mins: number
  is_pinned: boolean
  is_favorite: boolean
  archived_at?: string | null
  created_at: string
  updated_at: string
  tags?: string[]
  sticky_notes?: StickyNoteData[]
  writing_font?: string
}

export interface LocalTag {
  id: string
  name: string
  color: string
  created_at: string
}

class StudoraLocalDB extends Dexie {
  subjects!: EntityTable<LocalSubject, 'id'>
  topics!: EntityTable<LocalTopic, 'id'>
  notes!: EntityTable<LocalNote, 'id'>
  tags!: EntityTable<LocalTag, 'id'>

  constructor() {
    super('studora_local_db')
    this.version(1).stores({
      subjects: 'id, name, sort_order, archived_at',
      topics: 'id, subject_id, parent_id, sort_order',
      notes: 'id, subject_id, topic_id, title, is_pinned, is_favorite, archived_at, created_at, updated_at, *tags',
      tags: 'id, name',
    })
  }
}

export const db = new StudoraLocalDB()

/**
 * Seed full realistic student academic demo dataset if database is empty
 */
export async function seedInitialLocalData() {
  const subjectCount = await db.subjects.count()
  if (subjectCount > 0) return

  const now = new Date().toISOString()

  // Seed sample subjects
  const subjects: LocalSubject[] = [
    {
      id: 'sub-ai',
      name: 'Artificial Intelligence',
      description: 'Neural networks, activation functions, perceptrons & gradient descent',
      color: 'indigo',
      icon: 'brain',
      sort_order: 1,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sub-dsa',
      name: 'Data Structures',
      description: 'Binary trees, graph algorithms, asymptotic analysis & linked lists',
      color: 'teal',
      icon: 'code-2',
      sort_order: 2,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sub-dbms',
      name: 'Database Management',
      description: 'Relational algebra, SQL, normalization & ACID transactions',
      color: 'amber',
      icon: 'database',
      sort_order: 3,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'sub-os',
      name: 'Operating Systems',
      description: 'Process scheduling, virtual memory, paging & deadlock handling',
      color: 'cobalt',
      icon: 'cpu',
      sort_order: 4,
      created_at: now,
      updated_at: now,
    },
  ]

  await db.subjects.bulkAdd(subjects)

  // Seed realistic academic notes
  const notes: LocalNote[] = [
    {
      id: 'note-neural-networks',
      subject_id: 'sub-ai',
      title: 'Neural Networks',
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Neural Networks' }] },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Artificial neuron me mainly ye components hote hain:',
              },
            ],
          },
          {
            type: 'studentBlock',
            attrs: { type: 'exampoint', label: 'EXAM POINT' },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Artificial neuron me mainly ye components hote hain:',
                  },
                ],
              },
            ],
          },
          {
            type: 'orderedList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Input — Ye neuron ko information dete hain.' }],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Weight — Wt batata hai ki particular input ka importance kitna hai' }],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Bias — Bias neuron ko extra adjustment deta hai.' }],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Summation — Neuron calculate karta hai.' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'studentBlock',
            attrs: { type: 'important', label: 'IMPORTANT CONCEPT' },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Activation functions introduce non-linearity into the network output.',
                  },
                ],
              },
            ],
          },
        ],
      },
      content_text:
        'Artificial neuron me mainly ye components hote hain: 1. Input 2. Weight 3. Bias 4. Summation.',
      word_count: 56,
      reading_time_mins: 1,
      is_pinned: true,
      is_favorite: true,
      created_at: now,
      updated_at: now,
      tags: ['ai', 'neural-networks', 'deep-learning'],
    },
    {
      id: 'note-osi-model',
      subject_id: 'sub-cn',
      title: 'OSI 7-Layer Reference Model & Encapsulation',
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'OSI 7-Layer Reference Model' }] },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'The Open Systems Interconnection model conceptualizes telecommunication network communications into 7 distinct layers.',
              },
            ],
          },
          {
            type: 'studentBlock',
            attrs: { type: 'important', label: 'IMPORTANT CONCEPT' },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Data flows down the stack during transmission (Encapsulation) and up the stack during reception (Decapsulation).',
                  },
                ],
              },
            ],
          },
          {
            type: 'studentBlock',
            attrs: { type: 'definition', label: 'DEFINITION' },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Encapsulation: Wrapping control headers (IP, TCP, Ethernet) around payload data units at each layer.',
                  },
                ],
              },
            ],
          },
        ],
      },
      content_text:
        'The Open Systems Interconnection model conceptualizes telecommunication network communications into 7 distinct layers. Data flows down the stack during transmission.',
      word_count: 36,
      reading_time_mins: 1,
      is_pinned: true,
      is_favorite: true,
      created_at: now,
      updated_at: now,
      tags: ['networking', 'exam-prep', 'protocols'],
    },
    {
      id: 'note-tcp-congestion',
      subject_id: 'sub-cn',
      title: 'TCP Congestion Control Algorithms',
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'TCP Congestion Control' }] },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'TCP uses Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery to manage throughput.',
              },
            ],
          },
          {
            type: 'studentBlock',
            attrs: { type: 'exampoint', label: 'EXAM POINT' },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'During Slow Start, the Congestion Window (cwnd) doubles every RTT until reaching ssthresh.',
                  },
                ],
              },
            ],
          },
        ],
      },
      content_text:
        'TCP uses Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery to manage throughput. During Slow Start, cwnd doubles every RTT.',
      word_count: 28,
      reading_time_mins: 1,
      is_pinned: false,
      is_favorite: true,
      created_at: now,
      updated_at: now,
      tags: ['networking', 'tcp'],
    },
    {
      id: 'note-paging-memory',
      subject_id: 'sub-os',
      title: 'Virtual Memory Paging & Page Tables',
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Paging & Address Translation' }] },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Paging permits the physical address space of a process to be noncontiguous by dividing memory into fixed-size pages.',
              },
            ],
          },
          {
            type: 'studentBlock',
            attrs: { type: 'formula', label: 'KEY FORMULA' },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Physical Address = (Frame Number × Page Size) + Offset (d)',
                  },
                ],
              },
            ],
          },
        ],
      },
      content_text:
        'Paging permits the physical address space of a process to be noncontiguous. Physical Address = (Frame Number × Page Size) + Offset.',
      word_count: 26,
      reading_time_mins: 1,
      is_pinned: true,
      is_favorite: false,
      created_at: now,
      updated_at: now,
      tags: ['os', 'memory'],
    },
    {
      id: 'note-normalization-dbms',
      subject_id: 'sub-dbms',
      title: 'Database Normalization (1NF, 2NF, 3NF, BCNF)',
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Database Normalization' }] },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Normalization eliminates redundant data and prevents insertion, update, and deletion anomalies.',
              },
            ],
          },
          {
            type: 'studentBlock',
            attrs: { type: 'mistake', label: 'COMMON MISTAKE' },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Confusing 2NF (removing partial dependencies) with 3NF (removing transitive dependencies).',
                  },
                ],
              },
            ],
          },
        ],
      },
      content_text:
        'Normalization eliminates redundant data and prevents anomalies. Confusing 2NF with 3NF is a frequent mistake.',
      word_count: 24,
      reading_time_mins: 1,
      is_pinned: false,
      is_favorite: true,
      created_at: now,
      updated_at: now,
      tags: ['dbms', 'sql'],
    },
  ]

  await db.notes.bulkAdd(notes)
}
