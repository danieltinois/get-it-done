import { forwardRef, InputHTMLAttributes, useState } from "react";

import * as S from "./styled";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isShowingPassword = type === "password";

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <S.Wrapper>
        <S.InputContainer>
          <S.StyledInput
            ref={ref}
            {...props}
            type={isShowingPassword && showPassword ? "text" : type}
            hasIcon={isShowingPassword}
          />
          {isShowingPassword && (
            <S.ToggleButton
              onClick={togglePasswordVisibility}
              type="button"
              tabIndex={-1}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </S.ToggleButton>
          )}
        </S.InputContainer>
        {error && <S.ErrorText>{error}</S.ErrorText>}
      </S.Wrapper>
    );
  }
);

export default Input;
