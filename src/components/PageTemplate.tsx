import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";

interface PageTemplateProps {
  title: string;
  children?: React.ReactNode;
}

const PageTemplate = ({ title, children }: PageTemplateProps) => {
  return (
    <div className="min-h-screen p-8 md:p-12">
      <Header />
      <header className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Link>
        <h1 className="text-3xl font-medium name-underline">{title}</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default PageTemplate;