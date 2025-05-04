
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LeadsImporter from '@/components/leads/LeadsImporter';
import LeadsTable from '@/components/leads/LeadsTable';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Table } from 'lucide-react';

const LeadsPage = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const { toast } = useToast();
  
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Leads Updated",
      description: "Your leads list has been refreshed.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Leads Management</h1>
          </div>
          
          <Tabs defaultValue="view">
            <TabsList className="mb-8">
              <TabsTrigger value="view" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                View Leads
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Import Leads
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              <LeadsTable refreshTrigger={refreshTrigger} />
            </TabsContent>
            
            <TabsContent value="import">
              <LeadsImporter onImportSuccess={triggerRefresh} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LeadsPage;
