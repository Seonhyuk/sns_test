import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { authService } from "../fbase";
import AppRouter from "./Router";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<User | boolean>(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(user);
      } else {
        setIsLoggedIn(false);
      }

      setLoading(true);
    });
  }, []);

  return (
    <>
      {loading ? <AppRouter isLoggedIn={isLoggedIn} /> : "로딩중..."}
      <footer>&copy; {new Date().getFullYear()} Self-Project</footer>
    </>
  );
}

export default App;
