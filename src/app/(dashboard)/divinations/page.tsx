import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/utils";

export default async function DivinationsPage() {
  const user = await requireUser();
  const supabase = await getServerSupabaseClient();
  const { data: rawData } = await supabase
    .from("divinations")
    .select("id, divination_type, question, created_at, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const data = (rawData ?? []) as Array<{
    id: string;
    divination_type: string;
    question: string;
    created_at: string;
    status: string;
  }>;

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
