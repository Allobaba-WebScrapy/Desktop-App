import { columns } from "./table_components/columns" 
import { DataTable } from "./table_components/data-table"; 
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";



export default function CardsTable() {
  const data = useSelector((state: RootState) => state.orange.cards);

  return (
    <div className="w-[100vw] rounded-md overflow-x-scroll">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
