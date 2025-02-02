import { useState } from "react";
import { Home, Computer, Dog, Apple, Plus, Loader2 } from "lucide-react";
import PageTemplate from "@/components/PageTemplate";
import { ShoppingCategory } from "@/types/shopping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useShoppingItems } from "./hooks/useShoppingItems";

const DEFAULT_CATEGORIES: ShoppingCategory[] = [
  { id: "1", name: "Feira", icon: "food" },
  { id: "2", name: "Casa", icon: "home" },
  { id: "3", name: "Cachorro", icon: "dog" },
  { id: "4", name: "Trabalho", icon: "computer" },
];

const SUGGESTIONS = {
  "1": ["Frutas", "Verduras", "Leite", "Pão"],
  "2": ["Papel higiênico", "Detergente", "Sabão em pó"],
  "3": ["Ração", "Petiscos", "Areia"],
  "4": ["Post-its", "Canetas", "Caderno"],
};

export const ShoppingPage = () => {
  const [categories, setCategories] = useState<ShoppingCategory[]>(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const { items, isLoading, addItem, toggleItem, removeItem } = useShoppingItems();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "food":
        return <Apple className="w-4 h-4" />;
      case "home":
        return <Home className="w-4 h-4" />;
      case "dog":
        return <Dog className="w-4 h-4" />;
      case "computer":
        return <Computer className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      const newCat: ShoppingCategory = {
        id: Date.now().toString(),
        name: newCategory,
        icon: "plus",
      };
      setCategories([...categories, newCat]);
      setNewCategory("");
      toast.success("Categoria adicionada com sucesso!");
    }
  };

  if (isLoading) {
    return (
      <PageTemplate title="Lista de Compras">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Lista de Compras">
      <div className="space-y-8">
        <div className="flex gap-2">
          <Input
            placeholder="Nova categoria..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addCategory();
              }
            }}
          />
          <Button onClick={addCategory}>Adicionar</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-4 rounded-lg border bg-card space-y-4"
            >
              <div className="flex items-center gap-2">
                {getIconComponent(category.icon)}
                <h3 className="text-lg font-medium">{category.name}</h3>
              </div>

              <div className="space-y-2">
                {items
                  ?.filter((item) => item.category_id === category.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 group"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem.mutate(item.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span
                        className={`flex-1 ${
                          item.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100"
                        onClick={() => removeItem.mutate(item.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}

                {/* Empty state with suggestions */}
                {!items?.filter((item) => item.category_id === category.id)
                  .length && (
                  <div className="space-y-2">
                    {(SUGGESTIONS[category.id as keyof typeof SUGGESTIONS] || []).map(
                      (suggestion, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300"
                            disabled
                          />
                          <span
                            className="flex-1 text-muted-foreground cursor-pointer"
                            onClick={() => {
                              addItem.mutate({
                                name: suggestion,
                                categoryId: category.id,
                              });
                            }}
                          >
                            {suggestion}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Add new item input */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    disabled
                  />
                  <input
                    type="text"
                    placeholder="Adicionar item..."
                    className="flex-1 bg-transparent border-none focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        addItem.mutate({
                          name: e.currentTarget.value.trim(),
                          categoryId: category.id,
                        });
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};