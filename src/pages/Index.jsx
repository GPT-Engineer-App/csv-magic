import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { parse, unparse } from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const result = parse(text, { header: true });
        setHeaders(result.meta.fields);
        setCsvData(result.data);
      };
      reader.readAsText(file);
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleDownload = () => {
    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("CSV file downloaded successfully.");
  };

  const handleCellChange = (index, field, value) => {
    const newData = [...csvData];
    newData[index][field] = value;
    setCsvData(newData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">CSV Upload, Edit, and Download Tool</h1>
      <Input type="file" accept=".csv" onChange={handleFileUpload} />
      {csvData.length > 0 && (
        <>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Input
                        value={row[header] || ""}
                        onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4" onClick={handleAddRow}>
            Add Row
          </Button>
          <Button className="mt-4 ml-2" onClick={handleDownload}>
            Download CSV
          </Button>
        </>
      )}
    </div>
  );
};

export default Index;