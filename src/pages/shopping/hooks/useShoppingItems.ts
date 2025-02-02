import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShoppingItem {
  id: string;
  name: string;
  category_id: string;
  completed: boolean;
  user_id: string;
}

export const useShoppingItems = () => {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["shopping-items"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("shopping_items")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error fetching shopping items");
        throw error;
      }

      return data as ShoppingItem[];
    },
  });

  const addItem = useMutation({
    mutationFn: async ({ name, categoryId }: { name: string; categoryId: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("shopping_items")
        .insert({
          name,
          category_id: categoryId,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) {
        toast.error("Error adding shopping item");
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-items"] });
      toast.success("Item added successfully");
    },
  });

  const toggleItem = useMutation({
    mutationFn: async (itemId: string) => {
      const item = items?.find((i) => i.id === itemId);
      if (!item) throw new Error("Item not found");

      const { error } = await supabase
        .from("shopping_items")
        .update({ completed: !item.completed })
        .eq("id", itemId);

      if (error) {
        toast.error("Error updating item");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-items"] });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("shopping_items")
        .delete()
        .eq("id", itemId);

      if (error) {
        toast.error("Error removing item");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-items"] });
      toast.success("Item removed successfully");
    },
  });

  return {
    items,
    isLoading,
    addItem,
    toggleItem,
    removeItem,
  };
};