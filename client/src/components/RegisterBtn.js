import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../css";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { fileUpload, fileDelete, FileFirst } from "../api/fileUpload";
import { useSetAuth } from "../contexts/AuthContext";
import { Fetching } from "./States";

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
  setHeader,
  modifyMode,
  InputData,
  Files,
  BeforeDelete,
}) {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();
  const navigate = useNavigate();

  const user = queryClient.getQueryData("login");

  const saveApi = async ({ fileKeys, type }) => {
    let newSteps = InputData?.steps?.map((item, idx) => {
      let imgKey = item[1];
      if (!imgKey?.startsWith(FileFirst)) {
        item[1] = fileKeys[idx + 1];
      }
      return item;
    });

    let mainSrc = InputData?.mainSrc?.startsWith(FileFirst)
      ? InputData?.mainSrc
      : fileKeys[0];

    let body = {
      ...InputData,
      mainSrc,
      steps: newSteps,
      public: type === "public" ? 1 : 0,
    };

    let result = modifyMode
      ? await axios
          .put(
            `${process.env.REACT_APP_OUR_SERVER_URI}/recipe/${InputData?.id}`,
            body,
            setHeader(user?.token, user?.authType)
          )
          .then((res) => res.data)
      : await axios
          .post(
            `${process.env.REACT_APP_OUR_SERVER_URI}/recipe`,
            body,
            setHeader(user?.token, user?.authType)
          )
          .then((res) => res.data);

    return result;
  };

  const deleteApi = async () => {
    let recipe_id = InputData?.id;

    let result = await axios
      .delete(
        `${process.env.REACT_APP_OUR_SERVER_URI}/recipe/${recipe_id}`,
        setHeader(user?.token, user?.authType)
      )
      .then((res) => res.data);
    return result;
  };

  const { isLoading: saveLoading, mutate: saveMutate } = useMutation(saveApi, {
    onSuccess: async (data, val) => {
      if (data?.status === 200) {
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

        if (modifyMode) {
          queryClient.invalidateQueries(["getMyRecipe", InputData?.id]);
        }
        alert("저장되었습니다.");
        // public or private
        navigate(`/mypage/recipe?type=${val?.type}`);
      }
    },
    onError: async (error, val) => {
      console.error(error);
      alert("저장에 실패했습니다.");
      // 레시피 저장에 실패했으니 이미 s3 버킷에 저장된 파일들은 삭제하기
      let { fileKeys } = val;
      let list = fileKeys.map((file) => ({ Key: file }));
      let isDeleted = await fileDelete(list);
      if (isDeleted?.response?.error) {
        return alert("이미 올라간 파일들의 삭제 실패");
      } else {
        return alert("이미 올라간 파일들의 삭제 성공");
      }
    },
    onSettled: (data, error) => {
      let result = data || error?.response?.data;
      if (result?.authInfo) {
        let { isAuth, newToken } = result?.authInfo;
        if (!isAuth) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
          alert("올바른 회원 경로가 아닙니다. 다시 로그인 해주세요.");
          return navigate("/user/login");
        } else if (isAuth && newToken) {
          queryClient.setQueryData("login", (prev) => ({
            ...prev,
            token: newToken,
          }));
        }
      }
    },
  });

  const { isLoading: deleteLoading, mutate: deleteMutate } = useMutation(
    deleteApi,
    {
      onSuccess: async (data, val) => {
        if (data?.status === 200) {
          // s3 파일들 삭제
          let list = val?.map((file) => ({ Key: file }));
          let isDeleted = await fileDelete(list);
          if (isDeleted?.response?.error) {
            return alert("기존 이미지 파일 삭제 중 에러가 발생했습니다.");
          } else {
            alert("삭제되었습니다.");
            navigate(-1);
          }
        }
      },
      onError: (error) => {
        console.error(error);
        alert("레시피 삭제에 실패했습니다.");
      },
      onSettled: (data, error) => {
        let result = data || error?.response?.data;
        if (result?.authInfo) {
          let { isAuth, newToken } = result?.authInfo;
          if (!isAuth) {
            setAuth((prev) => false);
            queryClient.removeQueries("login");
            alert("올바른 회원 경로가 아닙니다. 다시 로그인 해주세요.");
            return navigate("/user/login");
          } else if (isAuth && newToken) {
            queryClient.setQueryData("login", (prev) => ({
              ...prev,
              token: newToken,
            }));
          }
        }
      },
    }
  );

  const handleSave = async (e, type) => {
    e.preventDefault();
    let confirm = window.confirm("저장하시겠습니까?");
    if (confirm) {
      // steps 파일들 정리하기
      let { main, steps, stepIdArr } = Files;
      let filesResult = stepIdArr.map((id) => steps[id] || "");

      // 등록 버전, 수정 버전: e.target.files[0] 과 "" 으로 이루어짐.
      filesResult = [main, ...filesResult];
      const promises = filesResult.map((data) => fileUpload(data));

      const results = await Promise.all(promises);
      saveMutate({ fileKeys: results, type });
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    let confirm = window.confirm("취소하시겠습니까?");
    if (confirm) {
      navigate(-1);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    let confirm = window.confirm("삭제하시겠니까?");
    if (confirm) {
      let stepsFiles = InputData?.steps
        .map((item) => item[1])
        .filter((item) => item);

      let fileKeysToDelete = [InputData?.mainSrc, ...stepsFiles];
      deleteMutate(fileKeysToDelete);
    }
  };

  return (
    <>
      {(saveLoading || deleteLoading) && (
        <Fetching type="progress" size={100} />
      )}
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
    </>
  );
}

export default RegisterBtn;
