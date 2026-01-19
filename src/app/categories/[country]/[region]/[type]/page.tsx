"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Post } from "@/types/post"

export default function CategoryPage() {
  const params = useParams()

  const country =
    Array.isArray(params.country) ? params.country[0] : params.country || ""
  const region =
    Array.isArray(params.region) ? params.region[0] : params.region || ""
  const type =
    Array.isArray(params.type) ? params.type[0] : params.type || ""

  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)

        const res = await fetch("/api/posts")
        const allPosts: Post[] = await res.json()

        // 移除空字串，避免 "" 導致 includes 永遠 false
        const slugs = [country, region, type]
          .filter(Boolean)
          .map(s => s.toLowerCase())

        const filtered = allPosts.filter(post => {
          const postSlugs = post.categories.map(c =>
            c.slug.toLowerCase()
          )
          return slugs.every(slug => postSlugs.includes(slug))
        })

        setFilteredPosts(filtered)
      } catch (err) {
        console.error("取得貼文失敗", err)
        setFilteredPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [country, region, type])

  // ✅ 先處理 loading
  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-gray-400">載入中...</p>
      </main>
    )
  }

  // ✅ 再判斷是否真的沒資料
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
      <Link href="/" className="text-sm text-gray-500">
        ← 回首頁
      </Link>

      <h1 className="mt-6 text-3xl font-light">
        {`${region} / ${type}`}
      </h1>

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
