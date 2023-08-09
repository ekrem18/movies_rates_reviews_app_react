import React, { createContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import {  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toastErrorNotify, toastSuccessNotify } from "../helpers/ToastNotify";

export const AuthContext = createContext();


const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false)
    let navigate = useNavigate() 

    useEffect(() => {
      userObserver();
    }, []);
      

  const createUser = async (email, password) => {
    // yeni bir kullanıcı oluşturmak için kullanılan firebase metodu
    try {
      let userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      navigate("/")
      toastSuccessNotify("Registered Successfully!")
    } catch (error) {
      toastErrorNotify(error.message)
    }
  };


  const signIn =async(email,password)=>{
    try {
     let userCredential =  await signInWithEmailAndPassword(auth, email, password)
     console.log(userCredential);
     navigate("/")
     toastSuccessNotify("Logged In Successfully!")
    } catch (error) {
        
    }
  };

  const logOut = () => {
    signOut(auth)
    toastSuccessNotify("Logged Out Successfully!")
  };

  const userObserver = () => {
    //? Kullanıcının signin olup olmadığını takip eden ve kullanıcı değiştiğinde yeni kullanıcıyı response olarak dönen firebase metodu
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, displayName, photoURL } = user;
        setCurrentUser({ email, displayName, photoURL });
        console.log(user);
      } else {
        // User is signed out
        setCurrentUser(false);
        console.log("logged out");
      }
    });
  };

    const values={createUser, signIn, logOut}
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
//children In gelebilmesi için  AuthContext.Provider  ile sarmallama yapmamız gerekiyor. App js içierisnde bütün yapıyı kapsayan AppRouter ı kapsadığımız için children approuter olmuş oldu

export default AuthContextProvider;
