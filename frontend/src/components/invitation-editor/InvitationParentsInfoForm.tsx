import { UpdateInvitationRequest } from "@/lib/api/invitations";
import InputField from "../common/InputField";

interface InvitationParentsInfoFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationParentsInfoForm({
  data,
  onChange,
}: InvitationParentsInfoFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-semibold text-gray-800">부모님 정보</h3>

      {/* 신랑 측 */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          신랑 측
        </p>
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="아버지"
            placeholder="성함"
            value={data.groomFatherName ?? ""}
            onChange={(e) => onChange({ groomFatherName: e.target.value })}
          />
          <InputField
            label="어머니"
            placeholder="성함"
            value={data.groomMotherName ?? ""}
            onChange={(e) => onChange({ groomMotherName: e.target.value })}
          />
        </div>
      </div>

      {/* 신부 측 */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          신부 측
        </p>
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="아버지"
            placeholder="성함"
            value={data.brideFatherName ?? ""}
            onChange={(e) => onChange({ brideFatherName: e.target.value })}
          />
          <InputField
            label="어머니"
            placeholder="성함"
            value={data.brideMotherName ?? ""}
            onChange={(e) => onChange({ brideMotherName: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
