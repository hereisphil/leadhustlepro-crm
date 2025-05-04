
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNavigation from '@/components/DashboardNavigation';
import DashboardFooter from '@/components/DashboardFooter';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LeadsTable from '@/components/leads/LeadsTable';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const fullName = user?.user_metadata?.full_name || 'there';

  const { data: leadsCount = 0 } = useQuery({
    queryKey: ['leadsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DashboardNavigation />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {fullName}!</h1>
          <p className="text-gray-600 mb-8">Let's boost your lead conversion today.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started with LeadHustle.pro</CardTitle>
                  <CardDescription>Watch this short tutorial to learn the basics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                    <div className="text-center p-6">
                      <p className="text-gray-500 mb-2">Tutorial Video</p>
                      <p className="text-sm text-gray-400">Coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Your current performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Leads</p>
                      <p className="text-2xl font-bold">{leadsCount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Campaigns</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                      <p className="text-2xl font-bold">0%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">What would you like to do?</h2>
            
            <Tabs defaultValue="learn">
              <TabsList className="mb-4">
                <TabsTrigger value="learn">Learn</TabsTrigger>
                <TabsTrigger value="leads">Manage Leads</TabsTrigger>
                <TabsTrigger value="campaign">Create Campaign</TabsTrigger>
              </TabsList>
              
              <TabsContent value="learn">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="bg-blue-100 text-blue-500 p-1 rounded mr-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span>Guide: How to import your existing leads</span>
                      </li>
                      <li className="flex items-center">
                        <span className="bg-blue-100 text-blue-500 p-1 rounded mr-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span>Tutorial: Creating your first email campaign</span>
                      </li>
                      <li className="flex items-center">
                        <span className="bg-blue-100 text-blue-500 p-1 rounded mr-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span>Best practices: Lead nurturing sequences</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="leads">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Your Leads</h3>
                      <Link to="/leads">
                        <Button className="flex items-center gap-2 bg-leadhustle-blue text-white rounded hover:bg-leadhustle-darkBlue">
                          <FileSpreadsheet className="h-4 w-4" />
                          Import More Leads
                        </Button>
                      </Link>
                    </div>
                    
                    {leadsCount > 0 ? (
                      <LeadsTable refreshTrigger={0} limit={5} showViewAllLink={true} />
                    ) : (
                      <div className="text-center py-8">
                        <h3 className="text-xl font-semibold mb-2">Ready to grow your lead database?</h3>
                        <p className="text-gray-500 mb-4">Import contacts or add them manually to get started.</p>
                        <div className="flex justify-center gap-4">
                          <Link to="/leads">
                            <Button className="flex items-center gap-2 bg-leadhustle-blue text-white rounded hover:bg-leadhustle-darkBlue">
                              <FileSpreadsheet className="h-4 w-4" />
                              Import Leads
                            </Button>
                          </Link>
                          <Button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
                            Add Manually
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="campaign">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <h3 className="text-xl font-semibold mb-2">Create your first campaign</h3>
                      <p className="text-gray-500 mb-4">Design automated sequences to nurture and convert your leads.</p>
                      <Button className="px-4 py-2 bg-leadhustle-blue text-white rounded hover:bg-leadhustle-darkBlue transition">
                        New Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;
