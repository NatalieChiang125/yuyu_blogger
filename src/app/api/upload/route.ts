import { supabaseAdmin } from "@/lib/supabaseServer"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // 讀取前端傳過來的檔案
    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const filePath = `uploads/${file.name}-${Date.now()}`

    const { error } = await supabaseAdmin.storage.from("posts").upload(filePath, buffer)
    if (error) throw error

    const { data } = supabaseAdmin.storage.from("posts").getPublicUrl(filePath)

    return NextResponse.json({ publicUrl: data.publicUrl })
  } catch (err: any) {
    console.error("Upload Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
