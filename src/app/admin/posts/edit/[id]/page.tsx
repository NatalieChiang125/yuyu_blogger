"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { categories } from "@/data/catagories"
import { Category } from "@/types/category"
import { Post, ContentBlock } from "@/types/post"

/* ===== 小工具 ===== */
const getChildren = (parentId: string) =>
  categories.filter((c) => c.parentId === parentId)

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-")

export default function EditPostPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)

  /* 基本資料 */
  const [title, setTitle] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [rating, setRating] = useState(4)
  const [price, setPrice] = useState(0)

  const [countryId, setCountryId] = useState<string>("")
  const [regionId, setRegionId] = useState<string>("")
  const [typeId, setTypeId] = useState<string>("")

  const [content, setContent] = useState<ContentBlock[]>([])

  /* ===== 載入原本的 post ===== */
  useEffect(() => {
    const stored = localStorage.getItem("posts")
    if (!stored) return
    const allPosts: Post[] = JSON.parse(stored)
    const found = allPosts.find((p) => p.id === id)
    if (!found) return
    setPost(found)

    setTitle(found.title)
    setCoverImage(found.coverImage)
    setRating(found.rating)
    setPrice(found.price)
    setContent(found.content || [])

    // 假設 categories[0]=country, [1]=region, [2]=type
    setCountryId(found.categories[0]?.id || "")
    setRegionId(found.categories[1]?.id || "")
    setTypeId(found.categories[2]?.id || "")
  }, [id])

  /* ===== 新增內容區塊 ===== */
  const addTextBlock = () => setContent([...content, { type: "text", value: "" }])
  const addImageBlock = () => setContent([...content, { type: "image", src: "", caption: "" }])

  /* ===== 儲存修改 ===== */
  const handleSubmit = () => {
    if (!title || !coverImage || !countryId || !regionId || !typeId) {
      alert("請填完所有必填欄位")
      return
    }

    const selectedCategories: Category[] = [
      categories.find((c) => c.id === countryId)!,
      categories.find((c) => c.id === regionId)!,
      categories.find((c) => c.id === typeId)!,
    ]

    const updatedPost: Post = {
      ...post!,
      title,
      coverImage,
      rating,
      price,
      categories: selectedCategories,
      content,
    }

    const old = localStorage.getItem("posts")
    const allPosts: Post[] = old ? JSON.parse(old) : []
    const index = allPosts.findIndex((p) => p.id === post!.id)
    if (index >= 0) allPosts[index] = updatedPost
    localStorage.setItem("posts", JSON.stringify(allPosts))

    alert("修改完成")
    router.push("/")
  }

  if (!post) return <p>載入中...</p>

  /* ===== UI 跟 NewPostPage 類似 ===== */
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
      <h1 className="text-3xl font-light">編輯食帳</h1>

      {/* 標題 */}
      <input
        placeholder="餐廳名稱"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 封面 */}
      {/* <input
        placeholder="封面圖片 URL"
        className="w-full border p-2 rounded"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
      /> */}
      <div>
        <label className="block mb-2">封面圖片</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => setCoverImage(reader.result as string)
            reader.readAsDataURL(file)
          }}
          className="w-full border p-2 rounded"
        />
        {/* 預覽 */}
        {coverImage && (
          <img
            src={coverImage}
            alt="封面預覽"
            className="mt-2 w-64 h-auto rounded"
          />
        )}
      </div>

      {/* 評分 / 價格 */}
      <div className="flex gap-4">
        <input
          type="number"
          min={0}
          max={5}
          step={0.5}
          className="border p-2 rounded w-24"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <input
          type="number"
          className="border p-2 rounded w-32"
          placeholder="價格"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      {/* 分類選擇 */}
      <div className="space-y-4">
        <select
          className="w-full rounded border bg-black text-white p-2"
          value={countryId}
          onChange={(e) => { setCountryId(e.target.value); setRegionId(""); setTypeId(""); }}
        >
          <option value="">選擇國家</option>
          {categories.filter(c => !c.parentId).map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {countryId && (
          <select
            className="w-full rounded border bg-black text-white p-2"
            value={regionId}
            onChange={(e) => { setRegionId(e.target.value); setTypeId(""); }}
          >
            <option value="">選擇地區</option>
            {getChildren(countryId).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}

        {regionId && (
          <select
            className="w-full rounded border bg-black text-white p-2"
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
          >
            <option value="">選擇餐點類型</option>
            {getChildren(regionId).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* 內容區塊 */}
      {/* <div className="space-y-6">
        <h2 className="text-xl">內容</h2>
        {content.map((block, i) => (
          <div key={i} className="border p-4 rounded space-y-2">
            {block.type === "text" ? (
              <textarea
                className="w-full border p-2 rounded"
                value={block.value}
                onChange={(e) => {
                  const copy = [...content]
                  copy[i] = { ...block, value: e.target.value }
                  setContent(copy)
                }}
              />
            ) : (
              <>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="圖片 URL"
                  value={block.src}
                  onChange={(e) => {
                    const copy = [...content]
                    copy[i] = { ...block, src: e.target.value }
                    setContent(copy)
                  }}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="圖片說明"
                  value={block.caption || ""}
                  onChange={(e) => {
                    const copy = [...content]
                    copy[i] = { ...block, caption: e.target.value }
                    setContent(copy)
                  }}
                />
              </>
            )}
          </div>
        ))}
        <div className="flex gap-4">
          <button onClick={addTextBlock} className="border px-4 py-2 rounded">+ 文字</button>
          <button onClick={addImageBlock} className="border px-4 py-2 rounded">+ 圖片</button>
        </div>
      </div> */}
      <div className="space-y-6">
        <h2 className="text-xl">內容</h2>
        {content.map((block, i) => (
          <div key={i} className="border p-4 rounded space-y-2">
            {block.type === "text" ? (
              <textarea
                className="w-full border p-2 rounded"
                value={block.value}
                onChange={(e) => {
                  const copy = [...content]
                  copy[i] = { ...block, value: e.target.value }
                  setContent(copy)
                }}
              />
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border p-2 rounded"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const copy = [...content]
                      copy[i] = { ...block, src: reader.result as string }
                      setContent(copy)
                    }
                    reader.readAsDataURL(file)
                  }}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="圖片說明"
                  value={block.caption || ""}
                  onChange={(e) => {
                    const copy = [...content]
                    copy[i] = { ...block, caption: e.target.value }
                    setContent(copy)
                  }}
                />
                {/* 預覽 */}
                {block.src && (
                  <img
                    src={block.src}
                    alt={block.caption || ""}
                    className="w-4/5 max-w-xl rounded-2xl mt-2"
                  />
                )}
              </>
            )}
          </div>
        ))}
        <div className="flex gap-4">
          <button onClick={addTextBlock} className="border px-4 py-2 rounded">+ 文字</button>
          <button onClick={addImageBlock} className="border px-4 py-2 rounded">+ 圖片</button>
        </div>
      </div>

      {/* 儲存 */}
      <button
        onClick={handleSubmit}
        className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        儲存修改
      </button>
    </main>
  )
}
