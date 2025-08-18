import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentAddressSectionProps {
  address: string;
  city: string;
  state: string;
  pincode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
}

const PaymentAddressSection = ({ 
  address, 
  city, 
  state, 
  pincode, 
  onChange, 
  readOnly 
}: PaymentAddressSectionProps) => {
  if (!address && !city && !state && !pincode) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          readOnly={readOnly}
          className={readOnly ? "bg-gray-50" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          value={city}
          onChange={onChange}
          placeholder="City"
          readOnly={readOnly}
          className={readOnly ? "bg-gray-50" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          name="state"
          value={state}
          onChange={onChange}
          placeholder="State"
          readOnly={readOnly}
          className={readOnly ? "bg-gray-50" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pincode">Pincode</Label>
        <Input
          id="pincode"
          name="pincode"
          value={pincode}
          onChange={onChange}
          placeholder="Pincode"
          readOnly={readOnly}
          className={readOnly ? "bg-gray-50" : ""}
        />
      </div>
    </div>
  );
};

export default PaymentAddressSection;
