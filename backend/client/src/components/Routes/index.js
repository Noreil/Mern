import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Home from '../../pages/Home'
import Profil from '../../pages/Profil'
import Trendings from '../../pages/Trendings'

export default function index() {
  return (
    <Router>
        <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/profil" exact component={Profil}></Route>
            <Route path="/trending" exact component={Trendings}></Route>
            <Redirect to="/"/>
        </Switch>
    </Router>
  )
}
