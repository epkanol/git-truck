import type { Dispatch, SetStateAction } from "react"
import { createContext, useContext } from "react"
import type { HydratedGitObject } from "../analyzer/model"

export interface clickedObject {
  clickedObject: HydratedGitObject | null
  setClickedObject: Dispatch<SetStateAction<HydratedGitObject | null>>
}

export const ClickedObjectContext = createContext<clickedObject | null>(null)

export function useClickedObject() {
  const context = useContext(ClickedObjectContext)
  if (!context) {
    throw new Error("useClickedObject must be used within a ClickedObjectProvider")
  }
  return context
}
