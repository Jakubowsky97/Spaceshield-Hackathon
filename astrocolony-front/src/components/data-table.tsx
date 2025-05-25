"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"

// Definicja schematu danych
const schema = z.object({
  id: z.string(),
  destination: z.string(),
  content: z.string(),
  status: z.enum(["In progress", "Planned", "Ended", "Delayed"]),
  planned_start: z.string(),
  ETA: z.string(),
  operator: z.string(),
})

type Transport = z.infer<typeof schema>

// Komponent uchwytu do przeciągania
const DragHandle = ({ id }: { id: string }) => {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// Definicja kolumn
const columns: ColumnDef<Transport>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Transport ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium text-slate-600">
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "destination",
    header: "Farm Destination",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800">
        {row.original.destination}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">{row.original.content}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors = {
        "In progress": "bg-amber-100 text-amber-800 border-amber-300",
        "Planned": "bg-blue-100 text-blue-800 border-blue-300",
        "Ended": "bg-emerald-100 text-emerald-800 border-emerald-300",
        "Delayed": "bg-rose-100 text-rose-800 border-rose-300",
      }
      
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${statusColors[row.original.status]}`}>
          {row.original.status === "Ended" && <CheckCircle2Icon className="inline size-3 mr-1" />}
          {row.original.status === "Delayed" && <LoaderIcon className="inline size-3 mr-1" />}
          {row.original.status}
        </span>
      )
    },
  },
  {
    accessorKey: "planned_start",
    header: "Planned Start",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.planned_start}
      </span>
    ),
  },
  {
    accessorKey: "ETA",
    header: "ETA",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-700">
        {row.original.ETA === "N/A" ? (
          <span className="text-rose-600">Attention needed</span>
        ) : (
          row.original.ETA
        )}
      </span>
    ),
  },
  {
    accessorKey: "operator",
    header: "Operator",
    cell: ({ row }) =>
      row.original.operator === "Assign operator" ? (
        <Button variant="outline" size="sm" className="h-7 gap-1 text-indigo-600 hover:bg-indigo-50">
          <PlusIcon className="size-3" />
          <span>Assign operator</span>
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400"></span>
          <span className="text-sm text-slate-700">{row.original.operator}</span>
        </div>
      ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// Komponent wiersza z możliwością przeciągania
const DraggableRow = ({ row }: { row: Row<Transport> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      className="group relative transition-colors hover:bg-indigo-50/50 data-[dragging=true]:bg-indigo-100/30 data-[state=selected]:bg-indigo-50"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="py-3 align-middle">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// Główny komponent DataTable
export function DataTable({ data: initialData }: { data: Transport[] }) {
  const [data, setData] = React.useState(initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo(() => data.map(({ id }) => id), [data])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id as string)
        const newIndex = dataIds.indexOf(over.id as string)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs defaultValue="outline" className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5 border-slate-300 bg-white">
                <ColumnsIcon className="size-4" />
                <span>Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <PlusIcon className="size-4 mr-1.5" />
          New transport
        </Button>
      </div>

      <TabsContent value="outline" className="border-0 p-0">
        <div className="rounded-xl border shadow-sm">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="bg-slate-50 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id} 
                        className="py-3 font-semibold text-slate-700 first:rounded-tl-xl last:rounded-tr-xl"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-b-xl">
          <div className="text-sm text-slate-600">
            Selected {table.getFilteredSelectedRowModel().rows.length} from{" "}
            {table.getFilteredRowModel().rows.length} logs
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="size-8 border-slate-300 bg-white"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            
            <span className="px-3 text-sm text-slate-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>

            <Button
              variant="outline"
              className="size-8 border-slate-300 bg-white"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}