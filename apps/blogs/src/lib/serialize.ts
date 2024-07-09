import { serialize as serialize_ } from "next-mdx-remote-client/serialize";
import type { SerializeResult, SerializeProps } from "next-mdx-remote-client/serialize";
import { plugins, prepare, type TocItem } from "@ipikuka/plugins";

export async function serialize<
    TFrontmatter extends Record<string, unknown> = Record<string, unknown>,
    TScope extends Record<string, unknown> = Record<string, unknown>,
>({
    source,
    options,
}: SerializeProps<TScope>): Promise<SerializeResult<TFrontmatter, TScope & { toc?: TocItem[] }>> {
    const { mdxOptions, ...rest } = options || {};

    const format_ = mdxOptions?.format;
    const format = format_ === "md" || format_ === "mdx" ? format_ : "mdx";
    const processedSource = format === "mdx" ? prepare(source) : source;

    return await serialize_<TFrontmatter, TScope>({
        source: processedSource,
        options: {
            mdxOptions: {
                ...mdxOptions,
                ...plugins({ format }),
            },
            vfileDataIntoScope: "toc",
            ...rest,
        },
    });
};