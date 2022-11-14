import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { fileUpload, fileDelete } from "../api/fileUpload";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 700px;
  margin: 0 auto;
  padding: 30px 10px;
  button {
    padding: 10px 20px;
    font-size: 20px;
    border: 0;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
    &.save {
      background-color: ${colors.main};
    }
    &.release {
      background-color: #a3314a;
    }
    &.cancel,
    &.delete {
      border: 1px solid gray;
      color: #555;
      background-color: #fff;
    }
    &.delete {
    }
  }
  @media screen and (max-width: 850px) {
    width: 100%;
  }
  @media screen and (max-width: 700px) {
    button {
      padding: 8px 15px;
      font-size: 18px;
    }
  }
  @media screen and (max-width: 500px) {
    padding: 30px 6px;
    button {
      padding: 7px 10px;
      font-size: 16px;
    }
  }
  @media screen and (max-width: 400px) {
    button {
      padding: 7px 10px;
      font-size: 14px;
    }
  }
`;

function RegisterBtn({
  modifyMode,
  InputData,
  Files,
  setInputData,
  BeforeDelete,
  setBeforeDelete,
}) {
  const navigate = useNavigate();
  const [Save, setSave] = useState({ private: false, public: false });
  const [Delete, setDelete] = useState(false);

  const saveApi = async () => {
    let type = Save.private ? "private" : "public";
    console.log("saveApi InputData: ", InputData);

    let result = await axios
      .post(`${process.env.REACT_APP_OUR_SERVER_URI}/recipe?type=${type}`, {
        ...InputData,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        return null;
      });

    if (result.message === "success") {
      // s3 파일 삭제는 디비 삭제 확인 후, 진행
      let size = BeforeDelete?.length;
      if (size > 0) {
        let list = BeforeDelete.map((file) => ({ Key: file }));

        try {
          let isDeleted = await fileDelete(list);
          if (isDeleted?.response?.error) {
            return alert("기존 이미지 파일 삭제 중 에러가 발생했습니다.");
          }
        } catch (err) {
          return alert("기존 이미지 파일 삭제 중 에러가 발생했습니다.");
        }
      }

      alert("저장되었습니다.");
      // public or private
      navigate(`/mypage/recipe?type=${type}`);
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  const deleteApi = async () => {
    let type = InputData?.public ? "public" : "private";
    let recipe_id = InputData?.id;

    let result = await axios
      .delete(`${process.env.REACT_APP_OUR_SERVER_URI}/recipe/${recipe_id}`)
      .catch((err) => {
        console.error(err);
        return null;
      });

    if (result?.status === 200) {
      // s3 파일들 삭제
      let list = BeforeDelete.map((file) => ({ Key: file }));
      let isDeleted = await fileDelete(list);
      if (isDeleted?.response?.error) {
        return alert("기존 이미지 파일 삭제 중 에러가 발생했습니다.");
      } else {
        alert("삭제되었습니다.");
        navigate(-1);
      }
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  useQuery("saveRecipe", saveApi, {
    refetchOnWindowFocus: false,
    enabled: Save.private || Save.public,
  });

  useQuery("deleteRecipe", deleteApi, {
    refetchOnWindowFocus: false,
    enabled: Delete,
  });

  const handleSave = async (e, type) => {
    e.preventDefault();
    let confirm = window.confirm("저장하시겠습니까?");
    if (confirm) {
      // steps 파일들 정리하기
      let { main, steps, stepIdArr } = Files;
      let filesResult = stepIdArr.map((id) => steps[id] || "");

      // 등록 버전, 수정 버전: e.target.files[0] 과 "" 으로 이루어짐.
      filesResult = [main, ...filesResult];

      const promises = filesResult.map(async (data) => {
        return await fileUpload(data);
      });

      const results = await Promise.all(promises);

      results.map((fileKey, idx) => {
        if (fileKey) {
          setInputData((prev) => {
            if (idx === 0) {
              return { ...prev, mainSrc: fileKey };
            } else {
              let newSteps = [...prev.steps];
              newSteps[idx - 1][1] = fileKey;
              return { ...prev, steps: newSteps };
            }
          });
        }
      });

      setSave((prev) => ({ ...prev, [type]: true }));
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    let confirm = window.confirm("취소하시겠습니까?");
    if (confirm) {
      navigate(-1);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    let confirm = window.confirm("삭제하시겠니까?");
    if (confirm) {
      setBeforeDelete(() => {
        let stepsFiles = InputData.steps
          .map((item) => item[1])
          .filter((item) => item);

        let filesList = [InputData.mainSrc, ...stepsFiles];
        return filesList;
      });
      setDelete(true);
    }
  };

  return (
    <Container>
      <button className="save" onClick={(e) => handleSave(e, "private")}>
        저장
      </button>
      <button className="release" onClick={(e) => handleSave(e, "public")}>
        저장 후 공개하기
      </button>
      <button className="cancel" onClick={handleCancel}>
        취소
      </button>
      {modifyMode && (
        <button className="delete" onClick={handleDelete}>
          삭제
        </button>
      )}
    </Container>
  );
}

export default RegisterBtn;
