import { z } from 'zod'

const SUBJECT_COLORS = [
  'slate', 'cobalt', 'teal', 'sage', 'amber', 'rust',
  'rose', 'violet', 'indigo', 'copper', 'stone', 'plum',
] as const

export const subjectColors = SUBJECT_COLORS

export const createSubjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Subject name is required')
    .max(100, 'Subject name must be 100 characters or fewer')
    .trim(),
  description: z.string().max(500).optional(),
  color: z.enum(SUBJECT_COLORS).default('slate'),
  icon: z.string().max(50).optional(),
})

export const updateSubjectSchema = createSubjectSchema.partial()

export type CreateSubjectValues = z.infer<typeof createSubjectSchema>
export type UpdateSubjectValues = z.infer<typeof updateSubjectSchema>
