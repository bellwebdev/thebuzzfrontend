import { Post } from "~/components/Post";
import type { Post as PostType } from "~/types";

type PostsProps = {
  posts: PostType[];
};

export function Posts({ posts }: PostsProps) {
  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
