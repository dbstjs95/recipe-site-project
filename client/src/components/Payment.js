import React from "react";
import axios from "axios";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { v4 } from "uuid";
import { useSetAuth } from "../contexts/AuthContext";

const PayButton = styled.div`
  background-color: #03a81f;
  width: 400px;
  text-align: center;
  padding: 15px 0;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 30px;
  cursor: pointer;
  @media screen and (max-width: 600px) {
    width: 80%;
    font-size: 1.2rem;
  }
  @media screen and (max-width: 400px) {
    font-size: 1.1rem;
    padding: 12px 0;
  }
  &:hover {
    box-shadow: inset 0 0 500px rgba(0, 0, 0, 0.2);
  }
`;

// https://github.com/iamport/iamport-react-example/blob/master/manuals/PAYMENT.md
function Payment({ PaymentData = {}, setHeader, classId, user }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useSetAuth();

  const { amount, name, buyer_name, buyer_tel, buyer_email } = PaymentData;

  const handleCheck = async () => {
    let emailCheck =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // let telCheck = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    let telCheck = /^01([0|1|6|7|8|9])([0-9]{7,8})$/;

    if (!buyer_email || !emailCheck.test(buyer_email)) {
      return alert("올바른 이메일 형식이 아닙니다.");
    }

    if (!buyer_tel || !telCheck.test(buyer_tel)) {
      return alert("올바른 핸드폰 번호 형식이 아닙니다.");
    }

    // 가격확인
    let response = await axios
      .get(
        `${process.env.REACT_APP_OUR_SERVER_URI}/class/${classId}/check?amount=${amount}`,
        setHeader(user?.token, user?.authType)
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        let result = err?.response?.data;
        alert(`에러발생: ${result?.message}`);
        return result;
      });

    if (user && response?.authInfo) {
      let { isAuth, newToken } = response?.authInfo;
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

    if (response?.status !== 200) return;
    if (!response?.isChecked) {
      return alert("가격 위조 시도가 발생했습니다.");
    }

    onClickPayment();
  };

  function onClickPayment() {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init("imp64527300");

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: "kakaopay", // PG사(필수항목)
      pay_method: "card", // 결제수단(필수항목)
      merchant_uid: `mid_${new Date().getTime()}` + v4(), // 주문번호(필수항목)
      amount, // 결제금액(필수항목)
      name, // 주문명(필수항목)
      buyer_name, // 구매자 이름
      buyer_tel, // 구매자 전화번호(필수항목)
      buyer_email, // 구매자 이메일
      // buyer_addr: "신사동 661-16", // 구매자 주소
      // buyer_postcode: "06018", // 구매자 우편번호
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
  }

  /* 3. 콜백 함수 정의하기 */
  async function callback(response) {
    const {
      success,
      error_msg,
      imp_uid,
      merchant_uid,
      pay_method,
      paid_amount,
      status,
    } = response;

    if (success) {
      alert("결제 성공");
      let response = await axios
        .post(
          `${process.env.REACT_APP_OUR_SERVER_URI}/pay/${classId}`,
          { imp_uid, merchant_uid, pay_method, paid_amount, status },
          setHeader(user?.token, user?.authType)
        )
        .then((res) => res.data)
        .catch((err) => {
          console.error(err);
          let result = err?.response?.data;
          alert(`결제정보 저장 실패: ${result?.message}`);
          return result;
        });

      if (user && response?.authInfo) {
        let { isAuth, newToken } = response?.authInfo;
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

      if (response?.status === 200) {
        // 결제정보가 잘 저장되었으니, 결제완료페이지로 이동해야함.
        return navigate("", {
          state: { use: "afterPay", paymentId: response?.paymentId },
        });
      }
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  }

  return <PayButton onClick={handleCheck}>결제하기</PayButton>;
}

export default Payment;
