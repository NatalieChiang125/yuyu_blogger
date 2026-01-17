// export type Role = "viewer" | "blogger"

// // 先寫死，之後可換成登入狀態
// export const useRole = (): Role => {
//   return "blogger" // or "viewer"
// }

"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export type Role = "viewer" | "blogger"

const BLOGGER_KEY = "abc123" // 你自己定，別公開

export const useRole = (): Role => {
  const [role, setRole] = useState<Role>("viewer")
  const searchParams = useSearchParams()

  useEffect(() => {
    // 1. 如果網址帶 key
    const urlRole = searchParams.get("role")
    const key = searchParams.get("key")

    if (urlRole === "blogger" && key === BLOGGER_KEY) {
      localStorage.setItem("role", "blogger")
      setRole("blogger")
      return
    }

    // 2. 沒帶 key → 用 localStorage
    const savedRole = localStorage.getItem("role") as Role | null
    if (savedRole) setRole(savedRole)
  }, [searchParams])

  return role
}
