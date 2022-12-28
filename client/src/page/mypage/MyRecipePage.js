import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import queryString from "query-string";
import { useLocation, useOutletContext } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useSetAuth } from "../../contexts/AuthContext";
import { bucketUrl } from "../../api/fileUpload";
import { Error, Nodata, Loading, Fetching } from "../../components/States";

const barColor = "lightgray";

export const Container = styled.div`
  div#pagination {
    text-align: center;
    padding: 10px 0 30px;
  }
`;

const Bar = styled.ul`
  display: flex;
  li {
    &:nth-child(${({ order }) => order[0]}) {
      border-top: 1px solid ${barColor};
      border-left: 1px solid ${barColor};
      border-right: 1px solid ${barColor};
      font-weight: bold;
    }
    &:nth-child(${({ order }) => order[1]}) {
      border-bottom: 1px solid ${barColor};
    }
    a {
      display: block;
      padding: 15px 20px;
      font-size: 18px;
      cursor: pointer;
      @media screen and (max-width: 500px) {
        font-size: 17px;
        padding: 12px 15px;
      }
      @media screen and (max-width: 400px) {
        font-size: 15px;
        padding: 10px 13px;
      }
      &:hover {
        color: black;
        box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.1);
      }
    }
  }
  > div {
    flex: 1;
    border-bottom: 1px solid ${barColor};
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
    span {
      padding: 5px;
      font-size: 16px;
      position: relative;
      cursor: pointer;
      &:nth-child(2) {
        margin: 0 18px;
      }
      em {
        display: none;
      }
      &.active {
        em {
          display: block;
          position: absolute;
          transform: translateY(-50%);
          top: 50%;
          left: -7px;
          color: green;
          opacity: 0.8;
        }
      }
    }
    @media screen and (max-width: 500px) {
      padding-right: 15px;
      span {
        font-size: 13px;
        &:nth-child(2) {
          margin: 0 10px;
        }
      }
    }
    @media screen and (max-width: 400px) {
      padding-right: 8px;
      span {
        font-size: 12px;
        &:nth-child(2) {
          margin: 0 8px;
        }
      }
    }
    @media screen and (max-width: 350px) {
      padding-right: 5px;
      span {
        padding: 3px;
        &:nth-child(2) {
          margin: 0px;
        }
        &.active {
          font-weight: bold;
          em {
            display: none;
          }
        }
      }
    }
  }
`;

export const ContentPrivate = styled.ul`
  padding: 20px;
  li {
    display: flex;
    border-bottom: 1px solid lightgray;
    padding: 15px;
    margin-bottom: 10px;
    img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      margin-right: 30px;
      border-radius: 5px;
      @media screen and (max-width: 500px) {
        width: 135px;
        height: 135px;
        margin-right: 20px;
      }
    }
    @media screen and (max-width: 400px) {
      padding: 10px;
      img {
        width: 120px;
        height: 120px;
        margin-right: 10px;
      }
    }
    > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h2 {
        display: block;
        font-size: 18px;
        font-weight: bold;
        word-break: break-all;
        color: #5d5f61;
        margin-bottom: 15px;
        @media screen and (max-width: 600px) {
          font-size: 17px;
        }
        @media screen and (max-width: 500px) {
          font-size: 16px;
        }
        @media screen and (max-width: 400px) {
          font-size: 15px;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export const ContentPublic = styled(ContentPrivate)`
  li > div p.detail {
    display: flex;
    flex-direction: column;
    span {
      font-size: 14px;
      @media screen and (max-width: 500px) {
        font-size: 13px;
      }
      @media screen and (max-width: 400px) {
        font-size: 12px;
      }
    }
  }
`;

function MyRecipePage() {
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();
  const navigate = useNavigate();

  const { search } = useLocation();
  const { type } = queryString.parse(search);
  const { setHeader, user } = useOutletContext();

  const LIMIT = 10;
  const INITIAL_PAGE_INFO = {
    order_by: "created_at",
    offset: 0,
    limit: LIMIT,
  };

  const [Count, setCount] = useState(0);
  const [PagingInfo, setPagingInfo] = useState(INITIAL_PAGE_INFO);

  const handleOrderSelect = (value) =>
    setPagingInfo({ order_by: value, offset: 0, limit: LIMIT });

  const handleChangeType = (type) => {
    setPagingInfo(INITIAL_PAGE_INFO);
    navigate(`/mypage/recipe?type=${type}`);
  };

  const LocaleStringfn = (num) => Number(num).toLocaleString();

  const { data, isLoading, isError, isFetching } = useQuery(
    ["myRecipeList", type, PagingInfo],
    async ({ queryKey }) => {
      if (queryKey[1] === "public") {
        queryClient.removeQueries(["myRecipeList", "private"]);
      } else {
        queryClient.removeQueries(["myRecipeList", "public"]);
      }

      let isExisted = queryClient.getQueryData(queryKey);
      if (isExisted) return isExisted;

      let type = queryKey[1] === "public" ? 1 : 0;
      let { order_by, offset, limit } = queryKey[2];

      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/user/recipe?public=${type}&order_by=${order_by}&offset=${offset}&limit=${limit}`,
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data);

      return result;
    },
    {
      onSuccess: (data) => {
        if (data?.status === 200 && PagingInfo?.offset === 0)
          setCount(data?.count);
      },
      onError: (error) => {
        console.error(error);
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
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  if (PagingInfo?.offset === 0 && isFetching)
    return <Loading height="75vh" type="dots" size="50" />;
  if (isError) return <Error />;

  return (
    <>
      <Container>
        {isFetching && <Fetching />}
        <Bar order={type === "public" ? [1, 2] : [2, 1]}>
          <li onClick={() => handleChangeType("public")}>
            <a>공개중</a>
          </li>
          <li onClick={() => handleChangeType("private")}>
            <a>작성중</a>
          </li>
          {type === "public" && (
            <div>
              {["created_at", "like"].map((item, idx) => (
                <span
                  key={idx}
                  className={PagingInfo?.order_by === item ? "active" : ""}
                  onClick={() => handleOrderSelect(item)}
                >
                  {item === "like" ? "인기순" : "최신순"}
                  <em>
                    <FontAwesomeIcon icon={faCheck} />
                  </em>
                </span>
              ))}
            </div>
          )}
        </Bar>
        {Count === 0 ? (
          <Nodata
            height="68vh"
            imgSize={{ w: "200px", h: "200px" }}
            text={
              type === "public"
                ? "공개 중인 레시피가 없습니다 :("
                : "작성 중인 레시피가 없습니다 :("
            }
            interval="30px"
          />
        ) : (
          <>
            {type === "public" ? (
              <ContentPublic>
                {data?.list?.map((item, idx) => {
                  return (
                    <li key={idx}>
                      <img src={item?.src ? bucketUrl + item?.src : ""} />
                      <div>
                        <Link to={`/recipes/${item?.recipe_id}`}>
                          <h2>{item?.title}</h2>
                        </Link>
                        <p className="detail">
                          <span>조회수 {LocaleStringfn(item?.view)}</span>
                          <span>좋아요 {LocaleStringfn(item?.like)}</span>
                          <span></span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ContentPublic>
            ) : (
              <ContentPrivate>
                {data?.list?.map((item, idx) => {
                  return (
                    <li key={idx}>
                      <img src={item?.src ? bucketUrl + item?.src : ""} />
                      <div>
                        <Link to={`/modify/${item?.recipe_id}`}>
                          <h2>{item?.title}</h2>
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ContentPrivate>
            )}
            <div id="pagination">
              <Pagination
                totalData={Count}
                dataLimit={LIMIT}
                setPagingInfo={setPagingInfo}
                PagingInfo={PagingInfo}
              />
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export default MyRecipePage;
