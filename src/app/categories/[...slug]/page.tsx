"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Post } from "@/types/post"
import { posts as staticPosts } from "@/data/posts"
import { useParams } from "next/navigation"

export default function CategorySinglePage() {
  const { slug } = useParams<{ slug: string | string[] }>()
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("posts")
    const allPosts: Post[] = stored ? JSON.parse(stored) : staticPosts

    // 支援 slug 為字串或陣列
    const s = Array.isArray(slug) ? slug[slug.length - 1].toLowerCase() : slug?.toLowerCase() || ""

    const filtered = allPosts.filter((post) =>
      post.categories.some((c) => c.slug.toLowerCase() === s)
    )

    setFilteredPosts(filtered)
  }, [slug])

  if (filteredPosts.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-2xl font-light">找不到符合的食帳</h1>
        <Link href="/" className="mt-6 inline-block text-blue-500">
          ← 回首頁
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-gray-500">← 回首頁</Link>
      <h1 className="mt-6 text-3xl font-light">{Array.isArray(slug) ? slug.join("/") : slug}</h1>

      <div className="mt-12 grid grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="flex flex-col items-center text-center"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                className="rounded-xl w-32 h-32 object-cover mb-2"
              />
            )}
            <h3 className="font-light text-sm">{post.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  )
}
