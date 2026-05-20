import { fmt } from "../../../lib/bill-calc";
import { Avatar, PersonTab } from "../atoms";

export default function StepTick({
  items,
  peopleArr,
  vat,
  service,
  result,
  activeItem,
  setActiveItem,
  activePid,
  setActivePid,
  tickMode,
  setTickMode,
  toggleEater,
  updateItem,
}) {
  const activeItemObj =
    items.find((x) => x.id === activeItem) || items[0] || null;
  const activePerson = peopleArr.find((p) => p.id === activePid);
  const activeIdx = peopleArr.findIndex((p) => p.id === activePid);

  return (
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
        {[
          ["item", "ทีละเมนู"],
          ["person", "ทีละคน"],
        ].map(([k, l]) => (
          <button
            type="button"
            key={k}
            onClick={() => setTickMode(k)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              tickMode === k ? "bg-gray-900 text-white" : "text-gray-700"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {tickMode === "item" && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
          ยังไม่มีเมนู — กลับไปที่ขั้น &quot;เมนู&quot; เพื่อเพิ่มก่อน
        </div>
      )}

      {tickMode === "item" && items.length > 0 && (
        <div>
          <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
            {items.map((it) => (
              <button
                type="button"
                key={it.id}
                onClick={() => setActiveItem(it.id)}
                className={`shrink-0 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs ${
                  activeItem === it.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                {it.name || "ไม่มีชื่อ"}
                <span className="ml-1.5 opacity-60">
                  {it.eaters.length}/{peopleArr.length}
                </span>
              </button>
            ))}
          </div>

          {activeItemObj &&
            (() => {
              const it = activeItemObj;
              const sub = it.price * it.qty;
              const discAmt =
                it.discount > 0
                  ? it.discountType === "baht"
                    ? it.discount
                    : (sub * it.discount) / 100
                  : 0;
              const lineTotal =
                (sub - discAmt) * (1 + vat / 100) * (1 + service / 100);
              return (
                <div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold">
                        {it.name || "ไม่มีชื่อ"}
                      </div>
                      <div className="mt-0.5 text-[11px] text-gray-500">
                        ฿{it.price} × {it.qty}
                        {discAmt > 0 ? ` − ฿${fmt(discAmt)}` : ""} → ฿
                        {fmt(lineTotal)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        คนละ
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        ฿
                        {it.eaters.length
                          ? fmt(lineTotal / it.eaters.length)
                          : "0.00"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                    {peopleArr.length === 0 ? (
                      <div className="px-4 py-4 text-center text-sm text-gray-500">
                        ยังไม่มีคน
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2.5">
                        {peopleArr.map((p, i) => {
                          const on = it.eaters.includes(p.id);
                          return (
                            <button
                              type="button"
                              key={p.id}
                              onClick={() => toggleEater(it.id, p.id)}
                              className={`flex flex-col items-center gap-1 rounded-lg border-2 px-1 py-2.5 ${
                                on
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-transparent"
                              }`}
                            >
                              <Avatar person={p} idx={i} size={40} />
                              <div className="truncate text-[11px] text-gray-700">
                                {p.name || `คน ${i + 1}`}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2 border-t border-gray-100 pt-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateItem(it.id, {
                            eaters: peopleArr.map((p) => p.id),
                          })
                        }
                        className="flex-1 rounded-md bg-gray-900 px-2 py-1.5 text-xs text-white"
                      >
                        ทุกคน
                      </button>
                      <button
                        type="button"
                        onClick={() => updateItem(it.id, { eaters: [] })}
                        className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700"
                      >
                        ล้าง
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      )}

      {tickMode === "person" && peopleArr.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
          ยังไม่มีคน
        </div>
      )}

      {tickMode === "person" && peopleArr.length > 0 && (
        <div>
          <div className="mb-2.5 flex gap-1.5 overflow-x-auto pb-1">
            {peopleArr.map((p, i) => (
              <PersonTab
                key={p.id}
                label={p.name || `คน ${i + 1}`}
                active={activePid === p.id}
                person={p}
                idx={i}
                onClick={() => setActivePid(p.id)}
              />
            ))}
          </div>

          {activePerson && (
            <div className="mb-2.5 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <Avatar person={activePerson} idx={activeIdx} size={40} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {activePerson.name || `คน ${activeIdx + 1}`}
                </div>
                <div className="text-[11px] text-gray-500">
                  กิน{" "}
                  {items.filter((it) => it.eaters.includes(activePid)).length}{" "}
                  เมนู
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  จ่าย
                </div>
                <div className="text-lg font-bold text-blue-600">
                  ฿{fmt(result.perPerson[activePid])}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {items.map((it) => {
              const on = it.eaters.includes(activePid);
              const sub = it.price * it.qty;
              const discAmt =
                it.discount > 0
                  ? it.discountType === "baht"
                    ? it.discount
                    : (sub * it.discount) / 100
                  : 0;
              const share =
                it.eaters.length > 0
                  ? ((sub - discAmt) *
                      (1 + vat / 100) *
                      (1 + service / 100)) /
                    it.eaters.length
                  : 0;
              return (
                <div
                  key={it.id}
                  onClick={() => toggleEater(it.id, activePid)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 ${
                    on
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white opacity-70"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      on
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {on && (
                      <svg width="10" height="8" viewBox="0 0 12 10">
                        <path
                          d="M1 5L4.5 8.5L11 1.5"
                          stroke="#fff"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {it.name || "ไม่มีชื่อ"}
                      {it.qty > 1 && (
                        <span className="ml-1 text-gray-500">× {it.qty}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      ฿{fmt(sub)} · หาร {it.eaters.length} คน
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      on ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {on ? `+฿${fmt(share)}` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
