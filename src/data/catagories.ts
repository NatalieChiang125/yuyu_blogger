// src/data/categories.ts
import { Category } from "@/types/category"

export const categories: Category[] = [
  // 第一層
  { id: "tw", name: "台灣", slug: "tw" },
  { id: "jp", name: "日本", slug: "japan" },
  { id: "us", name: "美國", slug: "usa" },

  // 第二層（台灣）
  { id: "tp", name: "台北", slug: "taipei", parentId: "tw" },
  { id: "kh", name: "高雄", slug: "kaohsiung", parentId: "tw" },

  // 第二層（日本）
  { id: "sapporo", name: "札幌", slug: "sapporo", parentId: "jp" },

  // 第三層（台灣 → 台北）
  { id: "tp_brunch", name: "早午餐", slug: "brunch", parentId: "tp" },
  { id: "tp_dinner", name: "晚餐", slug: "dinner", parentId: "tp" },

  { id: "kh_brunch", name: "早午餐", slug: "brunch", parentId: "kh" },
  { id: "kh_dinner", name: "晚餐", slug: "dinner", parentId: "kh" },
]
