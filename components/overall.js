import { useEffect, useState } from "react";

const statsInit = [
  { id: 1, name: "จำนวนเงินรวม", value: "- บาท" },
  { id: 2, name: "จำนวนคนทั้งหมด", value: "- คน" },
];

export default function Overall({ pay, people }) {
  const [stats, setStats] = useState(statsInit);

  useEffect(() => {
    const p1 = parseFloat(pay.replace(/,/g, ""));
    const p2 = parseFloat(people.replace(/,/g, ""));
    const total = p1 * p2;
    const formattedTotal = Number(total).toLocaleString();

    setStats([
      { id: 1, name: "จำนวนเงินรวม", value: `${formattedTotal} บาท` },
      { id: 2, name: "จำนวนคนทั้งหมด", value: `${people} คน` },
    ]);
  }, [pay, people]);

  return (
    <div className="bg-white py-2 sm:py-3">
      <div className="mx-auto max-w-2xl px-2 lg:px-8">
        <dl className="grid grid-cols-2 gap-x-2 gap-y-4 text-center md:grid-cols-1 xl:grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-1"
            >
              <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
