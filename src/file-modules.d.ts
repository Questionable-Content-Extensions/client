// For CSS
declare module '*.module.css' {
    const classes: { [key: string]: string }
    export default classes
}

// For Markdown
declare module '*.md' {
    const contents: string
    export default contents
}
