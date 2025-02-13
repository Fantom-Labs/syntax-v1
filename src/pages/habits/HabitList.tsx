
import { Habit } from "@/types/habits";
import { useState } from "react";
import { HabitItem } from "./components/HabitItem";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useHabitTimers } from "./hooks/useHabitTimers";
import { useHabitOperations } from "./hooks/useHabitOperations";
import { useHabitDragAndDrop } from "./hooks/useHabitDragAndDrop";

interface HabitListProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  date: Date;
}

export const HabitList = ({ habits, setHabits, date }: HabitListProps) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const { runningTimers, setRunningTimers, elapsedTimes, setElapsedTimes } = useHabitTimers();
  const { toggleHabitCheck, removeHabit } = useHabitOperations(habits, setHabits, setRunningTimers, setElapsedTimes, setIsDeleteMode);
  const { handleDragEnd } = useHabitDragAndDrop(habits, setHabits);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={habits.map(h => h.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                date={date}
                runningTimers={runningTimers}
                elapsedTimes={elapsedTimes}
                onToggleHabit={toggleHabitCheck}
                onRemoveHabit={removeHabit}
                isDeleteMode={isDeleteMode}
              />
            ))}
            
            {habits.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Nenhum hábito cadastrado
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {habits.length > 0 && (
        <button
          onClick={() => setIsDeleteMode(!isDeleteMode)}
          className="mt-6 text-destructive hover:text-destructive/90 underline underline-offset-4 text-sm mx-auto block"
        >
          {isDeleteMode ? "Cancelar" : "Excluir hábito"}
        </button>
      )}
    </>
  );
};
