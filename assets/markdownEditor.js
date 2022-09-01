/**
 * Sets up a markdown editor
 * @param {Element} textarea The element to get the text from.
 * @param {Element} preview The element to preview/syntaxhighlight to.
 */
function setupMarkdownEditor(textarea, preview) {
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

    // Run an initial event...
    textarea.dispatchEvent(new Event("input"))

    textarea.addEventListener("scroll", () => {
        preview.scrollTop = textarea.scrollTop
    })
}

setupMarkdownEditor(
    document.querySelector("#blog-post-body"),
    document.querySelector("#blog-post-preview")
)

setupMarkdownEditor(
    document.querySelector("#about-text"),
    document.querySelector("#about-text-preview")
)