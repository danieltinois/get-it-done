import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";
import SmallLink from "../../components/SmallLink";
import * as S from "./styled";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await axios.post("http://localhost:3333/api/users/login", data);
      const token = response.data.token;

      console.log("RESPOSTA LOGIN: ", response.data);

      localStorage.setItem("token", token);

      console.log("TOKEN SALVO:", localStorage.getItem("token"));
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao logar: ", error);
      toast.error("Erro ao logar, e-mail ou senha inválidos");
    }
  };

  return (
    <S.Container>
      <S.FormWrapper>
        <S.Title>Bem-vindo de volta</S.Title>
        <S.Subtitle>Entre para continuar</S.Subtitle>
        <Form onSubmit={handleSubmit(handleLogin)}>
          <Input
            type="email"
            placeholder="E-mail"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            type="password"
            placeholder="Senha"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button type="submit" disabled={isSubmitting}>
            Entrar
          </Button>

          <SmallLink to="/register">Não tem uma conta? Crie uma</SmallLink>
        </Form>
      </S.FormWrapper>
    </S.Container>
  );
};

export default Login;
