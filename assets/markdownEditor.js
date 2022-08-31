const textarea = document.querySelector("#blog-post-body")
const preview  = document.querySelector("#markdown-preview")

textarea.style.color = "transparent"

textarea.addEventListener(
    "input",
    () => {
        const currentText = textarea.value

        const syntaxHighlighted = currentText
            // This is important for scrolling...
            .replace(/\n$/, "\n ")
            // This is for headings...
            .replace(/^(#+)(?= )/gm, "<span class=\"muted\">$&</span>")
            .replace(/^/gm, "<span class=\"line\">")
            .replace(/$/gm, "</span>")

        preview.innerHTML = syntaxHighlighted
    }
)

textarea.addEventListener("scroll", () => {
    preview.scrollTop = textarea.scrollTop
})