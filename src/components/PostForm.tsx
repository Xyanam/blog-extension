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
  const [isSendingPost, setIsSendingPost] = useState(false)
  const [errors, setErrors] = useState({
    titleError: null,
    imageUrlError: null,
    bodyError: null
  })
  const [newPostId, setNewPostId] = useState("")

  const { getToken } = useAuth()

  const handleCreatePost = async (e, post) => {
    e.preventDefault()
    if (title.length < 5 || body.length < 5 || imageUrl.length < 5) {
      if (title.length < 5) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          titleError: "Enter at least 5 characters"
        }))
      }
      if (imageUrl.length < 5) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          imageUrlError: "Enter at least 5 characters"
        }))
      }
      if (body.length < 5) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          bodyError: "Enter at least 5 characters"
        }))
      }
    } else {
      try {
        const token = await getToken()

        if (!token) {
          console.log("Token not found")
          return
        }
        setIsSendingPost(true)
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
          .then((resp) => resp.json())
          .then((result) => setNewPostId(result.data.createPost.id))
        setIsSendingPost(false)
        setTitle("")
        setImageUrl("")
        setBody("")
      } catch (error) {
        console.error(error)
        setIsSendingPost(false)
      }
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
    <form className="flex flex-col justify-center items-center px-5 mb-6 mt-1">
      <div className="flex items-center">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-black">
            Title
          </label>
          <input
            name="title"
            type="text"
            className="rounded-md pt-1 px-2 border border-black w-42 h-8 outline-none"
            placeholder="Enter the title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setErrors({ ...errors, titleError: null })
            }}
            required
          />
          <div className="h-2">
            {errors.titleError && (
              <span className="text-red-500">{errors.titleError}</span>
            )}
          </div>
        </div>
        <button
          className="py-1.5 px-4 ml-2 mt-2 rounded-md text-md font-semibold border border-black hover:text-white transition-all button"
          onClick={(e) => pickTextOnSite(e, setTitle)}>
          Pick
        </button>
      </div>

      <div className="flex items-center mt-2">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-black">
            ImageUrl
          </label>
          <input
            name="title"
            type="text"
            className="rounded-md py-1 px-2 border border-black w-42 h-8 outline-none"
            placeholder="Enter the imageUrl..."
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              setErrors({ ...errors, imageUrlError: null })
            }}
            required
          />
          <div className="h-2">
            {errors.imageUrlError && (
              <span className="text-red-500">{errors.imageUrlError}</span>
            )}
          </div>
        </div>
        <button
          className="py-1.5 px-4 ml-2 mt-2 rounded-md text-md font-semibold border border-black hover:text-white transition-all button"
          onClick={(e) => pickImageOnSite(e, setImageUrl)}>
          Pick
        </button>
      </div>
      <div className="flex items-center mt-2">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-black">
            Body
          </label>
          <textarea
            name="title"
            className="rounded-md py-1 px-2 border border-black w-42 h-20 outline-none body"
            placeholder="Enter the content..."
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              setErrors({ ...errors, bodyError: null })
            }}
            required
          />
          <div className="h-2">
            {errors.bodyError && (
              <span className="text-red-500">{errors.bodyError}</span>
            )}
          </div>
        </div>
        <button
          className="py-1.5 px-4 ml-2 rounded-md text-md font-semibold border border-black  hover:text-white transition-all button"
          onClick={(e) => pickTextOnSite(e, setBody)}>
          Pick
        </button>
      </div>
      <div className="mt-3 w-56">
        <button
          className="w-full py-2 px-4 rounded-md text-md font-semibold border border-black bg-black text-white transition-all"
          onClick={(e) => handleCreatePost(e, { title, imageUrl, body })}
          disabled={isSendingPost}>
          {isSendingPost ? "Sending" : "Send"}
        </button>
      </div>
      {newPostId && (
        <div className="bg-black flex flex-col justify-center items-center rounded-md my-3 px-3 py-2">
          <p className="text-white text-base">Link to the post:</p>
          <a
            className="text-white hover:underline"
            href={`https://redwood-practiceblog.netlify.app/article/${newPostId}`}
            target="_blank">{`https://redwood-practiceblog.netlify.app/article/${newPostId}`}</a>
        </div>
      )}
    </form>
  )
}

export default PostForm
