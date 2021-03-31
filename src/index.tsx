import React, { createElement } from 'react'
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { IFrameElements } from './iframe-elements/iframe-elements';

const pages: {
  [key: string]: {
    title: string,
    component: any
  }
} = {
  '/iframe-embeds': {
    title: 'I frame embeds',
    component: IFrameElements,
  }
}

function App () {
  return (
    <Router>
      <aside>
        <ul>
          {Object.keys(pages).map((path) => (
            <li>
              <Link to={path}>{pages[path].title}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <main>
        <Switch>
          {Object.keys(pages).map(path => (
            <Route path={path}>
              {createElement(pages[path].component)}
            </Route>
          ))}
        </Switch>
      </main>
    </Router>
  );
}

render(<App />, document.getElementById('root'))