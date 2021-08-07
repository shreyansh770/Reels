import React from "react";
import { auth, signWithGoogle , firestore } from "./firebase";
import { useEffect, useState , useContext } from "react";
import { Redirect } from "react-router-dom";
import { userContext } from "./App";



let Login = (props) => {


  // kyuki function component har ek render pe pura chlta hai
  let value = useContext(userContext);


  useEffect(() => {
    // ye tab fire hota hai jab
    //user login ya logout hota hai
    auth.onAuthStateChanged(async (user) => {
      //if login ->user info
      // if logout -> null
      if (user) {
        let { displayName, email , uid } = user;

        let docRef =  firestore.collection("users").doc(uid)// ye doc ka ref dega

        /*
             // ye us ref se vo document get krne ke koshish karega
             // agr mil jyega to vo obj dega 
             // nhi to ek temp obj dega
        
        */
        let document = await docRef.get();

        /* 
            // if user exists  nhi hoga to 
            // use ref se user bnaega 
            // jiski id 'uid' hogi
        
        */


        if(!document.exists){// true or false
          docRef.set({
            displayName,
            email,
            posts:[]
          })
        }
        
        props.handleUser({ displayName, email ,uid});
      } else {
        props.handleUser(user);
      }
    });
  }, []);


  return (
    <div>
      {value ? <Redirect to="/home" /> : ""}
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => signWithGoogle()}
      >
        Sign Up With Google
      </button>
    </div>
  );
};

export default Login;
