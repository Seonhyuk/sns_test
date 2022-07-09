import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { authService } from "../fbase";
import AppRouter from "./Router";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [userObject, setUserObject] = useState<User | null>(null);

  const updateUser = () => {
    setUserObject(authService.currentUser);
  };

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObject(user);
      } else {
        setUserObject(null);
      }

      setLoading(true);
    });
  }, []);

  return (
    <>
      {loading ? (
        <AppRouter
          isLoggedIn={!!userObject}
          userObject={userObject}
          updateUser={updateUser}
        />
      ) : (
        "로딩중..."
      )}
    </>
  );
}

export default App;
