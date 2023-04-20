import { ClerkLoading, ClerkProvider } from "@clerk/chrome-extension"
import React from "react"
import { useNavigate } from "react-router-dom"

import AuthUser from "~components/AuthUser"
import Loader from "~components/Loader/Loader"

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
      <AuthUser />
    </ClerkProvider>
  )
}

export default ClerkProviderAuth
