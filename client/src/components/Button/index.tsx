import { ButtonHTMLAttributes } from "react";
import * as S from "./styled";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, ...rest }: ButtonProps) => {
  return <S.Button {...rest}>{children}</S.Button>;
};

export default Button;
