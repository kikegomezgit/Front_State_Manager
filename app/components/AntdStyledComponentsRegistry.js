"use client"

import React from "react"
import { useServerInsertedHTML } from "next/navigation"
import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs"

export default function AntdStyledComponentsRegistry({ children }) {
    const [cache] = React.useState(() => createCache()) // gets antd cached styles

    // innsert cache style on the server
    useServerInsertedHTML(() => (
        React.createElement("style", {
            id: "antd",
            dangerouslySetInnerHTML: { __html: extractStyle(cache, true) }
        })
    ))

    return React.createElement(StyleProvider, { cache }, children)
}