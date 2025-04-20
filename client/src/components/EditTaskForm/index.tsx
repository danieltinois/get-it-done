import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Task from "../Task";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";

import * as S from "./styled";
import * as Dialog from "@radix-ui/react-dialog";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

type FormData = z.infer<typeof schema>;

interface Props {
  task: Task;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTaskForm = ({ task, onClose, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("status", task.status as FormData["status"]);
  }, [task]);

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:3333/api/tasks/${task.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Tarefa atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Erro ao atualizar tarefa");
      console.error(err);
    }
  };

  const autoResizeTextArea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <S.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <S.Wrapper
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <S.Content
            as={motion.div}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <h2>Editar tarefa</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input {...register("title")} placeholder="Título" />
              {errors.title && <span>{errors.title.message}</span>}

              <textarea
                {...register("description")}
                placeholder="Descrição"
                onInput={(e) => autoResizeTextArea(e.currentTarget)}
                rows={1}
              />

              <select {...register("status")}>
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="COMPLETED">Concluída</option>
              </select>

              <S.Actions>
                <button type="submit" disabled={isSubmitting}>
                  Salvar
                </button>
                <button type="button" onClick={onClose}>
                  Cancelar
                </button>
              </S.Actions>
            </form>
          </S.Content>
        </S.Wrapper>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditTaskForm;
