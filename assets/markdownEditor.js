import hljs from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js"

/**
 * Sets up a markdown editor
 * @param {Element} textarea The element to get the text from.
 * @param {Element} preview The element to preview/syntaxhighlight to.
 */
function setupMarkdownEditor(textarea, preview, lineNumbers) {
    textarea.style.color = "transparent"

    textarea.addEventListener(
        "input",
        () => {
            const currentText = textarea.value
                // Make sure to not interpret HTML...
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")

            const syntaxHighlighted = currentText
                // This is for headings...
                .replace(/^(#+)(?= )/gm, "<span class=\"heading\">$&</span>")
                // This is for code blocks.
                .replace(/^(```)(\w*)(\n[\s\S]*?\n)(```)$/gm, "<span class=\"code-block\"><span class=\"muted\">$1</span><span class=\"lang\">$2</span><span class=\"hljs language-$2\">$3</span><span class=\"muted\">$4</span></span>")
                // This is for inline-code.
                .replace(/(?<=\s)`(\S|\S.*?\S)`(?=\s|$)/gm, "<span class=\"code\">$&</span>")
                .replace(/`(?!`+)/g, "<span class=\"muted\">$&</span>")
                // Block quotes
                .replace(/^&gt;/gm, "<span class=\"blockquote\">$&</span>")
                // This is for bold and italic beginnings.
                .replace(/[_*]+(?=[^_*\s])/g, match => {
                    const length = match.length >= 3 ? 3     : match.length
                    const italic = length %  2 === 1 ? "<i>" : ""
                    const bold   = length >= 2       ? "<b>" : ""
                    return `${match}${italic}${bold}`
                })
                // This is for bold and italic ends.
                .replace(/(?<=[^_*\s])[_*]+/g, match => {
                    const length = match.length >= 3 ? 3      : match.length
                    const italic = length %  2 === 1 ? "</i>" : ""
                    const bold   = length >= 2       ? "</b>" : ""
                    return `${italic}${bold}${match}`
                })
                // This is for bold and italic.
                .replace(/[*_]+(?=[^_*\s])/g, "<span class=\"bold-italic\">$&</span>")
                .replace(/(?<=[^_*\s])[*_]+/g, "<span class=\"bold-italic\">$&</span>")
                // Links
                .replace(/https?:\/\/\S+\.\S+/gm, "<span class=\"link\">$&</span>")
                // Lists...
                .replace(/(?<=^[\t ]*)([-*]|\d+\.)(?= )/gm, "<span class=\"list-item\">$&</span>")
                // Horisontal rules...
                .replace(/(?<=^)[*_-]{3,}(?=$)/gm, "<span class=\"horisontal-rule\">$&</span>")
                // This is important for scrolling...
                .replace(/\n$/, "\n ")

            const lineNumbered = currentText
                // Show whitespace. (I can't place this in syntax highlighting since some regexes there depends on whitespace...)
                .replace(/ +/g, match => `<span class="whitespace">${match.replace(/ /g, "∙")}</span>`)
                .replace(/∙{2}(?=<\/span>(\n|$))/gm, "∙<span class=\"whitespace newline\">⮐</span>")
                .replace(/\t/g, "<span class=\"whitespace\">⭾\t</span>")
                // This just creates lines.
                .replace(/^/gm, "<span class=\"line\">")
                .replace(/$/gm, "</span>")
                // This is important for scrolling...
                .replace(/\n$/, "\n ")

            preview.innerHTML     = syntaxHighlighted
            lineNumbers.innerHTML = lineNumbered

            document.querySelectorAll(".hljs").forEach(codeBlock => hljs.highlightElement(codeBlock))
        }
    )

    // Run an initial event...
    textarea.dispatchEvent(new Event("input"))

    textarea.addEventListener("scroll", () => {
        preview.scrollTop     = textarea.scrollTop
        lineNumbers.scrollTop = textarea.scrollTop
    })
}

setupMarkdownEditor(
    document.querySelector("#blog-post-body"),
    document.querySelector("#blog-post-preview"),
    document.querySelector("#blog-post-line-numbers")
)

setupMarkdownEditor(
    document.querySelector("#about-text"),
    document.querySelector("#about-text-preview"),
    document.querySelector("#about-text-line-numbers")
)
