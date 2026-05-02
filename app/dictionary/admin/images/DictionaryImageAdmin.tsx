'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import type { Plant } from '@/lib/dictionary-data'
import type {
  DictionaryImageAssignment,
  DictionaryImageCandidate,
  DictionaryImageExclusion,
} from '@/lib/dictionary-image-data'

type QueueFilter = 'queue' | 'suggested' | 'assigned' | 'excluded' | 'all'

type Props = {
  plants: Plant[]
  candidates: DictionaryImageCandidate[]
  initialAssignments: DictionaryImageAssignment[]
  initialExclusions: DictionaryImageExclusion[]
  adminReady: boolean
}

export default function DictionaryImageAdmin({
  plants,
  candidates,
  initialAssignments,
  initialExclusions,
  adminReady,
}: Props) {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [exclusions, setExclusions] = useState(initialExclusions)
  const [activeGenus, setActiveGenus] = useState('all')
  const [activeSpecies, setActiveSpecies] = useState('all')
  const [activePlant, setActivePlant] = useState('all')
  const [queueFilter, setQueueFilter] = useState<QueueFilter>('queue')
  const [message, setMessage] = useState('')
  const [busyId, setBusyId] = useState('')

  const plantBySlug = useMemo(() => {
    return new Map(plants.map((plant) => [plant.slug, plant]))
  }, [plants])

  const assignedImageIds = useMemo(
    () => new Set(assignments.map((assignment) => assignment.imageId)),
    [assignments],
  )
  const excludedImageIds = useMemo(
    () => new Set(exclusions.map((exclusion) => exclusion.imageId)),
    [exclusions],
  )
  const plantTaxa = useMemo(() => {
    return plants.map((plant) => {
      const parts = plant.displayName
        .replace(/[()]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
      const genus = parts[0] ?? 'Unknown'
      const species = parts[1]?.startsWith("'") ? 'sp.' : parts[1] ?? 'sp.'

      return {
        slug: plant.slug,
        genus,
        species,
        speciesKey: `${genus} ${species}`,
      }
    })
  }, [plants])
  const taxonBySlug = useMemo(() => {
    return new Map(plantTaxa.map((taxon) => [taxon.slug, taxon]))
  }, [plantTaxa])
  const genusOptions = useMemo(() => {
    return [...new Set(plantTaxa.map((taxon) => taxon.genus))].sort()
  }, [plantTaxa])
  const speciesOptions = useMemo(() => {
    return [
      ...new Set(
        plantTaxa
          .filter((taxon) => activeGenus === 'all' || taxon.genus === activeGenus)
          .map((taxon) => taxon.speciesKey),
      ),
    ].sort()
  }, [activeGenus, plantTaxa])

  const visibleCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const isAssigned = assignedImageIds.has(candidate.id)
      const isExcluded = excludedImageIds.has(candidate.id)
      const hasSuggestion = candidate.suggestedPlantSlugs.length > 0
      const suggestedTaxa = candidate.suggestedPlantSlugs
        .map((slug) => taxonBySlug.get(slug))
        .filter((taxon): taxon is NonNullable<typeof taxon> => Boolean(taxon))
      const matchesGenus =
        activeGenus === 'all' ||
        suggestedTaxa.some((taxon) => taxon.genus === activeGenus)
      const matchesSpecies =
        activeSpecies === 'all' ||
        suggestedTaxa.some((taxon) => taxon.speciesKey === activeSpecies)
      const matchesPlant =
        activePlant === 'all' ||
        candidate.suggestedPlantSlugs.includes(activePlant) ||
        assignments.some(
          (assignment) =>
            assignment.imageId === candidate.id && assignment.plantSlug === activePlant,
        )

      if (!matchesGenus || !matchesSpecies || !matchesPlant) return false
      if (queueFilter === 'queue') return !isAssigned && !isExcluded
      if (queueFilter === 'suggested') return !isAssigned && !isExcluded && hasSuggestion
      if (queueFilter === 'assigned') return isAssigned
      if (queueFilter === 'excluded') return isExcluded
      return true
    })
  }, [
    activeGenus,
    activePlant,
    activeSpecies,
    assignedImageIds,
    assignments,
    candidates,
    excludedImageIds,
    queueFilter,
    taxonBySlug,
  ])

  async function refreshState() {
    const response = await fetch('/api/dictionary/images', { cache: 'no-store' })
    const result = await response.json()
    setAssignments(result.assignments ?? [])
    setExclusions(result.exclusions ?? [])
  }

  const saveAssignment = async (
    candidate: DictionaryImageCandidate,
    plantSlug: string,
    role: 'primary' | 'gallery',
  ) => {
    if (!plantSlug) {
      setMessage('品種を選んでください。')
      return
    }

    setBusyId(candidate.id)
    setMessage('')

    const response = await fetch('/api/dictionary/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'assign',
        imageId: candidate.id,
        plantSlug,
        role,
      }),
    })
    const result = await response.json()

    if (!response.ok || !result.ok) {
      setMessage(result.message ?? '保存できませんでした。')
      setBusyId('')
      return
    }

    setAssignments(result.assignments ?? [])
    setExclusions(result.exclusions ?? [])
    setQueueFilter('queue')
    setMessage('確認済みとして紐づけました。作業キューから外れます。')
    setBusyId('')
    await refreshState()
  }

  const excludeCandidate = async (candidate: DictionaryImageCandidate) => {
    setBusyId(candidate.id)
    setMessage('')

    const response = await fetch('/api/dictionary/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'exclude',
        imageId: candidate.id,
        reason: '管理者が図鑑候補から除外',
      }),
    })
    const result = await response.json()

    if (!response.ok || !result.ok) {
      setMessage(result.message ?? '除外できませんでした。')
      setBusyId('')
      return
    }

    setAssignments(result.assignments ?? [])
    setExclusions(result.exclusions ?? [])
    setQueueFilter('queue')
    setMessage('除外しました。作業キューから外れます。')
    setBusyId('')
    await refreshState()
  }

  const queueCount = candidates.filter(
    (candidate) => !assignedImageIds.has(candidate.id) && !excludedImageIds.has(candidate.id),
  ).length
  const suggestedCount = candidates.filter(
    (candidate) =>
      !assignedImageIds.has(candidate.id) &&
      !excludedImageIds.has(candidate.id) &&
      candidate.suggestedPlantSlugs.length > 0,
  ).length

  return (
    <div className="space-y-8">
      <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">
          IMAGE REVIEW QUEUE
        </p>
        <p className="mt-4 text-[14px] leading-8 text-[#d8d0bf]/76">
          自動判定は仮候補です。品種は確定しません。最終確認で紐づけた画像だけが採用済みになり、作業キューから消えます。不要な画像は除外できます。
        </p>
        {!adminReady && (
          <p className="mt-4 border border-[#b89558]/30 bg-[#b89558]/10 px-4 py-3 text-[13px] leading-7 text-[#ead2a4]">
            Supabase保存先が未設定です。SUPABASE_SERVICE_ROLE_KEY と Storage bucket dictionary を確認してください。
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FilterSelect
          label="GENUS"
          value={activeGenus}
          onChange={(value) => {
            setActiveGenus(value)
            setActiveSpecies('all')
            setActivePlant('all')
          }}
          options={[['all', '全属'], ...genusOptions.map((genus) => [genus, genus] as const)]}
        />

        <FilterSelect
          label="SPECIES"
          value={activeSpecies}
          onChange={(value) => {
            setActiveSpecies(value)
            setActivePlant('all')
          }}
          options={[
            ['all', '全種'],
            ...speciesOptions.map((species) => [species, species] as const),
          ]}
        />

        <FilterSelect
          label="VARIETY"
          value={activePlant}
          onChange={setActivePlant}
          options={[
            ['all', '全品種'],
            ...plants
              .filter((plant) => {
                const taxon = taxonBySlug.get(plant.slug)
                return (
                  taxon &&
                  (activeGenus === 'all' || taxon.genus === activeGenus) &&
                  (activeSpecies === 'all' || taxon.speciesKey === activeSpecies)
                )
              })
              .map((plant) => [plant.slug, plant.tradeName] as const),
          ]}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[
          ['queue', `未確認 ${queueCount}`],
          ['suggested', `仮候補あり ${suggestedCount}`],
          ['assigned', `採用済み ${assignments.length}`],
          ['excluded', `除外 ${exclusions.length}`],
          ['all', `全件 ${candidates.length}`],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setQueueFilter(value as QueueFilter)}
            className={`shrink-0 border px-4 py-2 text-xs font-semibold tracking-[0.14em] transition ${
              queueFilter === value
                ? 'border-[#d9ffd8]/65 bg-[#d9ffd8]/12 text-[#eaffdf]'
                : 'border-[#fffaf0]/12 bg-[#fffaf0]/4 text-[#eee7d7]/70 hover:border-[#d9ffd8]/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {message && (
        <div className="border border-[#fffaf0]/12 bg-[#fffaf0]/6 px-4 py-3 text-sm text-[#eaffdf]">
          {message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleCandidates.map((candidate) => {
          const linked = assignments.filter((assignment) => assignment.imageId === candidate.id)
          const excluded = exclusions.find((exclusion) => exclusion.imageId === candidate.id)
          const defaultPlant = candidate.suggestedPlantSlugs[0] ?? ''

          return (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              plants={plants}
              defaultPlant={defaultPlant}
              linkedLabels={linked.map((assignment) => {
                const plant = plantBySlug.get(assignment.plantSlug)
                return `${plant?.tradeName ?? assignment.plantSlug} / ${assignment.role}`
              })}
              excludedLabel={excluded ? excluded.reason ?? '除外済み' : ''}
              busy={busyId === candidate.id}
              onSave={saveAssignment}
              onExclude={excludeCandidate}
            />
          )
        })}
      </div>

      {visibleCandidates.length === 0 && (
        <div className="border border-[#fffaf0]/12 bg-[#fffaf0]/5 px-5 py-12 text-center text-[#d8d0bf]/72">
          この条件の画像候補はありません。
        </div>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly (readonly [string, string])[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold tracking-[0.22em] text-[#d8d0bf]/64">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full border border-[#fffaf0]/14 bg-[#fffaf0]/6 px-4 text-sm text-[#fffaf0] outline-none"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option className="bg-[#07120d]" key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  )
}

function CandidateCard({
  candidate,
  plants,
  defaultPlant,
  linkedLabels,
  excludedLabel,
  busy,
  onSave,
  onExclude,
}: {
  candidate: DictionaryImageCandidate
  plants: Plant[]
  defaultPlant: string
  linkedLabels: string[]
  excludedLabel: string
  busy: boolean
  onSave: (
    candidate: DictionaryImageCandidate,
    plantSlug: string,
    role: 'primary' | 'gallery',
  ) => void
  onExclude: (candidate: DictionaryImageCandidate) => void
}) {
  const [plantSlug, setPlantSlug] = useState(defaultPlant)
  const [role, setRole] = useState<'primary' | 'gallery'>('primary')

  return (
    <article className="overflow-hidden border border-[#fffaf0]/10 bg-[#07120d]/86 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
      <div className="relative aspect-[4/5] bg-[#020503]">
        <Image
          src={candidate.src}
          alt={candidate.originalName}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 rounded-full border border-[#d9ffd8]/30 bg-[#06100b]/80 px-3 py-1 text-[11px] text-[#eaffdf] backdrop-blur">
          PLANT {Math.round(candidate.plantCheck.confidence * 100)}%
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="break-all text-sm leading-6 text-[#fffaf0]">
            {candidate.originalName}
          </p>
          <p className="mt-2 text-xs leading-6 text-[#d8d0bf]/62">
            {candidate.width}x{candidate.height} / {candidate.sizeKb}KB
          </p>
          <p className="mt-2 text-xs leading-6 text-[#d8d0bf]/62">
            {candidate.plantCheck.reason}
          </p>
        </div>

        {candidate.suggestedPlantSlugs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {candidate.suggestedPlantSlugs.map((slug) => (
              <span
                key={slug}
                className="rounded-full border border-[#b89558]/30 bg-[#b89558]/10 px-3 py-1 text-[11px] text-[#ead2a4]"
              >
                仮候補: {plants.find((plant) => plant.slug === slug)?.tradeName ?? slug}
              </span>
            ))}
          </div>
        )}

        {linkedLabels.length > 0 && (
          <div className="space-y-1 border border-[#d9ffd8]/18 bg-[#d9ffd8]/8 p-3 text-xs leading-6 text-[#eaffdf]">
            {linkedLabels.map((label) => (
              <p key={label}>採用済み: {label}</p>
            ))}
          </div>
        )}

        {excludedLabel && (
          <div className="border border-[#b89558]/24 bg-[#b89558]/10 p-3 text-xs leading-6 text-[#ead2a4]">
            除外済み: {excludedLabel}
          </div>
        )}

        <select
          value={plantSlug}
          onChange={(event) => setPlantSlug(event.target.value)}
          className="h-11 w-full border border-[#fffaf0]/14 bg-[#fffaf0]/6 px-3 text-sm text-[#fffaf0] outline-none"
        >
          <option className="bg-[#07120d]" value="">
            品種を選ぶ
          </option>
          {plants.map((plant) => (
            <option className="bg-[#07120d]" key={plant.slug} value={plant.slug}>
              {plant.tradeName}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('primary')}
            className={`min-h-10 border text-xs font-semibold tracking-[0.14em] ${
              role === 'primary'
                ? 'border-[#d9ffd8]/60 bg-[#d9ffd8]/12 text-[#eaffdf]'
                : 'border-[#fffaf0]/12 text-[#d8d0bf]/64'
            }`}
          >
            PRIMARY
          </button>
          <button
            type="button"
            onClick={() => setRole('gallery')}
            className={`min-h-10 border text-xs font-semibold tracking-[0.14em] ${
              role === 'gallery'
                ? 'border-[#d9ffd8]/60 bg-[#d9ffd8]/12 text-[#eaffdf]'
                : 'border-[#fffaf0]/12 text-[#d8d0bf]/64'
            }`}
          >
            GALLERY
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_112px]">
          <button
            type="button"
            disabled={busy}
            onClick={() => onSave(candidate, plantSlug, role)}
            className="min-h-11 border border-[#d9ffd8]/60 bg-[#d9ffd8]/10 px-4 text-xs font-semibold tracking-[0.18em] text-[#eaffdf] transition hover:bg-[#d9ffd8] hover:text-[#07110c] disabled:opacity-45"
          >
            {busy ? '保存中' : '確認して紐づけ'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onExclude(candidate)}
            className="min-h-11 border border-[#b89558]/45 px-4 text-xs font-semibold tracking-[0.16em] text-[#ead2a4] transition hover:bg-[#b89558] hover:text-[#07110c] disabled:opacity-45"
          >
            除外
          </button>
        </div>
      </div>
    </article>
  )
}
