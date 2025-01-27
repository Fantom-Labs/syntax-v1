import { useState } from "react";
import { Home, Computer, Dog, Apple, Plus } from "lucide-react";
import PageTemplate from "@/components/PageTemplate";
import { ShoppingCategory, ShoppingItem } from "@/types/shopping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newCategory, setNewCategory] = useState("");

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

  const toggleItem = (itemId: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addItem = (categoryId: string, name: string) => {
    if (name.trim()) {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: name.trim(),
        completed: false,
        categoryId,
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

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
                  .filter((item) => item.categoryId === category.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 group"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(item.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          if (newName.trim()) {
                            setItems(
                              items.map((i) =>
                                i.id === item.id ? { ...i, name: newName } : i
                              )
                            );
                          } else {
                            removeItem(item.id);
                          }
                        }}
                        className={`flex-1 bg-transparent border-none focus:outline-none ${
                          item.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      />
                    </div>
                  ))}

                {/* Empty state with suggestions */}
                {items.filter((item) => item.categoryId === category.id)
                  .length === 0 && (
                  <div className="space-y-2">
                    {(SUGGESTIONS[category.id as keyof typeof SUGGESTIONS] || []).map(
                      (suggestion, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300"
                            disabled
                          />
                          <input
                            type="text"
                            placeholder={suggestion}
                            className="flex-1 bg-transparent border-none focus:outline-none text-muted-foreground"
                            onFocus={(e) => {
                              addItem(category.id, e.target.value);
                            }}
                          />
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
                      if (e.key === "Enter") {
                        addItem(category.id, e.currentTarget.value);
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