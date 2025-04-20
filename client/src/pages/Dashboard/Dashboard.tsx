import { useEffect, useState } from "react";
import TaskItem from "../../components/Task";
import axios from "axios";
import * as S from "./styled";
import NewTaskForm from "../../components/NewTaskForm";

interface Tasks {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3333/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Erro ao buscar tarefas: ", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <S.Container>
      <S.Header>
        <h1>Suas Tarefas</h1>
        <S.NewTaskButton onClick={() => setShowForm(true)}>
          Nova tarefa
        </S.NewTaskButton>
        {showForm && (
          <NewTaskForm
            onClose={() => setShowForm(false)}
            onSuccess={fetchTasks}
          />
        )}
      </S.Header>

      <S.TaskList>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onRefresh={fetchTasks} />
        ))}
      </S.TaskList>
    </S.Container>
  );
};

export default Dashboard;
