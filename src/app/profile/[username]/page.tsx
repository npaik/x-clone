import React from "react";
import Image from "next/image";
import Link from "next/link";
import { eq, not } from "drizzle-orm";
import { db } from "@/db/";
import { users, posts, media } from "@/db/schema/table";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const result = cookies().get("username");
  console.log(result?.value);
  if (!result || typeof result.value !== "string") {
    return (
      <main>
        <h1>No user logged in</h1>
      </main>
    );
  }
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, params.username));

  if (!user || user.length === 0) {
    notFound();
  }

  const curruntUser = user[0].id;

  const userMedia = await db
    .select()
    .from(media)
    .innerJoin(posts, eq(posts.media, media.id))
    .where(eq(posts.user, curruntUser));

  return (
    <>
      <div className="gap-y-1 flex flex-col items-center justify-center p-5 dark:bg-black bg-white rounded w-[500px] mx-auto">
        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={user[0].avatar}
            alt={`${user[0].username}'s avatar`}
            className="min-w-full min-h-full object-cover"
          />
        </div>
        <div className="namebox text-2xl font-bold">
          {user[0].firstName} {user[0].lastName}
        </div>
        <div className="w-full flex justify-start">{user[0].username}</div>
        <div className="w-full flex justify-start">
          {user[0].followers} followers
        </div>
        <div className="w-full flex justify-start">Posts</div>
        <div>
          <ul>
            {userMedia.map((post) => (
              <li key={post.posts.id}>
                <div className="post-content">
                  <Link href={`/post/${post.posts.id}`}>
                    {post.posts.content}
                  </Link>
                </div>
                {post.media && post.media.type === "image" ? (
                  <div className="mt-2">
                    <Image
                      src={post.media.url}
                      alt="Post media"
                      width={420}
                      height={420}
                    />
                  </div>
                ) : null}
                {post.media && post.media.type === "video" ? (
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
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
