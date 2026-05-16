import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { listDivinations } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "测算记录",
};

export default async function DivinationsPage() {
  const user = await requireUser();
  const data = await listDivinations(user.id);

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <CardTitle>测算记录</CardTitle>
        <Link href="/divinations/new" className="text-sm text-muted-foreground">
          发起新测算
        </Link>
      </div>
      <div className="space-y-3">
        {data?.map((item) => (
          <Link
            key={item.id}
            href={`/divinations/${item.id}`}
            className="block rounded-[1.4rem] bg-white/55 p-4 hover:bg-white/78"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.28em] text-muted-foreground">
                  {item.divination_type}
                </p>
                <p className="mt-2 text-sm leading-7">{item.question}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{item.status}</p>
                <p>{formatDateTime(item.created_at)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
