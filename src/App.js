import { Router, Route, Switch, Redirect } from 'react-router-dom'
import Home from 'pages/Layout'
import Login from 'pages/Login'
import AuthRoute from 'components/AuthRoute'
import history from 'utils/history'

function App() {
  return (
    <Router history={history}>
      <div className="App">
        {/* 路由规则 */}
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <AuthRoute path="/home" component={Home}></AuthRoute>
          <Route path="/login" component={Login}></Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
