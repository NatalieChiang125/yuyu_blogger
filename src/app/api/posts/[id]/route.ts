import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Post } from "@/types/post";

const postsFile = path.join(process.cwd(), "data/posts.json");

// GET 單篇貼文
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = decodeURIComponent(url.pathname.split("/").pop() || ""); // ✅ decode 中文
  if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });

  const json = fs.readFileSync(postsFile, "utf-8");
  const posts: Post[] = JSON.parse(json);
  const post = posts.find((p) => p.id === id);

  if (!post) return NextResponse.json({ error: "找不到貼文" }, { status: 404 });
  return NextResponse.json(post);
}

// PUT 編輯貼文
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = decodeURIComponent(url.pathname.split("/").pop() || ""); // ✅ decode 中文
  if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });

  const updatedPost: Post = await req.json();
  const json = fs.readFileSync(postsFile, "utf-8");
  const posts: Post[] = JSON.parse(json);

  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: "找不到貼文" }, { status: 404 });

  posts[index] = updatedPost;
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

  return NextResponse.json({ success: true });
}
