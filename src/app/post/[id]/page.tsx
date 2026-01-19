"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Post } from "@/types/post"
import { Category } from "@/types/category"
import { categories } from "@/data/catagories" // ✅ 修正路徑

// 工具：用分類 id 回推完整階層
const getCategoryPath = (categoryId: string): Category[] => {
  const result: Category[] = []

  let current: Category | undefined = categories.find(
    (c) => c.id === categoryId
  )

  while (current) {
    result.unshift(current)

    const parentId = current.parentId
    if (!parentId) break

    current = categories.find((c) => c.id === parentId)
  }

  return result
}

// 工具：取得文章所有分類的完整路徑（去重）
const getAllCategoryPaths = (postCategories: Category[] | undefined): Category[] => {
  if (!postCategories) return []

  const allPaths: Category[] = []

  postCategories.forEach((cat) => {
    const path = getCategoryPath(cat.id)
    path.forEach((c) => {
      if (!allPaths.find((x) => x.id === c.id)) {
        allPaths.push(c)
      }
    })
  })

  return allPaths
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return // ⬅️ 避免 id 尚未準備好就 fetch

    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/posts")
        const allPosts: Post[] = await res.json()
        const found = allPosts.find(p => p.id === id)
        setPost(found || null)
      } catch (err) {
        console.error("取得貼文失敗", err)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (!id || loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-gray-400">載入中...</p>
      </main>
    )
  }

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

  const categoryPath = getAllCategoryPaths(post.categories)

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* 返回首頁 */}
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← 回首頁
      </Link>

      {/* 分類標籤 */}
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {categoryPath.map((cat, index) => {
          const url = `/categories/${getCategoryPath(cat.id)
            .map((c) => c.slug)
            .join("/")}`

          return (
            <Link
              key={cat.id}
              href={url}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
            >
              {cat.name}
            </Link>
          )
        })}
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
                key={`text-${index}`}
                className="whitespace-pre-line leading-relaxed text-gray-300"
              >
                {block.value}
              </p>
            )
          }

          if (block.type === "image") {
            return (
              <div key={`image-${index}`} className="space-y-3 flex flex-col">
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

      {/* IG 連結 */}
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
