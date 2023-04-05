chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "pick-text") {
    let isPicked = false
    let targetElement = null
    let originalBorderStyle = null

    const handlerClick = (e) => {
      if (isPicked) return

      targetElement.style.border = originalBorderStyle

      let text = e.target.innerText

      isPicked = true
      sendResponse({ text: text })
      document.body.removeEventListener("click", handlerClick)
      document.body.removeEventListener("mouseover", handleMouseOver)
      document.body.removeEventListener("mouseout", handleMouseOut)
    }

    const handleMouseOver = (e) => {
      if (isPicked) return

      targetElement = e.target
      originalBorderStyle = targetElement.style.border

      e.target.style.border = "2px solid red"
    }

    const handleMouseOut = (e) => {
      if (isPicked) return
      e.target.style.border = originalBorderStyle
    }

    document.body.addEventListener("mouseover", handleMouseOver)
    document.body.addEventListener("mouseout", handleMouseOut)
    document.body.addEventListener("click", handlerClick)
    return true
  }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let isPicked = false
  let targetElement = null
  let originalBorderStyle = null

  if (request.action === "pick-image") {
    const handlerClick = (e) => {
      if (isPicked) return

      targetElement.style.border = originalBorderStyle

      let imageSrc = e.target.getAttribute("src")
      sendResponse({ imageSrc })
      document.body.removeEventListener("click", handlerClick)
      document.body.removeEventListener("mouseover", handleMouseOver)
      document.body.removeEventListener("mouseout", handleMouseOut)
    }

    const handleMouseOver = (e) => {
      if (isPicked) return

      targetElement = e.target
      originalBorderStyle = targetElement.style.border

      e.target.style.border = "2px solid red"
    }

    const handleMouseOut = (e) => {
      if (isPicked) return
      e.target.style.border = originalBorderStyle
    }

    document.body.addEventListener("mouseover", handleMouseOver)
    document.body.addEventListener("mouseout", handleMouseOut)
    document.body.addEventListener("click", handlerClick)
    return true
  }
})
