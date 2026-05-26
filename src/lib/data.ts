import type { User } from "better-auth";
import type { PoolClient } from "pg";
import { query, withTransaction } from "@/lib/db";
import type { CreditPackId } from "@/lib/billing/plans";
import { buildBaziChart } from "@/lib/divination/adapters/bazi";
import {
  TRUMP_SAMPLE_BAZI_INPUT,
  TRUMP_SAMPLE_DIVINATION_KEY,
} from "@/lib/divination/sample-records";
import { hasDatabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

type AppUserRow = Database["public"]["Tables"]["users"]["Row"];
type DivinationRow = Database["public"]["Tables"]["divinations"]["Row"];
type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type StripeCheckoutSessionRow = Database["public"]["Tables"]["stripe_checkout_sessions"]["Row"];

export type DivinationSummaryRow = Pick<
  DivinationRow,
  | "id"
  | "divination_type"
  | "subject_name"
  | "question"
  | "status"
  | "created_at"
  | "input_params"
  | "chart_json"
>;

interface DbUserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  auth_provider: string;
  locale: string | null;
  timezone: string | null;
  stripe_customer_id: string | null;
  subscription_status: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export async function ensureUserProfile(user: User) {
  await query(
    `
      with sync_lock as (
        select pg_advisory_xact_lock(hashtextextended($2, 0))
      )
      insert into public.users (
        id,
        email,
        full_name,
        avatar_url,
        auth_provider
      )
      select $1, $2, $3, $4, $5
      from sync_lock
      on conflict (id) do update
      set
        email = excluded.email,
        full_name = coalesce(excluded.full_name, public.users.full_name),
        avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url),
        auth_provider = excluded.auth_provider
    `,
    [user.id, user.email, user.name ?? null, user.image ?? null, "better_auth"],
  );
}

export async function getUserProfile(userId: string) {
  const result = await query<DbUserProfile>(
    `select * from public.users where id = $1 limit 1`,
    [userId],
  );

  return (result.rows[0] ?? null) as AppUserRow | null;
}

export async function listRecentDivinations(userId: string, limit = 5) {
  const result = await query<DivinationRow>(
    `
      select * from public.divinations
      where user_id = $1
      order by created_at desc
      limit $2
    `,
    [userId, limit],
  );

  return result.rows as DivinationRow[];
}

export async function ensureTrumpSampleDivinationForUser(user: User) {
  await ensureUserProfile(user);

  const { chart, birthGregorian, birthLunar } = buildBaziChart(TRUMP_SAMPLE_BAZI_INPUT);
  const inputParams = {
    ...TRUMP_SAMPLE_BAZI_INPUT,
    sampleKey: TRUMP_SAMPLE_DIVINATION_KEY,
  };
  const sampleMarkdown = [
    "# 测试记录",
    "",
    "这是一条系统自动生成的特朗普八字测试记录，用于产品内体验排盘、记录列表与后续 AI 解读流程。",
    "",
    "- 生日：1946-06-14",
    "- 时间：10:54",
    "- 地点：Queens, New York, United States",
  ].join("\n");

  await query(
    `
      insert into public.divinations (
        user_id,
        divination_type,
        subject_name,
        birth_gregorian,
        birth_lunar,
        gender,
        question,
        input_params,
        chart_json,
        ai_result_markdown,
        ai_model,
        status
      )
      select
        $1,
        'bazi',
        $2,
        $3,
        $4::jsonb,
        $5,
        $6,
        $7::jsonb,
        $8::jsonb,
        $9,
        'system-sample',
        'completed'
      where not exists (
        select 1
        from public.divinations
        where user_id = $1
          and input_params ->> 'sampleKey' = $10
      )
    `,
    [
      user.id,
      TRUMP_SAMPLE_BAZI_INPUT.subjectName,
      birthGregorian,
      JSON.stringify(birthLunar),
      TRUMP_SAMPLE_BAZI_INPUT.gender,
      TRUMP_SAMPLE_BAZI_INPUT.question,
      JSON.stringify(inputParams),
      JSON.stringify(chart),
      sampleMarkdown,
      TRUMP_SAMPLE_DIVINATION_KEY,
    ],
  );
}

export async function listDivinations(userId: string) {
  const result = await query<DivinationRow>(
    `
      select * from public.divinations
      where user_id = $1
      order by created_at desc
    `,
    [userId],
  );

  return result.rows as DivinationRow[];
}

export async function listDivinationSummaries(userId: string) {
  const result = await query<DivinationSummaryRow>(
    `
      select
        id,
        divination_type,
        subject_name,
        question,
        status,
        created_at,
        input_params,
        chart_json
      from public.divinations
      where user_id = $1
      order by created_at desc
    `,
    [userId],
  );

  return result.rows as DivinationSummaryRow[];
}

export async function getDivinationById(userId: string, id: string) {
  const result = await query<DivinationRow>(
    `
      select * from public.divinations
      where id = $1 and user_id = $2
      limit 1
    `,
    [id, userId],
  );

  return result.rows[0] ?? null;
}

export async function insertDivination(input: {
  userId: string;
  divinationType: string;
  subjectName: string | null;
  birthGregorian: string;
  birthLunar: unknown;
  gender: string;
  question: string;
  inputParams: unknown;
  chartJson: unknown;
}) {
  const result = await query<DivinationRow>(
    `
      insert into public.divinations (
        user_id,
        divination_type,
        subject_name,
        birth_gregorian,
        birth_lunar,
        gender,
        question,
        input_params,
        chart_json,
        status
      )
      values ($1, $2, $3, $4, $5::jsonb, $6, $7, $8::jsonb, $9::jsonb, 'pending')
      returning *
    `,
    [
      input.userId,
      input.divinationType,
      input.subjectName,
      input.birthGregorian,
      JSON.stringify(input.birthLunar),
      input.gender,
      input.question,
      JSON.stringify(input.inputParams),
      JSON.stringify(input.chartJson),
    ],
  );

  return result.rows[0];
}

export async function updateDivinationResult(input: {
  id: string;
  userId: string;
  markdown: string;
  aiModel: string;
}) {
  await query(
    `
      update public.divinations
      set
        ai_result_markdown = $3,
        ai_model = $4,
        status = 'completed',
        updated_at = timezone('utc', now())
      where id = $1 and user_id = $2
    `,
    [input.id, input.userId, input.markdown, input.aiModel],
  );
}

export async function listPublishedPosts() {
  if (!hasDatabaseEnv()) {
    return [] as PostRow[];
  }

  const result = await query<PostRow>(
    `
      select * from public.posts
      where published_at is not null
      order by published_at desc
    `,
  );

  return result.rows as PostRow[];
}

export async function getPublishedPostBySlug(slug: string) {
  if (!hasDatabaseEnv()) {
    return null;
  }

  const result = await query<PostRow>(
    `
      select * from public.posts
      where slug = $1
      limit 1
    `,
    [slug],
  );

  return result.rows[0] ?? null;
}

export async function upsertAutomationPost(input: {
  slug: string;
  title: string;
  content: string;
  metaDescription: string | null;
  tags: string[];
  publishedAt: string;
}) {
  const result = await query<PostRow>(
    `
      insert into public.posts (
        slug,
        title,
        content,
        meta_description,
        tags,
        source,
        published_at
      )
      values ($1, $2, $3, $4, $5::text[], 'automation', $6)
      on conflict (slug) do update
      set
        title = excluded.title,
        content = excluded.content,
        meta_description = excluded.meta_description,
        tags = excluded.tags,
        source = excluded.source,
        published_at = excluded.published_at,
        updated_at = timezone('utc', now())
      returning *
    `,
    [
      input.slug,
      input.title,
      input.content,
      input.metaDescription,
      input.tags,
      input.publishedAt,
    ],
  );

  return result.rows[0];
}

export async function upsertStripeCheckoutSession(input: {
  sessionId: string;
  userId: string;
  planId: CreditPackId;
  credits: number;
  amountTotal: number;
  currency: string;
  stripeCustomerId: string | null;
  stripePaymentIntentId?: string | null;
  stripeStatus: string;
  paymentStatus: string;
}) {
  await query(
    `
      insert into public.stripe_checkout_sessions (
        session_id,
        user_id,
        stripe_customer_id,
        stripe_payment_intent_id,
        plan_id,
        credits,
        amount_total,
        currency,
        stripe_status,
        payment_status
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      on conflict (session_id) do update
      set
        stripe_customer_id = coalesce(excluded.stripe_customer_id, public.stripe_checkout_sessions.stripe_customer_id),
        stripe_payment_intent_id = coalesce(excluded.stripe_payment_intent_id, public.stripe_checkout_sessions.stripe_payment_intent_id),
        plan_id = excluded.plan_id,
        credits = excluded.credits,
        amount_total = excluded.amount_total,
        currency = excluded.currency,
        stripe_status = excluded.stripe_status,
        payment_status = excluded.payment_status,
        updated_at = timezone('utc', now())
    `,
    [
      input.sessionId,
      input.userId,
      input.stripeCustomerId,
      input.stripePaymentIntentId ?? null,
      input.planId,
      input.credits,
      input.amountTotal,
      input.currency,
      input.stripeStatus,
      input.paymentStatus,
    ],
  );
}

async function getStripeCheckoutSessionForUpdate(client: PoolClient, sessionId: string) {
  const result = await client.query<StripeCheckoutSessionRow>(
    `
      select *
      from public.stripe_checkout_sessions
      where session_id = $1
      for update
    `,
    [sessionId],
  );

  return result.rows[0] ?? null;
}

export async function fulfillStripeCheckoutSession(input: {
  sessionId: string;
  userId: string;
  stripeCustomerId: string | null;
  stripePaymentIntentId?: string | null;
  planId: CreditPackId;
  credits: number;
  amountTotal: number;
  currency: string;
  stripeStatus: string;
  paymentStatus: string;
}) {
  return withTransaction(async (client) => {
    await client.query(
      `
        insert into public.stripe_checkout_sessions (
          session_id,
          user_id,
          stripe_customer_id,
          stripe_payment_intent_id,
          plan_id,
          credits,
          amount_total,
          currency,
          stripe_status,
          payment_status
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        on conflict (session_id) do nothing
      `,
      [
        input.sessionId,
        input.userId,
        input.stripeCustomerId,
        input.stripePaymentIntentId ?? null,
        input.planId,
        input.credits,
        input.amountTotal,
        input.currency,
        input.stripeStatus,
        input.paymentStatus,
      ],
    );

    const checkoutSession = await getStripeCheckoutSessionForUpdate(client, input.sessionId);

    if (!checkoutSession) {
      throw new Error("Stripe checkout session record was not found.");
    }

    if (!checkoutSession.fulfilled_at) {
      await client.query(
        `
          update public.users
          set
            credits = credits + $2,
            stripe_customer_id = coalesce($3, stripe_customer_id),
            updated_at = timezone('utc', now())
          where id = $1
        `,
        [input.userId, checkoutSession.credits, input.stripeCustomerId],
      );
    }

    await client.query(
      `
        update public.stripe_checkout_sessions
        set
          stripe_customer_id = coalesce($2, stripe_customer_id),
          stripe_payment_intent_id = coalesce($3, stripe_payment_intent_id),
          stripe_status = $4,
          payment_status = $5,
          fulfilled_at = coalesce(fulfilled_at, timezone('utc', now())),
          updated_at = timezone('utc', now())
        where session_id = $1
      `,
      [
        input.sessionId,
        input.stripeCustomerId,
        input.stripePaymentIntentId ?? null,
        input.stripeStatus,
        input.paymentStatus,
      ],
    );

    return {
      fulfilled: !checkoutSession.fulfilled_at,
      creditsGranted: checkoutSession.fulfilled_at ? 0 : checkoutSession.credits,
    };
  });
}
