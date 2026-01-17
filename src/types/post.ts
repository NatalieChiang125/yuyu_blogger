// src/types/post.ts
import { Category } from "./category"

export type TextBlock = {
  type: "text"
  value: string
}

export type ImageBlock = {
  type: "image"
  src: string
  caption?: string
}

export type ContentBlock = TextBlock | ImageBlock

export type Post = {
  id: string
  title: string
  catagory: string
  area: string
  coverImage: string
  rating: number
  price: number
  igUrl?: string
  content?: ContentBlock[]
  categories: Category[]
}

    