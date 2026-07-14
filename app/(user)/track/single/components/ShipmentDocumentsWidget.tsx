import { Mail, Download, Heart, RotateCcw, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { getShippingLabelDocument } from "@/api/services/tracking.api";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useEffect, useState } from "react";

export function ShipmentDocumentsWidget({ quote }: { quote?: any }) {
  if (!quote) return null;
  // const getShippingLabelDocumentMutation = useMutation({
  //   mutationFn: (data: any) => getShippingLabelDocument(quote.shipment.id),
  //   onSuccess: async (data) => {
  //     console.log("SHIPPING LABEL", data)
  //   },
  //   onError: (error: AxiosError<ApiError>) => {
  //     console.log(error);
  //   },
  // });
  // const [shippingLabelDocument, setShippingLabelDocument] = useState();
  // useEffect(() => {
  //   if (getShippingLabelDocumentMutation.data) {
  //     setShippingLabelDocument(getShippingLabelDocumentMutation.data)
  //   }
  // }, [getShippingLabelDocumentMutation]);
  const normalizeUrl = (url: string) => {
    if (!url) return url;

    url = url.replace("uslfreight", "ulsfreight");

    if (url.startsWith("/uploads")) {
      return `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
    }

    if (url.startsWith("http")) {
      return url;
    }

    return url; // fallback
  };
  return (
    <Card className="rounded-sm pt-0 shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50 dark:bg-gray-900 py-3 px-4 border-b">
        <CardTitle className="text-xl">Shipment Documents</CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <p className="text-muted-foreground text-xs mb-6">
          Print and attach the shipping label to each pallet.
          <br />
          Please also ensure to provide one copy to the driver at time of pick
          up.
        </p>

        <div className="space-y-4 mb-6">
          {quote?.shipment?.shippingLabels && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p>Shipping Label</p>
            </div>
            <Button asChild>
              <Link
                href={normalizeUrl(quote.shipment.shippingLabels)}
                download={"file"}
                target="_blank"
              >
                View/Download
              </Link>
            </Button>
          </div>}
          {quote?.shipment?.bolPdf && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p>BOL</p>
            </div>
            <Button asChild>
              <Link
                href={normalizeUrl(quote.shipment.bolPdf)}
                download={"file"}
                target="_blank"

              >
                View/Download
              </Link>
            </Button>
          </div>}
        </div>

        {/* <div className="flex gap-2 mb-8">
          <Button
            variant="outline"
            className="flex-1 text-primary border-blue-200 hover:bg-blue-50 hover:text-blue-700 h-9 rounded-sm font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div> */}

        {/* <div className="space-y-2.5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 cursor-pointer hover:underline">
              <Checkbox id="watchlist" className="rounded-sm w-4 h-4 border-slate-300 pointer-events-none" />
              <label htmlFor="watchlist" className="text-sm text-foreground flex items-center cursor-pointer">
                Add shipment to Watchlist <Info className="w-3.5 h-3.5 ml-1 text-slate-400" />
              </label>
            </div>
            <span className="text-xs text-muted-foreground ml-6">0/5 Shipments added to Watchlist</span>
          </div>

          <a href="#" className="flex items-center gap-2 text-foreground hover:underline">
            <Heart className="w-4 h-4 text-slate-400" />
            Favourite This Shipment
          </a>

          <a href="#" className="flex items-center gap-2 text-primary font-semibold hover:underline">
            <RotateCcw className="w-4 h-4" />
            Repeat this Shipment
          </a>
        </div> */}
      </CardContent>
    </Card>
  );
}
