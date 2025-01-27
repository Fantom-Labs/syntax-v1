export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  categoryId: string;
}

export interface ShoppingCategory {
  id: string;
  name: string;
  icon: string;
}