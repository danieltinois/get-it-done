import { FormHTMLAttributes, ReactNode } from "react";
import * as S from "./styled";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

const Form = ({ children, ...props }: FormProps) => {
  return <S.Form {...props}>{children}</S.Form>;
};

export default Form;
