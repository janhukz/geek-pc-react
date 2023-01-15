import { Router, Route, Switch, Redirect } from 'react-router-dom'
import React, { Suspense } from 'react'
import AuthRoute from 'components/AuthRoute'
import history from 'utils/history'
// import Home from 'pages/Layout'
// import Login from 'pages/Login'
const Home = React.lazy(() => import('pages/Layout'))
const Login = React.lazy(() => import('pages/Login'))

function App() {
  return (
    <Router history={history}>
      <div className="App">
        {/* 路由规则 */}
        <Suspense fallback={<div>loading</div>}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <AuthRoute path="/home" component={Home}></AuthRoute>
            <Route path="/login" component={Login}></Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
