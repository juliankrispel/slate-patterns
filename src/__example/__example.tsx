import React, { useMemo, useState } from "react";
import { createEditor, Node, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";

export function IFrameElements()  {
  const editor = useMemo<ReactEditor>(() => withHistory(withReact(createEditor())) , [])

  const [value, setValue] = useState<Node[]>([
    {
      children: [{
        text: "Hey there"
      }], 
    },
  ]);

  return <Slate editor={editor} onChange={setValue} value={value}>
    <Editable placeholder="Write something..."/>
  </Slate>
}

