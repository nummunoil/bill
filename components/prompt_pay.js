import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "./modal";

const PromptPay = () => {
  const [pp, setPp] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const ppStorage = localStorage.getItem("pp");
    if (ppStorage) {
      setPp(ppStorage);
    }
  }, []);

  const openEditModal = () => {
    setToggle(true);
  };

  return (
    <div>
      {toggle && <Modal toggle={toggle} setPp={setPp} setToggle={setToggle} />}
      <div
        className="p-2 mb-2 grid justify-items-center"
        onClick={openEditModal}
      >
        <div className="text-center text-sm">พร้อมเพย์</div>
        {pp ? (
          <div>
            <Image
              src={`https://promptpay.io/${pp}.png`}
              alt="พร้อมเพย์"
              width="0"
              height="0"
              className="w-32 h-32"
            />
            <div className="text-center text-xs">{pp}</div>
          </div>
        ) : (
          <div className="w-32 h-32 relative text-center">
            <Image
              src={`https://promptpay.io/0000000000.png`}
              alt="พร้อมเพย์"
              width="0"
              height="0"
              className="w-full"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-700 font-bold bg-gray-200">
              <div className="p-2">เพิ่ม PromptPay</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptPay;
