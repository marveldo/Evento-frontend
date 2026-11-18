import Link from "next/link";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { PaymentCallback } from "@/components/payments/PaymentCallback";
import bellImage from "@/public/calendericon.svg";

export const metadata = { title: "Confirming payment | Evento" };

export default function PaymentCallbackPage({ searchParams }: { searchParams: { reference?: string; trxref?: string } }) {
  const reference = searchParams.reference ?? searchParams.trxref ?? "";
  return (
    <Container className="mb-40 flex flex-grow items-center justify-center pt-28">
      {reference ? (
        <PaymentCallback reference={reference} />
      ) : (
        <EmptyState image={bellImage} title="Payment not found">
          <Link href="/home" className="text-brand underline">
            Back to events
          </Link>
        </EmptyState>
      )}
    </Container>
  );
}
