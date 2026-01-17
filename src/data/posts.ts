

import { Post } from "@/types/post"
import { Category } from "@/types/category"
import { categories } from "./catagories"

const getCat = (id: string): Category => {
  const cat = categories.find((c: Category) => c.id === id)
  if (!cat) throw new Error(`Category ${id} not found`)
  return cat
}

export const posts: Post[] = [
  {
    id: "sushuyii",
    title: "鮨毅",
    catagory: "正餐",
    area: "台北",
    coverImage: "/sushuyii.png", // 從 public/posts/ 下放照片
    rating: 4.5,
    price: 280,
    igUrl: "https://www.instagram.com/p/DJjC455zOBe/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    //contentImages: ["/yii1.png", "/yii2.png"],
    categories: [
      getCat("tw"),
      getCat("tp"),
      getCat("tp_dinner"),
    ],
    content: [
      {
        type: "text",
        value:
          "🍴套餐\n躺在清單裡面好幾年，在今年生日終於解鎖😭真的好喜歡好好吃🤤"
      },
      {
        type: "image",
        src: "/yii1.png",
        caption: "🌟先付－老母雞·山藥 / 愛媛縣穴子苗"
      },
      {
        type: "image",
        src: "/yii2.png",
        caption: "🌟刺身－對馬本鮪 / 富士白鮭"
      }
    ]
  },
  {
    id: "lulu",
    title: "露露",
    catagory: "正餐",
    area: "高雄",
    coverImage: "/lulu_yakitori.png",
    rating: 5,
    price: 150,
    igUrl: "https://www.instagram.com/p/DDL4upoT4gL/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    //contentImages: ["/lulu1.png", "/lulu2.png"],
    categories: [
      getCat("tw"),
      getCat("kh"),
      getCat("kh_dinner"),
    ],
    content: [
      {
        type: "text",
        value:
          "🍴套餐\n看到是新開的串串店立馬安排上🙌🏻吃完覺得好喜歡啊😻\n\
                     露露的烤法比較水嫩juicy 但是仍然有Q度彈性\n\
                     直火烤讓肉肉們帶有碳香味 純粹的鹽巴調味更能吃出原汁原味 整體小編超級愛！\n\
                     雞頸肉來個一打都沒有問題哈哈🤫\n\
                     另外 讓小編意外的很有印象點的是七里香 油脂膩感被火逼出後留下渾厚的油香～是前幾名好吃的屁串串😝🤣\n\
                     串燒是蔬菜和肉串交錯 不會覺得都是一直在吃肉🤣 完時候也比較不會有負擔感 最後的主食釜飯很好吃耶～粒粒分明和會有雞軟骨的雞鬆 口感實在豐富😆"
      },
      {
        type: "image",
        src: "/lulu1.png",
        //caption: "🌟先付－老母雞·山藥 / 愛媛縣穴子苗"
      },
      {
        type: "image",
        src: "/lulu2.png",
        //caption: "🌟刺身－對馬本鮪 / 富士白鮭"
      }
    ]
  },
  {
    id: "nid",
    title: "nid.",
    catagory: "正餐",
    area: "高雄",
    coverImage: "/nid.png",
    rating: 4,
    price: 200,
    igUrl: "https://www.instagram.com/p/C2PpfLCvu2w/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    //contentImages: ["/nid1.png", "/nid2.png"],
    categories: [
      getCat("tw"),
      getCat("kh"),
      getCat("kh_dinner"),
    ],
    content: [
      {
        type: "text",
        value:
          "🍴Fine dining\n那晚串燒與法式的美學結合🌸\n\
                     酒灑關門+又訂不到新店 整個超懷念🤣🤣 很幸運有人讓位才能獲得吃美食的機會😭\n\
                     保留了串燒的本質 又添加了法料的搭配 整體超級新穎又好吃！\n\
                    （現在想到又餓了🤤"
      },
      {
        type: "image",
        src: "/nid1.png",
        caption: "🌟鳥巢鵪鶉蛋/雞翅一夜乾+雞高湯\n\
                     用炸馬鈴薯做成鳥巢的樣子真的超級可愛！雞翅第一口咬下去的時候整個心都飄起來了🙌🏻完全是滿分的烤物…. 另外吃完後會給一個暖心的雞高湯✨"
      },
      {
        type: "image",
        src: "/nid2.png",
        caption: "🌟雞爪燈籠\n\
                     人生第一次吃雞爪和輸卵管+沒有成熟的卵？🤣 其實就蠻像沒有熟的蛋黃 會直接在嘴裡爆開 意外的有點好吃欸哈哈哈以前怎麼都沒有嘗試過哈哈😆"
      }
    ]
  },
]
