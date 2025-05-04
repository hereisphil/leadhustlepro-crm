
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ListFilter, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  status: string;
  source: string;
};

interface LeadsTableProps {
  refreshTrigger: number;
  limit?: number;
  showViewAllLink?: boolean;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ 
  refreshTrigger, 
  limit, 
  showViewAllLink = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: leads = [], isLoading, error, refetch } = useQuery({
    queryKey: ['leads', refreshTrigger, limit],
    queryFn: async () => {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Lead[];
    }
  });

  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  const filteredLeads = leads.filter(lead => 
    lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading leads...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-10">Error loading leads: {(error as Error).message}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {!limit && (
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          {filteredLeads.length === 0 && (
            <TableCaption>
              {leads.length === 0 ? "No leads found. Import leads to get started." : "No leads match your search."}
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  {`${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'N/A'}
                </TableCell>
                <TableCell>{lead.email || 'N/A'}</TableCell>
                <TableCell>{lead.company || 'N/A'}</TableCell>
                <TableCell>{lead.job_title || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status || 'New'}
                  </Badge>
                </TableCell>
                <TableCell>{lead.source || 'Import'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {showViewAllLink && leads.length > 0 && (
        <div className="p-4 border-t">
          <Link to="/leads">
            <Button variant="ghost" className="flex items-center gap-1 text-leadhustle-blue">
              View All Leads <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
