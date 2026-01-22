"use client"

import { useEffect, useState } from "react"
import { Category } from "@/types/category"
import { useRole } from "@/lib/useRole"
import { nanoid } from "nanoid"

export default function CategoryAdminPage() {
  const role = useRole()
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [parentId, setParentId] = useState("")

  if (role !== "blogger") return <p>無權限</p>

  const fetchCategories = async () => {
    const res = await fetch("/api/categories")
    setCategories(await res.json())
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = async () => {
    if (!name || !slug) return alert("請填完整")

    await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({
        id: nanoid(),
        name,
        slug,
        parentId: parentId || undefined,
      }),
    })

    setName("")
    setSlug("")
    setParentId("")
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("確定刪除？子分類會一起刪")) return
    await fetch("/api/categories", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
    fetchCategories()
  }

  const level1 = categories.filter(c => !c.parentId)
  const level2 = categories.filter(c => {
    const parent = categories.find(p => p.id === c.parentId)
    return parent && !parent.parentId
  })

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl">分類管理</h1>

      <div className="space-y-2">
        <input
          placeholder="名稱"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="slug（英文）"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          className="border p-2 w-full"
        />

        <select
          value={parentId}
          onChange={e => setParentId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">第一層</option>
          {level1.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
          {level2.map(c => (
            <option key={c.id} value={c.id}>
              └ {c.name}
            </option>
          ))}
        </select>

        <button onClick={handleAdd} className="bg-black text-white px-4 py-2">
          新增分類
        </button>
      </div>

      <ul className="space-y-2">
        {categories.map(c => (
          <li key={c.id} className="flex justify-between border-b pb-1">
            <span>{c.name}</span>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-600"
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
