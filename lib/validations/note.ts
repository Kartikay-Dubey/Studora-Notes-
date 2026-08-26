import { z } from 'zod'

export const createNoteSchema = z.object({
  title: z
    .string()
    .max(200, 'Title must be 200 characters or fewer')
    .default('Untitled'),
  subject_id: z.string().uuid().optional().nullable(),
  topic_id: z.string().uuid().optional().nullable(),
  content: z.record(z.string(), z.unknown()).optional().nullable(),
  content_text: z.string().optional().nullable(),
})

export const updateNoteSchema = z.object({
  title: z.string().max(200).optional(),
  subject_id: z.string().uuid().optional().nullable(),
  topic_id: z.string().uuid().optional().nullable(),
  content: z.record(z.string(), z.unknown()).optional().nullable(),
  content_text: z.string().optional().nullable(),
  is_pinned: z.boolean().optional(),
})

export type CreateNoteValues = z.infer<typeof createNoteSchema>
export type UpdateNoteValues = z.infer<typeof updateNoteSchema>
