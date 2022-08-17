import { NextPage } from 'next';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import Page from "../../components/page/Page";
import IPost from '../../interfaces/Post';
import { getColor, generateColors, generateRadialGradients } from '../../services/Color';
import PostsService from '../../services/Post';

const Post: NextPage = () => {
    const router = useRouter()
    // base color
    const color = getColor();

    // get the color for the radial gradient
    const colors = generateColors(6, color);

    // generate the radial gradient
    const proprieties = generateRadialGradients(6, colors);

    const [post, setPost] = useState<IPost>({ content: "# Loading" } as IPost);
    const [isLoading, setLoading] = useState(false);
    const { id } = router.query
    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query
            PostsService.fetchPost(id as string).then(_post => {
                setPost(_post)
            })
        }
    }, [router])
    return (
        <main>
            <div className="nav">
                <div className="pfp" style={{ "backgroundImage": proprieties.join(","), "backgroundColor": colors[0] }}>
                </div>
                <h1>
                    sponge
                </h1>
            </div>
            {post && <Page post={{ content: post.content, key: post.key } as IPost} />}
        </main>
    )
}


export default Post
