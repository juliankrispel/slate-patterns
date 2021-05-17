import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Editor, Node, Range, Text } from "slate";
import { withHistory } from "slate-history";
import { DefaultLeaf, Editable, ReactEditor, Slate, useEditor, useSelected, useSlate, withReact } from "slate-react";

export function EditableWithDecorate() {
  const editor = useSlate()
  const [lastActiveSelection, setLastActiveSelection] = useState<Range>()

  useEffect(() => {
    if (editor.selection != null) setLastActiveSelection(editor.selection)
  }, [editor.selection])

  const decorate = useCallback(
    ([node, path]) => {
      if (
        Text.isText(node) &&
        editor.selection == null &&
        lastActiveSelection != null
      ) {
        const intersection = Range.intersection(lastActiveSelection, Editor.range(editor, path))

        if (intersection == null) {
          return []
        }

        const range = {
          highlighted: true,
          ...intersection
        };

        return [range]
      }
      return [];
    },
    [lastActiveSelection]
  );

  return <Editable
    renderLeaf={(props) => {
      if (props.leaf.highlighted) {
        return <span {...props.attributes} style={{background: 'yellow'}}>{props.children}</span>
      }
      return <DefaultLeaf {...props} />
    }}
    decorate={decorate}
    placeholder="Write something..."
  />
}

export function HighlightLastActiveSelection()  {
  const editor = useMemo<ReactEditor>(() => withHistory(withReact(createEditor())) , [])

  const [value, setValue] = useState<Node[]>([
    {
      children: [{
        text: "Make a text selection and click on the above input"
      }]
    },
    { children: [{
        text: "You'll then see that your last selection will be highlighted in yellow"
      }]
    }, 
  ]);

  return <div>
    <input type="text"  style={{ padding: '10px', marginBottom: '2em' }}/>
    <Slate editor={editor} onChange={setValue} value={value}>
      <EditableWithDecorate />
    </Slate>
  </div>
}

