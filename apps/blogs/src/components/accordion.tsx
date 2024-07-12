"use client"

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DirectoryNode, FileNode } from "@/lib/helpers";
import { cn } from "cn-func";

export default function AccordionComponent({ node }: { node: DirectoryNode | FileNode }) {
    const pathname = usePathname();
    const [nameSlug, folderSlug, ...segments] = pathname.split("/").filter(Boolean);
    const [isOpen, setIsOpen] = useState(false);

    const isActive = segments.join("/") === node.absolutePath;

    useEffect(() => {
        const checkAndOpenAccordion = (node: DirectoryNode | FileNode, segments: string[]): boolean => {
            // Check if the node path matches the current pathname segments
            const nodeSegments = node.absolutePath.split('/').filter(Boolean);
            if (nodeSegments.length > segments.length) return false;

            for (let i = 0; i < nodeSegments.length; i++) {
                if (nodeSegments[i] !== segments[i]) {
                    setIsOpen(false);
                    return false;
                }
            }

            if (nodeSegments.length === segments.length) {
                setIsOpen(true);
                return true;
            }

            if (node.type === "dir" && node.children.length > 0) {
                for (const child of node.children) {
                    if (checkAndOpenAccordion(child, segments)) {
                        setIsOpen(true);
                        return true;
                    }
                }
            }

            return false;
        };

        checkAndOpenAccordion(node, segments);
    }, [pathname, node]);

    return (
        node.type === "file" && node.name === "README.md" ? null : (
            <div>
                {node.type === "file" ? (
                    <AccordionLabel node={node} />
                ) : (
                    <Accordion expanded={isOpen} onChange={() => setIsOpen(!isOpen)} className="bg-transparent">
                        <AccordionSummary expandIcon={isOpen ? <ArrowDropDownIcon className="text-yellow" /> : <ArrowDownwardIcon className="text-yellow" />}>
                            <Link href={`/${nameSlug}/${folderSlug}/${node.absolutePath}`} className={cn("no-underline text-subtext0", isActive && "bg-surface0 text-text")}>
                                {node.name.replace(".md", "")}
                            </Link>
                        </AccordionSummary>
                        <AccordionDetails>
                            {node.children.map((child) => (
                                <AccordionComponent key={child.absolutePath} node={child} />
                            ))}
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>
        )
    );
}

export const AccordionLabel = ({ node, useFolderSlug }: { node: DirectoryNode | FileNode, useFolderSlug?: boolean }) => {
    const pathname = usePathname();
    const [nameSlug, folderSlug, ...segments] = pathname.split("/").filter(Boolean);
    const isActive = segments.join("/") === node.absolutePath;

    return <Link href={`/${nameSlug}/${folderSlug}/${node.absolutePath}`} className={cn("no-underline text-subtext0 p-2 hover:bg-surface0 block w-full rounded", isActive && "bg-surface0 text-text")}>
        {useFolderSlug ? folderSlug : node.name.replace(".md", "")}
    </Link>
}
