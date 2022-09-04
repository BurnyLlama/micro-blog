import sqlite from "better-sqlite3"
import { randomUUID } from "crypto"

const db = new sqlite("data/db.sqlite")

// Make sure tables are created...
console.log("Checking tables...")
db.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
        id       VARCHAR(6) DEFAULT 'xxxxxx',
        title    TEXT       DEFAULT 'Article Title',
        title_id TEXT       NOT NULL,
        text     TEXT       DEFAULT 'Article Body Text...',
        time     TIMESTAMP  DEFAULT current_timestamp,
        niceTime TEXT       DEFAULT ''
    )
`).run()

db.function(
    "regexp",
    { deterministic: true },
    (regexAsString, dataString) => {
        const regex = new RegExp(regexAsString, "igm")
        return dataString.match(regex) ? 1 : 0
    }
)

/**
 * @typedef  {object} Post
 * @property {string} id       The ID (a UUID) of the post.
 * @property {string} title    The title of the post.
 * @property {string} title_id The title ID.
 * @property {string} text     The body text of the post.
 * @property {string} time     When the post was created (ISO time string.
 * @property {string} niceTime A text representation of the time the post was created.
 */

const Post = {
    /**
     * Creates a {@link Post} object.
     * @param {string} title
     * @param {string} text
     * @returns {Post}
     */
    create: (title, text) => {
        const NOW = new Date(Date.now())
        return {
            id: randomUUID().split("-").map(e => e[0]).join(""),
            title,
            title_id: title.toLowerCase().trim().replace(/[^\w-_]+/g, "-"),
            text,
            time: NOW.toISOString(),
            niceTime: `${NOW.toLocaleDateString()} -- ${NOW.toLocaleTimeString()}`
        }
    },
    /**
     * Saves a post to the database.
     * @param {Post} post The post to save.
     * @returns {void}
     */
    save: post => db.prepare("INSERT INTO posts (id, title, title_id, text, time, niceTime) VALUES ($id, $title, $title_id, $text, $time, $niceTime)").run(post),
    /**
     * Gets a single post from the database.
     * @param {string} id The id of the post to get.
     * @returns
     */
    get: (id, title_id) => db.prepare("SELECT * FROM posts WHERE id = ? AND title_id = ?").get(id, title_id),
    /**
     * Gets all the posts in the database.
     * @returns {Array<Post>}
     */
    getAll: () => db.prepare("SELECT * FROM posts ORDER BY time DESC").all(),
    /**
     * Search for posts in the database.
     * @param {string} query Search query.
     * @returns {Array<Post>} Found posts.
     */
    search: query => db.prepare("SELECT * FROM posts WHERE text REGEXP $query OR title REGEXP $query").all({ query })
}

export default Post