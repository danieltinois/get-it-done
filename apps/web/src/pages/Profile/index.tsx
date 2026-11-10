import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import * as S from "./styled";
import api from "../../services/api";

const schema = z.object({
  name: z.string().min(2, "Mín. 2 caracteres").max(50),
  bio: z.string().max(160, "Máx. 160 caracteres").optional(),
  avatarUrl: z.string().url().optional(),
});

type FormData = z.infer<typeof schema>;

const Profile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/users/me");
      setValue("name", data.user.name ?? "");
      setValue("bio", data.user.bio ?? "");
      setPreview(data.user.avatarUrl ?? null);
    })();
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    const form = new FormData();
    form.append("file", file);

    try {
      const { data } = await api.post("/uploads/avatars", form);
      setValue("avatarUrl", data.url);
      toast.success("Foto enviada!");
    } catch (err) {
      toast.error("Falha no upload");
      console.log(err);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await api.patch("/users/me", data);
      toast.success("Perfil atualizado!");
    } catch (err) {
      toast.error("Erro ao salvar");
      console.log(err);
    }
  };

  return (
    <S.Container
      as={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Meu perfil</h2>

      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <S.AvatarWrapper>
          <motion.img
            key={preview}
            src={preview ?? "/placeholder.png"}
            alt="avatar"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
          <label>
            Trocar foto
            <input type="file" accept="image/*" onChange={onFileChange} />
          </label>
        </S.AvatarWrapper>

        <S.InputField>
          <input placeholder="Nome" {...register("name")} />
          {errors.name && <span>{errors.name.message}</span>}
        </S.InputField>

        <S.InputField>
          <textarea
            placeholder="Descrição"
            rows={1}
            {...register("bio")}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          {errors.bio && <span>{errors.bio.message}</span>}
        </S.InputField>

        <S.SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando…" : "Salvar"}
        </S.SubmitButton>
      </S.Form>
    </S.Container>
  );
};

export default Profile;
