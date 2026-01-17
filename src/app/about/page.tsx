import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12 pb-24 max-w-3xl mx-auto">
        {/* 返回 */}
        <Link href="/" className="text-sm text-gray-500 hover:underline">
            ← 回首頁
        </Link>
        <h1 className="text-4xl font-light mt-6 mb-8">關於我</h1>

        {/* 自我介紹 */}
      <div className="space-y-6 text-gray-700">
        <p className="text-lg leading-relaxed">
          嗨，我是 YuYu 👋  
          這裡記錄我生活裡的每一餐、每一次探索城市的味道。
        </p>

        <p className="">
          這個網站是我的食帳與生活日記，希望你也能在這裡找到想吃的下一餐。
        </p>
      </div>

      {/* 合作邀約 */}
      <div className="mt-16">
        <p className="text-white text-lg font-medium mb-6">
          📩 合作邀約
        </p>

        <div className="ml-6 space-y-4 text-gray-600">
          <a
            href="mailto:yuyu910417@gmail.com"
            className="block hover:text-white transition"
          >
            <span>✉️</span>
            <span className="ml-2 underline underline-offset-4">
              yuyu910417@gmail.com
            </span>
          </a>

          <a
            href="https://www.instagram.com/cj_eatkaohsiung/"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-white transition"
          >
            <span>📷</span>
            <span className="ml-2 underline underline-offset-4">
              @cj_eatkaohsiung
            </span>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=100090970147081&locale=zh_TW"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-white transition"
          >
            <span>📝</span>
            <span className="ml-2 underline underline-offset-4">
              睿仔的吃吃喝喝
            </span>
          </a>
        </div>
      </div>

    </main>
  )
}
