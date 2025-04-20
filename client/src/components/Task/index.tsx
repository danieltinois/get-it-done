import { useState } from "react";
import { TbPencil, TbTrash } from "react-icons/tb";

import * as S from "./styled";
import EditTaskForm from "../EditTaskForm";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteTaskForm from "../DeleteTaskForm";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  task: Task;
  onRefresh: () => void;
}

const Task = ({ task, onRefresh }: Props) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3333/api/tasks/${task.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Tarefa excluída com sucesso");
      onRefresh();
    } catch (err) {
      toast.error("Erro ao excluir a tarefa");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <S.TaskCard>
        <S.TaskTitle>{task.title}</S.TaskTitle>
        {task.description && (
          <S.TaskDescription>{task.description}</S.TaskDescription>
        )}
        <S.TaskStatus status={task.status}>
          {task.status === "COMPLETED"
            ? "Concluída"
            : task.status === "IN_PROGRESS"
            ? "Em andamento"
            : "Pendente"}
        </S.TaskStatus>

        <S.TaskActions>
          <S.EditButton
            onClick={() => setShowEditModal(true)}
            aria-label="Editar tarefa"
          >
            <TbPencil size={20} />
          </S.EditButton>
          <S.DeleteButton
            onClick={() => setShowDeleteModal(true)}
            aria-label="Deletar tarefa"
          >
            <TbTrash size={20} />
          </S.DeleteButton>
        </S.TaskActions>
      </S.TaskCard>

      {showEditModal && (
        <EditTaskForm
          task={task}
          onClose={() => setShowEditModal(false)}
          onSuccess={onRefresh}
        />
      )}

      {showDeleteModal && (
        <DeleteTaskForm
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default Task;
