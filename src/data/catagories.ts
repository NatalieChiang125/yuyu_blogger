// src/data/catagories.ts
import { Category } from "@/types/category"

export const categories: Category[] = [
  // 第一層
  { id: "tw", name: "台灣", slug: "tw" },
  { id: "jp", name: "日本", slug: "japan" },
  { id: "us", name: "美國", slug: "usa" },

  // 第二層（台灣）
  { id: "tp", name: "台北", slug: "taipei", parentId: "tw" },
  { id: "hs", name: "新竹", slug: "hsinchu", parentId: "tw" },
  { id: "tc", name: "台中", slug: "taichung", parentId: "tw" },
  { id: "tn", name: "台南", slug: "tainan", parentId: "tw" },
  { id: "kh", name: "高雄", slug: "kaohsiung", parentId: "tw" },
  { id: "pt", name: "屏東", slug: "pingtung", parentId: "tw" },

  // 第二層（日本）
  { id: "sapporo", name: "札幌", slug: "sapporo", parentId: "jp" },
  { id: "tokyo", name: "東京", slug: "tokyo", parentId: "jp" },
  { id: "osaka", name: "大阪", slug: "osaka", parentId: "jp" },

  // 第二層（美國）
  { id: "nyc", name: "紐約", slug: "newyork", parentId: "us" },
  { id: "la", name: "洛杉磯", slug: "losangeles", parentId: "us" },
  { id: "sf", name: "舊金山", slug: "sanfrancisco", parentId: "us" },

  // 第三層（台灣 → 台北）
  { id: "tp_brunch", name: "早午餐", slug: "brunch", parentId: "tp" },
  { id: "tp_lunch", name: "午餐", slug: "lunch", parentId: "tp" },
  { id: "tp_dinner", name: "晚餐", slug: "dinner", parentId: "tp" },
  { id: "tp_coffee", name: "咖啡廳", slug: "coffee", parentId: "tp" },
  { id: "tp_snack", name: "小吃", slug: "snack", parentId: "tp" },

  // 第三層（台灣 → 新竹）
  { id: "hs_brunch", name: "早午餐", slug: "brunch", parentId: "hs" },
  { id: "hs_lunch", name: "午餐", slug: "lunch", parentId: "hs" },
  { id: "hs_dinner", name: "晚餐", slug: "dinner", parentId: "hs" },
  { id: "hs_coffee", name: "咖啡廳", slug: "coffee", parentId: "hs" },
  { id: "hs_snack", name: "小吃", slug: "snack", parentId: "hs" },

  // 第三層（台灣 → 台中）
  { id: "tc_brunch", name: "早午餐", slug: "brunch", parentId: "tc" },
  { id: "tc_lunch", name: "午餐", slug: "lunch", parentId: "tc" },
  { id: "tc_dinner", name: "晚餐", slug: "dinner", parentId: "tc" },
  { id: "tc_coffee", name: "咖啡廳", slug: "coffee", parentId: "tc" },
  { id: "tc_snack", name: "小吃", slug: "snack", parentId: "tc" },

  // 第三層（台灣 → 台南）
  { id: "tn_brunch", name: "早午餐", slug: "brunch", parentId: "tn" },
  { id: "tn_lunch", name: "午餐", slug: "lunch", parentId: "tn" },
  { id: "tn_dinner", name: "晚餐", slug: "dinner", parentId: "tn" },
  { id: "tn_coffee", name: "咖啡廳", slug: "coffee", parentId: "tn" },
  { id: "tn_snack", name: "小吃", slug: "snack", parentId: "tn" },

  // 第三層（台灣 → 高雄）
  { id: "kh_brunch", name: "早午餐", slug: "brunch", parentId: "kh" },
  { id: "kh_lunch", name: "午餐", slug: "lunch", parentId: "kh" },
  { id: "kh_dinner", name: "晚餐", slug: "dinner", parentId: "kh" },
  { id: "kh_coffee", name: "咖啡廳", slug: "coffee", parentId: "kh" },
  { id: "kh_snack", name: "小吃", slug: "snack", parentId: "kh" },

  // 第三層（台灣 → 屏東）
  { id: "pt_brunch", name: "早午餐", slug: "brunch", parentId: "pt" },
  { id: "pt_lunch", name: "午餐", slug: "lunch", parentId: "pt" },
  { id: "pt_dinner", name: "晚餐", slug: "dinner", parentId: "pt" },
  { id: "pt_coffee", name: "咖啡廳", slug: "coffee", parentId: "pt" },
  { id: "pt_snack", name: "小吃", slug: "snack", parentId: "pt" },
]
