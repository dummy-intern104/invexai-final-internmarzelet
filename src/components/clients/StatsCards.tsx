
import { Users, Phone, Calendar } from "lucide-react";
import { CardStat } from "@/components/ui/card-stat";
import { Client } from "@/types";
import useAppStore from "@/store/appStore";

interface StatsCardsProps {
  clients: Client[];
  onMeetingsClick: () => void;
}

export const StatsCards = ({ clients, onMeetingsClick }: StatsCardsProps) => {
  const { getTotalMeetings } = useAppStore();
  const totalClients = clients.length;
  const totalMeetings = getTotalMeetings();
  
  // Calculate recent contacts (clients added in the last 7 days)
  const recentContacts = clients.filter(client => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(client.lastPurchase) >= oneWeekAgo;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CardStat 
        title="Total Clients" 
        value={totalClients} 
        icon={<Users className="w-5 h-5 text-primary" />}
      >
        <p className="text-xs text-muted-foreground mt-1">{totalClients} active</p>
      </CardStat>
      
      <CardStat 
        title="Recent Contacts" 
        value={recentContacts}
        icon={<Phone className="w-5 h-5 text-blue-500" />} 
        className="bg-card"
      >
        <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
      </CardStat>
      
      <CardStat 
        title="Meetings" 
        value={totalMeetings}
        icon={<Calendar className="w-5 h-5 text-green-500" />} 
        className="bg-card cursor-pointer hover:shadow-md transition-shadow"
        onClick={onMeetingsClick}
      >
        <p className="text-xs text-muted-foreground mt-1">Total scheduled</p>
      </CardStat>
    </div>
  );
};
