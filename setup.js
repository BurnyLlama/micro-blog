import argon2 from "argon2"
import { existsSync } from "fs"
import fs from "fs/promises"
import readline from "readline"

const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout
})

export default async function setup() {
    if (!existsSync("data/settings.json"))
        await fs.writeFile("data/settings.json", "{}")

    if (!existsSync("data/posts.json"))
        await fs.writeFile("data/posts.json", "[]")


    const SETTINGS_FILE = (await fs.readFile("data/settings.json"))?.toString()
    let   settings      = JSON.parse(SETTINGS_FILE ?? "{}")

    if (!settings.password) {
        await new Promise(resolve => {
            rl.question(
                "Please enter a password for the admin view: ",
                async password => {
                    const HASH = await argon2.hash(password)
                        .catch(
                            err => console.log("There was an error setting the password...", err)
                        )

                    settings.password = HASH
                    resolve()
                }
            )
        })
    }

    if (!settings.port) {
        await new Promise(resolve => {
            rl.question(
                "Please enter a port for the server: ",
                port => {
                    settings.port = port
                    resolve()
                }
            )
        })
    }

    if (!settings.port) {
        await new Promise(resolve => {
            rl.question(
                "Please enter a name for the blog: ",
                name => {
                    settings.blogName = name
                    resolve()
                }
            )
        })
    }

    await fs.writeFile("data/settings.json", JSON.stringify(settings))
        .catch(
            err => console.log("There was an error saving the settings...", err)
        )
}
