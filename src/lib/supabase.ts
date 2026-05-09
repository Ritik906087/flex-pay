
import { createClient } from '@supabase/supabase-js'

// Supabase configuration from user provided credentials
const supabaseUrl = 'https://gcfmifxdqlcfmorsozek.supabase.co'
const supabaseAnonKey = 'sb_publishable_n3ZzHOcLzCVDyGG6QuOaQg_vjeFvyAS'

// Note: Secret key is usually for server-side only (sb_secret_b_ImXQtbVMzNIAkiwQQrYg_kfrCjtEV)
// For client side, we use the Anon Key.

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
