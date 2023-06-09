import "~base.css"
import "~style.css"

import React from "react"
import { MemoryRouter } from "react-router-dom"

import ClerkProviderAuth from "~features/ClerkProviderAuth"

function IndexPopup() {
  return (
    <MemoryRouter>
      <div className="w-96 h-[440px] popup">
        <ClerkProviderAuth />
      </div>
    </MemoryRouter>
  )
}

export default IndexPopup
