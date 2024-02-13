export interface FolderNode {
    name: string;
    path: string;
    children: FolderNode[];
}

export function normalizePaths(flattenedPaths: string[]): FolderNode | null {
    if (flattenedPaths.length === 0) {
        return null;
    }

    const folderStructure: FolderNode = {
        name: 'root',
        path: '',
        children: [],
    };

    flattenedPaths.forEach((flattenedPath) => {
        const pathSegments = flattenedPath.split('/');
        let currentLevel: FolderNode = folderStructure;

        pathSegments.forEach((segment, index) => {
            const existingNode = currentLevel.children.find((node) => node.name === segment);

            if (!existingNode) {
                const newNode: FolderNode = {
                    name: segment,
                    path: currentLevel.path ? `${currentLevel.path}/${segment}` : `/${segment}`,
                    children: [],
                };

                currentLevel.children.push(newNode);
                currentLevel = newNode;
            } else {
                currentLevel = existingNode;
            }
        });
    });

    // Return the root's children directly if there's only one child, otherwise return the entire root structure
    return folderStructure.children.length === 1 ? folderStructure.children[0] : folderStructure;
}