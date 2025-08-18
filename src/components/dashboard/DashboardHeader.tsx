
import UserProfile from "@/components/layout/UserProfile";

export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of your business performance
        </p>
      </div>
      <div className="hidden md:block">
        <UserProfile />
      </div>
    </div>
  );
};
