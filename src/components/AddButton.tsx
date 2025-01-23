import { Plus } from "lucide-react";
import { toast } from "sonner";

const AddButton = () => {
  const handleClick = () => {
    toast("Esta funcionalidade será implementada em breve!");
  };

  return (
    <button
      onClick={handleClick}
      className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 transition-colors duration-200 flex items-center justify-center"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default AddButton;