import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

import * as S from "./styled";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteTaskForm = ({ isOpen, onClose, onConfirm }: Props) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <S.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <S.Wrapper>
          <S.Content
            as={motion.div}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <h2>Excluir tarefa</h2>

            <S.Info>
              <p>Tem certeza que deseja excluir esta tarefa?</p>
              <S.Alert>Essa ação não poderá ser desfeita!</S.Alert>
            </S.Info>

            <S.Actions>
              <button onClick={onConfirm}>Sim, excluir</button>
              <button onClick={onClose}>Cancelar</button>
            </S.Actions>
          </S.Content>
        </S.Wrapper>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteTaskForm;
