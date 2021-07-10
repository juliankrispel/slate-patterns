import { BaseElement, BaseText } from "slate";
import { ReactEditor } from "slate-react";

export type NorrisJoke = {
  icon_url: string,
  id: string,
  updated_at: string,
  url: string,
  value: string
}

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor
    Element: BaseElement & {
      videoId?: string
      type?: 'youtube' | 'dad-joke'
      id?: string
    }
    Text: BaseText & {
      highlighted?: boolean
      placeholder?: boolean
    }
  }
}