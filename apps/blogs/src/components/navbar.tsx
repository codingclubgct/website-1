"use client"

import { OpenContext } from '@/context/open';
import { FolderNode } from '@/lib/normalize-path';
import { faFolderClosed, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export function Tray({ tree, pl }: { tree?: FolderNode | null, pl: number }) {
    const router = useRouter()
    const [clicked, setClicked] = useState(false);
    const { setClose } = useContext(OpenContext)

    if (!tree) {
        return null;
    }

    const handleItemClick = () => {
        if (tree.children?.length) {
            setClicked(!clicked);
        } else {
            setClose()
        }
        router.push(tree.path)
    };
    const renderTree = (node: FolderNode, pl: number) => {
        const isDir = Boolean(node.children?.length)
        return (
            <div key={node.path}>
                <div onClick={handleItemClick} style={{ paddingLeft: pl }} className="flex items-center text-overlay2 hover:text-text gap-2 hover:bg-crust p-1 cursor-pointer mr-4">
                    {isDir ? clicked ? <FontAwesomeIcon icon={faFolderOpen} className="text-mauve" /> : <FontAwesomeIcon icon={faFolderClosed} /> : <div className="w-2 h-2 rounded-full bg-mauve"></div>}
                    <p> {node.name === "app" ? "home" : node.name.replaceAll("-", " ")} </p>
                </div>
                {clicked && node.children?.map((child, index) => (
                    <Tray key={index} tree={child} pl={pl + 12} />
                ))}
            </div>
        );
    };

    return (
        <div className="text-sm">
            {renderTree(tree, pl)}
        </div>
    );
}
