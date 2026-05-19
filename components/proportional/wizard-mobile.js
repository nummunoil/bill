import StepPeople from "./steps/StepPeople";
import StepItems from "./steps/StepItems";
import StepTick from "./steps/StepTick";
import StepSummary from "./steps/StepSummary";

const STEPS = ["คน", "เมนู", "ติ๊กคน", "สรุป"];
const TITLES = [
  ["ใครกินบ้าง?", "ใส่ชื่อคนที่จะหารบิลกัน"],
  ["สั่งอะไรบ้าง?", "แตะ % ที่รายการเพื่อใส่ส่วนลดเฉพาะเมนูได้"],
  ["ติ๊กคนที่กิน", "สลับมุมมองได้: ดูทีละเมนู หรือทีละคน"],
  ["สรุปบิล", "แตะ tab คนเพื่อดูว่าใครกินอะไร"],
];

export default function WizardMobile(props) {
  const { step, setStep } = props;
  const [title, subtitle] = TITLES[step];

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className={`bg-transparent px-0 text-sm ${
            step > 0 ? "text-gray-900" : "text-gray-300"
          }`}
        >
          ← ย้อน
        </button>
        <span className="text-xs font-semibold tracking-wide text-gray-500">
          STEP {step + 1} / 4
        </span>
      </div>

      <div className="mt-2.5 flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i <= step ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="mt-3 text-xl font-bold tracking-tight">{title}</div>
      <div className="mt-0.5 text-xs text-gray-500">{subtitle}</div>

      <div className="mt-4">
        {step === 0 && <StepPeople {...props} />}
        {step === 1 && <StepItems {...props} />}
        {step === 2 && <StepTick {...props} />}
        {step === 3 && <StepSummary {...props} />}
      </div>

      {step < 3 && (
        <button
          type="button"
          onClick={() => setStep(Math.min(3, step + 1))}
          className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700"
        >
          ถัดไป →
        </button>
      )}
    </div>
  );
}
