"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { categories } from "@/data/catagories"
import { Category } from "@/types/category"
import { Post, ContentBlock } from "@/types/post"

const getChildren = (parentId: string) =>
  categories.filter((c) => c.parentId === parentId)

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-")

export default function NewPostPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [id, setId] = useState("")
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

  // ---- 上傳圖片到 /api/upload ----
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await res.json()

    console.log("upload 回傳:", data)

    if (!res.ok) throw new Error(data.error || "上傳失敗")
    return data.publicUrl
  }

  // ---- Supabase 上傳 ----
  const handleCoverUpload = async (file: File) => {
    try {
      const url = await uploadFile(file) // 上傳拿回 URL
      setCoverImage(url)                  // 更新 state
      return url                          // 回傳 URL 給 handleSubmit 直接用
    } catch (err: any) {
      console.error(err)
      alert("封面上傳失敗：" + err.message)
      return null
    }
  }

  const handleContentImageUpload = async (file: File, index: number) => {
    try {
      const url = await uploadFile(file)
      const copy = [...content]
      if (copy[index].type === "image") {
        copy[index] = { ...copy[index], src: url }
        setContent(copy)
      }
    } catch (err: any) {
      console.error(err)
      alert("圖片上傳失敗：" + err.message)
    }
    console.log("送出時 coverImage:", coverImage)
  }

  console.log("目前 coverImage:", coverImage)

  const handleSubmit = async () => {
    if (!title || !coverImage || !countryId || !regionId || !typeId) {
      alert("請填完所有必填欄位")
      return
    }

    let finalCoverImage = coverImage

    // 如果 coverImage 還是空的，要求使用者選檔
    if (!finalCoverImage) {
      alert("請先上傳封面圖片")
      return
    }

    //const postId = id.trim() ? id.trim() : slugify(title)
    const postId = id.trim() || (title ? slugify(title) : `post-${Date.now()}`);


    // const selectedCategories: Category[] = [
    //   categories.find((c) => c.id === countryId)!,
    //   categories.find((c) => c.id === regionId)!,
    //   categories.find((c) => c.id === typeId)!,
    // ]

    const selectedCategories: Category[] = [
      categories.find((c) => c.id === countryId),
      categories.find((c) => c.id === regionId),
      categories.find((c) => c.id === typeId),
    ].filter(Boolean) as Category[]

    // DB 對應 Supabase 欄位
    const newPostForDB = {
      id: postId,
      title,
      cover_image: finalCoverImage,
      rating,
      price,
      ig_url: igUrl.trim() || null,
      categories: selectedCategories,
      content,
      created_at: new Date().toISOString(),
    }

    console.log("Posting to DB:", JSON.stringify(newPostForDB, null, 2))

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPostForDB),
      })
      const resData = await res.json()
      if (!res.ok) {
        //const errData = await resData
        console.error("Supabase Error:", resData)
        throw new Error(resData.error ||"新增貼文失敗")
      }

      alert("新增完成")
      router.push("/")
    } catch (err: any) {
      console.error(err)
      alert("新增貼文發生錯誤：" + err.message)
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

      {/* ID */}
      <input
        placeholder="文章 ID (英文)"
        className="w-full border p-2 rounded"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      {/* 封面圖片 */}
      <div>
        <label className="block mb-2">封面圖片</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            try {
              await handleCoverUpload(file)
            } catch (err) {
              console.error(err)
              alert("封面上傳失敗")
            }
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
      <input
        type="url"
        placeholder="IG 原文 URL (選填)"
        className="w-full border p-2 rounded"
        value={igUrl}
        onChange={(e) => setIgUrl(e.target.value)}
      />

      {/* 分類選擇 */}
      <div className="space-y-4">
        {/* 國家 */}
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

        {/* 地區 */}
        {countryId && getChildren(countryId).length > 0 && (
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

        {/* 類型（只有當該地區有子分類時才顯示） */}
        {regionId && getChildren(regionId).length > 0 && (
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
      <div className="space-y-6">
        <h2 className="text-xl">內容</h2>
        {content.map((block, i) => (
          <div key={i} className="border p-4 rounded space-y-2 relative">
            <button
              onClick={() => {
                const copy = [...content]
                copy.splice(i, 1)
                setContent(copy)
              }}
              className="absolute top-2 right-2 text-red-600 font-bold hover:text-red-800"
            >
              刪除
            </button>

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
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      await handleContentImageUpload(file, i)
                    } catch (err) {
                      console.error(err)
                      alert("圖片上傳失敗")
                    }
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

      <button
        onClick={handleSubmit}
        className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        發布食帳
      </button>
    </main>
  )
}
