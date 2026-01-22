import { NextResponse } from "next/server"
import { Category } from "@/types/category"
import { categories } from "@/data/catagories"

let categoryStore: Category[] = [...categories]

// GET：取得所有分類
export async function GET() {
  return NextResponse.json(categoryStore)
}

// POST：新增分類
export async function POST(req: Request) {
  const body = await req.json()

  const newCategory: Category = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    slug: body.slug,
    parentId: body.parentId,
  }

  categoryStore.push(newCategory)

  return NextResponse.json(newCategory, { status: 201 })
}
