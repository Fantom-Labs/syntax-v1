
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";

interface PageTemplateProps {
  title: string;
  children?: React.ReactNode;
}

const PageTemplate = ({ title, children }: PageTemplateProps) => {
  return (
    <div className="min-h-screen px-3 py-4 md:p-12 relative max-w-full">
      <Header />
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        </div>
        <h1 className="text-3xl font-medium name-underline">{title}</h1>
      </header>
      <main className="w-full max-w-full overflow-hidden">{children}</main>
    </div>
  );
};

export default PageTemplate;
