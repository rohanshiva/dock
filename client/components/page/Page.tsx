import React from "react";
import Markdoc from "@markdoc/markdoc";
import IPost from "../../interfaces/Post";

interface PageProps {
    post: IPost
}

function Page({ post }: PageProps) {
    return (
        <div className="page">
            {Markdoc.renderers.react(Markdoc.transform(Markdoc.parse(post.content)), React)}
        </div>
    )
}

export default Page;