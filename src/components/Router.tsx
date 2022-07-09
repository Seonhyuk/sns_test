import { User } from "firebase/auth";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "../pages/Auth";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Navigation from "./Navigation";

interface IsLoggedIn {
  isLoggedIn: boolean;
  userObject: User | null;
  updateUser: Function;
}

const AppRouter = ({
  isLoggedIn,
  userObject,
  updateUser,
}: IsLoggedIn): JSX.Element => {
  return (
    <Router>
      {isLoggedIn && userObject && <Navigation userObject={userObject} />}
      <Routes>
        {isLoggedIn && userObject ? (
          <>
            <Route path="/" element={<Home userObject={userObject} />} />
            <Route
              path="/profile"
              element={
                <Profile userObject={userObject} updateUser={updateUser} />
              }
            />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
