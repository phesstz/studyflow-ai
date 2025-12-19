import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Se quiseres redirecionar para uma página específica após o login
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies() // No Next.js 15, cookies() é assíncrono
    
    const supabase = createServerClient(
      'https://yfiukvjyvhjrohiklcbf.supabase.co',
      'sb_publishable_o-9LqegWA6o-IPl3PPRtHQ_lHrhdya7',
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se algo falhar, volta para a página inicial (login)
  return NextResponse.redirect(`${origin}/`)
}