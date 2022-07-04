import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { authService } from "../fbase";
import AppRouter from "./Router";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<User | boolean>(false);
  const [userObject, setUserObject] = useState<User | null>(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(user);
        setUserObject(user);
      } else {
        setIsLoggedIn(false);
      }

      setLoading(true);
    });
  }, []);

  return (
    <>
      {loading ? (
        <AppRouter isLoggedIn={isLoggedIn} userObject={userObject} />
      ) : (
        "로딩중..."
      )}
    </>
  );
}

export default App;
