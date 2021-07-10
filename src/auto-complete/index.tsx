import React, { useEffect, useLayoutEffect, useMemo, useState, useCallback } from "react";
import { createEditor, Editor, Node, Range, Transforms } from "slate";
import { withHistory } from "slate-history";
import { DefaultElement, Editable, ReactEditor, Slate, useSlateStatic, withReact } from "slate-react";
import { debounce } from "lodash";
import Highlighter from "react-highlight-words";
import { useTextSelection } from 'use-text-selection'

type ApiResponse = {
  timestamp?: string
  error?: string
  message?: string
  results?: DadJoke[]
}

type DadJoke = {
  id: string
  joke: string
}

function AutoComplete({ query }: { query: string }) {
  const editor = useSlateStatic()
  const [options, setOptions] = useState<DadJoke[]>([]);
  const [error, setError] = useState<string>()

  const sel = useTextSelection()

  const { selection } = editor

  const apiQuery = useCallback(debounce(async (term: string) => {
    console.log('api query')
    try {
      const res = await fetch(`https://icanhazdadjoke.com/search?term=${term}&limit=10`, {
        headers: {
          'accept': 'application/json'
        },
      })
      const json: ApiResponse = await res.json()
      console.log(json.results)
      if (json.message != null) {
        setOptions([])
        setError(json.message)
      } else if (json.results != null) {
        setOptions(json.results)
        setError(undefined)
      }
    } catch (err) {
      setError(err.message)
      // throw new Error(err)
    }
  }, 600), [])

  useEffect(() => void apiQuery(query), [query])

  return (
    <div
      style={{
        listStyleType: "none",
        padding: 0,
        margin: 0,
        top: `calc(${sel.clientRect?.top}px + 1.2em)`,
        left: "2.3em",
        position: "absolute",
        width: "calc(100% - 4.6em)",
      }}
    >
      {error != null && (
        <div role="alert" style={{ color: "red" }}>
          {error}
        </div>
      )}
      <div className="options">
        {options.map((val) => (
          <button
            key={val.id}
            className="option"
            role="button"
            onClick={(e) => {
              if (selection != null && Range.isCollapsed(selection)) {
                e.stopPropagation();
                const path = selection.focus.path;
                editor.selection?.focus.path;
                Transforms.delete(editor, {
                  distance: query.length + 1,
                  reverse: true,
                });
                Transforms.insertNodes(editor, [
                  {
                    type: "dad-joke",
                    id: val.id,
                    children: [
                      {
                        text: val.joke,
                      },
                    ],
                  },
                  // We'll add an extra node so that the user can continue typing
                  {
                    children: [
                      {
                        text: "",
                      },
                    ],
                  },
                ]);

                Transforms.select(editor, [path[0] + 2]);
                ReactEditor.focus(editor);
              }
            }}
          >
            <Highlighter
              activeStyle={{ background: "purple" }}
              searchWords={[query]}
              autoEscape={true}
              textToHighlight={val.joke}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function AutoCompleteEditor()  {
  const editor = useMemo<ReactEditor>(() => withHistory(withReact(createEditor())) , [])

  const [value, setValue] = useState<Node[]>([
    {
      children: [
        {
          text: "",
        },
      ],
    },
  ]);

  const { selection } = editor

  let showAutoComplete = false
  let searchString = ''

  if (selection != null && Range.isCollapsed(selection)) {
    const [_, path] = Editor.node(editor, selection, { depth: 1 })
    const range = Editor.range(editor, Editor.start(editor, path), selection.focus)
    const text = Editor.string(editor, range)
    const matches = text.match(/@([^\s]+$)/)

    if (matches != null) {
      showAutoComplete = true
      searchString = matches[1]
    }
  } 

  return (
    <Slate editor={editor} onChange={setValue} value={value}>
      <Editable placeholder="Write something..." renderElement={(props) => {
        if (props.element.type === 'dad-joke') {
          return <blockquote {...props.attributes} style={{fontSize: '0.8em', paddingLeft: '1em'}} contentEditable={false} >
            {props.children}
          </blockquote>
        }
        return <DefaultElement {...props} />
      }}/>
      {showAutoComplete && <AutoComplete query={searchString} />}
    </Slate>
  );
}

