import candidatesJson from '@/lib/dictionary-image-candidates.json'

export type DictionaryImageCandidate = {
  id: string
  src: string
  originalName: string
  relativePath: string
  width: number
  height: number
  sizeKb: number
  source: string
  suggestedPlantSlugs: string[]
  status: 'candidate'
  plantCheck: {
    isLikelyPlant: boolean
    confidence: number
    reason: string
  }
}

export type DictionaryImageAssignment = {
  id: string
  imageId: string
  plantSlug: string
  role: 'primary' | 'gallery'
  note?: string
  createdAt: string
}

export type DictionaryImageExclusion = {
  id: string
  imageId: string
  reason?: string
  createdAt: string
}

export const dictionaryImageCandidates =
  candidatesJson as DictionaryImageCandidate[]

export const staticDictionaryImageAssignments: DictionaryImageAssignment[] = [
  {
    id: 'alocasia-black-velvet-pink-albo-188-primary',
    imageId: '188-alocasia-black-velvet-pink-06',
    plantSlug: 'alocasia-black-velvet-pink-albo',
    role: 'primary',
    note: 'ZAMAKURI photo record primary image',
    createdAt: '2000-01-01T00:00:00.000Z',
  },
  ...[
    '183-alocasia-black-velvet-pink-01',
    '184-alocasia-black-velvet-pink-02',
    '185-alocasia-black-velvet-pink-03',
    '186-alocasia-black-velvet-pink-04',
    '187-alocasia-black-velvet-pink-05',
    '189-alocasia-black-velvet-pink-07',
  ].map((imageId, index) => ({
    id: `alocasia-black-velvet-pink-albo-${imageId}-gallery`,
    imageId,
    plantSlug: 'alocasia-black-velvet-pink-albo',
    role: 'gallery' as const,
    note: 'ZAMAKURI photo record gallery image',
    createdAt: `2026-05-05T12:45:0${index + 1}.000Z`,
  })),
]

export function getDictionaryImageCandidate(id: string) {
  return dictionaryImageCandidates.find((candidate) => candidate.id === id)
}

export function getStaticAssignedDictionaryImages(plantSlug: string) {
  return staticDictionaryImageAssignments
    .filter((assignment) => assignment.plantSlug === plantSlug)
    .map((assignment) => ({
      assignment,
      image: getDictionaryImageCandidate(assignment.imageId),
    }))
    .filter((item) => item.image)
}
