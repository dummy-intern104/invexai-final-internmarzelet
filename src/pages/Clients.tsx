
import { useState, useEffect } from "react";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { StatsCards } from "@/components/clients/StatsCards";
import { ClientList } from "@/components/clients/ClientList";
import { MeetingListDialog } from "@/components/clients/MeetingListDialog";
import useAppStore from "@/store/appStore";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Clients = () => {
  const { clients, deleteClient } = useAppStore();
  const [isMeetingListOpen, setIsMeetingListOpen] = useState(false);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to access clients');
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleMeetingsClick = () => {
    setIsMeetingListOpen(true);
  };

  const handleAddClientClick = () => {
    navigate("/clients/add");
  };

  return (
    <div className="space-y-8 animate-fade-in smooth-scroll">
      <ClientsHeader />
      <StatsCards clients={clients} onMeetingsClick={handleMeetingsClick} />
      <ClientList 
        clients={clients} 
        onDeleteClient={deleteClient}
        onAddClientClick={handleAddClientClick}
      />
      <MeetingListDialog 
        open={isMeetingListOpen}
        onOpenChange={setIsMeetingListOpen}
      />
    </div>
  );
};

export default Clients;
