import { User, updateProfile } from "firebase/auth";
import { collection, orderBy, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ArticleComponent from "../components/Article";
import { authService, dbService } from "../fbase";
import { Article } from "./Home";

interface propsData {
  userObject: User;
  updateUser: Function;
}

const Profile = ({ userObject, updateUser }: propsData): JSX.Element => {
  const [myArticles, setMyArticles] = useState<Array<Article>>([]);
  const [newNickName, setNewNickName] = useState<string>("");

  const onChange = (e: any) => {
    const { value } = e.target;
    setNewNickName(value);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (userObject.displayName !== newNickName && newNickName) {
      await updateProfile(userObject, { displayName: newNickName });
      setNewNickName("");
      updateUser();
    } else if (!newNickName) {
      alert("바꿀 닉네임을 입력해주세요");
    }
  };

  const onLogOutClick = () => authService.signOut();

  const getMyArticles = async () => {
    const q = query(
      collection(dbService, "article"),
      where("creatorId", "==", userObject.uid),
      orderBy("createdAt", "desc")
    );

    const articles = await getDocs(q);

    const newMyArticle: Array<Article> = articles.docs.map((doc) => {
      const newArticle: Article = { ...doc.data(), id: doc.id };
      return newArticle;
    });

    setMyArticles(newMyArticle);
  };

  useEffect(() => {
    getMyArticles();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="새 닉네임을 입력해주세요"
          value={newNickName}
          onChange={onChange}
        />
        <input type="submit" value="닉네임 변경" />
      </form>
      <button onClick={onLogOutClick}>로그아웃</button>
      {myArticles.map((article) => {
        return (
          <ArticleComponent
            key={article.id}
            articleObject={article}
            isWriter={true}
          />
        );
      })}
    </>
  );
};

export default Profile;
