"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Post } from "@/types/post"
import { posts as staticPosts } from "@/data/posts"

const slugMap: Record<string, string> = {
  台灣: "tw",
  日本: "japan",
  美國: "usa",
  台北: "taipei",
  高雄: "kaohsiung",
  新竹: "hsintu",
  台中: "taichun",
  台南: "tainan",
  屏東: "pingtun",
  札幌: "sapporo",
  東京: "tokyo",
  大阪: "osaka",
  早午餐: "brunch",
  午餐: "lunch",
  晚餐: "dinner",
  咖啡廳: "coffee",
  小吃: "snack",
}

export default function SearchClient() {
  const searchParams = useSearchParams()
  const searchText = searchParams.get("search") || ""

  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("posts")
    const allPosts: Post[] = stored ? JSON.parse(stored) : staticPosts

    const knownKeywords = Object.keys(slugMap)

    const extractKeywords = (text: string) => {
      const result: string[] = []
      let remaining = text
      knownKeywords.forEach((key) => {
        if (remaining.includes(key)) {
          result.push(key)
          remaining = remaining.replace(key, "")
        }
      })
      return result
    }

    const rawKeywords =
      searchText.includes(" ")
        ? searchText.split(/\s+/).filter(Boolean)
        : extractKeywords(searchText)

    const keywords = rawKeywords.map((k) => slugMap[k] || k.toLowerCase())

    const filtered = allPosts.filter((post) => {
      const slugs = post.categories.map((c) => c.slug.toLowerCase())
      return keywords.every((k) => slugs.includes(k))
    })

    setFilteredPosts(filtered)
  }, [searchText])

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
        {searchText ? `搜尋結果：${searchText}` : "所有食帳"}
      </h1>

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
