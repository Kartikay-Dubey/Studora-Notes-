import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { DiagramView } from './DiagramView'

export interface DiagramAttributes {
  src: string | null
  alt?: string
  caption?: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

export const DiagramNode = Node.create({
  name: 'diagramBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => ({
          src: attributes.src,
        }),
      },
      alt: {
        default: 'Academic Diagram',
        parseHTML: (element) => element.getAttribute('alt') || 'Academic Diagram',
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
      caption: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-caption') || '',
        renderHTML: (attributes) => ({
          'data-caption': attributes.caption,
        }),
      },
      width: {
        default: '100%',
        parseHTML: (element) => element.getAttribute('data-width') || '100%',
        renderHTML: (attributes) => ({
          'data-width': attributes.width,
        }),
      },
      align: {
        default: 'center',
        parseHTML: (element) => (element.getAttribute('data-align') as 'left' | 'center' | 'right') || 'center',
        renderHTML: (attributes) => ({
          'data-align': attributes.align,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="diagram-block"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'diagram-block' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DiagramView)
  },
})
