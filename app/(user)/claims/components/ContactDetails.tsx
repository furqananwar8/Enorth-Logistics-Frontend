import React from "react";

// Props for the contact detail component – values will be passed from the selected shipment
export interface ShipmentDetailsProps {
  tracking: string;
  status: string;
  transaction: string;
  bol: string;
  shipmentDate: string;
  insuranceAmount: string;
  insuranceType: string;
  carrier: string;
  service: string;
  totalPrice: string;
  bookedBy: string;
}

export default function ContactDetails({
  tracking,
  status,
  transaction,
  bol,
  shipmentDate,
  insuranceAmount,
  insuranceType,
  carrier,
  service,
  totalPrice,
  bookedBy,
}: ShipmentDetailsProps) {
  return (
    <div className="bg-muted/30 border border-border p-4 rounded-md mb-6">
      <h2 className="text-lg font-semibold text-primary mb-4">Shipment Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <p><span className="font-medium">Tracking:</span> {tracking}</p>
        <p><span className="font-medium">Status:</span> {status}</p>
        <p><span className="font-medium">Transaction:</span> {transaction}</p>
        <p><span className="font-medium">BOL:</span> {bol}</p>
        <p><span className="font-medium">Shipment Date:</span> {shipmentDate}</p>
        <p><span className="font-medium">Insurance Amount:</span> {insuranceAmount}</p>
        <p><span className="font-medium">Insurance Type:</span> {insuranceType}</p>
        <p><span className="font-medium">Carrier:</span> {carrier}</p>
        <p><span className="font-medium">Service:</span> {service}</p>
        <p><span className="font-medium">Total Price:</span> {totalPrice}</p>
        <p><span className="font-medium">Booked By:</span> {bookedBy}</p>
      </div>
    </div>
  );
}
