import React from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db/";
import { users, posts, media } from "@/db/schema/table";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function createPostContent(data: FormData) {
  "use server";
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/create-post");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, String(userEmail)));

  const curruntUser = user[0].id;

  const post = data.get("content") as string;

  if (post) {
    await db.insert(posts).values({ user: curruntUser, content: post });
    revalidatePath("/");
    redirect("/");
  }
}

export default async function CreatePost() {
  const session = await auth();

  const userEmail = session?.user?.email;

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/create-post");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, String(userEmail)));

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
