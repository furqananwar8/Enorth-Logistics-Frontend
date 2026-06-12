import {
  ArrowRight,
  Check,
  Eye,
  FileUser,
  LoaderCircle,
  Package,
  Save,
  Truck,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PromoBannerWidget from "@/app/(user)/home/components/PromoBannerWidget";
export function SideBar({
  currentStep,
  setCurrentStep,
  onSubmit,
  setQuoteStatus,
  isPending,
  isToAddressValid,
  isFromAddressValid,
  isDimensionsValid,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setQuoteStatus: any;
  onSubmit: () => void;
  isPending: boolean;
  isDimensionsValid: boolean;
  isToAddressValid: boolean;
  isFromAddressValid: boolean;
}) {
  const isStep1Complete = isToAddressValid && isFromAddressValid;

  const steps = [
    {
      active: isStep1Complete,
      label: "Shipping Details",
      activeLabel: "Step 1: Shipping Details",
      Icon: ArrowRight,
    },
    {
      active: isDimensionsValid,
      label: "Dimensions & Weight",
      activeLabel: "Step 2: Dimensions & Weight",
      Icon: Package,
    },
  ];
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24">
      <div className="p-5 rounded-md  bg-white dark:bg-card space-y-4 shadow-lg mb-5">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="font-semibold text-lg">
            {isToAddressValid && isFromAddressValid
              ? "Shipment Overview"
              : "Quote Overview"}
          </h2>
          {/* {currentStep === 1 && <span className="text-primary text-sm flex items-center gap-1 cursor-pointer hover:underline"><Eye size={14} /> Hide</span>} */}
        </div>
        <div className="relative pt-2 pl-2">
          {/* Stepper Lines connecting steps */}
          <div className="absolute left-4.5 top-5 bottom-5 w-px bg-slate-200 dark:bg-slate-800 z-0 hidden lg:block"></div>
          <div className="space-y-6 relative z-10 mb-5">
            {steps.map((step) => (
              <div key={step.activeLabel} className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center text-xs ${
                    step.active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.active ? (
                    <div className="bg-primary text-white rounded-full p-1">
                      <Check size={10} />
                    </div>
                  ) : (
                    <div className="border border-muted-foreground/30 text-muted-foreground/30 rounded-full p-1 bg-white dark:bg-transparent">
                      <step.Icon
                        size={12}
                        className="text-muted-foreground/30"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between w-full items-center">
                  <span>{step.active ? step.activeLabel : step.label}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
          <Button
            variant="outline"
            onClick={() => {
              setQuoteStatus("SAVED");
              onSubmit();
            }}
            className="flex items-center justify-center gap-3 text-primary cursor-pointer hover:underline text-sm"
          >
            {isPending ? (
              <LoaderCircle className="animate-spin mr-2" size={16} />
            ) : (
              <Save size={16} />
            )}
            <span>Save For Later</span>
          </Button>
      </div>
      <PromoBannerWidget />
      </div>
    </div>
  );
}
