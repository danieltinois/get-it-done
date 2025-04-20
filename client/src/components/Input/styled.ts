import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input<{ hasIcon?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  padding-right: ${({ hasIcon }) => (hasIcon ? "2.5rem" : "0.75rem")};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: #2a2a2a;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid #444;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 57%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.25rem;
  cursor: pointer;
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 4px;
`;
