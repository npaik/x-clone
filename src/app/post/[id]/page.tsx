import React from "react";
import Image from "next/image";
import { eq } from "drizzle-orm";
import { db } from "@/db/";
import { users, posts, media } from "@/db/schema/table";
import { revalidatePath } from "next/cache";

export default async function Post({ params }: { params: { id: string } }) {
  const allPost = await db
    .select()
    .from(posts)
    .where(eq(posts.id, +params.id))
    .leftJoin(users, eq(posts.user, users.id))
    .leftJoin(media, eq(posts.media, media.id));

  const singlePost = allPost[0];

  revalidatePath(`/post/${params.id}`);

  if (!singlePost) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <div className="gap-y-1 flex flex-col items-center justify-center p-5 dark:bg-black bg-white rounded shadow-lg w-[500px] mx-auto">
        <div className="imagebox rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={singlePost.users?.avatar || ""}
            alt={`${singlePost.users?.username}'s avatar`}
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <div className="usernamebox w-full text-left">
          <h2 className="namebox text-center text-2xl font-bold">
            {singlePost.users?.username}
          </h2>
        </div>
        <div className="contentsbox w-full text-left mb-4">
          {singlePost.posts.content}
          {singlePost.media?.type === "image" && (
            <div className="flex justify-center mt-4">
              <Image
                src={singlePost.media.url}
                alt="Post media"
                width={420}
                height={420}
                className="mx-auto"
              />
            </div>
          )}
          {singlePost.media?.type === "video" && (
            <div className="mt-2">
              <iframe
                width="420"
                height="420"
                src={singlePost.media.url.replace(
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
      </div>
    </>
  );
}
