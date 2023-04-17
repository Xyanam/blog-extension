export const getText = (e, setState) => {
  e.preventDefault()
  let isPicked = false
  let targetElement = null
  let originalBoxShadow = null

  const handlerClick = (e) => {
    if (isPicked) return

    targetElement.style.boxShadow = originalBoxShadow

    let text = e.target.innerText

    isPicked = true
    setState(text)
    document.body.removeEventListener("click", handlerClick)
    document.body.removeEventListener("mouseover", handleMouseOver)
    document.body.removeEventListener("mouseout", handleMouseOut)
  }

  const handleMouseOver = (e) => {
    if (isPicked) return

    targetElement = e.target
    originalBoxShadow = targetElement.style.boxShadow
    e.target.style.boxShadow = "0px 0px 0px 2px red"
  }

  const handleMouseOut = (e) => {
    if (isPicked) return
    e.target.style.boxShadow = originalBoxShadow
  }

  document.body.addEventListener("mouseover", handleMouseOver)
  document.body.addEventListener("mouseout", handleMouseOut)
  document.body.addEventListener("click", handlerClick)
  return true
}

export const getImage = (e, setState) => {
  e.preventDefault()
  let isPicked = false
  let targetElement: HTMLElement | null = null
  let originalBoxShadow = null

  const handlerClick = (e) => {
    if (isPicked) return

    targetElement.style.boxShadow = originalBoxShadow

    let imageSrc = e.target.getAttribute("src")
    setState(imageSrc)
    document.body.removeEventListener("click", handlerClick)
    document.body.removeEventListener("mouseover", handleMouseOver)
    document.body.removeEventListener("mouseout", handleMouseOut)
  }

  const handleMouseOver = (e) => {
    if (isPicked) return

    targetElement = e.target
    originalBoxShadow = targetElement.style.boxShadow
    e.target.style.boxShadow = "0px 0px 0px 2px red"
  }

  const handleMouseOut = (e) => {
    if (isPicked) return
    e.target.style.boxShadow = originalBoxShadow
  }

  document.body.addEventListener("mouseover", handleMouseOver)
  document.body.addEventListener("mouseout", handleMouseOut)
  document.body.addEventListener("click", handlerClick)
  return true
}
