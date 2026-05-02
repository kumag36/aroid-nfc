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

export const staticDictionaryImageAssignments: DictionaryImageAssignment[] = []

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
