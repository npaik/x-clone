import React from "react";
import Image from "next/image";
import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db/";
import { users, posts, media } from "@/db/schema/table";

export default async function FeedPost() {
  const allPostsData = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.id))
    .leftJoin(users, eq(posts.user, users.id)) 
    .leftJoin(media, eq(posts.media, media.id)); 

  return (
    <>
      {allPostsData.map((post) => (
        <div
          key={post.posts.id}
          className="gap-y-1 flex flex-col items-center justify-center p-5 dark:bg-black bg-white rounded w-[500px] mx-auto"
        >
          <div className="user-info w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={post.users?.avatar}
              alt={`${post.users?.avatar}'s avatar`}
              className="min-w-full min-h-full object-cover"
            />
          </div>
          <div className="namebox text-2xl font-bold">
            {post.users?.username}
          </div>
          <div className="post-content">
            <Link href={`/post/${post.posts.id}`}>{post.posts.content}</Link>
          </div>
          {post.media?.type === "image" && (
            <div className="mt-2">
              <Image
                src={post.media?.url}
                alt="Post media"
                width={420}
                height={420}
              />
            </div>
          )}

          {post.media?.type === "video" && (
            <div className="mt-2">
              <iframe
                width="420"
                height="420"
                src={post.media.url.replace(
                  "https://www.youtube.com/watch?v=",
                  "https://www.youtube.com/embed/"
                )}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
