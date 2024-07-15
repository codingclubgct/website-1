"use client"

import { Children, DetailedHTMLProps, HTMLAttributes, ReactNode, useState, useEffect, ReactElement, isValidElement } from "react";
import hljs from "highlight.js"
import { IconButton } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function Pre(props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
    const { children, ...rest } = props;
    const [language, setLanguage] = useState<string | null>(null);
    const [text, setText] = useState("")
    const [copied, setCopied] = useState(false)
    const [ready, setReady] = useState(false)

    const languageRegex = /language-(\w+)/;

    const handleCopy = () => {
        if (!navigator || !navigator.clipboard) return
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    const extractTextFromChildren = (children: ReactNode): string => {
        let textContent = "";
        Children.forEach(children, (child) => {
            if (typeof child === "string") {
                textContent += child;
            } else if (isValidElement(child)) {
                textContent += extractTextFromChildren(child.props.children);
            }
        });
        return textContent;
    };

    useEffect(() => {
        const childrenArray = Children.toArray(children) as ReactElement[];
        Children.forEach(childrenArray, (child: ReactElement) => {
            if (child.type === "code") {
                setText(extractTextFromChildren(child.props.children));
            }
            if (child.props.className?.includes("language-")) {
                const match = child.props.className.match(languageRegex);
                if (match) {
                    setLanguage(match[1]);
                }
            }
        });
    }, [children]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            hljs.highlightAll()
            setReady(true)
        }
    }, [])

    const additionalStyles = (text.match(/\n/g) || []).length > 1 ? "top-4" : "top-1/2 -translate-y-1/2"

    return (
        <div className="relative w-full">
            <pre className={language ? `language-${language}` : "language-plaintext"} {...rest}>
                {children}
            </pre>
            {ready && (
                <div className={"absolute bottom-auto left-auto right-4 " + additionalStyles}>
                    {copied ? (
                        <IconButton color="success">
                            <DoneIcon />
                        </IconButton>
                    ) : (
                        <IconButton onClick={handleCopy} color="primary">
                            <ContentCopyIcon />
                        </IconButton>
                    )}
                </div>
            )}
        </div>
    )
}