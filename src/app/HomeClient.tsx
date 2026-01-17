"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRole } from "@/lib/useRole"
import { Post } from "@/types/post"

export default function HomeClient() {
  const role = useRole()
  const router = useRouter()
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [open, setOpen] = useState(false)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [searchText, setSearchText] = useState("")

  // 取得所有貼文
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts")
      if (!res.ok) throw new Error("Failed to fetch posts")
      const data: Post[] = await res.json()
      setAllPosts(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // 刪除貼文（部落客）
  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這篇食帳嗎？")) return
    await fetch("/api/posts", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
    fetchPosts()
  }

  // 搜尋功能
  const handleSearch = () => {
    if (!searchText.trim()) return
    router.push(`/categories/search?search=${encodeURIComponent(searchText.trim())}`)
  }

  // 第一層選單資料
  const menuData = [
    {
      label: "台灣",
      value: "Taiwan",
      regions: [
        { label: "台北", value: "Taipei" },
        { label: "新竹", value: "Hsintu" },
        { label: "台中", value: "Taichun" },
        { label: "台南", value: "Tainan" },
        { label: "高雄", value: "Kaohsiung" },
        { label: "屏東", value: "Pingtun" },
      ],
    },
    {
      label: "日本",
      value: "Japan",
      regions: [
        { label: "札幌", value: "Sapporo" },
        { label: "東京", value: "Tokyo" },
        { label: "大阪", value: "Osaka" },
      ],
    },
    {
      label: "美國",
      value: "America",
      regions: [
        { label: "紐約", value: "NewYork" },
        { label: "洛杉磯", value: "LosAngeles" },
        { label: "舊金山", value: "SanFrancisco" },
      ],
    },
  ]

  return (
    <main>
      {/* 選單按鈕 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-6 left-6 z-[100] text-2xl text-white"
      >
        ☰
      </button>

      {/* 右上搜尋欄 */}
      <div className="fixed top-6 right-2 flex gap-2 z-[100]">
        <input
          type="text"
          placeholder="搜尋餐點或地區"
          className="px-2 py-1 rounded-l border border-r-0 outline-none w-36 sm:w-48 md:w-64"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="px-2 py-1 bg-gray-300 text-gray-700 rounded-r hover:bg-gray-400 transition-colors"
          onClick={handleSearch}
        >
          search
        </button>
      </div>

      {/* 新增食帳（部落客） */}
      {role === "blogger" && (
        <Link
          href="/admin/posts/new"
          className="fixed bottom-6 right-3 z-[100] bg-gray-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-800"
        >
          ＋ 新增食帳
        </Link>
      )}

      {/* ===== Sidebar ===== */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[90]"
            onClick={() => {
              setOpen(false)
              setOpenCategory(null)
              setMenuOpen(null)
            }}
          />
          <aside className="fixed top-0 left-0 h-full w-52 z-[100] bg-white/30 backdrop-blur-xl p-6 shadow-2xl flex flex-col">
            <button
              onClick={() => {
                setOpen(false)
                setOpenCategory(null)
                setMenuOpen(null)
              }}
              className="absolute top-6 left-6 text-xl"
            >
              ☰
            </button>

            <nav className="space-y-6 pt-12">
              {menuData.map((country) => (
                <div key={country.value}>
                  <button
                    onClick={() =>
                      setOpenCategory(openCategory === country.value ? null : country.value)
                    }
                    className="text-lg font-light flex items-center gap-2 w-full text-left hover:underline"
                  >
                    {country.label}
                    <span className="text-sm">
                      {openCategory === country.value ? "▾" : "▸"}
                    </span>
                  </button>

                  {openCategory === country.value && (
                    <ul className="mt-2 ml-4 space-y-2 text-gray-800">
                      {country.regions.map((region) => (
                        <li key={region.value}>
                          {country.label === "台灣" ? (
                            <>
                              <button
                                onClick={() =>
                                  setMenuOpen(menuOpen === region.value ? null : region.value)
                                }
                                className="w-full text-left flex items-center gap-2 hover:underline"
                              >
                                {region.label}
                                <span className="text-xs">
                                  {menuOpen === region.value ? "▾" : "▸"}
                                </span>
                              </button>

                              {menuOpen === region.value && (
                                <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-700">
                                  {[
                                    { label: "早午餐", value: "brunch" },
                                    { label: "午餐", value: "lunch" },
                                    { label: "晚餐", value: "dinner" },
                                    { label: "咖啡廳", value: "coffee" },
                                    { label: "小吃", value: "snack" },
                                  ].map((type) => (
                                    <li key={type.value}>
                                      <Link href={`/categories/tw/${region.value.toLowerCase()}/${type.value.toLowerCase()}`}>
                                        {type.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          ) : (
                            <Link
                              href={`/categories/${region.value.toLowerCase()}`}
                              className="hover:underline"
                            >
                              {region.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-auto flex justify-center border-t-2 border-black/20 pt-4">
              <Link
                href="/about"
                onClick={() => {
                  setOpen(false)
                  setOpenCategory(null)
                  setMenuOpen(null)
                }}
                className="block text-lg text-gray-800 hover:text-black transition"
              >
                關於我
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* 首頁設計 */}
      <section className="relative h-[80vh] w-full">
        <img src="/HOME.png" alt="Food" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-5xl md:text-7xl font-light tracking-wide">
              YuYu Food Journal
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80">
              記錄生活裡的每一餐
            </p>
          </div>
        </div>
      </section>

      {/* 近期餐點展示區 */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-12 text-3xl font-light tracking-wide">Recent Meals</h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {allPosts.map((post) => (
            <div key={post.id} className="group block relative">
              <Link href={`/post/${post.id}`}>
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-xl font-light">{post.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  ★ {post.rating} · NT${post.price}
                </p>
              </Link>

              {/* 部落客才可編輯/刪除 */}
              {role === "blogger" && (
                <>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800"
                  >
                    刪除
                  </button>
                  <button
                    onClick={() => router.push(`/admin/posts/edit/${post.id}`)}
                    className="absolute top-2 right-16 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-800"
                  >
                    編輯
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
