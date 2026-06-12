import { Event } from "~/components/Event";
import { Post } from "~/components/Post";
import type { FeedItem } from "~/types";

type FeedStreamProps = {
  items: FeedItem[];
};

export function FeedStream({ items }: FeedStreamProps) {
  return (
    <>
      {items.map((item) =>
        item.type === "post" ? (
          <Post key={item.data.id} post={item.data} />
        ) : (
          <Event key={item.data.id} event={item.data} />
        ),
      )}
    </>
  );
}
