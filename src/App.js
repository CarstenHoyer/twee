import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import Loadable from 'react-loadable'
import './App.css'

const Loading = () => <div>Loading...</div>;

const routes = [
  { component: 'Home', name: '/', path: '/' },
  { component: 'RandomWalker', name: 'Random Walker', path: '/random-walker' },
  { component: 'PerlinWalker', name: 'Perlin Walker', path: '/perlin-walker' },
  { component: 'SimpleFractals', name: 'Simple Fractals', path: '/simple-fractals' },
]

const routingElements = routes.map((route, i) => {
  const loadable = Loadable({
    loader: () => import(`./routes/${route.component}`),
    loading: Loading,
  })
  return <Route key={i} exact path={`${process.env.PUBLIC_URL}${route.path}`} component={loadable}/>
})

const menu = () => {
  const items = routes.map((route, i) => {
    return (
      <li key={i}>
        <NavLink exact to={`${process.env.PUBLIC_URL}${route.path}`}>{route.name}</NavLink>
      </li>
    )
  })
  return (
    <ul className='App-menu'>
      {items}
    </ul>
  )
}

export default class App extends Component {
  componentDidMount () {
    document.title = 'ThreeJS Demos'
  }

  render () {
    return (
      <Router>
        <div className='App-container'>
          {menu()}
          <div className='App-content'>
            {routingElements.map(route => route)}
          </div>
        </div>
      </Router>
    )
  }
}
