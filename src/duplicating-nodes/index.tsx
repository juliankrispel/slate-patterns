import { Descendant, Element } from "slate";

export function cloneChildren(children: Descendant[]): Descendant[] {
  return children.map((node) => {
    if (Element.isElement(node)) {
      return {
        ...node,
        children: cloneChildren(node.children),
      };
    }

    return { ...node };
  });
}