import { createClient, type PostgrestError } from '@supabase/supabase-js'

export async function runSupabaseDiagnostics() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

  console.group('Supabase Diagnostics')
  console.log('Supabase URL present:', Boolean(supabaseUrl))
  console.log('Supabase anon key present:', Boolean(supabaseAnonKey))

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase URL or anon key; cannot run diagnostics.')
    console.groupEnd()
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const summary: string[] = []

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) {
    console.error('Session error:', sessionError)
    summary.push(`Session error: ${sessionError.message}`)
  } else {
    console.log('Session data:', sessionData)
    summary.push(`Session ok: ${Boolean(sessionData?.session)}`)
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.error('User error:', userError)
    summary.push(`User error: ${userError.message}`)
  } else {
    console.log('User data:', userData)
    summary.push(`User present: ${Boolean(userData?.user)}`)
  }

  const user = userData?.user ?? sessionData?.session?.user
  const accessToken = sessionData?.session?.access_token

  if (user) {
    const { data: profileRows, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)

    handleProfileResult(profileRows, profileError, summary)
  } else {
    console.info('No authenticated user; skipping profile query and RLS validation.')
    summary.push('No user: skipped profile query')
  }

  await callEdgeFunction(supabaseUrl, accessToken, summary)

  console.log('Diagnostic summary:', summary)
  console.groupEnd()
}

function handleProfileResult(
  profileRows: Record<string, unknown>[] | null,
  profileError: PostgrestError | null,
  summary: string[],
) {
  if (profileError) {
    console.error('Profile query error:', profileError)
    const permissionIssue = profileError.message?.toLowerCase().includes('permission')
    summary.push(`Profile error: ${profileError.message}${permissionIssue ? ' (possible RLS denial)' : ''}`)
    return
  }

  const rowCount = profileRows?.length ?? 0
  console.log(`Profile query returned ${rowCount} rows`, profileRows)
  summary.push(`Profile query success: ${rowCount} rows (RLS passed)`)
}

async function callEdgeFunction(
  supabaseUrl: string,
  accessToken: string | undefined,
  summary: string[],
) {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/get-generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ limit: 1, offset: 0 }),
    })

    const responseBody = await response.json().catch(() => null)
    console.log('Edge function status:', response.status)
    console.log('Edge function response:', responseBody)
    summary.push(`Edge function: ${response.status} ${response.ok ? 'ok' : 'failed'}`)
  } catch (error) {
    console.error('Edge function call failed:', error)
    summary.push(`Edge function error: ${(error as Error).message}`)
  }
}
