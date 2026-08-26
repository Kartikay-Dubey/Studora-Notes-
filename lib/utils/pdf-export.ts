import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Normalizes CSS color values (converting lab(), oklab(), oklch(), color-mix(), etc.)
 * into standard hex or rgba strings using the browser's 2D canvas context.
 */
function createColorNormalizer() {
  if (typeof document === 'undefined') return (val: string) => val
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')

  return function normalizeColor(val: string | null | undefined): string | null {
    if (!val || val === 'transparent' || val === 'inherit' || val === 'initial' || val === 'none') {
      return null
    }
    if (
      val.includes('lab') ||
      val.includes('lch') ||
      val.includes('color-mix') ||
      val.includes('color(') ||
      val.includes('oklab') ||
      val.includes('oklch')
    ) {
      if (ctx) {
        try {
          ctx.fillStyle = '#000000'
          ctx.fillStyle = val
          return ctx.fillStyle // Converts natively to "#rrggbb" or "rgba(...)"
        } catch {
          return '#000000'
        }
      }
    }
    return null
  }
}

/**
 * Sanitizes all computed colors on a cloned DOM element and its descendants
 * so that html2canvas receives standard rgba/hex colors and never crashes with 'lab' errors.
 */
function sanitizeClonedDomColors(rootElement: HTMLElement) {
  const normalizer = createColorNormalizer()
  const allElements = [rootElement, ...Array.from(rootElement.querySelectorAll('*'))] as HTMLElement[]

  const colorProps = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'outlineColor',
  ] as const

  for (const el of allElements) {
    if (!el.style) continue
    try {
      const computed = window.getComputedStyle(el)
      for (const prop of colorProps) {
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
        const raw = computed.getPropertyValue(cssProp)
        const normalized = normalizer(raw)
        if (normalized) {
          el.style.setProperty(cssProp, normalized, 'important')
        }
      }
    } catch {
      // Ignore if element is not accessible
    }
  }
}

/**
 * Exports the full-length note document into a clean, properly formatted A4 PDF.
 * Uses a dedicated A4-dimensioned layout container to guarantee:
 * - Complete top-to-bottom note export without scrolling
 * - Safe margins and natural title wrapping (no clipping or horizontal stretching)
 * - Academic heading hierarchy (#166534 for H1, #1e40af for H2, #b45309 for H3)
 * - 0% application UI / sidebar chrome
 */
export async function exportNoteToPdf(elementId: string, noteTitle: string) {
  const sourceElement = document.getElementById(elementId)
  if (!sourceElement) return

  const A4_WIDTH_PX = 720
  const CONTENT_PADDING_PX = 44

  // 1. Create a dedicated unconstrained export container on document.body
  const exportStage = document.createElement('div')
  exportStage.id = 'studora-pdf-export-stage'
  exportStage.style.position = 'fixed'
  exportStage.style.top = '0'
  exportStage.style.left = '-10000px'
  exportStage.style.width = `${A4_WIDTH_PX}px`
  exportStage.style.height = 'auto'
  exportStage.style.maxHeight = 'none'
  exportStage.style.overflow = 'visible'
  exportStage.style.zIndex = '-99999'
  exportStage.style.backgroundColor = '#FFFFFF'
  exportStage.style.pointerEvents = 'none'
  exportStage.style.opacity = '1'

  // 2. Clone the note sheet DOM tree
  const clone = sourceElement.cloneNode(true) as HTMLElement
  clone.id = 'studora-pdf-clone'
  clone.style.width = `${A4_WIDTH_PX}px`
  clone.style.maxWidth = `${A4_WIDTH_PX}px`
  clone.style.height = 'auto'
  clone.style.minHeight = 'auto'
  clone.style.maxHeight = 'none'
  clone.style.overflow = 'visible'
  clone.style.position = 'relative'
  clone.style.padding = `${CONTENT_PADDING_PX}px`
  clone.style.backgroundColor = '#FFFFFF'
  clone.style.boxSizing = 'border-box'

  // 3. Transform note title input into a beautifully wrapping academic document title
  const titleInput = clone.querySelector('input')
  if (titleInput) {
    const titleHeader = document.createElement('h1')
    titleHeader.textContent = noteTitle || titleInput.value || 'Study Note'
    titleHeader.style.fontSize = '24pt'
    titleHeader.style.fontWeight = '700'
    titleHeader.style.color = '#166534' // Academic Green
    titleHeader.style.lineHeight = '1.25'
    titleHeader.style.margin = '0 0 10px 0'
    titleHeader.style.padding = '0'
    titleHeader.style.wordBreak = 'break-word'
    titleHeader.style.overflowWrap = 'break-word'
    titleHeader.style.fontFamily = "'Patrick Hand', 'DM Sans', sans-serif"
    titleInput.parentElement?.replaceChild(titleHeader, titleInput)
  }

  // Strip non-printable interactive elements from the clone
  const interactiveElements = clone.querySelectorAll(
    'button, .bubble-menu, .slash-menu, [role="dialog"], .no-print'
  )
  interactiveElements.forEach((el) => el.remove())

  // Ensure inner content containers are fully unconstrained and styled with academic hierarchy
  const allContainers = clone.querySelectorAll('div, .ProseMirror') as NodeListOf<HTMLElement>
  allContainers.forEach((c) => {
    c.style.height = 'auto'
    c.style.maxHeight = 'none'
    c.style.overflow = 'visible'
    c.style.maxWidth = '100%'
    c.style.boxSizing = 'border-box'
  })

  // Copy writing font family from source element
  const computedFont = window.getComputedStyle(sourceElement).fontFamily
  if (computedFont) {
    clone.style.fontFamily = computedFont
  }

  // Ensure headings in PDF use distinct academic colors
  clone.querySelectorAll('h1').forEach((h1) => {
    h1.style.color = '#166534' // Deep academic green
    h1.style.wordBreak = 'break-word'
  })
  clone.querySelectorAll('h2').forEach((h2) => {
    h2.style.color = '#1e40af' // Academic cobalt/indigo
    h2.style.wordBreak = 'break-word'
  })
  clone.querySelectorAll('h3').forEach((h3) => {
    h3.style.color = '#b45309' // Academic amber/bronze
    h3.style.wordBreak = 'break-word'
  })

  // Sanitize all color tokens in the clone to standard RGB/HEX
  sanitizeClonedDomColors(clone)

  exportStage.appendChild(clone)
  document.body.appendChild(exportStage)

  try {
    // 4. Allow browser a brief frame to compute full layout & fonts
    await new Promise((resolve) => setTimeout(resolve, 60))

    const fullHeight = Math.max(clone.scrollHeight, clone.offsetHeight, exportStage.scrollHeight, 600)
    const fullWidth = A4_WIDTH_PX

    // 5. Capture complete unconstrained canvas at 2x resolution
    const canvas = await (html2canvas as any)(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      width: fullWidth,
      height: fullHeight,
      windowWidth: fullWidth + 100,
      windowHeight: fullHeight + 100,
      scrollX: 0,
      scrollY: 0,
    })

    // 6. Setup standard A4 PDF dimensions (in points: 595.28 x 841.89)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 36 // 0.5 in margin (36pt)
    const footerHeight = 24 // reserved for page numbers

    const printableWidth = pdfWidth - margin * 2
    const printableHeight = pdfHeight - margin * 2 - footerHeight

    // Scaling ratio from canvas pixels to printable PDF points
    const ratio = printableWidth / canvas.width
    const totalPdfHeight = canvas.height * ratio
    const totalPages = Math.max(1, Math.ceil(totalPdfHeight / printableHeight))
    const sliceHeightPx = Math.floor(printableHeight / ratio)

    // 7. Intelligently slice canvas into individual PDF pages
    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      if (pageIdx > 0) {
        pdf.addPage()
      }

      const sourceY = pageIdx * sliceHeightPx
      const currentSliceHeightPx = Math.min(sliceHeightPx, canvas.height - sourceY)
      const currentSliceHeightPt = currentSliceHeightPx * ratio

      // Create an offscreen canvas for the current page slice
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = currentSliceHeightPx

      const pageCtx = pageCanvas.getContext('2d')
      if (pageCtx) {
        pageCtx.fillStyle = '#FFFFFF'
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
        pageCtx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          currentSliceHeightPx,
          0,
          0,
          canvas.width,
          currentSliceHeightPx
        )

        const pageImgData = pageCanvas.toDataURL('image/png')
        pdf.addImage(
          pageImgData,
          'PNG',
          margin,
          margin,
          printableWidth,
          currentSliceHeightPt
        )
      }

      // Page footer with branding and page count
      pdf.setFontSize(8)
      pdf.setTextColor(130, 130, 130)
      pdf.text(
        `Studora — ${noteTitle || 'Study Note'}`,
        margin,
        pdfHeight - margin / 2
      )
      pdf.text(
        `Page ${pageIdx + 1} of ${totalPages}`,
        pdfWidth - margin - 55,
        pdfHeight - margin / 2
      )
    }

    const cleanTitle = noteTitle.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'Studora-Study-Note'
    const fileName = `${cleanTitle.replace(/\s+/g, '-')}.pdf`

    // Web Share API check if supported on mobile/tablet
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [] })) {
      try {
        const blob = pdf.output('blob')
        const file = new File([blob], fileName, { type: 'application/pdf' })
        await navigator.share({
          title: noteTitle,
          text: `Study Note: ${noteTitle}`,
          files: [file],
        })
        return
      } catch {
        // Fallback to direct download
      }
    }

    pdf.save(fileName)
  } catch (err) {
    console.error('PDF export error:', err)
    // Fallback: window.print() — cleanly styled via @media print in globals.css
    window.print()
  } finally {
    // Always clean up the off-screen export stage from document.body
    if (document.body.contains(exportStage)) {
      document.body.removeChild(exportStage)
    }
  }
}
