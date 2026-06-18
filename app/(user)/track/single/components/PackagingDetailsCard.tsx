import { Package, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InfoToolTip from "@/components/common/tooltip/InfoToolTip";

export function PackagingDetailsCard({ quote }: { quote?: any }) {
  if (!quote) return null;

  const lineItems = quote.lineItems;
  const units = lineItems?.units || [];
  const totalWeight = units.reduce((acc: number, unit: any) => acc + (unit.weight || 0), 0);
  const dimensionalWeight = (units.reduce((acc: number, unit: any) => acc + ((unit.length || 0) * (unit.width || 0) * (unit.height || 0)), 0) / 139).toFixed(2);

  return (
    <Card className="rounded-sm pt-0 shadow-sm mb-6">
      <CardHeader className="bg-slate-50 dark:bg-gray-900 border-b py-3 px-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Package className="w-6 h-6" />
          Packaging Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Packaging Type:</span> <span className="font-medium text-foreground capitalize">{lineItems?.type?.toLowerCase().replaceAll("_", " ") || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total # of units on pallets:</span> <span className="font-medium text-foreground">{lineItems?.quantity || 0} Unit(s)</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Units:</span> <span className="font-medium text-foreground">{units.length} Unit(s)</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Dangerous Goods:</span> <span className="font-medium text-foreground">{lineItems?.dangerousGoods ? 'Yes' : 'None'}</span></div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dimensional Weight:</span>
              <span className="font-medium text-foreground flex items-center gap-1">{dimensionalWeight} lbs
                {/* <Info className="w-4 h-4 text-white bg-primary rounded-full" /> */}
                <InfoToolTip
                  message="Dimensional Weight means the weight of the space a parcel or shipment occupies in relation to its volume, as determined by each individual carrier's internal policies."
                />
              </span>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Shipment Weight:</span> <span className="font-medium text-foreground">{totalWeight} lbs</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Stackable:</span> <span className="font-medium text-foreground">{lineItems?.stackable ? 'Yes' : 'No'}</span></div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-foreground h-8 w-10">#</TableHead>
              <TableHead className="font-semibold text-foreground h-8 text-center">Length (in)</TableHead>
              <TableHead className="font-semibold text-foreground h-8 text-center">Width (in)</TableHead>
              <TableHead className="font-semibold text-foreground h-8 text-center">Height (in)</TableHead>
              <TableHead className="font-semibold text-foreground h-8 text-center">Weight (lbs)</TableHead>
              <TableHead className="font-semibold text-foreground h-8">Type</TableHead>
              <TableHead className="font-semibold text-foreground h-8 text-right"># units on pallet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit: any, index: number) => (
              <TableRow className="border-b-0" key={unit.id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="text-center">{unit.length || 'N/A'}</TableCell>
                <TableCell className="text-center">{unit.width || 'N/A'}</TableCell>
                <TableCell className="text-center">{unit.height || 'N/A'}</TableCell>
                <TableCell className="text-center">{unit.weight || 'N/A'}</TableCell>
                <TableCell className="capitalize">{lineItems?.type.toLowerCase().replaceAll("_", " ") || 'N/A'}</TableCell>
                <TableCell className="text-right">{unit.unitsOnPallet || 1}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={7} className="pt-0 text-muted-foreground font-medium border-t-0">
                <p className="capitalize"> <b>Description:</b> {quote.description || lineItems?.type.toLowerCase().replaceAll("_", " ") || 'N/A'}</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
