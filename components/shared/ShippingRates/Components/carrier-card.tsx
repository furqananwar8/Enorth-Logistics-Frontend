import Image from "next/image";
import type { CarrierResult } from "../shippinRates.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface CarrierCardProps {
  result: CarrierResult;
  index: number;
  setSelectedCarrier: (carrier: string) => void;
  selectedCarrier: any;
}
export function getCarrierImg(carrierName: string) {
  switch (carrierName?.toLowerCase()) {
    case "fedex":
      return (
        <Image src="/carriers/fedex.svg" width={80} height={80} alt="FedEx" />
      );
    case "tst":
      return <Image src="/carriers/tst.png" width={80} height={80} alt="TST" />;
    case "tforce":
      return (
        <Image
          src="/carriers/tforce.png"
          className="mix-blend-multiply"
          width={80}
          height={80}
          alt="TForce"
        />
      );
    case "xpo":
      return <Image src="/carriers/xpo.svg" width={80} height={80} alt="XPO" />;
    case "minimax":
      return <Image src="/carriers/minimax.svg" width={80} height={80} alt="MiniMax" />;

    default:
      return <div className="border rounded-2xl p-3 flex justify-center items-center">{carrierName}</div>;
  }
}
export function CarrierCard({
  result,
  index,
  selectedCarrier,
  setSelectedCarrier,
}: CarrierCardProps) {
  const isError = result.error !== null;
  const quotes = JSON.stringify(result.quotes);
  const carrierName = result?.carrier || null;

  const quotesList = Array.isArray(result?.quotes)
    ? result.quotes
    : result?.quotes
      ? [result.quotes]
      : [];

  const isSelected = (quote: any) => {
    return (
      selectedCarrier?.carrier === result.carrier &&
      selectedCarrier?.serviceType === quote.serviceType
    );
  };

  // console.log(result);
  return (
    <>
      {isError ? (
        // <TableRow>
        //     <TableCell colSpan={5}>
        //         <code className="text-red-500 text-sm">
        //             {result.error}
        //         </code>
        //     </TableCell>
        // </TableRow>
        ""
      ) : quotesList.length > 0 ? (
        quotesList
          .filter(
            (r) => r.estimatedDeliveryDays && r.finalTotalWithAdminCut != null,
          )
          .map((quote: any, index: number) => (
            <TableRow
              key={index}
              className={
                isSelected(quote) ? "border-primary bg-primary/10" : ""
              }
            >
              {/* Carrier */}
              <TableCell>
                <div className="h-16 w-16 flex items-center justify-center">
                  {getCarrierImg(result.carrier)}
                </div>
              </TableCell>

              {/* Service */}
              <TableCell>{quote?.serviceName || "N/A"}</TableCell>

              {/* EST Time */}
              <TableCell>{quote?.estimatedDeliveryDays || "—"}</TableCell>

              {/* Shipping Rate */}
              <TableCell>
                {quote?.totalPrice
                  ? `${quote.currency} ${quote.finalTotalWithAdminCut}`
                  : "—"}
              </TableCell>

              {/* Action */}
              <TableCell className="cursor-pointer">
                <Button
                  variant={isSelected(quote) ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCarrier(quote);
                  }}
                >
                  {isSelected(quote) ? "Selected" : "Select"}
                </Button>
              </TableCell>
            </TableRow>
          ))
      ) : (
        // 🟡 Empty / loading state
        // <TableRow>
        //   <TableCell colSpan={5} className="text-center py-6">
        //     No rates available
        //   </TableCell>
        // </TableRow>
        ""
      )}
    </>
  );
}
