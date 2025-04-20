import styled from "styled-components";

export const TaskCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  position: relative;
`;

export const TaskTitle = styled.h2`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const TaskDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

export const TaskStatus = styled.span<{ status: string }>`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: ${({ status }) =>
    status === "COMPLETED"
      ? "#28a745"
      : status === "IN_PROGRESS"
      ? "#ffc107"
      : "#6c757d"};
  color: white;
  font-size: 0.75rem;
  border-radius: 4px;
  text-transform: uppercase;
`;

export const TaskActions = styled.div`
  position: absolute;
  bottom: 2.2rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const EditButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: 1.2rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    transform: scale(1.1);
    transition: all 0.2s ease;
  }
`;

export const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.cancel};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.cancelDark};
    transform: scale(1.1);
    transition: all 0.2s ease;
  }
`;
