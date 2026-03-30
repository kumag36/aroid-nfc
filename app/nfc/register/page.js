'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const params = useSearchParams()
  const id = params.get('id')

  const [name, setName] = useState('')

  const save = async () => {
    if (!name) {
      alert('品種名を入力')
      return
    }

    // 仮：plantsなしなのでnfc_tagsに直接保存
    const { error } = await supabase
      .from('nfc_tags')
      .update({ short_url: name })
      .eq('id', id)

    if (error) {
      alert('エラー: ' + error.message)
      return
    }

    alert('登録完了')
    window.location.href = '/nfc/' + id
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>品種登録</h1>
      <p>ID: {id}</p>

      <input
        placeholder="例：Monstera Albo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ border: '1px solid #ccc', padding: 10 }}
      />

      <br /><br />
      <button onClick={save}>保存</button>
    </div>
  )
}
