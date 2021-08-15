import Login from "./Login";
import Home from "./Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import Profile from "./Profile";



function App() {

  // App -> Route -> AuthProvider -> AuthProviderContext ->Switch..

  return (
    <>
      <Router>
      <AuthProvider>

          <Switch>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/profile">
              <Profile/>
            </Route>
            <Route path="/">
              <Login/>
            </Route>
          </Switch>

      </AuthProvider>
      </Router>
    </>
  );
}


export default App;