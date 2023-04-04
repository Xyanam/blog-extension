import { useAuth, useUser } from "@clerk/chrome-extension"
import React from "react"

const User = () => {
  const { isSignedIn, user } = useUser()
  const { signOut } = useAuth()

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="flex justify-center items-center my-5">
      <h1 className="text-xl font-semibold">Hi, {user.firstName}</h1>
      <button
        onClick={() => signOut()}
        className="py-2 px-3 rounded-xl text-md font-semibold border border-black hover:bg-black hover:text-white transition-all ml-3">
        Sign out
      </button>
    </div>
  )
}

export default User
