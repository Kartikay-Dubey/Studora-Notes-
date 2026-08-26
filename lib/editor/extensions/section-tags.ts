import { ReactNodeViewRenderer } from '@tiptap/react'
import Heading from '@tiptap/extension-heading'
import { HeadingNodeView } from '@/components/editor/blocks/HeadingNodeView'

export const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      tags: {
        default: [],
        parseHTML: (element) => {
          const raw = element.getAttribute('data-tags')
          try {
            return raw ? JSON.parse(raw) : []
          } catch {
            return []
          }
        },
        renderHTML: (attributes) => {
          if (!attributes.tags || attributes.tags.length === 0) return {}
          return {
            'data-tags': JSON.stringify(attributes.tags),
          }
        },
      },
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('id'),
        renderHTML: (attributes) => {
          if (!attributes.id) return {}
          return { id: attributes.id }
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeadingNodeView)
  },
})
