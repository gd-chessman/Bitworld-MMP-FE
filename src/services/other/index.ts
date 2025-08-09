export async function listBoxLogos(): Promise<string[]> {
  try {
    const res = await fetch('/api/box-logo-pools', { cache: 'no-store' })
    const json = await res.json()
    if (json?.success && Array.isArray(json.data)) return json.data
    return []
  } catch {
    return []
  }
}