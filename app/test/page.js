'use client'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

export default function Test() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase
        .from('nfc_tags')
        .select('*')

      console.log('DATA:', data)
      console.log('ERROR:', error)
    }

    test()
  }, [])

  return <div>Supabase接続テスト（F12で確認）</div>
}
