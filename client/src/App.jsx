import {UserContextProvider } from "./component/UserContext";
import axios from "axios";
import Routes from "./component/Routes";

function App() {

  axios.defaults.baseURL = 'http://localhost:4040'
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>

  )
};

export default App
