import { SdiHandshake } from "@/src/components/sdi/SdiHandshake";

export default function IdentityPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <SdiHandshake requiredVerificationTypes={[]} />
    </div>
  );
}
