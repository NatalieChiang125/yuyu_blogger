import { supabaseAdmin } from "@/lib/supabaseServer"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { data: posts, error } = await supabaseAdmin
        .from("posts")
        .select("*, content(*)")
      if (error) throw error

      const mappedPosts = posts.map((p: any) => ({
        ...p,
        coverImage: p.cover_image,
        igUrl: p.ig_url,
        content: p.content,
      }))

      return res.status(200).json(mappedPosts)
    }

    if (req.method === "POST") {
      const body = req.body  // <-- 這裡改成 req.body
      console.log("API received body:", body)

      if (!body.id || !body.title || !body.cover_image) {
        return res.status(400).json({ error: "id, title, cover_image are required" })
      }

      const { data, error } = await supabaseAdmin
        .from("posts")
        .insert([body])

      if (error) {
        console.error("Supabase insert error:", error)
        return res.status(400).json({ error })
      }

      return res.status(200).json(data)
    }

    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).json({ error: `Method ${req.method} not allowed` })

  } catch (err: any) {
    console.error("API /posts error:", err)
    res.status(500).json({ error: err.message })
  }
}
