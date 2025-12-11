import { MemberInfoItemType } from "@/app/types";

export default function MemberInfoItem({ icon, label, value }: MemberInfoItemType) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex flex-col text-navy-100">
        <span className="text-sm">{label}</span>
        <span className="font-bold text-xl">{value}</span>
      </div>
    </div>
  );
}
