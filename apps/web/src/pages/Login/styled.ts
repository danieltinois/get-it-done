import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FormWrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 100%;
  max-width: 400px;
`;

export const Title = styled.h1`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
