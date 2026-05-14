import { useState, useRef, useEffect, ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import Loader from './Loader';
import Button from './Button';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  render?: (value: any, row: T) => ReactNode;
}

interface TableComponentProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  actions?: {
    label: string;
    onClick: (row: T) => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  }[];
  showCheckbox?: boolean;
  selectedRows?: number[];
  onSelectRow?: (index: number) => void;
  onSelectAll?: () => void;
  emptyMessage?: string;
}

export default function TableComponent<T>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  actions = [],
  showCheckbox = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  emptyMessage = 'No data available',
}: TableComponentProps<T>) {
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setOpenActionIndex(null);
      }
    };

    if (openActionIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionIndex]);

  if (isLoading) return <Loader />;

  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-[#F9FAFB] sticky top-0">
          <tr>
            {showCheckbox && (
              <th className="py-3.5 px-4 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#00AD51] border-gray-300 rounded focus:ring-[#00AD51]"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={onSelectAll}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className="py-3.5 px-4 text-left text-[10px] font-medium text-black uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="py-3.5 px-4 text-left text-[10px] font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick?.(row)}
              >
                {showCheckbox && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#00AD51] border-gray-300 rounded focus:ring-[#00AD51]"
                      checked={selectedRows.includes(rowIndex)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectRow?.(rowIndex);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => {
                  const value = getCellValue(row, column);
                  return (
                    <td
                      key={colIndex}
                      className="px-4 py-4 text-[10px] text-gray-900 whitespace-nowrap"
                    >
                      {column.render ? column.render(value, row) : String(value)}
                    </td>
                  );
                })}
                {actions.length > 0 && (
                  <td className="px-4 py-4 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {actions.length === 1 ? (
                        <Button
                          size="sm"
                          variant={actions[0].variant || 'primary'}
                          onClick={() => actions[0].onClick(row)}
                        >
                          {actions[0].label}
                        </Button>
                      ) : (
                        <>
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() =>
                              setOpenActionIndex(
                                openActionIndex === rowIndex ? null : rowIndex
                              )
                            }
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openActionIndex === rowIndex && (
                            <div
                              ref={actionRef}
                              className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]"
                            >
                              {actions.map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                  onClick={() => {
                                    action.onClick(row);
                                    setOpenActionIndex(null);
                                  }}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (showCheckbox ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                className="py-12 text-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-500 font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
