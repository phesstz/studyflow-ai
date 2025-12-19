import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  'https://yfiukvjyvhjrohiklcbf.supabase.co',
  'sb_publishable_o-9LqegWA6o-IPl3PPRtHQ_lHrhdya7'
)