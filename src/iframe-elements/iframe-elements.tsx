import React, { useMemo, useState } from "react";
import { createEditor, Node, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";

export function IFrameElements()  {
  const editor = useMemo<ReactEditor>(() => {
    const _editor = withHistory(withReact(createEditor()))
    _editor.isVoid = (el) => el.type === 'youtube'
    return _editor
  }, [])

  const [value, setValue] = useState<Node[]>([
    {
      children: [{
        text: "Hey there"
      }], 
    },
    {
      type: 'youtube',
      videoId: 'CvZjupLir-8',
      children: [{
        text: ''
      }]
    },
    {
      children: [{
        text: ""
      }], 
    },
  ]);

  const youtubeRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:\S+)?$/

  return <Slate editor={editor} onChange={setValue} value={value}>
    <Editable
      onPaste={(event) => {
        const pastedText = event.clipboardData?.getData('text')?.trim()
        const matches = pastedText.match(youtubeRegex)
        if (matches != null) {
          const [_, videoId] = matches
          event.preventDefault()
          Transforms.insertNodes(editor, [{
            type: 'youtube',
            videoId,
            children: [{
              text: ''
            }]
          }])
        }
      }}
      renderElement={({ attributes, element, children }) => {
        if (element.type === 'youtube') {
          return <div {...attributes}>
            <iframe
              contentEditable={false}
              src={`https://www.youtube.com/embed/${element?.videoId}`}
              frameBorder="0"
            ></iframe>
            {children}
          </div>
        } else {
          return <p {...attributes}>{children}</p>
        }
      }}
      placeholder="Write something..."/>
  </Slate>
}

