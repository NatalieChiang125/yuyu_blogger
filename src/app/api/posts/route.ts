// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { Post } from "@/types/post";

// const postsFile = path.join(process.cwd(), "data/posts.json");

// // 取得所有貼文
// export async function GET() {
//   const json = fs.readFileSync(postsFile, "utf-8");
//   const posts: Post[] = JSON.parse(json);
//   return NextResponse.json(posts);
// }

// // 新增貼文
// export async function POST(req: NextRequest) {
//   const newPost: Post = await req.json();
//   const json = fs.readFileSync(postsFile, "utf-8");
//   const posts: Post[] = JSON.parse(json);
//   posts.push(newPost);
//   fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
//   return NextResponse.json({ success: true });
// }

// // 刪除貼文
// export async function DELETE(req: NextRequest) {
//   const { id } = await req.json();
//   const json = fs.readFileSync(postsFile, "utf-8");
//   let posts: Post[] = JSON.parse(json);
//   posts = posts.filter(p => p.id !== id);
//   fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
//   return NextResponse.json({ success: true });
// }

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseServer"
import { Post } from "@/types/post"

// GET 所有貼文
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase Error:", error)
      return NextResponse.json({ error }, { status: 500 })
    }

    const formatted = (data ?? []).map(post => ({
      ...post,
      coverImage: post.cover_image,
      igUrl: post.ig_url,
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error("API Crash:", err)
    return NextResponse.json({ error: "Server crashed" }, { status: 500 })
  }
}

// POST 新增貼文
export async function POST(req: NextRequest) {
  const newPost: Post = await req.json()

  const postForDB = {
    title: newPost.title,
    cover_image: newPost.coverImage ?? null,
    rating: newPost.rating ?? null,
    price: newPost.price ?? null,
    ig_url: newPost.igUrl ?? null,
    categories: newPost.categories ?? [],
    content: newPost.content ?? [],
    created_at: new Date().toISOString(),
  }

  console.log("Inserting into Supabase:", postForDB)

  const { data, error } = await supabaseAdmin.from("posts").insert([postForDB]).select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json((data ?? []) as Post[])
}

// DELETE 刪除貼文
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()

  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
