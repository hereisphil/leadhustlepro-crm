
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LeadsImporterProps {
  onImportSuccess: () => void;
}

interface HeaderMapping {
  [key: string]: string; // Maps CSV header to DB field
}

interface CSVRow {
  [key: string]: string;
}

const LeadsImporter: React.FC<LeadsImporterProps> = ({ onImportSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<HeaderMapping>({});
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'upload' | 'map' | 'confirm'>('upload');
  
  const dbFields = [
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'company', label: 'Company' },
    { value: 'job_title', label: 'Job Title' },
    { value: 'status', label: 'Status' },
    { value: 'source', label: 'Source' },
    { value: 'notes', label: 'Notes' },
    { value: 'none', label: 'Do not import' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedHeaders = results.meta.fields || [];
        setHeaders(parsedHeaders);
        
        // Initialize mapping with best guesses
        const initialMapping: HeaderMapping = {};
        parsedHeaders.forEach(header => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('first') || lowerHeader.includes('fname')) {
            initialMapping[header] = 'first_name';
          } else if (lowerHeader.includes('last') || lowerHeader.includes('lname')) {
            initialMapping[header] = 'last_name';
          } else if (lowerHeader.includes('email')) {
            initialMapping[header] = 'email';
          } else if (lowerHeader.includes('phone')) {
            initialMapping[header] = 'phone';
          } else if (lowerHeader.includes('company')) {
            initialMapping[header] = 'company';
          } else if (lowerHeader.includes('job') || lowerHeader.includes('title')) {
            initialMapping[header] = 'job_title';
          } else if (lowerHeader.includes('status')) {
            initialMapping[header] = 'status';
          } else if (lowerHeader.includes('source')) {
            initialMapping[header] = 'source';
          } else if (lowerHeader.includes('note')) {
            initialMapping[header] = 'notes';
          } else {
            initialMapping[header] = 'none';
          }
        });
        
        setHeaderMapping(initialMapping);
        setCsvData(results.data as CSVRow[]);
        setStep('map');
      },
      error: (error) => {
        toast({
          title: "Error parsing file",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleMapChange = (header: string, dbField: string) => {
    setHeaderMapping(prev => ({
      ...prev,
      [header]: dbField
    }));
  };

  const handleImport = async () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to import leads.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const transformedData = csvData.map((row) => {
        const transformedRow: { [key: string]: string; user_id: string } = {
          user_id: user.id
        };
        
        Object.keys(row).forEach(header => {
          const mappedField = headerMapping[header];
          if (mappedField && mappedField !== 'none') {
            transformedRow[mappedField] = row[header];
          }
        });
        
        return transformedRow;
      });
      
      // Filter out empty rows
      const validData = transformedData.filter(row => {
        // Check if row has at least one field with data besides user_id
        return Object.keys(row).length > 1 && 
               Object.keys(row).some(key => key !== 'user_id' && row[key]);
      });
      
      if (validData.length === 0) {
        toast({
          title: "No valid leads to import",
          description: "Please check your mappings and try again.",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }
      
      const { error } = await supabase
        .from('leads')
        .insert(validData);
      
      if (error) throw error;
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${validData.length} leads.`,
      });
      
      // Reset the form
      setFile(null);
      setHeaders([]);
      setHeaderMapping({});
      setCsvData([]);
      setStep('upload');
      
      // Trigger parent refresh
      onImportSuccess();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: (error as Error).message,
        variant: "destructive"
      });
      console.error("Import error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Import Leads</CardTitle>
        <CardDescription>
          Upload your CSV or Excel file to import your leads.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'upload' && (
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-10 text-center hover:bg-slate-50 transition cursor-pointer"
              onClick={handleUploadClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
              />
              <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-1">Drop your file here or click to browse</p>
              <p className="text-sm text-gray-500">Supports CSV and Excel files</p>
            </div>
            
            <Alert>
              <AlertTitle>Make sure your spreadsheet includes:</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>Lead contact information (name, email, phone)</li>
                  <li>Company details where applicable</li>
                  <li>Headers for each column</li>
                  <li>No protected or sensitive personal data</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {step === 'map' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Map your spreadsheet columns to lead fields</h3>
              <div className="space-y-3">
                {headers.map((header) => (
                  <div key={header} className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-sm font-medium">{header}</div>
                    <Select
                      value={headerMapping[header] || 'none'}
                      onValueChange={(value) => handleMapChange(header, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {dbFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            
            {csvData.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Preview ({csvData.length} leads)</h3>
                <div className="border rounded-md overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {headers.map((header) => (
                          <th 
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                            {headerMapping[header] !== 'none' && (
                              <span className="block text-xs text-gray-400 normal-case font-normal">
                                → {dbFields.find(f => f.value === headerMapping[header])?.label}
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {csvData.slice(0, 3).map((row, idx) => (
                        <tr key={idx}>
                          {headers.map((header) => (
                            <td 
                              key={`${idx}-${header}`}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {csvData.length > 3 && (
                        <tr>
                          <td 
                            colSpan={headers.length}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center italic"
                          >
                            ... {csvData.length - 3} more leads
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setHeaders([]);
                  setHeaderMapping({});
                  setCsvData([]);
                  setStep('upload');
                }}
              >
                Back
              </Button>
              <Button 
                onClick={handleImport}
                disabled={isUploading}
              >
                {isUploading ? 'Importing...' : 'Import Leads'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsImporter;
