import React from "react";
import Markdoc from "@markdoc/markdoc";

interface PostCardProps {
    content: string
}

function PostCard({ content }: PostCardProps) {
    return (
        <>
            {Markdoc.renderers.react(Markdoc.transform(Markdoc.parse(content)), React)}
        </>
    )
}

export default PostCard;