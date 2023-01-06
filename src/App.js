import { BrowserRouter as Router, Route, Switch,Redirect} from 'react-router-dom'
import Home from './pages/Layout'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 路由规则 */}
        <Switch>
          <Route path="/Home" component={Home}></Route>
          <Route path="/login" component={Login}></Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
