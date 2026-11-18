import Link from "next/link";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadFailed } from "@/components/common/LoadFailed";
import { Pagination } from "@/components/common/Pagination";
import { SectionHeading } from "@/components/common/SectionHeading";
import { OrderList } from "@/components/orders/OrderList";
import { getOrders, load } from "@/lib/server/data";
import bellImage from "@/public/calendericon.svg";

export const metadata = { title: "Orders | Evento" };

function pageNumber(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function OrdersPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = pageNumber(searchParams.page);
  const loaded = await load(getOrders(page));
  const href = (n: number) => (n === 1 ? "/orders" : `/orders?page=${n}`);

  return (
    <Container className="mb-40 flex-grow pt-28">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Payments" title="Orders" />
          {loaded.data && loaded.data.count > 0 && (
            <p className="font-nunito text-[14px] font-[600] text-[#676767]">
              {loaded.data.count} {loaded.data.count === 1 ? "order" : "orders"}
            </p>
          )}
        </div>

        {loaded.error ? (
          <LoadFailed unavailable={loaded.error.unavailable} />
        ) : loaded.data.data.length > 0 ? (
          <>
            <OrderList orders={loaded.data.data} />
            <div className="flex justify-center">
              <Pagination page={page} totalPages={loaded.data.total_pages} href={href} />
            </div>
          </>
        ) : (
          <EmptyState image={bellImage} title={page > 1 ? "No orders on this page" : "No orders yet"}>
            {page > 1 ? (
              <Link className="text-brand" href="/orders">
                Back to the latest
              </Link>
            ) : (
              <>
                Tickets you buy for paid events will show up here.{" "}
                <Link className="text-brand" href="/home">
                  Explore events
                </Link>
              </>
            )}
          </EmptyState>
        )}
      </div>
    </Container>
  );
}
