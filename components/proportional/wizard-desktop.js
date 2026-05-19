import { fmt } from "../../lib/bill-calc";
import { Avatar, Eyebrow } from "./atoms";

// 3-column "Bill Splitter v2" layout: People | Items | Summary.
// Locked grid (320 | 1fr | 340) per design handoff — no responsive collapse.

function PersonCard({
  person,
  idx,
  selected,
  total,
  personalDiscount,
  onClick,
  onUpdate,
  onRemove,
}) {
  const hasDisc = (Number(person.discount) || 0) > 0;
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition ${
        selected
          ? "border-blue-600 ring-1 ring-blue-600"
          : "border-gray-200"
      }`}
    >
      <div
        className="flex cursor-pointer items-center gap-2.5 px-3 py-2.5"
        onClick={onClick}
      >
        <Avatar person={person} idx={idx} size={30} />
        <input
          value={person.name}
          placeholder={`คน ${idx + 1}`}
          onChange={(e) => onUpdate(person.id, { name: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="min-w-0 flex-1 border-0 bg-transparent py-1 text-sm font-semibold leading-6 outline-none focus:ring-0"
        />
        <div className="text-sm font-bold text-gray-900">฿{fmt(total)}</div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(person.id);
          }}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-xs leading-none text-gray-500 hover:bg-gray-50"
          title="ลบ"
        >
          ×
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-dashed border-gray-200 bg-gray-50 px-3 py-2">
        <div className="text-xs font-medium text-gray-700">ส่วนลด</div>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={person.discount || ""}
            placeholder="0"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              onUpdate(person.id, {
                discount: parseFloat(e.target.value) || 0,
              })
            }
            className={`w-16 rounded-md border bg-white px-2 py-1 text-right text-xs font-semibold outline-none focus:border-blue-600 ${
              hasDisc ? "border-blue-600" : "border-gray-200"
            }`}
          />
          <div className="inline-flex overflow-hidden rounded-md border border-gray-200 bg-white">
            {["baht", "percent"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(person.id, { discountType: t });
                }}
                className={`px-2 py-1 text-[11px] font-semibold ${
                  person.discountType === t
                    ? "bg-gray-900 text-white"
                    : "text-gray-700"
                }`}
              >
                {t === "baht" ? "฿" : "%"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {personalDiscount > 0 && (
        <div className="flex items-center justify-end gap-2 px-3 py-1.5 text-[11px]">
          <span className="text-gray-500">ก่อนหักส่วนลด</span>
          <span className="text-gray-400 line-through">
            ฿{fmt(total + personalDiscount)}
          </span>
          <span className="font-semibold text-blue-700">
            −฿{fmt(personalDiscount)}
          </span>
        </div>
      )}
    </div>
  );
}

function NumField({ label, value, onChange }) {
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <input
        type="number"
        value={value || ""}
        placeholder="0"
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-right text-sm font-semibold outline-none focus:border-blue-600"
      />
    </div>
  );
}

function SummaryRow({ label, v, dim, big, accent }) {
  const color = dim
    ? "text-gray-400"
    : accent === "blue"
    ? "text-blue-700"
    : accent === "green"
    ? "text-green-700"
    : "text-gray-900";
  return (
    <div
      className={`flex items-center justify-between ${
        big ? "text-base font-bold" : "text-[13px] font-medium"
      }`}
    >
      <span className={dim ? "text-gray-400" : "text-gray-500"}>{label}</span>
      <span className={color}>฿{fmt(v)}</span>
    </div>
  );
}

export default function WizardDesktop({
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
  activePid,
  setActivePid,
  discountEditor,
  setDiscountEditor,
  newPerson,
  setNewPerson,
  addPerson,
  rmPerson,
  addItem,
  rmItem,
  updateItem,
  toggleEater,
  updatePerson,
}) {
  const filteredItems =
    activePid === "all"
      ? items
      : items.filter((it) => it.eaters.includes(activePid));
  const activePerson = peopleArr.find((p) => p.id === activePid);

  return (
    <div
      className="mx-auto grid gap-4 pb-12 pt-4"
      style={{ gridTemplateColumns: "320px 1fr 340px", maxWidth: 1440 }}
    >
      {/* LEFT: people */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-bold text-gray-900">คน</div>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
            {peopleArr.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setActivePid("all")}
          className={`mb-2.5 flex w-full items-center justify-between rounded-xl border px-3 py-2.5 transition ${
            activePid === "all"
              ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path d="M6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
              </svg>
            </span>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">ทั้งบิล</div>
              <div className="text-[11px] text-gray-500">รวมทุกคน</div>
            </div>
          </div>
          <div className="text-sm font-bold text-gray-900">
            ฿{fmt(result.finalTotal)}
          </div>
        </button>

        <div className="flex flex-col gap-2">
          {peopleArr.map((p, i) => {
            const detail = result.perPersonDetail?.[p.id] || {};
            return (
              <PersonCard
                key={p.id}
                person={p}
                idx={i}
                selected={activePid === p.id}
                total={detail.total ?? result.perPerson[p.id] ?? 0}
                personalDiscount={detail.personalDiscount || 0}
                onClick={() =>
                  setActivePid(activePid === p.id ? "all" : p.id)
                }
                onUpdate={updatePerson}
                onRemove={rmPerson}
              />
            );
          })}
        </div>

        <div className="mt-3 flex gap-1.5">
          <input
            value={newPerson}
            placeholder="เพิ่มคน…"
            onChange={(e) => setNewPerson(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPerson()}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-blue-600"
          />
          <button
            type="button"
            onClick={addPerson}
            className="rounded-lg bg-blue-600 px-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            +
          </button>
        </div>
      </div>

      {/* CENTER: items */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <div className="text-sm font-bold text-gray-900">รายการอาหาร</div>
            <div className="text-xs text-gray-500">
              · {filteredItems.length} เมนู
            </div>
          </div>
          <button
            type="button"
            onClick={() => addItem()}
            className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
          >
            + เพิ่มเมนู
          </button>
        </div>

        {activePid !== "all" && (
          <div className="mb-2.5 inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
            กำลังกรอง:{" "}
            <strong>
              {activePerson?.name ||
                `คน ${peopleArr.findIndex((p) => p.id === activePid) + 1}`}
            </strong>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {filteredItems.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 px-4 py-7 text-center text-sm text-gray-500">
              {activePid === "all"
                ? "ยังไม่มีเมนู — กด “เพิ่มเมนู” เพื่อเริ่ม"
                : "คนนี้ยังไม่ได้กินเมนูไหน"}
            </div>
          )}
          {filteredItems.map((it) => (
            <ItemCard
              key={it.id}
              item={it}
              people={peopleArr}
              editing={discountEditor === it.id}
              setEditing={(on) => setDiscountEditor(on ? it.id : null)}
              onUpdate={updateItem}
              onRemove={rmItem}
              onToggleEater={toggleEater}
            />
          ))}
          <button
            type="button"
            onClick={() => addItem()}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:bg-gray-50"
          >
            + เพิ่มเมนู
          </button>
        </div>
      </div>

      {/* RIGHT: summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-bold text-gray-900">สรุปบิล</div>

        <Eyebrow>ค่าบริการ & ภาษี</Eyebrow>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          <NumField label="VAT %" value={vat} onChange={setVat} />
          <NumField label="Service %" value={service} onChange={setService} />
        </div>

        <div className="mt-3.5">
          <Eyebrow>ส่วนลดทั้งบิล</Eyebrow>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              type="number"
              value={billDiscount || ""}
              placeholder="0"
              onChange={(e) =>
                setBillDiscount(parseFloat(e.target.value) || 0)
              }
              className="flex-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-right text-sm font-semibold outline-none focus:border-blue-600"
            />
            <div className="inline-flex overflow-hidden rounded-md border border-gray-200 bg-white">
              {["baht", "percent"].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setBillDiscountType(t)}
                  className={`px-2.5 py-1.5 text-xs font-semibold ${
                    billDiscountType === t
                      ? "bg-gray-900 text-white"
                      : "text-gray-700"
                  }`}
                >
                  {t === "baht" ? "฿" : "%"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-1.5 text-[11px] leading-snug text-gray-500">
            ลดเฉลี่ยให้ทุกคนตามสัดส่วน (ถ้าอยากลดเฉพาะคน ใช้ช่องส่วนลดในแต่ละคนทางซ้าย)
          </div>
        </div>

        <div className="my-4 h-px bg-gray-200" />

        <div className="flex flex-col gap-1.5">
          <SummaryRow label="ค่าอาหาร" v={result.subtotal} />
          {result.itemDiscTotal > 0 && (
            <SummaryRow
              label="ส่วนลดเมนู"
              v={-result.itemDiscTotal}
              accent="blue"
            />
          )}
          <SummaryRow label={`VAT ${vat}%`} v={result.vatAmt} dim={!vat} />
          <SummaryRow
            label={`Service ${service}%`}
            v={result.serviceAmt}
            dim={!service}
          />
          {result.billDiscAmt > 0 && (
            <SummaryRow
              label="ส่วนลดบิล"
              v={-result.billDiscAmt}
              accent="blue"
            />
          )}
          {result.personalDiscTotal > 0 && (
            <SummaryRow
              label="ส่วนลดรายคน"
              v={-result.personalDiscTotal}
              accent="green"
            />
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3">
          <span className="text-sm font-semibold text-gray-900">รวมทั้งหมด</span>
          <span className="text-xl font-bold text-gray-900">
            ฿{fmt(result.finalTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  people,
  editing,
  setEditing,
  onUpdate,
  onRemove,
  onToggleEater,
}) {
  const sub = (item.price || 0) * (item.qty || 1);
  const discAmt =
    item.discount > 0
      ? item.discountType === "baht"
        ? item.discount
        : (sub * item.discount) / 100
      : 0;
  const lineNet = Math.max(0, sub - discAmt);
  const perEater =
    item.eaters.length > 0 ? lineNet / item.eaters.length : 0;
  const hasDisc = item.discount > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <input
          value={item.name}
          onChange={(e) => onUpdate(item.id, { name: e.target.value })}
          placeholder="ชื่อเมนู"
          className="min-w-0 flex-1 border-0 bg-transparent py-1 text-[15px] font-semibold leading-6 outline-none focus:ring-0"
        />
        <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
          <button
            type="button"
            onClick={() =>
              onUpdate(item.id, { qty: Math.max(1, item.qty - 1) })
            }
            className="flex h-7 w-7 items-center justify-center text-sm text-gray-700 hover:bg-gray-50"
          >
            −
          </button>
          <span className="min-w-[20px] text-center text-sm font-semibold">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() => onUpdate(item.id, { qty: item.qty + 1 })}
            className="flex h-7 w-7 items-center justify-center text-sm text-gray-700 hover:bg-gray-50"
          >
            +
          </button>
        </div>
        <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1">
          <span className="text-xs text-gray-400">฿</span>
          <input
            type="number"
            value={item.price || ""}
            placeholder="0"
            onChange={(e) =>
              onUpdate(item.id, { price: parseFloat(e.target.value) || 0 })
            }
            className="w-14 border-0 bg-transparent text-right text-sm font-semibold outline-none focus:ring-0"
          />
        </div>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className={`rounded-lg border px-2 py-1.5 text-xs font-semibold ${
            hasDisc
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
          title="ส่วนลดเมนูนี้"
        >
          {hasDisc
            ? `−${item.discountType === "percent" ? item.discount + "%" : "฿" + item.discount}`
            : "+ ส่วนลด"}
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-base leading-none text-gray-400 hover:text-gray-600"
          title="ลบ"
        >
          ×
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-dashed border-gray-200 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] text-gray-500">คนกิน</span>
          {people.map((p, i) => {
            const on = item.eaters.includes(p.id);
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => onToggleEater(item.id, p.id)}
                title={p.name || `คน ${i + 1}`}
                className={`transition ${
                  on ? "opacity-100" : "opacity-30 hover:opacity-60"
                }`}
              >
                <Avatar person={p} idx={i} size={22} dim={!on} />
              </button>
            );
          })}
        </div>
        <div className="text-[11px] text-gray-500">
          ฿{fmt(lineNet)} ÷ {item.eaters.length || 0} คน{" "}
          <span className="ml-1 font-semibold text-gray-900">
            ฿{fmt(perEater)}/คน
          </span>
        </div>
      </div>

      {editing && (
        <div className="mt-2 flex items-center gap-2 rounded-md bg-gray-50 p-2.5">
          <span className="text-xs text-gray-500">ส่วนลดเมนูนี้</span>
          <input
            type="number"
            value={item.discount || ""}
            placeholder="0"
            onChange={(e) =>
              onUpdate(item.id, {
                discount: parseFloat(e.target.value) || 0,
              })
            }
            className="w-20 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-semibold outline-none focus:border-blue-600"
          />
          <div className="inline-flex overflow-hidden rounded-md border border-gray-200 bg-white">
            {["baht", "percent"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => onUpdate(item.id, { discountType: t })}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  item.discountType === t
                    ? "bg-gray-900 text-white"
                    : "text-gray-700"
                }`}
              >
                {t === "baht" ? "฿" : "%"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onUpdate(item.id, { discount: 0 })}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700"
          >
            ลบ
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white"
          >
            เสร็จ
          </button>
        </div>
      )}
    </div>
  );
}
