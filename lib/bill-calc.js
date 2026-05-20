// Pure calculation + helpers ported from design_handoff_bill_splitter/shared.jsx.
// Pipeline (Thai standard order):
//   1. For each item: sub = price * qty, then itemDiscount (% or ฿), lineNet = sub - itemDiscAmt.
//   2. foodTotal = sum(lineNet); per-person subtotal from lineNet / eaters.
//   3. billDiscount (% or ฿) applied proportionally to foodTotal.
//   4. VAT % and Service % applied to (foodTotal - billDiscount), distributed proportionally.
//   5. Per-person discount (% or ฿) applied per person AFTER the above.
//      - if %, applied against (subtotal - billDiscShare) so the % feels intuitive
//      - clamped so each person's final total is ≥ 0
export function calculate({
  items,
  people,
  vat = 0,
  service = 0,
  discount = 0,
  discountType = "percent",
}) {
  const subtotal = {};
  people.forEach((p) => {
    subtotal[p.id] = 0;
  });

  const lines = items.map((it) => {
    const eaters = it.eaters || [];
    const qty = it.qty || 1;
    const sub = (it.price || 0) * qty;
    let itemDiscAmt = 0;
    if (it.discount && it.discount > 0) {
      itemDiscAmt =
        it.discountType === "baht" ? it.discount : (sub * it.discount) / 100;
    }
    itemDiscAmt = Math.min(itemDiscAmt, sub);
    const lineNet = sub - itemDiscAmt;
    const share = eaters.length > 0 ? lineNet / eaters.length : 0;
    eaters.forEach((pid) => {
      if (subtotal[pid] != null) subtotal[pid] += share;
    });
    return { ...it, sub, itemDiscAmt, lineNet, share };
  });

  const foodTotal = lines.reduce((s, l) => s + l.lineNet, 0);

  let billDiscAmt =
    discountType === "percent" ? (foodTotal * discount) / 100 : discount;
  billDiscAmt = Math.min(Math.max(0, billDiscAmt), foodTotal);

  const baseAfterDisc = foodTotal - billDiscAmt;
  const vatAmt = (baseAfterDisc * (vat || 0)) / 100;
  const serviceAmt = (baseAfterDisc * (service || 0)) / 100;

  // perPerson[id] = final total (number) — kept as a number for the existing
  // mobile wizard which reads it directly. Detailed breakdown lives in
  // perPersonDetail[id] for the new desktop layout.
  const perPerson = {};
  const perPersonDetail = {};
  let personalDiscTotal = 0;
  people.forEach((p) => {
    const sub = subtotal[p.id] || 0;
    const ratio =
      foodTotal > 0 ? sub / foodTotal : 1 / Math.max(1, people.length);
    const billDiscShare = billDiscAmt * ratio;
    const vatShare = vatAmt * ratio;
    const svcShare = serviceAmt * ratio;
    const beforePD = sub - billDiscShare + vatShare + svcShare;

    let pd = 0;
    if (p.discount && p.discount > 0) {
      pd =
        p.discountType === "percent"
          ? ((sub - billDiscShare) * p.discount) / 100
          : p.discount;
    }
    pd = Math.min(Math.max(0, pd), Math.max(0, beforePD));
    personalDiscTotal += pd;

    const total = Math.max(0, beforePD - pd);
    perPerson[p.id] = total;
    perPersonDetail[p.id] = {
      subtotal: sub,
      billDiscShare,
      vatShare,
      svcShare,
      personalDiscount: pd,
      total,
    };
  });

  const subtotalAll = lines.reduce((s, l) => s + l.sub, 0);
  const itemDiscTotal = lines.reduce((s, l) => s + l.itemDiscAmt, 0);
  const grossTotal = baseAfterDisc + vatAmt + serviceAmt;
  const finalTotal = grossTotal - personalDiscTotal;

  return {
    lines,
    perPerson,
    perPersonDetail,
    subtotal: subtotalAll,
    itemDiscTotal,
    vatAmt,
    serviceAmt,
    billDiscAmt,
    personalDiscTotal,
    grossTotal,
    finalTotal,
  };
}

export function fmt(n) {
  if (n == null || isNaN(n)) return "0.00";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function fmt0(n) {
  if (n == null || isNaN(n)) return "0";
  return Math.round(n).toLocaleString("en-US");
}

// Avatar color palette as Tailwind class pairs [bg, text].
// 8 hues — cycled by index across the people list.
export const AVATAR_PALETTE = [
  ["bg-blue-100", "text-blue-700"],
  ["bg-green-100", "text-green-700"],
  ["bg-purple-100", "text-purple-700"],
  ["bg-pink-100", "text-pink-700"],
  ["bg-yellow-100", "text-yellow-700"],
  ["bg-teal-100", "text-teal-700"],
  ["bg-orange-100", "text-orange-700"],
  ["bg-indigo-100", "text-indigo-700"],
];

export function seedPeople(count) {
  const arr = [];
  const base = Date.now();
  for (let i = 0; i < count; i++) {
    arr.push({ id: `p${base}_${i}`, name: "", discount: 0, discountType: "baht" });
  }
  return arr;
}
