"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Post } from "@/types/post"
import { posts as staticPosts } from "@/data/posts"

export default function CategoryPage() {
  const params = useParams()
  const country = Array.isArray(params.country) ? params.country[0] : params.country || ""
  const region = Array.isArray(params.region) ? params.region[0] : params.region || ""
  const type = Array.isArray(params.type) ? params.type[0] : params.type || ""

  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("posts")
    const allPosts: Post[] = stored ? JSON.parse(stored) : staticPosts

    const filtered = allPosts.filter((post) => {
      const slugs = post.categories.map((c) => c.slug.toLowerCase())
      return (
        slugs.includes(country.toLowerCase()) &&
        slugs.includes(region.toLowerCase()) &&
        slugs.includes(type.toLowerCase())
      )
    })

    setFilteredPosts(filtered)
  }, [country, region, type])

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

      <h1 className="mt-6 text-3xl font-light">{`${region} / ${type}`}</h1>

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
