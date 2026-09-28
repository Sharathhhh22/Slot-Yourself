import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://ctfskadogvzmmeboajgn.supabase.co',
    'sb_publishable_zzp6go7I4NOEtTz90ZFSsA_-ngRHV6s'
  )
}
