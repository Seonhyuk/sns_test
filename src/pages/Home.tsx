import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { User } from "firebase/auth";
import ArticleComponent from "../components/Article";

import NewArticle from "../components/NewArticle";

export interface Article {
  text?: string;
  createdAt?: Date;
  creatorId?: string;
  imageUrl?: string;
  id?: string;
}

interface UserObject {
  userObject: User | null;
}

const Home = ({ userObject }: UserObject): JSX.Element => {
  const [articles, setArticles] = useState<Array<Article>>([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "article"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (doc) => {
      const newArticles: Array<Article> = doc.docs.map((data) => {
        const { text, createdAt, creatorId, imageUrl } = data.data();
        const newArticle: Article = {
          text,
          createdAt,
          creatorId,
          imageUrl,
          id: data.id,
        };
        return newArticle;
      });

      setArticles(newArticles);
    });
  }, []);

  return (
    <>
      <NewArticle userObject={userObject} />
      <div>
        {userObject &&
          articles.map((article) => (
            <ArticleComponent
              key={article.id}
              articleObject={article}
              isWriter={article.creatorId === userObject.uid}
            />
          ))}
      </div>
    </>
  );
};

export default Home;
