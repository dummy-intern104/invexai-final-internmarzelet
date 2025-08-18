
import { Calendar, AlertTriangle, Package, Trash2 } from "lucide-react";
import { CardStat } from "@/components/ui/card-stat";
import { ProductExpiry } from "@/types";

interface ExpiryStatsProps {
  expiries: ProductExpiry[];
}

export const ExpiryStats = ({ expiries }: ExpiryStatsProps) => {
  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  const activeExpiries = expiries.filter(e => e.status === 'active');
  const expiredCount = expiries.filter(e => {
    const expiryDate = new Date(e.expiry_date);
    return e.status === 'active' && expiryDate < today;
  }).length;
  
  const expiringSoonCount = expiries.filter(e => {
    const expiryDate = new Date(e.expiry_date);
    return e.status === 'active' && expiryDate >= today && expiryDate <= next7Days;
  }).length;
  
  const disposedCount = expiries.filter(e => e.status === 'disposed').length;

  const stats = [
    {
      title: "Active Items",
      value: activeExpiries.length,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: "Expiring Soon",
      value: expiringSoonCount,
      icon: <Calendar className="h-5 w-5 text-warning" />,
    },
    {
      title: "Expired",
      value: expiredCount,
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
    },
    {
      title: "Disposed",
      value: disposedCount,
      icon: <Trash2 className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <CardStat
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};
