
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";

interface PageTemplateProps {
  title: string;
  children?: React.ReactNode;
}

const PageTemplate = ({ title, children }: PageTemplateProps) => {
  return (
    <div className="min-h-screen px-4 py-6 md:p-8 lg:p-10 relative max-w-full">
      <Header />
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-xl hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Voltar</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold name-underline">{title}</h1>
      </header>
      <main className="w-full max-w-full overflow-hidden">{children}</main>
    </div>
  );
};

export default PageTemplate;
