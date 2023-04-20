import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useState } from "react"

import { getImage, getText } from "./functions/InteractWithSite"
import { CREATE_POST_MUTATION } from "./mutations/CreatePostMutation"

import "~base.css"
import "~style.css"

export const config: PlasmoCSConfig = {
  matches: [
    "https://www.plasmo.com/*",
    "http://localhost:8910/*",
    "https://redwood-practiceblog.netlify.app/"
  ]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

type TStateErrors = {
  titleError: string | null
  imageUrlError: string | null
  bodyError: string | null
}

type TResponseCookie = {
  cookie: string
}

const PlasmoOverlay = () => {
  const [isShowForm, setIsShowForm] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [body, setBody] = useState("")
  const [isSendingPost, setIsSendingPost] = useState(false)
  const [errors, setErrors] = useState<TStateErrors>({
    titleError: null,
    imageUrlError: null,
    bodyError: null
  })
  const [newPostId, setNewPostId] = useState("")

  const checkAuth = async () => {
    const auth = await chrome.storage.local.get()
    setIsAuth(auth.isSignedIn)
  }

  const createNewPost = async (e, post) => {
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
        const response: TResponseCookie = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ action: "getCookie" }, (response) => {
            resolve(response)
          })
        })

        if (!response.cookie) {
          console.log("Token not found")
          return
        }
        setIsSendingPost(true)
        await fetch("http://localhost:8911/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response.cookie}`,
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

  return (
    <div className="z-50 flex flex-col items-end fixed bottom-10 right-8 w-46">
      {isShowForm &&
        (isAuth ? (
          <div className="form mb-2 h-[410px] flex justify-center items-center bg-white">
            <form className="flex flex-col justify-center items-center px-5 my-5 mt-1">
              <div className="flex items-center">
                <div className="flex flex-col">
                  <label htmlFor="title" className="text-black">
                    Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    className="rounded-md pt-1 px-2 border border-black w-42 h-7 outline-none"
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
                      <span className="text-red-500 text-sm">
                        {errors.titleError}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="py-2 px-4 ml-2 mt-4 rounded-md text-md font-semibold border border-black hover:text-white transition-all button cursor-pointer"
                  onClick={(e) => getText(e, setTitle)}>
                  Pick
                </button>
              </div>
              <div className="flex items-center mt-3">
                <div className="flex flex-col">
                  <label htmlFor="title" className="text-black">
                    ImageUrl
                  </label>
                  <input
                    name="title"
                    type="text"
                    className="rounded-md pt-1 px-2 border border-black w-42 h-7 outline-none"
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
                      <span className="text-red-500 text-sm">
                        {errors.imageUrlError}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="py-2 px-4 ml-2 mt-4 rounded-md text-md font-semibold border border-black hover:text-white transition-all button cursor-pointer"
                  onClick={(e) => getImage(e, setImageUrl)}>
                  Pick
                </button>
              </div>
              <div className="flex items-center mt-3">
                <div className="flex flex-col">
                  <label htmlFor="title" className="text-black">
                    Body
                  </label>
                  <textarea
                    name="title"
                    className="rounded-md py-1 px-2 border border-black w-42 h-20 outline-none body resize-none"
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
                      <span className="text-red-500 text-sm">
                        {errors.bodyError}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="py-2 px-4 ml-2 mt-4 rounded-md text-md font-semibold border border-black hover:text-white transition-all button cursor-pointer"
                  onClick={(e) => getText(e, setBody)}>
                  Pick
                </button>
              </div>
              <div className="mt-5 w-full">
                <button
                  className="w-full py-3 px-4 rounded-md text-md font-semibold border border-black bg-black text-white transition-all cursor-pointer"
                  onClick={(e) => createNewPost(e, { title, imageUrl, body })}>
                  {isSendingPost ? "Sending" : "Send"}
                </button>
              </div>
              {newPostId && (
                <div className="bg-black flex my-2 justify-center items-center rounded-md px-2 w-38">
                  <p className="text-white text-base my-1">Link to the post:</p>
                  {""}
                  <a
                    className="text-white hover:underline"
                    href={`https://redwood-practiceblog.netlify.app/article/${newPostId}`}
                    target="_blank">
                    Click
                  </a>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="w-96 h-96 bg-white rounded-md flex flex-col items-center mb-2 auth shadow-xl">
            <div className="flex flex-col items-center justify-center px-5">
              <p className="font-bold text-lg mb-0">
                You need to Login or Register
              </p>
              <p className="mt-1 font-bold text-lg">You can do this:</p>
              <div className="flex flex-col justify-center items-center mt-5">
                <p>In the Web-extension</p>
                <p className="text-xl text-gray-500">OR</p>
                <a
                  href="https://redwood-practiceblog.netlify.app/"
                  target="_blank"
                  className="text-black mt-3.5">
                  On the website
                </a>
              </div>
            </div>
          </div>
        ))}
      <div
        className="w-14 h-14 rounded-full bg-blue-600 flex justify-center items-center cursor-pointer content overflow-hidden"
        onClick={() => {
          setIsShowForm(!isShowForm)
          checkAuth()
        }}>
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className={`${isShowForm ? "plus active" : "plus"}`}>
          <path
            fill="#ffffff"
            fillRule="evenodd"
            d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"
          />
        </svg>
        <svg
          width="30px"
          height="30px"
          viewBox="0 -4.5 20 20"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className={`${isShowForm ? "arrow active" : "arrow"}`}>
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd">
            <g
              id="Dribbble-Light-Preview"
              transform="translate(-220.000000, -6684.000000)"
              fill="#ffffff">
              <g id="icons" transform="translate(56.000000, 160.000000)">
                <path
                  d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
                  id="arrow_down-[#338]"></path>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default PlasmoOverlay
