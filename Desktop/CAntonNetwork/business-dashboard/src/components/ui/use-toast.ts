import * as React from "react"
import { cn } from "@/lib/utils"

const useToast = () => {
  return {
    toast: (props: { title: string; description: string }) => {
      console.log("Toast:", props)
      alert(`${props.title}: ${props.description}`)
    }
  }
}

export { useToast }
