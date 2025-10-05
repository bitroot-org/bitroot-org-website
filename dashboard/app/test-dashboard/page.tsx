"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function TestDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    console.log("Test Dashboard - User state:", { isLoaded, isSignedIn, user: user?.emailAddresses?.[0]?.emailAddress });
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Not signed in</h1>
      </div>
    );
  }

  const email = user?.emailAddresses?.[0]?.emailAddress || "";
  const isBkcStudent = email.endsWith("@bkc.met.edu");

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard - Client Side</h1>

      <div className="space-y-2 bg-gray-100 p-4 rounded">
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Is BKC Student:</strong> {isBkcStudent ? "Yes" : "No"}</p>
        <p><strong>First Name:</strong> {user?.firstName}</p>
        <p><strong>Last Name:</strong> {user?.lastName}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Expected Sidebar Sections:</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Dashboard ✓</li>
          <li>Projects ✓</li>
          <li>Timeline ✓</li>
          {isBkcStudent && (
            <>
              <li className="text-blue-600">Analytics ✓ (BKC Only)</li>
              <li className="text-blue-600">Resources ✓ (BKC Only)</li>
              <li className="text-blue-600">Settings ✓ (BKC Only)</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}