import sqlite from "better-sqlite3"
import { randomUUID } from "crypto"

const db = new sqlite("data/db.sqlite")

// Make sure tables are created...
console.log("Checking tables...")
db.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
        id       UUID      PRIMARY KEY,
        title    TEXT      DEFAULT 'Article Title',
        text     TEXT      DEFAULT 'Article Body Text...',
        time     TIMESTAMP DEFAULT current_timestamp,
        niceTime TEXT      DEFAULT ''
    )
`).run()
db.prepare(`
    CREATE VIRTUAL TABLE IF NOT EXISTS posts_search_table
    USING FTS5(id, title, text, niceTime)
`).run()


/**
 * @typedef  {object} Post
 * @property {string} id       The ID (a UUID) of the post.
 * @property {string} title    The title of the post.
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
            id: randomUUID(),
            title,
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
    save: post => {
        db.prepare("INSERT INTO posts (id, title, text, time, niceTime) VALUES ($id, $title, $text, $time, $niceTime)").run(post)
        db.prepare("INSERT INTO posts_search_table (id, title, text, niceTime) VALUES ($id, $title, $text, $niceTime)").run(post)
    },
    /**
     * Gets a single post from the database.
     * @param {string} id The id of the post to get.
     * @returns
     */
    get: id => db.prepare("SELECT * FROM posts WHERE id = ?").get(id),
    /**
     * Gets all the posts in the database.
     * @returns {Array<Post>}
     */
    getAll: () => db.prepare("SELECT * FROM posts ORDER BY time DESC").all(),
    search: query => db.prepare(`
        SELECT
            id,
            highlight(posts_search_table, 1, '<span class="highlight">', '</span>') title,
            highlight(posts_search_table, 2, '<span class="highlight">', '</span>') text,
            niceTime
        FROM posts_search_table
        WHERE posts_search_table MATCH ?
        ORDER BY rank
    `).all(query)
}

export default Post