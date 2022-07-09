import { User } from "firebase/auth";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dbService, storageService } from "../fbase";
import { collection, addDoc } from "firebase/firestore";

interface propsData {
  userObject: User | null;
}

const NewArticle = ({ userObject }: propsData): JSX.Element => {
  const [article, setArticle] = useState<string>("");
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

  return (
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
  );
};

export default NewArticle;
