"use client"

import { OpenContext } from '@/context/open';
import { FolderNode } from '@/lib/normalize-path';
import { faFolderClosed, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";

const childPresent = (path: string, tree?: FolderNode | null) => {
    if(!tree) return false
    if (tree.path === path) {
        return true;
    }
    if (tree.children) {
        for (const child of tree.children) {
            if (childPresent(path, child)) {
                return true;
            }
        }
    }
    return false;
}

export function Tray({ tree, pl }: { tree?: FolderNode | null, pl: number }) {
    const router = useRouter()
    const pathname = usePathname()
    const [clicked, setClicked] = useState(tree?.name === "root" ? true : childPresent(pathname, tree));
    const { setClose } = useContext(OpenContext)

    if (!tree) {
        return null;
    }

    const handleItemClick = () => {
        if (tree.children?.length) {
            setClicked(!clicked);
        } else {
            setClose()
            router.push(tree.path)
        }
    };
    const renderTree = (node: FolderNode, pl: number) => {
        const isDir = Boolean(node.children?.length)

        return (
            <div key={node.path}>
                {node.name !== "root" && <div onClick={handleItemClick} style={{ paddingLeft: pl }} className={"flex items-center text-overlay2 hover:text-text gap-2 hover:bg-crust p-2 cursor-pointer mr-4" + (node.path === pathname ? " bg-crust text-text" : " ")}>
                    {isDir ? clicked ? <FontAwesomeIcon icon={faFolderOpen} className="text-mauve" /> : <FontAwesomeIcon icon={faFolderClosed} /> : <div className="w-2 h-2 rounded-full bg-mauve"></div>}
                    <p className='capitalize'> {node.name.replaceAll("-", " ")} </p>
                </div>}
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
