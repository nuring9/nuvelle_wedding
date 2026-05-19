"use client";

import { useState } from "react";
import InputField from "@/components/common/InputField";
import TextareaField from "@/components/common/TextareaField";
import PrimaryButton from "@/components/common/PrimaryButton";
import type { GuestbookRequest } from "@/types/invitation";

interface GuestbookFormProps {
  onSubmit: (data: GuestbookRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function GuestbookForm({
  onSubmit,
  isLoading = false,
}: GuestbookFormProps) {
  const [form, setForm] = useState<GuestbookRequest>({
    guestName: "",
    message: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!form.guestName.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!form.message.trim()) {
      setError("메시지를 입력해주세요.");
      return;
    }
    setError(null);
    await onSubmit(form);
    setForm({ guestName: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <InputField
        placeholder="이름"
        value={form.guestName}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, guestName: e.target.value }))
        }
        required
      />
      <TextareaField
        placeholder="축하 메시지를 남겨주세요"
        value={form.message}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, message: e.target.value }))
        }
        rows={3}
        required
      />
      <PrimaryButton type="submit" fullWidth isLoading={isLoading}>
        방명록 남기기
      </PrimaryButton>
    </form>
  );
}
