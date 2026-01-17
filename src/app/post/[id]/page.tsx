"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Post } from "@/types/post"

export default function PostPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("/api/posts")
        const allPosts: Post[] = await res.json()
        const found = allPosts.find((p) => p.id === id)
        setPost(found || null)
      } catch (err) {
        console.error("取得貼文失敗", err)
        setPost(null)
      }
    }

    fetchPost()
  }, [id])

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-2xl font-light">找不到這篇食帳</h1>
        <Link href="/" className="mt-6 inline-block text-blue-500">
          ← 回首頁
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* 返回首頁 */}
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← 回首頁
      </Link>

      {/* 分類 */}
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {post.categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug.toLowerCase()}`}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* 標題 */}
      <h1 className="mt-6 text-4xl font-light">{post.title}</h1>
      <p className="mt-2 text-gray-500">
        ★ {post.rating} · NT${post.price}
      </p>

      {/* 內容 */}
      <div className="font-light mt-10 space-y-10">
        {post.content?.map((block, index) => {
          if (block.type === "text") {
            return (
              <p
                key={index}
                className="whitespace-pre-line leading-relaxed text-gray-300"
              >
                {block.value}
              </p>
            )
          }

          if (block.type === "image" && block.src) {
            return (
              <div key={index} className="space-y-3 flex flex-col">
                <img
                  src={block.src}
                  alt={block.caption || ""}
                  className="w-4/5 max-w-xl rounded-2xl"
                />
                {block.caption && (
                  <p className="text-sm text-gray-300 whitespace-pre-line">
                    {block.caption}
                  </p>
                )}
              </div>
            )
          }

          return null
        })}
      </div>

      {/* IG */}
      {post.igUrl && (
        <a
          href={post.igUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-block text-blue-500 hover:underline"
        >
          查看 IG 原文
        </a>
      )}
    </main>
  )
}
