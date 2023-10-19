import React from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db/";
import { users, posts, media } from "@/db/schema/table";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function createPostContent(data: FormData) {
  "use server";

  let cookieUser = cookies().get("username")?.value;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, cookieUser!));
  const curruntUserId = user[0].id;

  const post = data.get("content") as string;
  // console.log(post);
  if (post) {
    await db.insert(posts).values({ user: curruntUserId, content: post });
    redirect("/");
  }
}

export default async function CreatePost() {
  let cookieUser = cookies().get("username")?.value;
  if (!cookieUser) {
    redirect("/login");
  }
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, cookieUser));

  if (!user || user.length === 0) {
    console.log("User not found");
    return <div>User not found</div>;
  }
  const curruntUserId = user[0].id;
  console.log(curruntUserId); // 11 for npaik

  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center mb-4 p-4 dark:bg-black bg-white rounded shadow-lg w-[500px] mx-auto">
          <div className="flex items-center w-full mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={user[0].avatar}
                alt={`${user[0].username}'s avatar`}
                className="min-w-full min-h-full object-cover"
              />
            </div>
            <div className="ml-4 text-xl">{user[0].username}</div>
          </div>
          <form className="flex flex-col" action={createPostContent}>
            {/* <input
              type="text"
              hidden
              value={curruntUserId}
              onChange={() => {}}
            /> */}
            <input
              className="text center py-2 px-4 border border-neutral-400 rounded-3xl"
              name="content"
              type="text"
              placeholder="What's on your mind?"
            />
            <button type="submit" className="mt-4">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
