"use client"

import { AnchorHTMLAttributes, DetailedHTMLProps } from "react"

const A = (props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
    return <a {...props} href={props.href?.startsWith(".") ? `${window.location.href}/${props.href}` : props.href} />
}

export default A