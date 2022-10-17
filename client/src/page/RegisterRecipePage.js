import React from "react";
import styled from "styled-components";
import { LayoutSize, ContainerStyle } from "../css";

// border: 1px solid red;

const Container = styled.div`
  ${LayoutSize}
  ${ContainerStyle}
  h1 {
    /* border: 1px solid red; */
    font-size: 25px;
    font-weight: bold;
    padding: 10px 15px;
    background-color: rgba(7, 115, 61, 0.7);
    color: #fff;
  }
`;

const InputBox = styled.div`
  > div {
    border: 1px solid red;
    &.input_intro {
      min-height: 300px;
    }
    &.input_ingredients {
      min-height: 200px;
    }
    &.input_order {
      min-height: 400px;
    }
  }
  > p.submit_btns {
    border: 1px solid blue;
    min-height: 100px;
    button {
      &.save {
      }
      &.release {
      }
      &.cancel {
      }
    }
  }
`;

function RegisterRecipePage() {
  return (
    <Container>
      <h1>레시피 등록</h1>
      <InputBox>
        <div className="input_intro">
          <ul></ul>
          <div>
            <label htmlFor="aaaa">aa</label>
            dddddddddddddddddddddddd
            <input
              id="aaaa"
              type="file"
              accept="image/jpg, image/png, image/jpeg"
              onChange={(e) => console.log(e.target.files[0])}
            />
          </div>
        </div>
        <div className="input_ingredients"></div>
        <div className="input_order"></div>
        <p className="submit_btns">
          <button className="save">저장</button>
          <button className="release">저장 후 공개하기</button>
          <button className="cancel">취소</button>
        </p>
      </InputBox>
    </Container>
  );
}

export default RegisterRecipePage;
