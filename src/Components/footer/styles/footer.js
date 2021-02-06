

import styled from "styled-components";

export const Container = styled.div`
  padding: 80px 60px;
  background-color: #FF2E2A;
  box-sizing: border-box;
  margin: 0;
  padding: 2%;
`;
/**
 *  radial-gradient(
    circle,
    rgba(92, 39, 251, 1) 0%,
    rgba(112, 71, 247, 1) 100%
  );
 */

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-aling: left;
  margin-left: 60px;
`;
export const FirstColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-aling: left;
  margin-left: 60px;

  @media (max-width: 480px) {
    width: auto;
    display: flex;
    flex-direction: column;
    text-aling: left;
    margin-left: 60px;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  grid-gap: 20px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(auto0fill, minmax(200px, 1fr));
  }
`;

export const Link = styled.div`
  color: black;
  margin-bottom: 5%;
  font-size: 18px;
  padding: 5px 10px;
  border-radius: 5px;
  text-decoration: none;
  background-color: none;

  &:hover {
    background-color: #FEA7A6;
    transition: all 200ms ease-in-out;
  }
`;

export const Title = styled.div`
  font-size: 24px;
  color: black;
  margin-bottom: 10%;
  font-weight: bold;
`;
