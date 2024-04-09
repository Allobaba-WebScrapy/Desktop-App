import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { store } from "@/state/store";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUpRightFromSquare, ChevronDown } from "lucide-react";


export type ProductType = {
  url: string;
  data: {
    title: string;
    model: string;
    vendor_info: {
      name: string;
      numbers: string[] | string;
      address: {
        url: string;
        text: string;
      };
      pro: boolean;
      company: string;
    };
  };
};

export const columns: ColumnDef<ProductType>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => {

                table.toggleAllPageRowsSelected(!!value)
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
  {
    id:'vendor',
    accessorKey: "data.vendor_info.name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Vendor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const vendor = row.original.data.vendor_info.name ; 
      const numbers = row.original.data.vendor_info.numbers ;
      
      return <div>
        <p className={Array.isArray(numbers) ? store.getState().autoscout24.dublicateNumbers.includes(numbers[0]) ? "bg-gray-300 dark:bg-muted rounded-full py-1 px-4 text-center":"":""}>{vendor}</p>
      </div>
    }
  },
  {
    id:'numbers',
    accessorKey: "data.vendor_info.numbers",
    header: () => <div className="">Numbers</div>,
    cell: ({ row }) => {
      const phones = row.original.data.vendor_info.numbers ; 
      // return <div>
      //   {Array.isArray(numbers) ? 
      //   // make number link tel:number
      //   <div>
      //       {numbers.map((number, index) => {
      //           return <div key={index}><a href={`tel:${number}`}  className="text-sky-800">
      //           {number} 
      //           </a>{", "}</div>
      //       })}
      //   </div>
      //    : "---"}
      // </div>
      return <div>
        {Array.isArray(phones) ?
          // make number link tel:number
          <div className="flex flex-col justify-center items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <>
                    <span className="font-semibold text-primary">
                      {phones.length}</span>&nbsp;Phone Numbers<ChevronDown style={{ scale: "0.7" }} />
                  </>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {phones.map((phone, index) => {
                  return (
                    <div key={index}>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <a href={`tel:${phone}`} className="font-semibold text-primary">
                          {phone}
                        </a>
                      </DropdownMenuItem>
                    </div>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          : "---"}
      </div>
    },
  },
  {
    id:'company',
    accessorKey: "data.vendor_info.company",
    header: "Company",
  },
  {
    id:'title',
    accessorKey: "data.title",
    header: "Title",
  },
  {
    id:'model',
    accessorKey: "data.model",
    header: "Model",
  },
  {
    id:'address',
    accessorKey: "data.vendor_info.address",
    header: () => <div className="">Address</div>,
    cell: ({ row }) => {
      const url = row.original.data.vendor_info.address.url ; 
      const address = row.original.data.vendor_info.address.text; 
      return <a href={url} target="_blank" rel="noopener noreferrer" className="text-sky-800">
      {address}
    </a>
    },
  },
  {
    id:'pro',
    accessorKey: "data.vendor_info.pro",
    header: "Pro",
  },
  {
    accessorKey: "url",
    header: () => <div className="text-right">Link</div>,
    cell: ({ row }) => {
      const url = row.getValue("url") as string;  
      return <a href={url} target="_blank" rel="noopener noreferrer">
      <ArrowUpRightFromSquare>Open</ArrowUpRightFromSquare>
    </a>
    },
  }
];
