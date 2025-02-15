import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  completedDays: number[];
}

interface HabitSettingsProps {
  habits: Habit[];
  onHabitsChange: (habits: Habit[]) => void;
}

export const HabitSettings = ({ habits, onHabitsChange }: HabitSettingsProps) => {
  const [localHabits, setLocalHabits] = React.useState(habits);

  React.useEffect(() => {
    setLocalHabits(habits);
  }, [habits]);

  const addHabit = () => {
    const newHabits = [...localHabits, { 
      id: Date.now().toString(), 
      name: "New habit", 
      completedDays: [] 
    }];
    setLocalHabits(newHabits);
    onHabitsChange(newHabits);
  };

  const updateHabit = (id: string, name: string) => {
    const newHabits = localHabits.map(h =>
      h.id === id ? { ...h, name } : h
    );
    setLocalHabits(newHabits);
    onHabitsChange(newHabits);
  };

  const removeHabit = (id: string) => {
    const newHabits = localHabits.filter(h => h.id !== id);
    setLocalHabits(newHabits);
    onHabitsChange(newHabits);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Habits</h3>
        <Button variant="outline" size="sm" onClick={addHabit}>
          <Plus className="w-4 h-4 mr-1" /> Add Habit
        </Button>
      </div>
      <div className="space-y-2">
        {localHabits.map((habit) => (
          <div key={habit.id} className="flex gap-2">
            <Input
              value={habit.name}
              onChange={(e) => updateHabit(habit.id, e.target.value)}
              placeholder="Habit name"
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeHabit(habit.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};