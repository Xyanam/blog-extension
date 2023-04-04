import type { PlasmoCSConfig } from "plasmo"

import "~base.css"

export const config: PlasmoCSConfig = {
  matches: ["https://www.plasmo.com/*"]
}

const PlasmoOverlay = () => {
  return <div className="z-50 flex fixed top-32 right-8"></div>
}

export default PlasmoOverlay
