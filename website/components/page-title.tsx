interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className="py-5 text-left text-3xl font-bold">{title}</h1>;
};
