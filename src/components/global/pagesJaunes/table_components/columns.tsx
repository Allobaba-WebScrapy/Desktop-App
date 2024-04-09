import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUpRightFromSquare } from "lucide-react";
import { CardType } from "@/state/pagesJaunes/PagesJaunesSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';



export const columns: ColumnDef<CardType>[] = [
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
    id: 'title',
    accessorKey: "info.title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4 scale-[70%]" />
        </Button>
      )
    },
  },
  {
    id: 'phones',
    accessorKey: "info.phones",
    header: () => <div className="">Phones</div>,
    cell: ({ row }) => {
      const phones = row.original.info.phones;
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
          : "_ _ _ _"}
      </div>
    },
  },
  {
    id: 'activite',
    accessorKey: "info.activite",
    header: "Activite",
  },
  {
    id: 'address',
    accessorKey: "info.address",
    header: () => <div className="">Address</div>,
    cell: ({ row }) => {
      const url = row.original.info.address.link;
      const address = row.original.info.address.text;
      return <a href={url} target="_blank" rel="noopener noreferrer" className="text-sky-600">
        {address}
      </a>
    },
  },
  {
    accessorKey: "card_url",
    header: () => <div className="text-right">Link</div>,
    cell: ({ row }) => {
      const url = row.getValue("card_url") as string;
      return <a href={url} target="_blank" rel="noopener noreferrer">
        <ArrowUpRightFromSquare>Open</ArrowUpRightFromSquare>
      </a>
    },
  }
];
