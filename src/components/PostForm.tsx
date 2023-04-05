import { useAuth } from "@clerk/chrome-extension"
import React, { useEffect, useState } from "react"

const CREATE_POST_MUTATION = `mutation CreatePostMutation($input: CreatePostInput!) {
  createPost(input: $input) {
    id
  }
}
`

const PostForm = () => {
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [body, setBody] = useState("")
  const { getToken } = useAuth()

  const handleCreatePost = async (e, post) => {
    e.preventDefault()
    try {
      const token = await getToken()

      if (!token) {
        console.log("Token not found")
        return
      }
      await fetch("http://localhost:8911/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "auth-provider": "clerk"
        },
        credentials: "include",
        body: JSON.stringify({
          query: CREATE_POST_MUTATION,
          variables: { input: post }
        })
      })
      setTitle("")
      setImageUrl("")
      setBody("")
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    chrome.storage.local.get(["title"]).then((resp) => setTitle(resp.title))
    chrome.storage.local
      .get(["imageUrl"])
      .then((resp) => setImageUrl(resp.imageUrl))
    chrome.storage.local.get(["body"]).then((resp) => setBody(resp.body))
  }, [])

  useEffect(() => {
    chrome.storage.local.set({ title, imageUrl, body })
  }, [title, imageUrl, body])

  const pickTextOnSite = (e: React.MouseEvent<HTMLButtonElement>, setState) => {
    e.preventDefault()

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "pick-text" },
        function (response) {
          if (response && response.text) {
            setState(response.text)
          }
        }
      )
    })
  }

  const pickImageOnSite = (
    e: React.MouseEvent<HTMLButtonElement>,
    setState
  ) => {
    e.preventDefault()

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "pick-image" },
        function (response) {
          if (response) {
            setState(response.imageSrc)
          }
        }
      )
    })
  }

  return (
    <form className="flex flex-col justify-center items-center px-5 mb-6">
      <div className="flex items-end justify-center">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-black">
            Title
          </label>
          <input
            name="title"
            type="text"
            className="rounded-lg py-1 px-2 border border-black w-52 h-9"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button
          className="py-1 px-2 ml-2 rounded-xl border border-black"
          onClick={(e) => pickTextOnSite(e, setTitle)}>
          Pick
        </button>
      </div>
      <div className="flex items-end justify-center mt-2">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-black">
            ImageUrl
          </label>
          <input
            name="title"
            type="text"
            className="rounded-lg py-1 px-2 border border-black w-52 h-9"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>
        <button
          className="py-1 px-2 ml-2 rounded-xl border border-black"
          onClick={(e) => pickImageOnSite(e, setImageUrl)}>
          Pick
        </button>
      </div>
      <div className="flex items-end justify-center mt-2">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-black">
            Body
          </label>
          <textarea
            name="title"
            className="rounded-lg py-1 px-2 border border-black w-52 h-24"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button
          className="py-1 px-2 ml-2 rounded-xl border border-black"
          onClick={(e) => pickTextOnSite(e, setBody)}>
          Pick
        </button>
      </div>
      <div className="mt-3">
        <button
          className="w-full py-2 px-4 rounded-xl text-md font-semibold border border-black hover:bg-black hover:text-white transition-all"
          onClick={(e) => handleCreatePost(e, { title, imageUrl, body })}>
          Отправить
        </button>
      </div>
    </form>
  )
}

export default PostForm
