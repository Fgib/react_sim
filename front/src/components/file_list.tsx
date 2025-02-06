import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ErrorType {
  id: string;
  name: string;
}

interface FileData {
  id: number;
  name: string;
  size: number;
  status: string;
  createdAt: unknown;
  updatedAt: unknown
  errors: ErrorType[];
}

const ErrorList = ({ errors }: { errors: ErrorType[] }) => {
  if (!errors?.length) return null;

  return (
    <div className="px-6 py-3 bg-gray-50">
      <h4 className="text-sm font-semibold mb-2">Errors found:</h4>
      <ul className="list-disc pl-5">
        {errors.map((error) => (
          <li key={error.id} className="text-sm text-red-600">
            {error.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const columns = [
  {
    accessorKey: "name",
    header: "File Name",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = row.getValue("size") as number;
      return <div>{(size / 1024).toFixed(2)} KB</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "error",
    header: "Errors",
    cell: ({ row }) => {
      const errors = row.getValue("error") as ErrorType[];
      return <div>{errors?.length || 0} errors</div>;
    },
  },
];

const FileList = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/files');
        console.log(response.data);
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleRowClick = (fileId: number) => {
    setExpandedRowId(expandedRowId === fileId ? null : fileId);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;

  return (
    <div className="p-4">
      <Table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow className="bg-gray-50">
            {columns.map((column) => (
              <TableHead
                key={column.accessorKey as string}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
              >
                {column.header as string}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <>
              <TableRow
                key={file.id}
                className="hover:bg-gray-50 transition-colors border-t border-gray-200 cursor-pointer"
                onClick={() => handleRowClick(file.id)}
              >
                <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                  {file.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${file.status === 'completed' ? 'bg-green-100 text-green-800' :
                    file.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {file.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-500">
                  {file.errors?.length || 0} errors
                </TableCell>
              </TableRow>
              {expandedRowId === file.id && file.errors?.length > 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <ErrorList errors={file.errors} />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileList;