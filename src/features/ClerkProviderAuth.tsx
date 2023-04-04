import {
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut
} from "@clerk/chrome-extension"
import React from "react"
import { Route, Routes, useNavigate } from "react-router-dom"

import PostForm from "~components/PostForm"
import User from "~components/User"

const publishableKey =
  "pk_test_b3JpZW50ZWQtYmFkZ2VyLTkzLmNsZXJrLmFjY291bnRzLmRldiQ"

function ClerkProviderAuth({ handleSubmit }) {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      navigate={(to) => navigate(to)}
      syncSessionWithTab>
      <div className="w-full">
        <main className="App-main">
          <Routes>
            <Route path="/sign-up/*" element={<SignUp signInUrl="/" />} />
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <User />
                    <PostForm handleSubmit={handleSubmit} />
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
