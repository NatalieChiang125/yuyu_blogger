import { supabaseAdmin } from "@/lib/supabaseServer"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: posts, error } = await supabaseAdmin
      .from("posts")
      .select("*, content(*)") // 如果 content 是 JSONB 或其他子表
    if (error) throw error

    const mappedPosts = posts.map((p: any) => {
      // 生成封面圖片 public URL
      let coverUrl = p.cover_image
      if (coverUrl) {
        const { data: publicData } = supabaseAdmin
          .storage
          .from("posts")
          .getPublicUrl(coverUrl)
        coverUrl = publicData?.publicUrl || coverUrl
      }

      // 如果 content 裡也有圖片，也可以在這裡生成 public URL
      const content = p.content?.map((block: any) => {
        if (block.type === "image" && block.src) {
          const { data: publicData } = supabaseAdmin
            .storage
            .from("posts")
            .getPublicUrl(block.src)
          return { ...block, src: publicData?.publicUrl || block.src }
        }
        return block
      })

      return {
        ...p,
        coverImage: coverUrl,
        igUrl: p.ig_url,
        content,
      }
    })

    res.status(200).json(mappedPosts)
  } catch (err: any) {
    console.error("API /posts error:", err)
    res.status(500).json({ error: err.message })
  }
}
