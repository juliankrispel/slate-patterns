import React, { useMemo, useState } from "react";
import { createEditor, Editor, Text, Node, Range } from "slate";
import { withHistory } from "slate-history";
import { DefaultLeaf, Editable, ReactEditor, Slate, withReact } from "slate-react";

export function ElementPlaceholders()  {
  const editor = useMemo<ReactEditor>(() => withHistory(withReact(createEditor())) , [])

  const [value, setValue] = useState<Node[]>([
    {
      children: [{
        text: "Hey there"
      }], 
    },
  ]);

  return (
    <Slate editor={editor} onChange={setValue} value={value}>
      <Editable
        placeholder="Write something..."
        spellCheck
        autoCorrect="true"
      />
    </Slate>
  );
}

