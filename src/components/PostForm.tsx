import React, { useState } from "react"

const PostForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [body, setBody] = useState("")

  const handle = (e) => {
    e.preventDefault()
    handleSubmit({ title, imageUrl, body })
  }

  const pickTextOnSite = (e, setState) => {
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

  const pickImageOnSite = (e, setState) => {
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
            className="rounded-lg py-1 px-2 border border-black w-34"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button
          className="py-1 px-2 ml-2 rounded-xl border border-black"
          onClick={(e) => pickTextOnSite(e, setTitle)}>
          Pick
        </button>
      </div>
      <div className="flex items-end justify-center">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-black">
            ImageUrl
          </label>
          <input
            name="title"
            type="text"
            className="rounded-lg py-1 px-2 border border-black w-34"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <button
          className="py-1 px-2 ml-2 rounded-xl border border-black"
          onClick={(e) => pickImageOnSite(e, setImageUrl)}>
          Pick
        </button>
      </div>
      <div className="flex items-end justify-center">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-black">
            Body
          </label>
          <textarea
            name="title"
            className="rounded-lg py-1 px-2 border border-black w-34"
            value={body}
            onChange={(e) => setBody(e.target.value)}
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
          onClick={handle}>
          Отправить
        </button>
      </div>
    </form>
  )
}

export default PostForm
