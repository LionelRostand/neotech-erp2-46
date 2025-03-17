
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

export interface Transaction {
  id: string;
  date: string;
  client: string;
  amount: string;
  status: "success" | "warning" | "danger";
  statusText: string;
}

interface DataTableProps {
  title: string;
  data: Transaction[];
  className?: string;
}

const DataTable = ({ title, data, className }: DataTableProps) => {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm overflow-hidden", className)}>
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Montant</th>
              <th className="px-6 py-4 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr 
                key={item.id}
                className="text-gray-700 text-sm hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium">#{item.id}</td>
                <td className="px-6 py-4">{item.date}</td>
                <td className="px-6 py-4">{item.client}</td>
                <td className="px-6 py-4 font-medium">{item.amount}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} text={item.statusText} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
