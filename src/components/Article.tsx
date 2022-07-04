import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { dbService, storageService } from "../fbase";
import { Article } from "../pages/Home";
import { deleteObject, ref } from "firebase/storage";

interface Props {
  articleObject: Article;
  isWriter: boolean;
}

const ArticleComponent = ({ articleObject, isWriter }: Props): JSX.Element => {
  const [editing, setEditing] = useState<boolean>(false);
  const [editArticle, setEditArticle] = useState<string>(
    articleObject.text ? articleObject.text : ""
  );

  const toggleEditing = () => setEditing((prev) => !prev);

  const onChange = (e: any) => {
    const { value } = e.target;
    setEditArticle(value);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    await updateDoc(doc(dbService, `article/${articleObject.id}`), {
      text: editArticle,
    });
    setEditing(false);
  };

  const onDeleteClick = async () => {
    const deleteOk: boolean = window.confirm("삭제하시겠습니까?");
    if (deleteOk) {
      await deleteDoc(doc(dbService, `article/${articleObject.id}`));
      if (articleObject.imageUrl !== "") {
        const imgRef = ref(storageService, articleObject.imageUrl);
        await deleteObject(imgRef);
      }
    }
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input value={editArticle} onChange={onChange} required />
            <input type="submit" value="수정하기" />
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <>
          <h4>{articleObject.text}</h4>
          {articleObject.imageUrl && (
            <img
              src={articleObject.imageUrl}
              alt="사진"
              width="50px"
              height="50px"
            />
          )}
          {isWriter && (
            <>
              <button onClick={onDeleteClick}>삭제</button>
              <button onClick={toggleEditing}>수정</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ArticleComponent;
