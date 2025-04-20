import styled from "styled-components";

export const Button = styled.button`
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: bold;
  transition: background 0.2s;
  border: none;

  &:hover {
    background: #854fff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
