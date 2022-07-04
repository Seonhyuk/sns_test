import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { User } from "firebase/auth";
import ArticleComponent from "../components/Article";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface Article {
  text?: string;
  createdAt?: Date;
  creatorId: string;
  imageUrl?: string;
  id: string;
}

interface UserObject {
  userObject: User | null;
}

const Home = ({ userObject }: UserObject): JSX.Element => {
  const [article, setArticle] = useState<string>("");
  const [articles, setArticles] = useState<Array<Article>>([]);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (userObject) {
      let imageUrl: string = "";

      if (image) {
        const imgRef = ref(storageService, `${userObject.uid}/${uuidv4()}`);
        // const response = await UploadMetadata(imgRef, imgUrl);
        const response = await uploadBytes(imgRef, image);
        imageUrl = await getDownloadURL(response.ref);
      }

      await addDoc(collection(dbService, "article"), {
        text: article,
        createdAt: Date.now(),
        creatorId: userObject ? userObject.uid : null,
        imageUrl: imageUrl,
      });
    }

    setArticle("");
    setImgUrl("");
  };

  const onChange = (e: any) => {
    e.preventDefault();

    const { value } = e.target;
    setArticle(value);
  };

  const onFileChange = (e: any) => {
    const { files } = e.target;
    const file = files[0];
    setImage(file);

    const render = new FileReader();
    render.onloadend = (finishedEvent: any) => {
      const { result } = finishedEvent.currentTarget;
      setImgUrl(result);
    };
    render.readAsDataURL(file);
  };

  const onClearImg = () => setImgUrl("");

  useEffect(() => {
    const q = query(
      collection(dbService, "article"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (doc) => {
      const newArticles: Array<Article> = doc.docs.map((data) => {
        const { text, createdAt, creatorId, imageUrl } = data.data();
        console.log(imageUrl);
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
      <form onSubmit={onSubmit}>
        <input
          value={article}
          onChange={onChange}
          type="text"
          placeholder="메시지를 입력해주세요"
          maxLength={200}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="작성" />
        {imgUrl && (
          <div>
            <img src={imgUrl} alt="미리보기" width="50px" height="50px" />
            <button onClick={onClearImg}>취소</button>
          </div>
        )}
      </form>
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
