import type { HoneymoonChatMessage } from "@/types/honeymoon";

interface HoneymoonChatBubbleProps {
  message: HoneymoonChatMessage;
  onCreatePlan?: (messageId: number) => void;
  isCreatingPlan?: boolean;
}

export default function HoneymoonChatBubble({
  message,
  onCreatePlan,
  isCreatingPlan = false,
}: HoneymoonChatBubbleProps) {
  const isUser = message.role === "USER";
  const canCreatePlan =
    !isUser && !!onCreatePlan && /(?:^|\n)\s*[*#\s]*day\s*\d+/i.test(message.content);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {/* AI 아이콘 , user가 없을때 ai*/}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <span className="text-xs">✈️</span>
        </div>
      )}

      {/* 말풍선 */}
      <div
        className={`max-w-[78%] sm:max-w-[70%] lg:max-w-[640px] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line break-words ${
          isUser
            ? "bg-primary-500 text-white rounded-tr-sm"
            : "bg-white text-gray-700 rounded-tl-sm shadow-sm border border-gray-100"
        }`}
      >
        {message.content}
        {canCreatePlan && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onCreatePlan(message.id)}
              disabled={isCreatingPlan}
              className="text-xs font-medium px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingPlan
                ? "새 일정 생성 중..."
                : "이 변경안으로 새 일정 만들기"}
            </button>
          </div>
        )}
      </div>

      {/* 사용자 아이콘 */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
          <span className="text-xs">👤</span>
        </div>
      )}
    </div>
  );
}
