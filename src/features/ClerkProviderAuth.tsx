import {
  ClerkLoading,
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut
} from "@clerk/chrome-extension"
import React from "react"
import { Route, Routes, useNavigate } from "react-router-dom"

import Loader from "~components/Loader/Loader"
import PostForm from "~components/PostForm"
import User from "~components/User"

const publishableKey = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY

function ClerkProviderAuth() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      navigate={(to) => navigate(to)}
      syncSessionWithTab>
      <ClerkLoading>
        <Loader />
      </ClerkLoading>
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
    </ClerkProvider>
  )
}

export default ClerkProviderAuth
