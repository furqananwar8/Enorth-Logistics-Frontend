import { useCarrierStream } from './Components/useCarrierStream.hook';
import { StreamControls } from './Components/stream-control';
import { ErrorBanner } from './Components/error-banner';
import { CarrierCard } from './Components/carrier-card';
import { QuoteType, PickupType, RateRequestType, ServiceType, WeightUnit, DimensionsUnit, Packaging, ShipmentRatesDto } from './shippinRates.types';
import { ShippingRatesTable } from './ShippingRatesTable';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { Loader } from '@/components/common/Loader';
import FetchingRatesModal from './Components/fetchingRatesModal';
const API_URL = 'https://api.ulsfreight.ca';
// const API_URL = 'https://your-live-backend.com';

// const DEMO_PAYLOAD = {
//     quoteType: QuoteType.STANDARD,
//     fedex: {
//         from: { postalCode: '38117', countryCode: 'US' },
//         to: { postalCode: '90210', countryCode: 'US' },
//     },
//     tst: {
//         from: {
//             name: 'ENorth Logistics',
//             address: '123 Main St',
//             postalCode: 'M5V3A8',
//             city: 'Toronto',
//             state: 'ON',
//         },
//         to: {
//             name: 'ENorth Logistics',
//             address: '456 Hollywood Blvd',
//             postalCode: '48226',
//             city: 'Detroit',
//             state: 'MI',
//         },
//     },
//     pickupType: PickupType.DROPOFF_AT_FEDEX_LOCATION,
//     rateRequestType: [RateRequestType.LIST],
//     serviceType: ServiceType.FEDEX_EXPRESS_SAVER,
//     packages: [
//         {
//             weightUnit: WeightUnit.LB,
//             weight: 10,
//             dimensionsUnit: DimensionsUnit.IN,
//             length: 20,
//             width: 20,
//             height: 40,
//             handlingUnits: 1,
//             packaging: Packaging.BOX,
//         },
//     ],
// } as const;

export const ShippingRatesStream = forwardRef(({ payload, selectedCarrier, setSelectedCarrier, getRatesLoading, setGetRatesLoading }: { payload: any, selectedCarrier: string | null, setSelectedCarrier: (carrier: string) => void, getRatesLoading: boolean, setGetRatesLoading: (value: boolean) => void }, ref) => {
    const { results, status, error, start, stop, reset } = useCarrierStream(API_URL);


    // console.log("ALL quotes results:", results)
    const handleStart = () => {
        start(payload)
        setGetRatesLoading(true)
    };
    useImperativeHandle(ref, () => ({
        handleStart,
        status,
        results
    }))

    useEffect(() => {
        if (status !== "connecting" && status !== "streaming") {
            setGetRatesLoading(false)
        }
    }, [status])

    return (
        <div>
            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <StreamControls status={status} onStart={handleStart} onStop={stop} />

            {error && <ErrorBanner message={error} onDismiss={reset} />}

            <Table className='border mb-4'>
                {/* ✅ Header */}
                <TableHeader className="bg-muted sticky top-0 z-10">
                    <TableRow>
                        <TableHead>Carrier</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>EST Time</TableHead>
                        <TableHead>Shipping Rate</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>

                {/* ✅ Body */}
                <TableBody>
                    {results
                    
                    .map((r, i) => (
                        <CarrierCard
                            selectedCarrier={selectedCarrier}
                            setSelectedCarrier={setSelectedCarrier}
                            key={`${r.carrier}-${i}`} result={r} index={i} />
                    ))}
                </TableBody>
            </Table>
            {/* {results.length === 0 && (
                    <div className="flex items-center justify-center p-4">
                        <p className="text-muted-foreground">No rates found</p>
                    </div>
                )} */}


            {/* </div> */}
            {/* <Button
                disabled={status === 'connecting' || status === 'streaming'}
                className='w-max bg-primary hover:bg-[#005999]' onClick={handleStart}>
                {status === 'streaming' || status === 'connecting' ? <Loader2 className='h-4 w-4 animate-spin' /> : ""}
                Get Rates
            </Button> */}
            {/* {status === 'streaming' || status === 'connecting' ?
                <FetchingRatesModal open={status === 'streaming' || status === 'connecting'} onOpenChange={(open) => {
                    if (!open) {
                        stop()
                        reset()
                    }
                }} />
                : null
            } */}
        </div>
    );
})
