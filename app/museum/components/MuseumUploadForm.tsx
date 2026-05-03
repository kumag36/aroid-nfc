'use client'

import { FormEvent, useRef, useState } from 'react'

export default function MuseumUploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setIsUploading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/museum/upload', {
        method: 'POST',
        body: formData,
      })
      const data = (await response.json()) as { ok?: boolean; message?: string }

      if (!response.ok || !data.ok) {
        setMessage(data.message ?? 'アップロードに失敗しました。')
        return
      }

      formRef.current?.reset()
      setMessage('展示に追加しました。')
    } catch {
      setMessage('通信に失敗しました。')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-5 border border-[#2c6a4b]/10 bg-white/86 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-8">
      <label className="grid gap-2">
        <span className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">ADMIN PASSWORD</span>
        <input
          name="password"
          type="password"
          required
          className="h-12 border border-[#2c6a4b]/14 bg-[#fffaf0]/6 px-4 text-sm text-[#143326] outline-none transition focus:border-[#d9ffd8]/60"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">TITLE</span>
        <input
          name="title"
          required
          className="h-12 border border-[#2c6a4b]/14 bg-[#fffaf0]/6 px-4 text-sm text-[#143326] outline-none transition focus:border-[#d9ffd8]/60"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">CAPTION</span>
        <textarea
          name="description"
          rows={4}
          className="border border-[#2c6a4b]/14 bg-[#fffaf0]/6 px-4 py-3 text-sm leading-7 text-[#143326] outline-none transition focus:border-[#d9ffd8]/60"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">MANGA PAGES</span>
        <input
          name="files"
          type="file"
          accept="image/*"
          multiple
          required
          className="border border-[#2c6a4b]/14 bg-[#fffaf0]/6 px-4 py-4 text-sm text-[#315244]/80 file:mr-4 file:border-0 file:bg-[#d9ffd8]/12 file:px-4 file:py-2 file:text-[#eaffdf]"
        />
        <span className="text-xs leading-6 text-[#315244]/54">
          複数ページを選ぶと、ファイル選択順で縦読み展示になります。
        </span>
      </label>

      <button
        type="submit"
        disabled={isUploading}
        className="inline-flex min-h-12 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c] disabled:cursor-wait disabled:opacity-60"
      >
        {isUploading ? '展示準備中' : '美術館に展示する'}
      </button>

      {message && <p className="text-sm leading-7 text-[#315244]/78">{message}</p>}
    </form>
  )
}
