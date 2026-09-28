import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ctfskadogvzmmeboajgn.supabase.co'
const supabaseAnonKey = 'sb_publishable_zzp6go7I4NOEtTz90ZFSsA_-ngRHV6s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
