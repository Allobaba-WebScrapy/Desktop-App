import { columns } from "./table_components/columns";
import { DataTable } from "./table_components/data-table";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function ProductsTable() {
  const data = useSelector((state: RootState) => state.autoscout24.cars);

  return (
    <div className="w-[99vw] rounded-md overflow-x-scroll">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
