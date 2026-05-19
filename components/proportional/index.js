import { useEffect, useRef, useState } from "react";
import { calculate } from "../../lib/bill-calc";
import WizardMobile from "./wizard-mobile";
import WizardDesktop from "./wizard-desktop";

const NEQ_OPTION = 2;

export default function Proportional({
  selectedOption,
  peopleArr,
  setPeopleArr,
  items,
  setItems,
  vat,
  setVat,
  service,
  setService,
  billDiscount,
  setBillDiscount,
  billDiscountType,
  setBillDiscountType,
  setTotal,
  setPay,
}) {
  // wizard-local UI state (persisted across option toggle since this component stays mounted).
  const [step, setStep] = useState(0);
  const [tickMode, setTickMode] = useState("item");
  const [activeItem, setActiveItem] = useState(null);
  const [activePid, setActivePid] = useState(
    peopleArr[0]?.id || "all",
  );
  const [summaryPid, setSummaryPid] = useState("all");
  const [discountEditor, setDiscountEditor] = useState(null);
  const [newPerson, setNewPerson] = useState("");

  const result = calculate({
    items,
    people: peopleArr,
    vat,
    service,
    discount: billDiscount,
    discountType: billDiscountType,
  });

  // Keep activeItem pointing at a real item.
  useEffect(() => {
    if (items.length === 0) {
      if (activeItem !== null) setActiveItem(null);
      return;
    }
    if (!items.find((it) => it.id === activeItem)) {
      setActiveItem(items[0].id);
    }
  }, [items, activeItem]);

  // Keep activePid valid (desktop filter) — reset to "all" if person removed.
  useEffect(() => {
    if (activePid !== "all" && !peopleArr.find((p) => p.id === activePid)) {
      setActivePid("all");
    }
  }, [peopleArr, activePid]);

  // Same for summaryPid.
  useEffect(() => {
    if (summaryPid !== "all" && !peopleArr.find((p) => p.id === summaryPid)) {
      setSummaryPid("all");
    }
  }, [peopleArr, summaryPid]);

  // Sync NEQ result back to parent's total/pay so Overall card reflects it.
  // Guard: only when we're in NEQ mode AND there are items — avoid zeroing
  // out a user-typed total in EQ when NEQ is still empty.
  const lastPushed = useRef({ total: null, pay: null });
  useEffect(() => {
    if (selectedOption !== NEQ_OPTION) return;
    if (items.length === 0) return;
    const finalTotal = result.finalTotal;
    const n = peopleArr.length;
    const totalStr = Number(Math.round(finalTotal)).toLocaleString();
    const avg = n > 0 ? Math.ceil((finalTotal / n) * 100) / 100 : 0;
    const payStr = Number(avg).toLocaleString();
    if (lastPushed.current.total !== totalStr) {
      setTotal(totalStr);
      lastPushed.current.total = totalStr;
    }
    if (lastPushed.current.pay !== payStr) {
      setPay(payStr);
      lastPushed.current.pay = payStr;
    }
  }, [
    selectedOption,
    result.finalTotal,
    peopleArr.length,
    items.length,
    setTotal,
    setPay,
  ]);

  // Handlers
  function addPerson() {
    const name = newPerson.trim();
    if (!name) return;
    setPeopleArr((prev) => [
      ...prev,
      { id: "p" + Date.now(), name, discount: 0, discountType: "baht" },
    ]);
    setNewPerson("");
  }

  function rmPerson(pid) {
    setPeopleArr((prev) => prev.filter((p) => p.id !== pid));
    setItems((prev) =>
      prev.map((it) => ({
        ...it,
        eaters: it.eaters.filter((x) => x !== pid),
      })),
    );
  }

  function updatePersonName(pid, name) {
    setPeopleArr((prev) =>
      prev.map((p) => (p.id === pid ? { ...p, name } : p)),
    );
  }

  function updatePerson(pid, patch) {
    setPeopleArr((prev) =>
      prev.map((p) => (p.id === pid ? { ...p, ...patch } : p)),
    );
  }

  function addItem() {
    const id = "i" + Date.now();
    setItems((prev) => [
      ...prev,
      {
        id,
        name: "",
        price: 0,
        qty: 1,
        eaters: peopleArr.map((p) => p.id),
        discount: 0,
        discountType: "percent",
      },
    ]);
    setActiveItem(id);
  }

  function rmItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function updateItem(id, patch) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );
  }

  function toggleEater(itemId, pid) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const has = it.eaters.includes(pid);
        return {
          ...it,
          eaters: has
            ? it.eaters.filter((x) => x !== pid)
            : [...it.eaters, pid],
        };
      }),
    );
  }

  const sharedProps = {
    // state
    peopleArr,
    items,
    vat,
    service,
    billDiscount,
    billDiscountType,
    result,
    // ui state
    step,
    setStep,
    tickMode,
    setTickMode,
    activeItem,
    setActiveItem,
    activePid,
    setActivePid,
    summaryPid,
    setSummaryPid,
    discountEditor,
    setDiscountEditor,
    newPerson,
    setNewPerson,
    // setters
    setVat,
    setService,
    setBillDiscount,
    setBillDiscountType,
    // handlers
    addPerson,
    rmPerson,
    updatePersonName,
    updatePerson,
    addItem,
    rmItem,
    updateItem,
    toggleEater,
  };

  return (
    <>
      <div className="mx-auto max-w-md px-4 lg:hidden">
        <WizardMobile {...sharedProps} />
      </div>
      <div className="hidden px-4 lg:block">
        <WizardDesktop {...sharedProps} />
      </div>
    </>
  );
}
