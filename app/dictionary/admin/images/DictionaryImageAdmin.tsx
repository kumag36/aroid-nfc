'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import type { Plant } from '@/lib/dictionary-data'
import type {
  DictionaryImageAssignment,
  DictionaryImageCandidate,
} from '@/lib/dictionary-image-data'

type Props = {
  plants: Plant[]
  candidates: DictionaryImageCandidate[]
  initialAssignments: DictionaryImageAssignment[]
  adminReady: boolean
}

export default function DictionaryImageAdmin({
  plants,
  candidates,
  initialAssignments,
  adminReady,
}: Props) {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [password, setPassword] = useState('')
  const [activePlant, setActivePlant] = useState('all')
  const [message, setMessage] = useState('')
  const [busyId, setBusyId] = useState('')

  const plantBySlug = useMemo(() => {
    return new Map(plants.map((plant) => [plant.slug, plant]))
  }, [plants])

  const visibleCandidates = useMemo(() => {
    if (activePlant === 'all') {
      return candidates
    }

    if (activePlant === 'unlinked') {
      return candidates.filter(
        (candidate) =>
          !assignments.some((assignment) => assignment.imageId === candidate.id),
      )
    }

    return candidates.filter((candidate) =>
      candidate.suggestedPlantSlugs.includes(activePlant),
    )
  }, [activePlant, assignments, candidates])

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
        password,
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

    setAssignments(result.assignments)
    setMessage('紐づけを保存しました。')
    setBusyId('')
  }

  return (
    <div className="space-y-8">
      <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">
          IMAGE LINKING POLICY
        </p>
        <p className="mt-4 text-[14px] leading-8 text-[#d8d0bf]/76">
          ここでは画像を自動で品種確定しません。植物らしさだけを最低限チェックし、候補名は参考表示に留めます。
          最終的な品種紐づけは管理者が選択したものだけ保存されます。iCloud写真も、いったん候補画像として追加すれば同じ画面で選別できます。
        </p>
        {!adminReady && (
          <p className="mt-4 border border-[#b89558]/30 bg-[#b89558]/10 px-4 py-3 text-[13px] leading-7 text-[#ead2a4]">
            Supabase保存は未設定です。候補確認はできます。保存するには
            DICTIONARY_ADMIN_PASSWORD または MUSEUM_ADMIN_PASSWORD と
            SUPABASE_SERVICE_ROLE_KEY、Storage bucket dictionary を設定します。
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <label className="block">
          <span className="mb-2 block text-[11px] font-semibold tracking-[0.22em] text-[#d8d0bf]/64">
            FILTER
          </span>
          <select
            value={activePlant}
            onChange={(event) => setActivePlant(event.target.value)}
            className="h-12 w-full border border-[#fffaf0]/14 bg-[#fffaf0]/6 px-4 text-sm text-[#fffaf0] outline-none"
          >
            <option className="bg-[#07120d]" value="all">
              全候補を見る
            </option>
            <option className="bg-[#07120d]" value="unlinked">
              未紐づけだけ
            </option>
            {plants.map((plant) => (
              <option className="bg-[#07120d]" key={plant.slug} value={plant.slug}>
                {plant.tradeName}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] font-semibold tracking-[0.22em] text-[#d8d0bf]/64">
            ADMIN PASSWORD
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full border border-[#fffaf0]/14 bg-[#fffaf0]/6 px-4 text-sm text-[#fffaf0] outline-none"
          />
        </label>
      </div>

      {message && (
        <div className="border border-[#fffaf0]/12 bg-[#fffaf0]/6 px-4 py-3 text-sm text-[#eaffdf]">
          {message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleCandidates.map((candidate) => {
          const linked = assignments.filter((assignment) => assignment.imageId === candidate.id)
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
              busy={busyId === candidate.id}
              onSave={saveAssignment}
            />
          )
        })}
      </div>
    </div>
  )
}

function CandidateCard({
  candidate,
  plants,
  defaultPlant,
  linkedLabels,
  busy,
  onSave,
}: {
  candidate: DictionaryImageCandidate
  plants: Plant[]
  defaultPlant: string
  linkedLabels: string[]
  busy: boolean
  onSave: (
    candidate: DictionaryImageCandidate,
    plantSlug: string,
    role: 'primary' | 'gallery',
  ) => void
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
                候補: {plants.find((plant) => plant.slug === slug)?.tradeName ?? slug}
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

        <button
          type="button"
          disabled={busy}
          onClick={() => onSave(candidate, plantSlug, role)}
          className="min-h-11 w-full border border-[#d9ffd8]/60 bg-[#d9ffd8]/10 px-4 text-xs font-semibold tracking-[0.18em] text-[#eaffdf] transition hover:bg-[#d9ffd8] hover:text-[#07110c] disabled:opacity-45"
        >
          {busy ? '保存中' : 'この画像を紐づける'}
        </button>
      </div>
    </article>
  )
}
