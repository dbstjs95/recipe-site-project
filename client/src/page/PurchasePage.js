import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import kakaoPay from "../assets/kakaoPay.png";
import { ContainerStyle } from "../css";
import { class_info } from "../mockData/class_detail";
import { user_info } from "../mockData/user_data";
import Payment from "../components/Payment";
import { useQueryClient, useQuery } from "react-query";
import { useSetAuth } from "../contexts/AuthContext";
import axios from "axios";

const headerColor = "#444";

const Container = styled.div`
  width: 70vw;
  @media screen and (max-width: 1300px) {
    width: 80vw;
  }
  @media screen and (max-width: 1024px) {
    width: 90vw;
  }
  ${ContainerStyle};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  h1 {
    width: 90%;
    font-size: 1.6rem;
    padding: 10px 0;
    border-bottom: 1px solid lightgray;
    font-weight: bold;
    color: ${headerColor};
  }
  @media screen and (max-width: 900px) {
    padding: 10px 20px;
    h1 {
      width: 100%;
      font-size: 1.5rem;
      margin: 0 20px;
    }
  }
  @media screen and (max-width: 700px) {
    h1 {
      font-size: 1.4rem;
    }
  }
  @media screen and (max-width: 600px) {
    width: 100vw;
  }
  @media screen and (max-width: 500px) {
    h1 {
      font-size: 1.3rem;
    }
  }
  @media screen and (max-width: 380px) {
    h1 {
      text-align: center;
    }
  }
`;

const InnerContainer = styled.ul`
  margin: 50px 0;
  @media screen and (max-width: 700px) {
    margin: 30px 0 50px;
  }
  li {
    &:not(:last-child) {
      margin-bottom: 40px;
    }
    h2 {
      font-size: 1.4rem;
      padding-bottom: 10px;
      font-weight: bold;
      color: ${headerColor};
      em {
        color: crimson;
      }
      @media screen and (max-width: 900px) {
        font-size: 1.3rem;
      }
      @media screen and (max-width: 500px) {
        font-size: 1.2rem;
      }
    }
    > div {
      border-top: 1px solid lightgray;
      &.class {
        display: flex;
        border: 1px solid lightgray;
        img {
          width: 150px;
          object-fit: cover;
        }
        > div {
          flex: 1;
          padding: 10px;
          width: 500px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          h3 {
            font-size: 1.1rem;
            margin-bottom: 10px;
            word-break: break-all;
          }
          span {
            display: flex;
            align-items: center;
            em {
              font-weight: bold;
              font-size: 1.3rem;
              margin-right: 3px;
            }
          }
          @media screen and (max-width: 900px) {
            h3 {
              font-size: 1rem;
            }
            span em {
              font-size: 1.2rem;
            }
          }
          @media screen and (max-width: 500px) {
            h3 {
              font-size: 0.9rem;
            }
            span {
              font-size: 0.9rem;
              em {
                font-size: 1.1rem;
              }
            }
          }
          @media screen and (max-width: 800px) {
            width: 100%;
          }
        }
      }
      &.orderer {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-top: 20px;
        border-top: 1px solid lightgray;
        input {
          padding: 10px;
          box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
          border: 1px solid lightgray;
          border-radius: 3px;
          @media screen and (max-width: 400px) {
            width: 100%;
            font-size: 15px;
          }
          &[type="tel"] {
            margin-bottom: 10px;
          }
        }
      }
      &.pay {
        text-align: center;
        padding-top: 20px;
        img {
          width: 120px;
          @media screen and (max-width: 600px) {
            width: 110px;
          }
          @media screen and (max-width: 400px) {
            width: 100px;
          }
        }
      }
    }
  }
`;

function PurchasePage({ setHeader }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  const { classId } = useParams();
  let purpose = location?.state?.use;

  const classData = queryClient.getQueryData(["class", classId]);
  const user = queryClient.getQueryData("login");

  const [PaymentData, setPaymentData] = useState({
    amount: classData?.price,
    name: `원데이 클래스-${classId}`,
    buyer_name: user?.userInfo?.nickname,
    buyer_tel: "",
    buyer_email: user?.userInfo?.email,
  });

  const convertString = (num) => Number(num).toLocaleString();

  return (
    <Container>
      <h1>{`클래스 신청 ${purpose === "afterPay" ? "완료" : ""}`}</h1>
      <InnerContainer>
        <li>
          <h2>
            <em>클래스</em> 정보
          </h2>
          <div className="class">
            <img src={classData?.header_img} alt="클래스 이미지" />
            <div>
              <h3>{classData?.header_title}</h3>
              <span>
                <em>{convertString(classData?.price)}</em>원
              </span>
            </div>
          </div>
        </li>
        {purpose === "pay" ? (
          <>
            <li>
              <h2>
                <em>주문자</em> 정보
              </h2>
              <div className="orderer">
                <input
                  type="tel"
                  placeholder="핸드폰번호(ex: 01012345678)"
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      buyer_tel: String(e.target.value),
                    }))
                  }
                />
                <input
                  type="email"
                  placeholder="이메일"
                  defaultValue={PaymentData?.buyer_email}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      buyer_email: e.target.value,
                    }))
                  }
                />
              </div>
            </li>
            <li>
              <h2>
                <em>결제</em> 방식
              </h2>
              <div className="pay">
                <img src={kakaoPay} alt="카카오페이" />
              </div>
            </li>
          </>
        ) : (
          purpose === "afterPay" && (
            <AfterPay setHeader={setHeader} user={user} />
          )
        )}
      </InnerContainer>
      {purpose === "pay" && (
        <Payment
          PaymentData={PaymentData}
          setHeader={setHeader}
          classId={classId}
          user={user}
        />
      )}
    </Container>
  );
}

function AfterPay({ setHeader, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  let paymentId = location?.state?.paymentId;

  const { data, isLoading, isError } = useQuery(
    ["getPaymentInfo", paymentId],
    async () => {
      let result = await axios
        .get(
          `${process.env.REACT_APP_OUR_SERVER_URI}/pay/${paymentId}`,
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data);
      return result;
    },
    {
      onError: (err) => {
        console.error(err);
        let result = err?.response?.data;
        alert(`결제 불러오기 실패: ${result?.message}`);
      },
      onSettled: (data, err) => {
        let result = data?.authInfo || err?.response?.data?.authInfo;
        if (result) {
          let { isAuth, newToken } = result;
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
    }
  );

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <AfterContainer>
      <p>구매가 완료되었습니다.</p>
      <span>{data?.payment?.created_at}</span>
      <button>구매 취소</button>
    </AfterContainer>
  );
}

const AfterContainer = styled.li`
  border: 1px dashed lightgray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  p {
    font-size: 1.3rem;
    margin-bottom: 5px;
    @media screen and (max-width: 500px) {
      font-size: 1.2rem;
    }
    @media screen and (max-width: 400px) {
      font-size: 1.15rem;
    }
  }
  span {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
  button {
    background-color: white;
    border: 1px solid lightgray;
    padding: 5px 10px;
    font-size: 0.9rem;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    &:hover {
      box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.1);
    }
  }
`;

export default PurchasePage;
