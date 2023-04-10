import { useAuth, useUser } from "@clerk/chrome-extension"
import React from "react"

const User = () => {
  const { isSignedIn, user } = useUser()
  const { signOut } = useAuth()

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5">
      <div>
        <img
          src={user.profileImageUrl}
          alt="avatar"
          className="rounded-full w-14"
        />
      </div>
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-xl font-semibold my-2 text-center">
          Hi, {user.firstName}
        </h1>
        <button
          onClick={() => signOut()}
          className="py-1 px-1.5 rounded-lg text-xs font-semibold border border-black bg-black text-white hover:bg-black hover:text-white transition-all ml-2">
          Sign out
        </button>
      </div>
    </div>
  )
}

export default User
