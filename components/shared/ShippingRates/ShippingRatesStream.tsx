import { useCarrierStream } from './Components/useCarrierStream.hook';
import { StreamControls } from './Components/stream-control';
import { ErrorBanner } from './Components/error-banner';
import { CarrierCard } from './Components/carrier-card';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LoaderCircle } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const API_URL = 'https://api.ulsfreight.ca';

export const ShippingRatesStream = forwardRef(({
    payload,
    selectedCarrier,
    setSelectedCarrier,
    getRatesLoading,
    setGetRatesLoading
}: {
    payload: any,
    selectedCarrier: string | null,
    setSelectedCarrier: (carrier: string) => void,
    getRatesLoading: boolean,
    setGetRatesLoading: (value: boolean) => void
}, ref) => {
    const { results, status, error, start, stop, reset } = useCarrierStream(API_URL);
    const isFirstRender = useRef(true);

    const handleStart = () => {
        start(payload);
        setGetRatesLoading(true);
    };

    useImperativeHandle(ref, () => ({
        handleStart,
        status,
        results
    }));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (status !== "connecting" && status !== "streaming") {
            setGetRatesLoading(false);
        }
    }, [status, setGetRatesLoading]);

    const isLoading = status === "connecting" || status === "streaming";

    return (
        <div>
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <StreamControls status={status} onStart={handleStart} onStop={stop} />

            {error && (
                <ErrorBanner
                    message="Something went wrong, try hitting the Get Rates button again."
                    onDismiss={reset}
                />
            )}

            
            <>
                <Table className='border mb-4'>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            <TableHead>Carrier</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>EST Time</TableHead>
                            <TableHead>Shipping Rate</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {results.map((r, i) => (
                            <CarrierCard
                                selectedCarrier={selectedCarrier}
                                setSelectedCarrier={setSelectedCarrier}
                                key={`${r.carrier}-${i}`}
                                result={r}
                                index={i}
                            />
                        ))}
                    </TableBody>
                </Table>

                {isLoading && (
                    <div className="flex items-center justify-center py-6">
                        <LoaderCircle className="animate-spin h-5 w-5 text-primary mr-2" />
                        <span className="text-muted-foreground text-sm">Fetching rates...</span>
                    </div>
                )}
            </>
        </div>
    );
});
