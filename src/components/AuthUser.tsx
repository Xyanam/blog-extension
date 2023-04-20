import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  useAuth
} from "@clerk/chrome-extension"
import React, { useEffect } from "react"
import { Route, Routes } from "react-router-dom"

import PostForm from "./PostForm"
import User from "./User"

const AuthUser = () => {
  const { isSignedIn, getToken } = useAuth()

  useEffect(() => {
    getToken().then((token) => {
      chrome.storage.local.set({ token })
    })
    chrome.storage.local.set({ isSignedIn })
  }, [isSignedIn, getToken])

  return (
    <div className="w-full">
      <main>
        <Routes>
          <Route path="/sign-up/*" element={<SignUp signInUrl="/" />} />
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <User />
                  <PostForm />
                </SignedIn>
                <SignedOut>
                  <SignIn afterSignInUrl="/" signUpUrl="/sign-up" />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default AuthUser
