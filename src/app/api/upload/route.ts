import { supabaseAdmin } from "@/lib/supabaseServer"
import formidable from "formidable"
import fs from "fs"
import { NextResponse } from "next/server"

export const config = { api: { bodyParser: false } }

export async function POST(req: Request): Promise<NextResponse> {
  const form = new formidable.IncomingForm()

  try {
    // 將 formidable.parse 包成 Promise
    const files: formidable.Files = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err)
        else resolve(files)
      })
    })

    // 處理 files.file 可能是陣列
    let file = Array.isArray(files.file) ? files.file[0] : files.file
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

    const buffer = fs.readFileSync(file.filepath)
    const filePath = `uploads/${file.originalFilename}-${Date.now()}`

    const { error } = await supabaseAdmin.storage.from("posts").upload(filePath, buffer)
    if (error) throw error

    const { data } = supabaseAdmin.storage.from("posts").getPublicUrl(filePath)

    return NextResponse.json({ publicUrl: data.publicUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
