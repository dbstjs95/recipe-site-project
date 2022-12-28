import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faEnvelope,
  faPeopleGroup,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { DetailPageLayout } from "../recipepage/RecipePage";
import ClassImgBox from "../../components/ClassImgBox";
import {
  ClassMainIntro,
  ClassSubIntro,
  HostIntro,
} from "../../components/ClassIntroBox";
import CommentDetailCommnets from "../../components/RecipeDetailComments";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useSetAuth } from "../../contexts/AuthContext";
import { Error, Loading } from "../../components/States";

const Container = styled.div`
  > div {
    ${DetailPageLayout};
    &.additionalInfo ul {
      li {
        display: flex;
        align-items: flex-start;
        padding: 8px 5px;
        span {
          font-size: 1.3em;
          display: flex;
          padding-top: 3px;
        }
        em {
          font-size: 17px;
          font-weight: bold;
          color: #444;
          margin: 0 20px 0 10px;
        }
        p {
        }
        @media screen and (max-width: 600px) {
          em {
            font-size: 16px;
          }
          p {
            font-size: 15px;
          }
        }
        @media screen and (max-width: 480px) {
          padding: 10px 5px;
          span {
            font-size: 1.2em;
          }
        }
      }
    }
    > div,
    &.additionalInfo ul {
      width: 800px;
      margin: 0 auto;
      padding: 30px;
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      @media screen and (max-width: 700px) {
        padding: 20px;
      }
    }
  }
`;

function AdditionalInfo({ data }) {
  let { date_time, limit, place, email } = data;
  let dataList = [date_time, limit, place, email];

  return (
    <ul>
      {dataList.map((item, idx) => {
        let iconType = [faClock, faPeopleGroup, faLocationDot, faEnvelope];
        let text = ["시간", "정원", "위치", "문의"];
        let content = idx === 1 ? `${item}명` : item;
        return (
          <li key={idx}>
            <span>
              <FontAwesomeIcon icon={iconType[idx]} />
            </span>
            <em>{text[idx]}</em>
            <p>{content}</p>
          </li>
        );
      })}
    </ul>
  );
}

function ClassPage({ setHeader }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();
  const classId = Number(useParams()?.classId);

  const user = queryClient.getQueryData("login");

  const {
    data: classData,
    isLoading,
    isError,
    isFetching,
  } = useQuery(
    ["class", classId],
    async () => {
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/class/${classId}`,
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data)
        .catch((err) => err?.response?.data);

      if (user && result?.authInfo) {
        let { isAuth, newToken } = result?.authInfo;
        if (!isAuth) {
          setAuth((prev) => false);
          queryClient.removeQueries("login");
        } else if (isAuth && newToken) {
          queryClient.setQueryData("login", (prev) => ({
            ...prev,
            token: newToken,
          }));
        }
      }

      if (result?.status === 200) {
        return result?.class;
      } else {
        alert(result?.message || "에러가 발생했습니다.");
        navigate(-1);
        throw new Error("에러 발생");
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isFetching) return <Loading type="dots" height="75vh" />;
  if (isError) return <Error />;

  return (
    <Container>
      <div className="intro">
        <ClassImgBox data={classData} user={user} />
      </div>
      <div className="additionalInfo">
        <AdditionalInfo data={classData} />
      </div>
      <div className="mainInfo">
        <ClassMainIntro data={classData.class_desc} />
      </div>
      <div className="subInfo">
        <ClassSubIntro data={classData.classFoods} />
      </div>
      <div className="profile">
        <HostIntro data={classData.classHost} />
      </div>
      <div className="comments">
        <CommentDetailCommnets
          use="class"
          ID={classId}
          user={user}
          setHeader={setHeader}
        />
      </div>
    </Container>
  );
}
export default ClassPage;
