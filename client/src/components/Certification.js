import React from "react";
import { v4 } from "uuid";

import styled from "styled-components";
const CertBtn = styled.button`
  border: 2px solid lightgray;
  border-radius: 3px;
  background-color: white;
  padding: 3px 7px;
  font-size: 15px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  &:hover {
    color: white;
    box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.7);
  }
`;

function Certification() {
  function onClickCertification() {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init("imp64527300");

    /* 2. 본인인증 데이터 정의하기 */
    const data = {
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      company: "아임포트", // 회사명 또는 URL
      carrier: "KT", // 통신사
      name: "최윤선", // 이름
      phone: "01072341377", // 전화번호
    };

    /* 4. 본인인증 창 호출하기 */
    IMP.certification(data, callback);
  }

  /* 3. 콜백 함수 정의하기 */
  function callback(response) {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      alert("본인인증 성공");
    } else {
      alert(`본인인증 실패: ${error_msg}`);
    }
  }

  return <CertBtn onClick={() => console.log("보류중...")}>인증</CertBtn>;
}

export default Certification;
