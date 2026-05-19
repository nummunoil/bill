import { fmt, fmt0 } from "../../../lib/bill-calc";
import { Avatar, PersonTab, Eyebrow } from "../atoms";

function NumField({ label, value, onChange }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <input
        type="number"
        value={value || 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full border-0 border-b border-gray-200 bg-transparent px-0 pb-0.5 pt-1 text-base font-semibold outline-none focus:border-blue-600 focus:ring-0"
      />
    </div>
  );
}

function Row({ label, v, dim, big, accent }) {
  const color = dim
    ? "text-gray-500"
    : accent
    ? "text-blue-700"
    : "text-gray-900";
  return (
    <div
      className={`flex justify-between py-0.5 ${color} ${
        big ? "text-base font-bold" : "text-sm font-medium"
      }`}
    >
      <span>{label}</span>
      <span>฿{fmt(v)}</span>
    </div>
  );
}

export default function StepSummary({
  peopleArr,
  items,
  vat,
  setVat,
  service,
  setService,
  billDiscount,
  setBillDiscount,
  billDiscountType,
  setBillDiscountType,
  result,
  summaryPid,
  setSummaryPid,
}) {
  const isAll = summaryPid === "all";
  const activePerson = peopleArr.find((p) => p.id === summaryPid);
  const activeIdx = peopleArr.findIndex((p) => p.id === summaryPid);

  return (
    <div>
      <div className="mb-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-3">
        <Eyebrow>ค่าใช้จ่าย</Eyebrow>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <NumField label="VAT %" value={vat} onChange={setVat} />
          <NumField label="Service %" value={service} onChange={setService} />
        </div>

        <div className="mt-3">
          <Eyebrow>ส่วนลดทั้งบิล</Eyebrow>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              type="number"
              value={billDiscount || ""}
              placeholder="0"
              onChange={(e) =>
                setBillDiscount(parseFloat(e.target.value) || 0)
              }
              className="w-20 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-semibold outline-none focus:border-blue-600"
            />
            <div className="inline-flex shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
              {["percent", "baht"].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setBillDiscountType(t)}
                  className={`px-3 py-1.5 text-xs font-semibold ${
                    billDiscountType === t
                      ? "bg-gray-900 text-white"
                      : "text-gray-700"
                  }`}
                >
                  {t === "percent" ? "%" : "฿"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="my-2.5 h-px bg-gray-100" />
        <Row label="ค่าอาหาร" v={result.subtotal} />
        {result.itemDiscTotal > 0 && (
          <Row label="ส่วนลดเมนู" v={-result.itemDiscTotal} accent />
        )}
        <Row label={`VAT ${vat}%`} v={result.vatAmt} dim />
        <Row label={`Service ${service}%`} v={result.serviceAmt} dim />
        {result.billDiscAmt > 0 && (
          <Row label="ส่วนลดบิล" v={-result.billDiscAmt} accent />
        )}
        <Row label="รวม" v={result.finalTotal} big />
      </div>

      <Eyebrow className="pb-1.5">คนละเท่าไหร่</Eyebrow>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <PersonTab
          label="ทั้งบิล"
          active={isAll}
          muted
          onClick={() => setSummaryPid("all")}
          rightLabel={`฿${fmt0(result.finalTotal)}`}
        />
        {peopleArr.map((p, i) => (
          <PersonTab
            key={p.id}
            label={p.name || `คน ${i + 1}`}
            active={summaryPid === p.id}
            person={p}
            idx={i}
            onClick={() => setSummaryPid(p.id)}
            rightLabel={`฿${fmt0(result.perPerson[p.id])}`}
          />
        ))}
      </div>

      <div className="mt-2.5 rounded-xl border border-gray-200 bg-white p-1.5">
        {isAll ? (
          peopleArr.length === 0 ? (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              ยังไม่มีคน
            </div>
          ) : (
            peopleArr.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 px-3 py-2.5 ${
                  i === peopleArr.length - 1
                    ? ""
                    : "border-b border-gray-100"
                }`}
              >
                <Avatar person={p} idx={i} size={30} />
                <span className="flex-1 truncate text-sm">
                  {p.name || `คน ${i + 1}`}
                </span>
                <span className="mr-2 text-xs text-gray-500">
                  {items.filter((it) => it.eaters.includes(p.id)).length} เมนู
                </span>
                <span className="text-base font-bold">
                  ฿{fmt(result.perPerson[p.id])}
                </span>
              </div>
            ))
          )
        ) : (
          <div className="p-1">
            {(() => {
              const eaten = items.filter((it) =>
                it.eaters.includes(summaryPid),
              );
              if (eaten.length === 0)
                return (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    {activePerson?.name || `คน ${activeIdx + 1}`} ยังไม่ได้กินอะไร
                  </div>
                );
              return (
                <>
                  {eaten.map((it, i, arr) => {
                    const sub = it.price * it.qty;
                    const discAmt =
                      it.discount > 0
                        ? it.discountType === "baht"
                          ? it.discount
                          : (sub * it.discount) / 100
                        : 0;
                    const share =
                      ((sub - discAmt) *
                        (1 + vat / 100) *
                        (1 + service / 100)) /
                      it.eaters.length;
                    return (
                      <div
                        key={it.id}
                        className={`flex items-center justify-between px-2.5 py-2 ${
                          i === arr.length - 1 ? "" : "border-b border-gray-100"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {it.name || "ไม่มีชื่อ"}
                            {it.qty > 1 && (
                              <span className="ml-1 text-gray-500">
                                ×{it.qty}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            หาร {it.eaters.length} คน
                          </div>
                        </div>
                        <span className="text-sm font-semibold">
                          ฿{fmt(share)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="mt-1 flex justify-between border-t border-dashed border-gray-300 px-2.5 pb-1 pt-2.5">
                    <span className="text-sm font-bold">
                      รวมที่{" "}
                      {activePerson?.name || `คน ${activeIdx + 1}`} ต้องจ่าย
                    </span>
                    <span className="text-lg font-bold text-blue-700">
                      ฿{fmt(result.perPerson[summaryPid])}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
