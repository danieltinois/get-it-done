import * as S from "./styled";

interface SmallLinkProps {
  children: React.ReactNode;
  to: string;
  className?: string;
}

const SmallLink = ({ to, children, className }: SmallLinkProps) => {
  return (
    <S.SmallLink href={to} className={className}>
      {children}
    </S.SmallLink>
  );
};

export default SmallLink;
