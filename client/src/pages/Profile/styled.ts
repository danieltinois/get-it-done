import styled from "styled-components";

export const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.5rem;
  }

  label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;

    input {
      display: none;
    }

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const InputField = styled.div`
  display: flex;
  flex-direction: column;

  input,
  textarea {
    background: ${({ theme }) => theme.colors.input};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
    resize: none;
  }

  span {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const SubmitButton = styled.button`
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
