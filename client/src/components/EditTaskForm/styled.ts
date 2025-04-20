import styled from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

export const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled(Dialog.Content)`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  width: 100%;
  max-width: 500px;

  z-index: 1000;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    input,
    textarea,
    select {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.colors.border};
      font-size: 1rem;
      background: ${({ theme }) => theme.colors.input};
      color: ${({ theme }) => theme.colors.text};

      resize: none;
      overflow: hidden;
      transition: height 0.2s ease;
    }

    span {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;

  button {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s ease;
  }

  button[type="submit"] {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  button[type="button"] {
    background: ${({ theme }) => theme.colors.cancel};
    color: ${({ theme }) => theme.colors.text};

    &:hover {
      background: ${({ theme }) => theme.colors.cancelDark};
    }
  }
`;
