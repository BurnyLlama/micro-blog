import rss from "rss"
import Post from "./models/Post.js"

export default function generateRSS() {
    const RSS_FEED = new rss({
        title: "BLOG",
        description: "Blog description",
        feed_url: "...",
        site_url: "...",
        image_url: "https://qwik.space/assets/images/logo.svg",
        managingEditor: "BurnyLlama",
        webMaster: "BurnyLlama",
        copyright: "CC BY-NC-SA 4.0",
        language: "en",
        ttl: 60,
        categories: ["blog", "articles"],
        pubDate: new Date(Date.now())
    })

    Post.getAll().forEach(post => RSS_FEED.item({
        title: post.title,
        guid: post.id,
        description: post.text,
        date: new Date(post.time)
    }))

    return RSS_FEED.xml()
}