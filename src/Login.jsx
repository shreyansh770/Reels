import React from "react";
import { signWithGoogle} from "./firebase";
import {  useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "./AuthProvider";



let Login = () => {


  // kyuki function component har ek render pe pura chlta hai
  let value = useContext(AuthContext);

  // yaha se use effect utha ke humne AuthProvider me daal diya
  // usubsrcption ke wjha se

  return (
    <div>
      {value ? <Redirect to="/home" /> : ""}
      <button
        type="submit"
        className="btn btn-primary m-4"
        onClick={() => signWithGoogle()}
      >
        Sign Up With Google
      </button>
    </div>
  );
};

export default Login;
