import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";

interface LoginForm {
  email: string;
  password: string;
}

const Auth = (): JSX.Element => {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [newSignUp, setNewSignUp] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const toggleSignUp = () => setNewSignUp((prev) => !prev);

  const onSocialLogin = async (e: any) => {
    const { name } = e.target;

    let social: any;
    if (name === "google") {
      social = new firebaseInstance.GoogleAuthProvider();
    } else if (name === "github") {
      social = new firebaseInstance.GithubAuthProvider();
    }

    await signInWithPopup(authService, social);
  };

  const onChange = (e: any) => {
    const { name, value } = e.target;

    setLoginForm((prevItems): LoginForm => {
      return { ...prevItems, [name]: value };
    });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (newSignUp) {
        // 회원가입 부분
        await createUserWithEmailAndPassword(
          authService,
          loginForm.email,
          loginForm.password
        );
      } else {
        // 로그인 부분
        await signInWithEmailAndPassword(
          authService,
          loginForm.email,
          loginForm.password
        );
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form>
        <input
          name="email"
          type="email"
          placeholder="이메일을 입력해주세요"
          required
          value={loginForm.email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          required
          value={loginForm.password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newSignUp ? "회원가입" : "로그인"}
          onClick={onSubmit}
        />
        {error}
      </form>
      <button onClick={toggleSignUp}>
        {newSignUp ? "로그인하기" : "회원가입하기"}
      </button>
      <div>
        <button onClick={onSocialLogin} name="google">
          구글아이디로 로그인
        </button>
        <button onClick={onSocialLogin} name="github">
          Github로 로그인
        </button>
      </div>
    </div>
  );
};

export default Auth;
