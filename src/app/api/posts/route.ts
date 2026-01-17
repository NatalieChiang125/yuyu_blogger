import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Post } from "@/types/post";

const postsFile = path.join(process.cwd(), "data/posts.json");

// 取得所有貼文
export async function GET() {
  const json = fs.readFileSync(postsFile, "utf-8");
  const posts: Post[] = JSON.parse(json);
  return NextResponse.json(posts);
}

// 新增貼文
export async function POST(req: NextRequest) {
  const newPost: Post = await req.json();
  const json = fs.readFileSync(postsFile, "utf-8");
  const posts: Post[] = JSON.parse(json);
  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  return NextResponse.json({ success: true });
}

// 刪除貼文
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const json = fs.readFileSync(postsFile, "utf-8");
  let posts: Post[] = JSON.parse(json);
  posts = posts.filter(p => p.id !== id);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  return NextResponse.json({ success: true });
}
