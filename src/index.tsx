import React, { createElement } from 'react'
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  Redirect,
  useLocation
} from "react-router-dom";
import { ElementPlaceholders } from './element-placeholders';
import { HighlightLastActiveSelection } from './highlight-last-selection';
import { IFrameElements } from './iframe-elements/iframe-elements';
import './index.css'

const pages: {
  [key: string]: {
    title: string,
    component: any
  }
} = {
  '/element-placeholders': {
    title: 'Element placeholders',
    component: ElementPlaceholders,
  },
  '/iframe-embeds': {
    title: 'I frame embeds',
    component: IFrameElements,
  },
  '/highlight-last-active-selection': {
    title: 'Highlight last active selection',
    component: HighlightLastActiveSelection,
  }
}

function Nav() {
  const history = useHistory()
  const location = useLocation()
  
  return (
    <select
      style={{
        marginBottom: '3em',
        padding: '.5em',
      }}
      value={location.pathname}
      onChange={(e) => {
        history.push(e.currentTarget.value)
      }}
    >
      {Object.keys(pages).map((path) => (
        <option key={path} value={path}>{pages[path].title}</option>
      ))}
    </select>
  );
}

function App () {
  return (
    <Router>
      <aside>
        <Nav />
      </aside>
      <main>
        <Switch>
          {Object.keys(pages).map((path) => (
            <Route path={path} key={path}>
              {createElement(pages[path].component)}
            </Route>
          ))}
          <Route path="/">
            <Redirect to={Object.keys(pages)[0]} />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

render(<App />, document.getElementById('root'))