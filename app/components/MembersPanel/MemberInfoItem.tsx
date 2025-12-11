import { MemberInfoItemType } from "@/app/types";

export default function MemberInfoItem({ icon, label, value }: MemberInfoItemType) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex flex-col">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-gray-900 font-bold text-xl">{value}</span>
      </div>
    </div>
  );
}
