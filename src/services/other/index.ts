import boxLogoManifest from '../../../public/box-logo-pools/manifest.json'

export async function listBoxLogos(): Promise<string[]> {
  try {
    return (boxLogoManifest as unknown as string[]) ?? []
  } catch {
    return []
  }
}