"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { categories } from "@/data/catagories"
import { Category } from "@/types/category"
import { Post, ContentBlock } from "@/types/post"

// 小工具
const getChildren = (parentId: string) =>
  categories.filter((c) => c.parentId === parentId)

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-")

export default function NewPostPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [rating, setRating] = useState(4)
  const [price, setPrice] = useState(0)
  const [igUrl, setIgUrl] = useState("")

  const [countryId, setCountryId] = useState<string>("")
  const [regionId, setRegionId] = useState<string>("")
  const [typeId, setTypeId] = useState<string>("")

  const [content, setContent] = useState<ContentBlock[]>([])

  const addTextBlock = () => setContent([...content, { type: "text", value: "" }])
  const addImageBlock = () => setContent([...content, { type: "image", src: "", caption: "" }])

  const handleSubmit = async () => {
    if (!title || !coverImage || !countryId || !regionId || !typeId) {
      alert("請填完所有必填欄位")
      return
    }

    const selectedCategories: Category[] = [
      categories.find((c) => c.id === countryId)!,
      categories.find((c) => c.id === regionId)!,
      categories.find((c) => c.id === typeId)!,
    ]

    const newPost: Post = {
      id: slugify(title),
      title,
      catagory: "正餐",
      area: regionId,
      coverImage,
      rating,
      price,
      categories: selectedCategories,
      content,
      igUrl: igUrl.trim() || undefined,
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      if (!res.ok) throw new Error("新增貼文失敗")

      alert("新增完成")
      router.push("/")
    } catch (err) {
      console.error(err)
      alert("新增貼文發生錯誤")
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
      <h1 className="text-3xl font-light">新增食帳</h1>

      {/* 標題 */}
      <input
        placeholder="餐廳名稱"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 封面圖片 */}
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
        {coverImage && (
          <img src={coverImage} alt="封面預覽" className="mt-2 w-64 h-auto rounded" />
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

      {/* IG 原文 URL */}
      <div>
        <input
          type="url"
          placeholder="IG 原文 URL (選填)"
          className="w-full border p-2 rounded"
          value={igUrl}
          onChange={(e) => setIgUrl(e.target.value)}
        />
      </div>

      {/* 分類選擇 */}
      <div className="space-y-4">
        <select
          className="w-full rounded border bg-black text-white p-2"
          value={countryId}
          onChange={(e) => {
            setCountryId(e.target.value)
            setRegionId("")
            setTypeId("")
          }}
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
            onChange={(e) => {
              setRegionId(e.target.value)
              setTypeId("")
            }}
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

      {/* 內容編輯 */}
      <div className="space-y-6">
        <h2 className="text-xl">內容</h2>
        {content.map((block, i) => (
          <div key={i} className="border p-4 rounded space-y-2">
            {block.type === "text" ? (
              <textarea
                className="w-full border p-2 rounded"
                placeholder="文字內容"
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
                {block.src && (
                  <img src={block.src} alt={block.caption || ""} className="w-4/5 max-w-xl rounded-2xl mt-2" />
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

      {/* 送出 */}
      <button
        onClick={handleSubmit}
        className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        發布食帳
      </button>
    </main>
  )
}
