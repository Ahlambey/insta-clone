import React, { createContext, useReducer, useEffect, useContext} from "react";
import NavBar from "./components/NavBar";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import UserProfile from './components/screens/UserProfile';
import CreatePost from "./components/screens/CreatePost";
import FollowedUserPosts from './components//screens/FollowedUserPosts';
import ResetPassword from './components/screens/ResetPassword';
import NewPassword from './components/screens/NewPassword';
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {dispatch}= useContext(UserContext);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user' ));

    if(user){
      dispatch({type:"USER", payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
      history.push('/login');
    }
   
    
  }, []);


  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route exact path="/profile">
        <Profile />
      </Route>

      <Route path="/login">
        <Login />
      </Route>

      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/createPost">
        <CreatePost />
      </Route>
      <Route path='/profile/:userId'>
        <UserProfile/>
      </Route>
      <Route path='/followedUserPosts'>
        <FollowedUserPosts/>
      </Route>
      <Route exact path='/reset'>
        <ResetPassword/>
      </Route>
      <Route path='/reset/:token'>
        <NewPassword/>
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      <UserContext.Provider value={{state, dispatch}}>
        <Router>
          <NavBar />
          <Routing />
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
