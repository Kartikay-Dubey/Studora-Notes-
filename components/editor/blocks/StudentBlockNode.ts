import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { StudentBlockView } from './StudentBlockView'

export type StudentBlockType =
  | 'exampoint'
  | 'important'
  | 'definition'
  | 'keyconcept'
  | 'example'
  | 'formula'
  | 'remember'
  | 'warning'
  | 'tip'
  | 'mistake'

export interface StudentBlockAttributes {
  type: StudentBlockType
  label?: string
}

export const StudentBlockNode = Node.create({
  name: 'studentBlock',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'important',
        parseHTML: (element) => element.getAttribute('data-block-type') || 'important',
        renderHTML: (attributes) => ({
          'data-block-type': attributes.type,
        }),
      },
      label: {
        default: 'IMPORTANT',
        parseHTML: (element) => element.getAttribute('data-block-label') || 'IMPORTANT',
        renderHTML: (attributes) => ({
          'data-block-label': attributes.label,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="student-block"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'student-block' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(StudentBlockView)
  },
})
