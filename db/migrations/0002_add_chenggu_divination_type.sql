alter table public.divinations
drop constraint if exists divinations_divination_type_check;

alter table public.divinations
add constraint divinations_divination_type_check
check (divination_type in ('bazi', 'ziwei', 'qimen', 'meihua', 'liuyao', 'chenggu', 'custom'));
