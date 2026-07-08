import React, { useState } from 'react';
import { 
  Search, ArrowUpDown, ChevronLeft, ChevronRight, 
  FileSpreadsheet, ArrowUp, ArrowDown, Columns 
} from 'lucide-react';

interface ColumnConfig<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  resizable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  csvFilename?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchKey,
  csvFilename = 'exported_table.csv'
}: DataTableProps<T>) {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => ({ ...acc, [col.header]: true }), {})
  );
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Column resizing state (simulated resizing offsets)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // CSV Export utility
  const exportToCSV = () => {
    const activeHeaders = columns.filter(c => visibleColumns[c.header]).map(c => c.header);
    const csvContent = [
      activeHeaders.join(','),
      ...data.map(row => 
        columns
          .filter(c => visibleColumns[c.header])
          .map(c => {
            const val = typeof c.key === 'string' ? row[c.key] : row[c.key as keyof T];
            return `"${String(val || '').replace(/"/g, '""')}"`;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', csvFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter query
  const filteredData = data.filter(row => {
    if (!searchQuery || !searchKey) return true;
    const value = row[searchKey];
    return String(value || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Sort logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination bounds
  const totalRows = sortedData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none">
        
        {/* Search */}
        {searchKey && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to first page
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-7.5 pr-3 py-1.5 border border-slate-200 rounded-lg text-[10px] focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>
        )}

        <div className="flex gap-2 w-full sm:w-auto items-center justify-end font-bold">
          
          {/* Column Visibility Selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 bg-white text-[10px]"
            >
              <Columns className="h-3.5 w-3.5 text-slate-400" />
              Columns
            </button>

            {isColumnDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2 space-y-1">
                {columns.map(col => (
                  <label key={col.header} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded-lg cursor-pointer text-[10px]">
                    <input
                      type="checkbox"
                      checked={visibleColumns[col.header]}
                      onChange={() => {
                        setVisibleColumns(prev => ({
                          ...prev,
                          [col.header]: !prev[col.header]
                        }));
                      }}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="truncate">{col.header}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* CSV Export */}
          <button
            onClick={exportToCSV}
            className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 bg-white text-[10px]"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-400" />
            CSV Export
          </button>
        </div>

      </div>

      {/* Main Table Grid Card Container */}
      <div className="border border-slate-200/60 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.015)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-450 font-bold uppercase tracking-wider bg-slate-50/50 select-none">
                {columns
                  .filter(c => visibleColumns[c.header])
                  .map(col => (
                    <th
                      key={col.header}
                      style={{ width: columnWidths[col.header] || 'auto' }}
                      className="p-3.5 relative select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        {col.sortable ? (
                          <button
                            onClick={() => handleSort(col.key as string)}
                            className="hover:text-slate-800 flex items-center gap-1 focus:outline-none"
                          >
                            {col.header}
                            {sortField === col.key ? (
                              sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3 opacity-40" />
                            )}
                          </button>
                        ) : (
                          col.header
                        )}
                      </div>
                      
                      {/* Resize Handle handle mapping */}
                      {col.resizable !== false && (
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-1.5 hover:bg-indigo-300 cursor-col-resize"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const startX = e.pageX;
                            const startWidth = e.currentTarget.parentElement?.offsetWidth || 150;
                            
                            const handleMouseMove = (moveEvent: MouseEvent) => {
                              const newWidth = Math.max(80, startWidth + (moveEvent.pageX - startX));
                              setColumnWidths(prev => ({
                                ...prev,
                                [col.header]: newWidth
                              }));
                            };
                            
                            const handleMouseUp = () => {
                              document.removeEventListener('mousemove', handleMouseMove);
                              document.removeEventListener('mouseup', handleMouseUp);
                            };
                            
                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                          }}
                        />
                      )}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.filter(c => visibleColumns[c.header]).length} className="p-8 text-center text-slate-400 italic">No records found.</td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    {columns
                      .filter(c => visibleColumns[c.header])
                      .map(col => (
                        <td key={col.header} className="p-3.5 text-xs">
                          {col.render ? col.render(row) : row[col.key as keyof T]}
                        </td>
                      ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 font-bold select-none pt-2">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-slate-200 rounded-lg text-[10px] bg-white focus:outline-none focus:border-indigo-500 font-medium"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 font-medium">Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows} records</span>
        </div>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange('prev')}
            className="p-1.5 border border-slate-250 hover:bg-slate-50 text-slate-550 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed bg-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="px-3 py-1 border border-slate-200 bg-slate-50/50 rounded-lg font-bold text-slate-700">{currentPage} / {totalPages || 1}</span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange('next')}
            className="p-1.5 border border-slate-250 hover:bg-slate-50 text-slate-550 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed bg-white"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
