import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BaseRange, createEditor, Location, Node, Range, Text, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, useEditor, useSelected, useSlate, withReact } from "slate-react";


export function DecorateEditable() {
  const editor = useSlate()
  const [lastActiveSelection, setLastActiveSelection] = useState<Range>()

  useEffect(() => {
    if (editor.selection != null) setLastActiveSelection(editor.selection)
  }, [editor.selection])

  const decorate = useCallback(
    ([node]) => {
      if (
        Text.isText(node) &&
        editor.selection == null &&
        lastActiveSelection != null
      ) {

        const range = {
          selected: true,
          ...lastActiveSelection,
        };

        return [range]
      }
      return [];
    },
    [lastActiveSelection]
  );

  return <Editable
    renderLeaf={(props) => {
      if (props.leaf.selected) {
        return <span {...props.attributes} style={{background: 'yellow'}}>{props.children}</span>
      }
      return <span {...props.attributes}>{props.children}</span>
    }}
    decorate={decorate}
    placeholder="Write something..."
  />
}

export function DecorateSelection()  {
  const editor = useMemo<ReactEditor>(() => withHistory(withReact(createEditor())) , [])

  const [value, setValue] = useState<Node[]>([
    {
      children: [{
        text: "Make a text selection and then click somewhere other than the editor"
      }, {
        text: "You'll then see that your last selection will be highlighted in yellow"
      }], 
    },
  ]);

  return <Slate editor={editor} onChange={setValue} value={value}>
    <DecorateEditable />
  </Slate>
}

