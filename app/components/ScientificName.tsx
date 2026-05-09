const rankMarkers = new Set(['sp.', 'spp.', 'subsp.', 'ssp.', 'var.', 'ver.', 'f.', 'forma', 'cf.', 'aff.', 'x', '×'])

type ScientificNamePart = {
  text: string
  style: 'italic' | 'cultivar' | 'note' | 'plain'
}

function isLatinName(value: string) {
  return /^[A-Za-z][A-Za-z-]*\.?$/.test(value)
}

function isGenusName(value: string) {
  return /^[A-Za-z][A-Za-z-]+$/.test(value)
}

function formatGenusName(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

function formatSpeciesName(value: string) {
  return value.toLowerCase()
}

function formatScientificNameParts(name: string): ScientificNamePart[] {
  const parts = name.split(/('[^']+'|\([^)]*\)|\s+)/g).filter((part) => part.length > 0)
  let sawGenus = false
  let italicNextRankName = false

  return parts.map((part) => {
    if (/^\s+$/.test(part)) return { text: part, style: 'plain' }

    const normalized = part.toLowerCase()
    const isQuoted = part.startsWith("'") && part.endsWith("'")
    const isParenthetical = part.startsWith('(') && part.endsWith(')')
    const isRankMarker = rankMarkers.has(normalized)
    const shouldItalicize =
      (!sawGenus && isGenusName(part)) ||
      (sawGenus && isLatinName(part) && part === part.toLowerCase() && !isRankMarker) ||
      (italicNextRankName && isLatinName(part))

    const displayText = !sawGenus && isGenusName(part)
      ? formatGenusName(part)
      : shouldItalicize && isLatinName(part)
        ? formatSpeciesName(part)
        : part

    if (!sawGenus && isGenusName(part)) sawGenus = true
    italicNextRankName = isRankMarker

    if (isQuoted) return { text: displayText, style: 'cultivar' }
    if (isParenthetical || isRankMarker) return { text: displayText, style: 'note' }
    if (shouldItalicize) return { text: displayText, style: 'italic' }
    return { text: displayText, style: sawGenus ? 'cultivar' : 'plain' }
  })
}

export default function ScientificName({ name }: { name: string }) {
  const parts = formatScientificNameParts(name)

  return (
    <>
      {parts.map((part, index) => {
        if (part.style === 'italic') return <em key={index}>{part.text}</em>
        if (part.style === 'cultivar') return <span key={index} className="zmk-cultivar-name">{part.text}</span>
        if (part.style === 'note') return <span key={index} className="zmk-name-note">{part.text}</span>
        return <span key={index}>{part.text}</span>
      })}
    </>
  )
}
