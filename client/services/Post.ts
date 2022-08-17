import config from "../config";
import IPost from "../interfaces/Post";

class PostsService {
    static async add(content: string, expires?: boolean): Promise<IPost> {
        const url = `${config.base}/${config.add}`
        const body = { content: content, expires: expires }
        try {
            const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, credentials: "include", body: JSON.stringify(body) });
            if (response.status === 201) {
                const data = await response.json();
                return data
            } else {
                throw Error(`Failed to add post: ${response.status}`)
            }
        } catch (error: any) {

            throw (error);
        }
    }

    static async delete(key: string): Promise<any> {
        const url = `${config.base}/${config.delete}/${key}`
        try {
            const response = await fetch(url)
            if (response.status === 200) {
                return key
            }
        } catch (error: any) {
            throw (error);
        }
    }

    static async fetch(last?: string): Promise<IPost[]> {
        const url = `${config.base}/${config.fetch}`
        try {
            const response = await fetch(url, { credentials: "include" });
            if (response.status === 200) {
                const data = await response.json();
                return data
            } else {
                throw Error(`Failed to add post: ${response.status}`)
            }
        } catch (error: any) {
            console.log(error)
            throw (error);
        }
    }

    static async fetchPost(key: string): Promise<IPost> {
        const url = `${config.base}/${config.fetchPost}/${key}`
        console.log(url)
        try {
            const response = await fetch(url, { credentials: "include" });
            if (response.status === 200) {
                const data = await response.json()
                console.log(data)
                return data
            } else {
                throw Error(`Failed to fetch post: ${response.status}`)
            }
        } catch (error: any) {
            console.log(error);
            throw(error);
        }
    }
}

export default PostsService;