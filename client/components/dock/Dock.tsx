import { useEffect, useState, useRef } from 'react';
import { Trash } from "react-feather"
import PostsService from '../../services/Post';
import PostCard from '../postCard';
import IPost from "../../interfaces/Post";
import Notification, {
    ERROR,
    LOADING,
} from "../notifications/Notification";
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

function Dock() {

    const lastPostRef = useRef(null)
    const [post, setPost] = useState<string>("")
    const [posts, setPosts] = useState<IPost[]>([])
    const [shouldFetch, setShouldFetch] = useState(true);
    const router = useRouter()

    const parseTimestamp = (timestamp: string) => {
        const date = new Date(parseInt(timestamp));
        let parsedDate = `${date.toLocaleString("en-us", { weekday: "short" })} ${date.toLocaleString("en-us", { month: "short" })} ${date.getDate()} ${date.toLocaleTimeString()}`
        return parsedDate;
    }

    const getTrimmedContent = (content: string) => {
        if (content.length <= 250) {
            return content
        } else {
            return `${content.substring(0, 250)}...`
        }
    }

    const fetchPosts = async () => {
        const loadingToast = toast.loading("Fetching posts...", LOADING as any);
        try {
            const newPosts = await PostsService.fetch();
            setPosts(newPosts.reverse());
            setShouldFetch(false);
            // @ts-ignore
            lastPostRef.current?.scrollIntoView({ behavior: "smooth" })
            toast.dismiss(loadingToast);
        } catch (error: any) {
            console.log(error);
            toast.dismiss(loadingToast);
            toast(
                `Failed to fetch posts with error: ${error.message}`,
                ERROR as any
            );
        }
    }

    useEffect(() => {
        if (shouldFetch) {
            fetchPosts();
        }
    })

    useEffect(() => {
        // @ts-ignore
        lastPostRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [posts])

    const handleSendPost = async (expires?: boolean) => {
        if (!post) {
            return
        }
        const loadingToast = toast.loading("Sending ...", LOADING as any);
        try {
            console.log("loading...")
            const newPost = await PostsService.add(post, expires)
            setPosts(prevPosts => [newPost, ...prevPosts])
            setPost("");
            // @ts-ignore
            lastPostRef.current?.scrollIntoView({ behavior: "smooth" })
            toast.dismiss(loadingToast);
        } catch (error: any) {
            toast.dismiss(loadingToast);
            console.log(error);
            toast(
                `Failed to send post with error: ${error.message}`,
                ERROR as any
            );
        }
    }

    const handleDelete = async (key: string) => {
        const loadingToast = toast.loading("Sending ...", LOADING as any);
        try {
            await PostsService.delete(key)
            setPosts(prevPosts => {
                let newPosts = prevPosts;
                newPosts = newPosts.filter(_post => _post.key !== key);
                return newPosts
            })
            // @ts-ignore
            lastPostRef.current?.scrollIntoView({ behavior: "smooth" })
            toast.dismiss(loadingToast);
        } catch (error: any) {
            toast.dismiss(loadingToast);
            console.log(error);
            toast(
                `Failed to delete post with error: ${error.message}`,
                ERROR as any
            )
        }
    }

    const handlePostClick = (key: string) => {
        router.push(`./posts/${key}`)
    }

    return (
        <>
            <div className="post-cards-container" >
                {posts && posts.length > 0 ? posts.map((_post, index) => {
                    console.log(_post, index, lastPostRef)

                    return (
                        <div className="post-card-container" key={index} ref={((index === 0) ? lastPostRef : null)} onClick={() => handlePostClick(_post.key)}>
                            <div className="post-card-content">
                                <PostCard content={getTrimmedContent(_post.content)} />
                            </div>
                            <div className="post-card-toolbar">
                                <div className="time-tag">
                                    {parseTimestamp(_post.key)}
                                </div>
                                <div className="toolbar-actions">
                                    <button className="icon-button" onClick={() => handleDelete(_post.key)}>
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }) :
                    (
                        <div>
                            No post's yet, add some 🦍
                        </div>
                    )}
            </div>
            <div className="input-container">
                <textarea
                    value={post}
                    onChange={(event) => {
                        setPost(event.target.value)
                    }} />
                <div className="actions">
                    <button className="send" onClick={() => handleSendPost(false)}>
                        <h3>
                            Enter
                        </h3>
                    </button>
                </div>

            </div>
            <Notification />
        </>
    )
}

export default Dock;
