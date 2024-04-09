import { columns } from "./table_components/columns" 
import { DataTable } from "./table_components/data-table"; 
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";



export default function CarsTable() {
  const data = useSelector((state: RootState) => state.pagesJaunes.cards);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
