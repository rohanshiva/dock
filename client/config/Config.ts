const config = {
    base: (typeof window !== "undefined") ? `https://server_${window.location.hostname}/api` : `http://localhost:8000/api`,
    add: "add",
    fetch: "fetch",
    download: "download",
    delete: "delete",
    fetchPost: "fetch"
}

export default config;