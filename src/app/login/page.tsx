import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function handleCreatePost(data: FormData) {
  "use server";
  const username = data.get("username");
  console.log(username);
  if (typeof username !== "string") {
    throw new Error("username needs to be submitted");
  }
  console.log("cookie set");
  cookies().set("username", username);
  revalidatePath(`/create-post/`);
  redirect(`/profile/${username}`);
}

export default function CreatePost() {
  return (
    <main className="text-center mt-10">
      <form action={handleCreatePost} className="flex flex-col gap-4">
        <label className="w-full">
          Username
          <input
            type="text"
            name="username"
            className="border rounded-xl px-4 py-2 w-full"
          />
        </label>

        <button type="submit" className="border rounded-xl px-4 py-2">
          Post
        </button>
      </form>
    </main>
  );
}
