import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { OrderListSkeleton } from "@/components/orders/OrderList";

export default function OrdersLoading() {
  return (
    <Container className="mb-40 flex-grow pt-28">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-y-8">
        <SectionHeading eyebrow="Payments" title="Orders" />
        <OrderListSkeleton />
      </div>
    </Container>
  );
}
