import { createPost } from "@/actions/posts";
import PostForm from "@/components/post-from";

export default function NewPostPage() {
 return <PostForm action={createPost}/>
}
