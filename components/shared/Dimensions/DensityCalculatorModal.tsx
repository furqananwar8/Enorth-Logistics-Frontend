"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calculator } from "lucide-react"

import { NmfcCodeRequestModal } from "./NmfcCodeRequestModal"
export const calculateClass = (
  length: number | string,
  width: number | string,
  height: number | string,
  weight: number | string,
  unit: "IMPERIAL" | "METRIC" | undefined
) => {
  const l = Number(length) || 0;
  const w = Number(width) || 0;
  const h = Number(height) || 0;
  const wt = Number(weight) || 0;

  console.log("[calculateClass] inputs:", { l, w, h, wt, unit });

  if (!l || !w || !h || !wt) {
    console.log("[calculateClass] early return — missing value");
    return undefined;
  }

  let lbs = wt;
  let cuFt = (l * w * h) / 1728;

  if (unit === "METRIC") {
    const lIn = l * 0.393701;
    const wIn = w * 0.393701;
    const hIn = h * 0.393701;
    lbs = wt * 2.20462;
    cuFt = (lIn * wIn * hIn) / 1728;
  }

  console.log("[calculateClass] cuFt:", cuFt, "lbs:", lbs);

  if (!isFinite(cuFt) || cuFt <= 0) {
    console.log("[calculateClass] invalid cuFt");
    return undefined;
  }

  const rawDensity = lbs / cuFt;
  const density = Math.round(rawDensity * 10) / 10;

  console.log("[calculateClass] density:", density);

  let estimatedClass = "500";
  if (density >= 50) estimatedClass = "50";
  else if (density >= 35) estimatedClass = "55";
  else if (density >= 30) estimatedClass = "60";
  else if (density >= 22.5) estimatedClass = "65";
  else if (density >= 15) estimatedClass = "70";
  else if (density >= 13.5) estimatedClass = "77.5";
  else if (density >= 12) estimatedClass = "85";
  else if (density >= 10.5) estimatedClass = "92.5";
  else if (density >= 9) estimatedClass = "100";
  else if (density >= 8) estimatedClass = "110";
  else if (density >= 7) estimatedClass = "125";
  else if (density >= 6) estimatedClass = "150";
  else if (density >= 5) estimatedClass = "175";
  else if (density >= 4) estimatedClass = "200";
  else if (density >= 3) estimatedClass = "250";
  else if (density >= 2) estimatedClass = "300";
  else if (density >= 1) estimatedClass = "400";

  console.log("[calculateClass] result:", { density, classEstim: estimatedClass });
  return { density: Number(density.toFixed(2)), classEstim: estimatedClass };
};
export const DensityCalculatorModal = () => {
    const [unit, setUnit] = useState<"IMPERIAL" | "METRIC">("IMPERIAL")
    const [length, setLength] = useState<number>(0)
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [weight, setWeight] = useState<number>(0)
    const [result, setResult] = useState<{ density: number, classEstim: string } | null>(null)

    const handleReset = () => {
        setLength(0)
        setWidth(0)
        setHeight(0)
        setWeight(0)
        setResult(null)
    }
    // handle Calculate class
    const handleCalculateClass = () => {
        const res = calculateClass(length, width, height, weight, unit)
        setResult(res ?? null)
    }
    // make this a utility so that it can be used in the dimensions component


    return (
        <Dialog onOpenChange={(open) => !open && handleReset()}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-primary dark:text-accent">
                    <Calculator size={16} /> Class & Density Calculator
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl! p-0 gap-0 border-0 rounded-lg overflow-hidden">
                <DialogHeader className="p-4 border-b bg-gray-50/50">
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
                        <Calculator size={20} className="text-gray-800 dark:text-white" /> Class & Density Calculator
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <div className="border border-gray-200 rounded-md p-4 mb-6 bg-white dark:bg-primary/10 shrink-0">
                        <h4 className="font-semibold mb-3 text-slate-800 dark:text-white">Please Note:</h4>
                        <p className="text-slate-600 text-sm mb-3">
                            <strong className="text-slate-800 dark:text-white">A)</strong> The density calculator is available only as an <strong className="text-slate-800 dark:text-white">estimation</strong> tool to provide the recommended freight class.
                        </p>
                        <p className="text-slate-600 text-sm">
                            <strong className="text-slate-800 dark:text-white">B)</strong> If you're unsure of your product's <strong className="text-slate-800">Freight Class and/or NMFC Class</strong> and require assistance, please <NmfcCodeRequestModal />.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-md p-6 bg-white dark:bg-primary/10 shadow-sm shrink-0">
                        <div className="flex justify-end mb-6 w-full">
                            <RadioGroup value={unit} onValueChange={(val: "IMPERIAL" | "METRIC") => { setUnit(val); handleReset() }} className="flex space-x-6">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="METRIC" id="metric-calc" className={unit === "METRIC" ? "text-amber-500 border-amber-500" : ""} />
                                    <Label htmlFor="metric-calc" className={`cursor-pointer flex items-center gap-1 ${unit === "METRIC" ? "font-semibold text-slate-800" : "font-normal text-slate-500"}`}>
                                        Metric <span className="hidden sm:inline">(cm & kg)</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="IMPERIAL" id="imperial-calc" className={unit === "IMPERIAL" ? "text-amber-500 border-amber-500" : ""} />
                                    <Label htmlFor="imperial-calc" className={`cursor-pointer ${unit === "IMPERIAL" ? "font-semibold text-slate-800" : "font-normal text-slate-500"}`}>
                                        Imperial <span className="hidden sm:inline">(in & lbs)</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div>
                                <Label className="text-slate-500 font-normal mb-1 block">Length ({unit === "IMPERIAL" ? "in" : "cm"})*</Label>
                                <Input
                                    type="number"
                                    placeholder={`00 (${unit === "IMPERIAL" ? "in" : "cm"})`}
                                    value={length} onChange={(e) => setLength(Number(e.target.value))}
                                    className="focus-visible:ring-amber-500 border-gray-300"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-500 font-normal mb-1 block">Width ({unit === "IMPERIAL" ? "in" : "cm"})*</Label>
                                <Input
                                    type="number"
                                    placeholder={`00 (${unit === "IMPERIAL" ? "in" : "cm"})`}
                                    value={width} onChange={(e) => setWidth(Number(e.target.value))}
                                    className="focus-visible:ring-amber-500 border-gray-300"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-500 font-normal mb-1 block">Height ({unit === "IMPERIAL" ? "in" : "cm"})*</Label>
                                <Input
                                    type="number"
                                    placeholder={`00 (${unit === "IMPERIAL" ? "in" : "cm"})`}
                                    value={height} onChange={(e) => setHeight(Number(e.target.value))}
                                    className="focus-visible:ring-amber-500 border-gray-300"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-500 font-normal mb-1 block">Weight ({unit === "IMPERIAL" ? "lbs" : "kg"})*</Label>
                                <Input
                                    type="number"
                                    placeholder={`00 (${unit === "IMPERIAL" ? "lbs" : "kg"})`}
                                    value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                                    className="focus-visible:ring-amber-500 border-gray-300"
                                />
                            </div>
                        </div>

                        {result && (
                            <div className="bg-blue-50 dark:bg-primary/10 border border-blue-100 rounded-md p-4 mb-6 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-blue-700">Calculated Density: <span className="font-semibold">{result.density} lbs/ft³</span></p>
                                </div>
                                <div>
                                    <p className="text-lg text-blue-800 font-bold">Estimated Class: {result.classEstim}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end items-center gap-4 border-t pt-4">
                            <button type="button" onClick={handleReset} className="text-primary text-sm font-medium hover:underline">
                                Reset
                            </button>
                            <Button disabled={!length || !width || !height || !weight} type="button" onClick={handleCalculateClass}>
                                Calculate Class
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-primary/10 p-4 rounded-md border text-center md:text-left">
                        <strong>Disclaimer:</strong> While density is the primary determinant in establishing the class using the National Motor Freight Classification system, other factors such as the value of the product, handling characteristics (storability on a trailer), claim susceptibility, etc., are also relevant. The recommended NMFC class is NOT an absolute. The most effective way to determine an accurate class is to abide by the NMFC codes and their associated class for that particular commodity.
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}
