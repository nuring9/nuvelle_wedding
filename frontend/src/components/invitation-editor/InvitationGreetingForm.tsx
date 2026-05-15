import { UpdateInvitationRequest } from "@/lib/api/invitations";
import TextareaField from "../common/TextareaField";

interface InvitationGreetingFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationGreetingForm({
  data,
  onChange,
}: InvitationGreetingFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-800">인사말</h3>
      <TextareaField
        placeholder={`저희 두 사람이 하나가 되는 날\n함께해 주시면 감사하겠습니다.`}
        value={data.greetingText ?? ""}
        onChange={(e) => onChange({ greetingText: e.target.value })}
        rows={5}
        hint="하객에게 전달할 인사말을 입력해주세요."
      />
    </div>
  );
}
