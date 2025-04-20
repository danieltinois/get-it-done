import Form from "../../components/Form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import SmallLink from "../../components/SmallLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import * as S from "./styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
});

type RegisterFormData = z.infer<typeof schema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await axios.post("http://localhost:3333/api/users/register", data);
      toast.success("Conta criada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao criar conta: ", error);
      toast.error("Erro ao criar conta, tente novamente");
    }
  };

  return (
    <S.Container>
      <S.FormWrapper>
        <S.Title>Crie sua conta</S.Title>
        <S.Subtitle>É rápido e fácil</S.Subtitle>
        <Form onSubmit={handleSubmit(handleRegister)}>
          <Input
            type="text"
            placeholder="Nome"
            {...register("name")}
            error={errors.name?.message}
          />
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
            Criar conta
          </Button>

          <SmallLink to="/">Já tem uma conta? Faça login</SmallLink>
        </Form>
      </S.FormWrapper>
    </S.Container>
  );
};

export default Register;
