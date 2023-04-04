import "~base.css"
import "~style.css"

import React from "react"
import { MemoryRouter } from "react-router-dom"

import ClerkProviderAuth from "~features/ClerkProviderAuth"

const CREATE_POST_MUTATION = `mutation CreatePostMutation($input: CreatePostInput!) {
  createPost(input: $input) {
    id
  }
}
`

const handleSubmit = (post) => {
  fetch("http://localhost:8911/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: CREATE_POST_MUTATION,
      variables: { input: post }
    })
  })
  console.log(post)
}

function IndexPopup() {
  return (
    <MemoryRouter>
      <div className="w-96">
        <ClerkProviderAuth handleSubmit={handleSubmit} />
      </div>
    </MemoryRouter>
  )
}

export default IndexPopup
