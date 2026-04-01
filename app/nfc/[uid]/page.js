import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  const { uid } = params

  const { data } = await supabase
    .from('nfc_tags')
    .select('plant_id')
    .eq('nfc_uid', uid)
    .single()

  if (!data || !data.plant_id) {
    return <div style={{ color: '#fff' }}>タグ未登録</div>
  }

  const { data: plant } = await supabase
    .from('plants')
    .select('slug')
    .eq('id', data.plant_id)
    .single()

  if (!plant) {
    return <div style={{ color: '#fff' }}>植物なし</div>
  }

  redirect(`/plant/${plant.slug}`)
}
