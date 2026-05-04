'use client'

import { FormEvent, useRef, useState } from 'react'

export default function MusicUploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setIsUploading(true)
    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/music/upload', { method: 'POST', body: formData })
      const data = (await response.json()) as { ok?: boolean; message?: string }
      if (!response.ok || !data.ok) {
        setMessage(data.message ?? 'アップロードに失敗しました。')
        return
      }
      formRef.current?.reset()
      setMessage('音楽を追加しました。')
    } catch {
      setMessage('通信に失敗しました。')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 border border-[#10291e]/12 bg-white p-5">
      <label className="grid gap-2"><span className="text-xs font-bold text-[#b89558]">TITLE</span><input name="title" required className="min-h-11 border border-[#10291e]/14 bg-[#fffef8] px-3 text-sm text-[#10291e]" /></label>
      <label className="grid gap-2"><span className="text-xs font-bold text-[#b89558]">ARTIST</span><input name="artist" placeholder="ZAMAKURI PLANTS" className="min-h-11 border border-[#10291e]/14 bg-[#fffef8] px-3 text-sm text-[#10291e]" /></label>
      <label className="grid gap-2"><span className="text-xs font-bold text-[#b89558]">NOTE</span><textarea name="description" rows={3} className="border border-[#10291e]/14 bg-[#fffef8] px-3 py-2 text-sm text-[#10291e]" /></label>
      <label className="grid gap-2"><span className="text-xs font-bold text-[#b89558]">AUDIO FILE</span><input name="file" type="file" accept="audio/*" required className="border border-[#10291e]/14 bg-[#fffef8] px-3 py-3 text-sm text-[#10291e]" /></label>
      <button type="submit" disabled={isUploading} className="zmk-button zmk-button-primary w-full disabled:opacity-60">{isUploading ? '追加中...' : '音楽を追加'}</button>
      {message ? <p className="text-sm font-bold text-[#315244]">{message}</p> : null}
    </form>
  )
}