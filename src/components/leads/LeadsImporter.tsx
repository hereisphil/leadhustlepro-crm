
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
import { Upload, Plus, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface LeadsImporterProps {
  onImportSuccess: () => void;
}

interface HeaderMapping {
  [key: string]: string; // Maps CSV header to DB field
}

interface CSVRow {
  [key: string]: string;
}

interface CustomField {
  name: string;
  label: string;
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
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [showCustomFieldDialog, setShowCustomFieldDialog] = useState(false);
  
  const standardFields = [
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'company', label: 'Company' },
    { value: 'job_title', label: 'Job Title' },
    { value: 'status', label: 'Status' },
    { value: 'source', label: 'Source' },
    { value: 'notes', label: 'Notes' },
  ];
  
  // Combine standard fields and custom fields
  const dbFields = [
    ...standardFields,
    ...customFields.map(field => ({ value: field.name, label: field.label })),
    { value: 'none', label: 'Do not import' },
    { value: 'custom', label: '+ Create Custom Field' }
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
    if (dbField === 'custom') {
      // Store the current header to map to the custom field
      setNewFieldLabel(header);
      // Open the custom field dialog
      setShowCustomFieldDialog(true);
      return;
    }
    
    setHeaderMapping(prev => ({
      ...prev,
      [header]: dbField
    }));
  };

  const handleAddCustomField = () => {
    if (!newFieldName) {
      toast({
        title: "Field name required",
        description: "Please enter a name for your custom field",
        variant: "destructive"
      });
      return;
    }
    
    // Standardize field name (lowercase, underscores instead of spaces)
    const formattedFieldName = newFieldName.toLowerCase().replace(/\s+/g, '_');
    
    // Check if field name already exists
    if ([...standardFields, ...customFields].some(field => field.value === formattedFieldName || field.name === formattedFieldName)) {
      toast({
        title: "Field exists",
        description: "This field name is already in use",
        variant: "destructive"
      });
      return;
    }
    
    // Add the new custom field
    const newField = { name: formattedFieldName, label: newFieldName };
    setCustomFields([...customFields, newField]);
    
    // Update the mapping for the header that triggered the dialog
    if (newFieldLabel) {
      setHeaderMapping(prev => ({
        ...prev,
        [newFieldLabel]: formattedFieldName
      }));
    }
    
    // Reset form
    setNewFieldName('');
    setNewFieldLabel('');
    setShowCustomFieldDialog(false);
    
    toast({
      title: "Custom field created",
      description: `Added custom field "${newFieldName}"`,
    });
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
      setCustomFields([]);
      
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

  const removeCustomField = (fieldName: string) => {
    setCustomFields(customFields.filter(field => field.name !== fieldName));
    
    // Update any mappings that used this field
    const updatedMapping = { ...headerMapping };
    for (const [header, value] of Object.entries(updatedMapping)) {
      if (value === fieldName) {
        updatedMapping[header] = 'none';
      }
    }
    setHeaderMapping(updatedMapping);
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
              
              {customFields.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2 text-sm text-gray-600">Custom Fields</h4>
                  <div className="flex flex-wrap gap-2">
                    {customFields.map((field) => (
                      <div key={field.name} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                        {field.label}
                        <button 
                          onClick={() => removeCustomField(field.name)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
                            {headerMapping[header] !== 'none' && headerMapping[header] !== 'custom' && (
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
                  setCustomFields([]);
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

      <Dialog open={showCustomFieldDialog} onOpenChange={setShowCustomFieldDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Field</DialogTitle>
            <DialogDescription>
              Add a custom field to store additional lead information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field Name</Label>
              <Input 
                id="field-name" 
                placeholder="e.g. Industry, Budget, Lead Score"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
              />
              <p className="text-xs text-gray-500">This will be converted to a database column</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomFieldDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomField}>
              Create Custom Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LeadsImporter;
