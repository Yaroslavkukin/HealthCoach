import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { TaskItem } from '@/components/TaskItem';
import { demoTasks } from '@/data/mock/healthProfile';

export default function WeeklyPlanScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">7-Day Plan</AppText>
      <AppText variant="body">This week is focused on recovery, movement consistency, and nutrition cleanup.</AppText>
      {['Monday', 'Tuesday', 'Wednesday'].map((day) => (
        <SectionCard key={day}>
          <AppText variant="subtitle">{day}</AppText>
          {demoTasks.slice(0, 3).map((task) => <TaskItem key={`${day}-${task.id}`} task={task} />)}
        </SectionCard>
      ))}
    </ScreenContainer>
  );
}
