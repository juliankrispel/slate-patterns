import React, { Children, useMemo, useState } from "react";
import { createEditor, Editor, Node, Transforms } from "slate";
import { withHistory } from "slate-history";
import create from 'zustand'
import { DefaultElement, Editable, Slate, withReact } from "slate-react";
import { init } from 'filestack-js';
import { nanoid } from 'nanoid'
const filestack = init('AmInuwFLJS2qXojnOhFZyz');

type Entity = {
  url?: string
}

type EntityState = {
  entities: {
    [entityId: string]: Entity;
  };
  upsertEntity: (entityId: string, entity: Entity) => void;
};

const useStore = create<EntityState>((set) => ({
  entities: {
    e1: {
      url: "https://placekitten.com/400/300",
    },
  },
  upsertEntity: (id, entity) =>
    set((state) => ({
      entities: {
        ...state.entities,
        [id]: entity,
      },
    })),
}));

export function Entities() {
  const editor = useMemo<Editor>(() => {
    const _editor = withHistory(withReact(createEditor()));
    const { isVoid } = _editor;
    _editor.isVoid = (el) => el.id != null || isVoid(el);
    return _editor;
  }, []);

  const [value, setValue] = useState<Node[]>([
    {
      children: [
        {
          text: "Hey there",
        },
      ],
    },
    {
      id: "e1",
      children: [{ text: "" }],
    },
  ]);

  return (
    <Slate editor={editor} onChange={setValue} value={value}>
      <Editable
        placeholder="Write something..."
        onDrop={(event) => {
          const files = Array.from(event.dataTransfer.items).map(
            (item) => item.getAsFile() as File
          )

          files.forEach(async (file) => {
            const id = nanoid()
            const entityState = useStore.getState()
            entityState.upsertEntity(id, {});
            Transforms.insertNodes(editor, { id, children: [{ text: "" }] });
            const uploaded = await filestack.upload(file)
            entityState.upsertEntity(id, { url: uploaded.url });
          });
        }}
        renderElement={(props) => {
          const entity = useStore(
            (state) =>
              props.element.id != null && state.entities[props.element.id]
          );

          if (entity) {
            return (
              <figure {...props.attributes} contentEditable={false}>
                {entity.url != null ? (
                  <img src={entity.url} />
                ) : (
                  <span>Loading</span>
                )}
                {props.children}
              </figure>
            );
          }

          return <DefaultElement {...props} />;
        }}
      />
    </Slate>
  );
}

