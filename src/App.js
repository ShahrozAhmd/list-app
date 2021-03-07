import React, { useContext } from "react";
import AuthContext from "./context/auth-context";
import Ingredients from "./components/Ingredients/Ingredients";
import Auth from "./components/Auth";

const App = (props) => {
  const authContx = useContext(AuthContext);
  let toRender = <Auth />;
  if (authContx.isAuth) {
    toRender = <Ingredients />;
  }
  return toRender;
};

export default App;
