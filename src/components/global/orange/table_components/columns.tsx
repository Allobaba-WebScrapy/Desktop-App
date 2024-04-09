import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';
import { CardType } from "@/state/orange/OrangeSlice";



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
    accessorKey: "message.title",
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
    id: 'phone',
    accessorKey: "message.phone",
    header: () => <div className="">Phones</div>,
    cell: ({ row }) => {
      const phone = row.original.message.phone;
      return <div>
        {Array.isArray(phone) ?
          // make number link tel:number
          <div className="flex flex-col justify-center items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <>
                    <span className="font-semibold text-primary">
                      {phone.length}</span>&nbsp;Phone Numbers<ChevronDown style={{ scale: "0.7" }} />
                  </>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {phone.map((phone, index) => {
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
    id: 'category',
    accessorKey: "message.category",
    header: () => <div className="">Activite</div>,
    cell: ({ row }) => {
      const address = row.original.message.category;
      return <p>{address}</p>
    },
  },
  {
    id: 'adress',
    accessorKey: "message.adress",
    header: () => <div className="">Address</div>,
    cell: ({ row }) => {
      const url = row.original.message.adress.link;
      const address = row.original.message.adress.text;
      return <a href={url} target="_blank" rel="noopener noreferrer" className="text-yellow-300">
        {address}
      </a>
    },
  },
  {
    id: 'email',
    accessorKey: "message.email",
    header: () => <div className="">Email</div>,
    cell: ({ row }) => {
      const email = row.original.message.email;
      return email ? <a className="text-blue-300" href={`mailto:${email}`}>{email}</a> : "_ _ _ _";
    },
  },
];
