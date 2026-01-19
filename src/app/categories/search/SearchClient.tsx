"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Post } from "@/types/post"

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
  const [isLoading, setIsLoading] = useState(true) // ✅ 新增

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)

      try {
        const res = await fetch("/api/posts")
        const allPosts: Post[] = await res.json()

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

        const keywords = rawKeywords.map(
          (k) => slugMap[k] || k.toLowerCase()
        )

        const filtered = allPosts.filter((post) => {
          const slugs = post.categories.map((c) => c.slug.toLowerCase())
          return keywords.every((k) => slugs.includes(k))
        })

        setFilteredPosts(filtered)
      } catch (err) {
        console.error(err)
        setFilteredPosts([])
      } finally {
        setIsLoading(false) // ✅ 不論成功失敗都結束 loading
      }
    }

    fetchPosts()
  }, [searchText])

  /* ========================
     🔄 載入中
  ======================== */
  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-400">搜尋中…</p>
      </main>
    )
  }

  /* ========================
     ❌ 查無資料
  ======================== */
  if (!isLoading && filteredPosts.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-2xl font-light">找不到符合的食帳</h1>
        <Link href="/" className="mt-6 inline-block text-blue-500">
          ← 回首頁
        </Link>
      </main>
    )
  }

  /* ========================
     ✅ 有資料
  ======================== */
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-gray-500">
        ← 回首頁
      </Link>

      <h1 className="mt-6 text-3xl font-light">
        {searchText ? `搜尋結果：${searchText}` : "所有食帳"}
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
