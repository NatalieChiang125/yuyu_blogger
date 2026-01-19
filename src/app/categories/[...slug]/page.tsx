"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Post } from "@/types/post"

interface CategorySinglePageProps {
  slug: string | string[]
}

export default function CategorySinglePage({ slug }: CategorySinglePageProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts")
        const allPosts: Post[] = await res.json()

        // slug 可能是陣列，轉成小寫陣列
        const slugs = Array.isArray(slug)
          ? slug.map((s) => s.toLowerCase())
          : [slug?.toLowerCase() || ""]

        // 過濾貼文：只要貼文 categories 中有包含所有 slug
        const filtered = allPosts.filter((post) => {
          const postSlugs = post.categories.map((c) => c.slug.toLowerCase())
          return slugs.every((s) => postSlugs.includes(s))
        })

        setFilteredPosts(filtered)
      } catch (err) {
        console.error("取得貼文失敗", err)
        setFilteredPosts([])
      }
    }

    fetchPosts()
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
      <h1 className="mt-6 text-3xl font-light">{Array.isArray(slug) ? slug.join(" / ") : slug}</h1>

      <div className="grid grid-cols-3 gap-5 mt-12">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="flex flex-col items-center text-center w-full"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="rounded-xl w-24 h-full object-cover mb-2"
              />
            )}
            <h3 className="font-light text-sm">{post.title}</h3>
          </Link>
        ))}
      </div>

    </main>
  )
}
