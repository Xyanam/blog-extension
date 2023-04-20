chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookie") {
    chrome.cookies.getAll(
      { url: process.env.PLASMO_PUBLIC_GET_TOKEN_URL, name: "__session" },
      (res) => {
        sendResponse({ cookie: res[0].value })
      }
    )
  }
})
