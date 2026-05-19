import { Avatar } from "../atoms";

export default function StepPeople({
  peopleArr,
  addPerson,
  rmPerson,
  updatePersonName,
  newPerson,
  setNewPerson,
}) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {peopleArr.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            ยังไม่มีคนในบิล กดเพิ่มด้านล่าง
          </div>
        ) : (
          peopleArr.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-3 py-2 ${
                i === peopleArr.length - 1 ? "" : "border-b border-gray-100"
              }`}
            >
              <Avatar person={p} idx={i} size={36} />
              <input
                value={p.name}
                onChange={(e) => updatePersonName(p.id, e.target.value)}
                placeholder={`คน ${i + 1}`}
                className="flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => rmPerson(p.id)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-base leading-none text-gray-500 hover:bg-gray-200"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex gap-2 rounded-xl border border-gray-200 bg-white p-2">
        <input
          value={newPerson}
          placeholder="เพิ่มชื่อ..."
          onChange={(e) => setNewPerson(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPerson()}
          className="flex-1 border-0 bg-transparent px-2 py-1.5 text-sm outline-none focus:ring-0"
        />
        <button
          type="button"
          onClick={addPerson}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + เพิ่ม
        </button>
      </div>
    </div>
  );
}
