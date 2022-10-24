import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faEnvelope,
  faPeopleGroup,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { DetailPageLayout } from "../recipepage/RecipePage";
import { class_info } from "../../mockData/class_detail";
import ClassImgBox from "../../components/ClassImgBox";
import {
  ClassMainIntro,
  ClassSubIntro,
  HostIntro,
} from "../../components/ClassIntroBox";
import RecipeDetailComments from "../../components/RecipeDetailComments";

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
  return (
    <ul>
      {data.map((item, idx) => {
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

function ClassPage() {
  const { classId } = useParams();
  return (
    <Container>
      <div className="intro">
        <ClassImgBox data={class_info} />
      </div>
      <div className="additionalInfo">
        <AdditionalInfo data={class_info.additional} />
      </div>
      <div className="mainInfo">
        <ClassMainIntro data={class_info.classDesc} />
      </div>
      <div className="subInfo">
        <ClassSubIntro data={class_info.classFoodImg} />
      </div>
      <div className="profile">
        <HostIntro data={class_info.HostDesc} />
      </div>
      <div className="comments">
        <RecipeDetailComments data={class_info.commentsData} />
      </div>
    </Container>
  );
}
export default ClassPage;
