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
        renderLeaf={(props) => {
          if (props.leaf.placeholder) {
            return (
              <>
                <DefaultLeaf {...props} />
                <span
                  style={{ opacity: 0.3, position: "absolute", top: 0 }}
                  contentEditable={false}
                >
                  Type / to open menu
                </span>
              </>
            );
          }
          return <DefaultLeaf 
            {...props}
          />
        }}
        decorate={([node, path]) => {
          if (editor.selection != null) {
            if (
              !Editor.isEditor(node) &&
              Editor.string(editor, [path[0]]) === "" &&
              Range.includes(editor.selection, path) &&
              Range.isCollapsed(editor.selection)
            ) {
              return [
                {
                  ...editor.selection,
                  placeholder: true,
                },
              ];
            }
          }
          return [];
        }}
      />
    </Slate>
  );
}

