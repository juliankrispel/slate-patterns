import { BaseElement, BaseText } from "slate";
import { ReactEditor } from "slate-react";

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor
    Element: BaseElement & {
      videoId?: string
      type?: 'youtube'
    }
    Text: BaseText & {
      highlighted?: boolean
      placeholder?: boolean
    }
  }
}