import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DebugPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>

      <div className="space-y-4">
        <div>
          <strong>User ID:</strong> {userId || "Not found"}
        </div>

        <div>
          <strong>User Object:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || "Not found"}
        </div>

        <div>
          <strong>Is BKC Student:</strong>{" "}
          {user?.emailAddresses?.[0]?.emailAddress?.endsWith("@bkc.met.edu") ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
}