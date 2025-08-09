import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), 'public', 'box-logo-pools')
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const allowed = /\.(png|jpg|jpeg|gif|webp|svg)$/i

    const files = entries
      .filter((d) => d.isFile() && allowed.test(d.name))
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b))

    const urls = files.map((name) => `/box-logo-pools/${name}`)

    return NextResponse.json({ success: true, data: urls })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, data: [], message: error?.message ?? 'Internal error' },
      { status: 500 }
    )
  }
}


