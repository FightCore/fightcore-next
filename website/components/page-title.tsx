interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className="pt-5 text-left text-3xl font-bold">{title}</h1>;
};
