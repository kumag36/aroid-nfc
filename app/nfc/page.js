'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function NFCPage() {
  const [uid, setUid] = useState('')

  const register = async () => {
    const { data, error } = await supabase
      .rpc('register_nfc', { p_uid: uid })

    if (error) {
      alert('エラー: ' + error.message)
      return
    }

    if (data.status === 'created') {
      alert('新規登録: ' + data.id)
      window.location.href = '/nfc/register?id=' + data.id
    } else {
      alert('既存タグ: ' + data.id)
      window.location.href = '/nfc/' + data.id
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>NFC登録</h1>
      <input
        placeholder="UID入力"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        style={{ border: '1px solid #ccc', padding: 10 }}
      />
      <br /><br />
      <button onClick={register}>登録</button>
    </div>
  )
}
