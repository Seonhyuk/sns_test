import React from "react";
import { Link } from "react-router-dom";
import { User } from "firebase/auth";

interface propsData {
  userObject: User;
}

const Navigation = ({ userObject }: propsData): JSX.Element => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObject.displayName}의 Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
