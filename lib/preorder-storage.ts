import { createClient } from '@supabase/supabase-js'

export type PreorderPickupMethod = 'store' | 'shipping' | 'event' | 'consult'

export type PreorderRequestInput = {
  customerName: string
  customerEmail?: string
  customerPhone?: string
  instagramHandle?: string
  plantName: string
  quantity: number
  budget?: string
  pickupMethod: PreorderPickupMethod
  preferredTiming?: string
  note?: string
  userAgent?: string
  requestIp?: string
}

type StockResult =
  | { ok: true; id: string }
  | { ok: false; message: string }

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) return null

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })
}

export async function stockPreorderRequest(input: PreorderRequestInput): Promise<StockResult> {
  const client = getSupabaseAdminClient()
  if (!client) return { ok: false, message: 'Supabase preorder storage is not configured.' }

  const id = crypto.randomUUID()
  const { error } = await client.from('preorder_requests').insert({
    id,
    created_at: new Date().toISOString(),
    status: 'new',
    customer_name: input.customerName,
    customer_email: input.customerEmail || null,
    customer_phone: input.customerPhone || null,
    instagram_handle: input.instagramHandle || null,
    plant_name: input.plantName,
    quantity: input.quantity,
    budget: input.budget || null,
    pickup_method: input.pickupMethod,
    preferred_timing: input.preferredTiming || null,
    note: input.note || null,
    user_agent: input.userAgent || null,
    request_ip: input.requestIp || null,
  })

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true, id }
}
