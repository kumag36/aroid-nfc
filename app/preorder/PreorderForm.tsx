'use client'

import Image from 'next/image'
import { FormEvent, useState } from 'react'
import type { ReactNode } from 'react'
import type { PreorderProduct } from '@/lib/preorder-products'

const pickupOptions = [
  { value: 'store', label: '店頭・直接受取' },
  { value: 'shipping', label: '発送希望' },
  { value: 'event', label: 'イベント受取' },
  { value: 'consult', label: '相談して決める' },
] as const

type SubmitState = {
  kind: 'idle' | 'success' | 'error'
  message: string
}

function getValue(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

type PreorderFormProps = {
  products: PreorderProduct[]
}

export default function PreorderForm({ products }: PreorderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: 'idle', message: '' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitState({ kind: 'idle', message: '' })

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      customerName: getValue(formData, 'customerName'),
      customerEmail: getValue(formData, 'customerEmail'),
      customerPhone: getValue(formData, 'customerPhone'),
      instagramHandle: getValue(formData, 'instagramHandle'),
      productId: getValue(formData, 'productId'),
      quantity: Number(getValue(formData, 'quantity') || '1'),
      pickupMethod: getValue(formData, 'pickupMethod'),
      preferredTiming: getValue(formData, 'preferredTiming'),
      note: getValue(formData, 'note'),
      company: getValue(formData, 'company'),
    }

    try {
      const response = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json() as { ok?: boolean; message?: string }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || '送信に失敗しました。')
      }

      form.reset()
      setSubmitState({
        kind: 'success',
        message: '予約オーダーを受け付けました。内容を確認して折り返します。',
      })
    } catch (error) {
      setSubmitState({
        kind: 'error',
        message: error instanceof Error ? error.message : '送信に失敗しました。',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/92 p-4 shadow-[0_24px_70px_rgba(44,106,75,0.12)] sm:p-6">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <fieldset className="grid gap-3">
        <legend className="zmk-eyebrow text-[11px]">予約商品</legend>
        <div className="grid gap-3">
          {products.map((product, index) => (
            <label key={product.id} className="grid cursor-pointer gap-3 border border-[var(--zmk-border)] bg-[var(--zmk-bg-soft)]/42 p-3 transition hover:border-[var(--zmk-border-strong)] sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="relative aspect-square overflow-hidden border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="136px" priority={index === 0} />
              </div>
              <div className="grid min-w-0 gap-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-black text-[var(--zmk-gold)]">{product.category}</p>
                    <h2 className="mt-1 text-xl font-black leading-tight">{product.name}</h2>
                  </div>
                  <input type="radio" name="productId" value={product.id} required className="mt-1 h-5 w-5 accent-[#123d2b]" />
                </div>
                <p className="text-sm font-bold leading-7 text-[var(--zmk-ink-soft)]">{product.summary}</p>
                <div className="flex flex-wrap gap-2 text-[11px] font-black text-[var(--zmk-ink)]">
                  <span className="border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)] px-2 py-1">{product.priceLabel}</span>
                  <span className="border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)] px-2 py-1">{product.arrivalLabel}</span>
                  <span className="border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)] px-2 py-1">{product.stockLabel}</span>
                </div>
                <ul className="grid gap-1 text-xs font-bold leading-5 text-[var(--zmk-ink-soft)]">
                  {product.notes.map((note) => (
                    <li key={note}>・{note}</li>
                  ))}
                </ul>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="お名前" required>
          <input name="customerName" required className="zmk-preorder-input" autoComplete="name" />
        </Field>
        <Field label="メール">
          <input name="customerEmail" type="email" className="zmk-preorder-input" autoComplete="email" />
        </Field>
        <Field label="電話">
          <input name="customerPhone" className="zmk-preorder-input" autoComplete="tel" inputMode="tel" />
        </Field>
        <Field label="Instagram">
          <input name="instagramHandle" className="zmk-preorder-input" placeholder="@zamakuri_plants" />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-[8rem_minmax(0,1fr)]">
        <Field label="数量">
          <input name="quantity" type="number" min="1" max="99" defaultValue="1" className="zmk-preorder-input" />
        </Field>
        <Field label="希望時期">
          <input name="preferredTiming" className="zmk-preorder-input" placeholder="例: 今月中、イベント当日、急ぎではない" />
        </Field>
      </div>

      <fieldset className="grid gap-3">
        <legend className="zmk-eyebrow text-[11px]">受取方法</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {pickupOptions.map((option) => (
            <label key={option.value} className="flex min-h-12 items-center gap-3 border border-[var(--zmk-border)] bg-[var(--zmk-bg-soft)]/52 px-3 text-sm font-bold text-[var(--zmk-ink)]">
              <input type="radio" name="pickupMethod" value={option.value} required className="h-4 w-4 accent-[#123d2b]" />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="備考">
        <textarea name="note" rows={5} className="zmk-preorder-input min-h-32 resize-y py-3" placeholder="希望するサイズ感、斑の好み、配送先地域、確認したいことなど" />
      </Field>

      <div className="grid gap-3 border-t border-[var(--zmk-border)] pt-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="text-xs font-bold leading-6 text-[var(--zmk-ink-soft)]">
          メール、電話、Instagramのうち、連絡が取れるものをひとつ以上入力してください。
        </p>
        <button type="submit" disabled={isSubmitting} className="zmk-button zmk-button-primary disabled:opacity-45">
          {isSubmitting ? '送信中' : '予約オーダーを送る'}
        </button>
      </div>

      {submitState.kind !== 'idle' ? (
        <p className={`border px-4 py-3 text-sm font-bold leading-7 ${
          submitState.kind === 'success'
            ? 'border-[#2c6a4b]/24 bg-[#d9ffd8]/24 text-[var(--zmk-ink)]'
            : 'border-[#b89558]/42 bg-[#b89558]/12 text-[var(--zmk-ink)]'
        }`}>
          {submitState.message}
        </p>
      ) : null}
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="zmk-eyebrow text-[11px]">
        {label}{required ? ' *' : ''}
      </span>
      {children}
    </label>
  )
}
