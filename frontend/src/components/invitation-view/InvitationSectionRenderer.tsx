"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  INVITATION_SECTIONS,
  normalizeInvitationSectionOrder,
  type InvitationSectionId,
} from "@/constants/invitationSections";
import type { PublicInvitation } from "@/types/invitation";

import InvitationAccountSection from "./InvitationAccountSection";
import InvitationCoupleSection from "./InvitationCoupleSection";
import InvitationDdaySection from "./InvitationDdaySection";
import InvitationGallerySection from "./InvitationGallerySection";
import InvitationGreetingSection from "./InvitationGreetingSection";
import InvitationGuestbookSection from "./InvitationGuestbookSection";
import InvitationGuestPhotoSection from "./InvitationGuestPhotoSection";
import InvitationHeroSection from "./InvitationHeroSection";
import InvitationInterviewSection from "./InvitationInterviewSection";
import InvitationMapKakaoSection from "./InvitationMapKakaoSection";
import InvitationProfileSection from "./InvitationProfileSection";
import InvitationQrSection from "./InvitationQrSection";
import InvitationRsvpSection from "./InvitationRsvpSection";
import InvitationWeddingInfoSection from "./InvitationWeddingInfoSection";

interface InvitationSectionRendererProps {
  invitation: PublicInvitation;
  editable?: boolean;
  onOrderChange?: (sectionOrder: InvitationSectionId[]) => void;
}

interface SortablePreviewSectionProps {
  sectionId: InvitationSectionId;
  invitation: PublicInvitation;
}

const sectionMap = {
  hero: InvitationHeroSection,
  couple: InvitationCoupleSection,
  profile: InvitationProfileSection,
  greeting: InvitationGreetingSection,
  weddingInfo: InvitationWeddingInfoSection,
  dday: InvitationDdaySection,
  interview: InvitationInterviewSection,
  gallery: InvitationGallerySection,
  map: InvitationMapKakaoSection,
  account: InvitationAccountSection,
  rsvp: InvitationRsvpSection,
  guestbook: InvitationGuestbookSection,
  guestPhoto: InvitationGuestPhotoSection,
  qr: InvitationQrSection,
};

function SortablePreviewSection({
  sectionId,
  invitation,
}: SortablePreviewSectionProps) {
  const SectionComponent = sectionMap[sectionId];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sectionId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-lg outline outline-1 outline-transparent hover:outline-primary-200 ${
        isDragging ? "z-20 opacity-70" : ""
      }`}
    >
      <button
        type="button"
        aria-label="섹션 순서 변경"
        className="absolute right-2 top-2 z-20 cursor-grab rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-500 shadow-sm active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        드래그
      </button>

      <SectionComponent invitation={invitation} />
    </div>
  );
}

export default function InvitationSectionRenderer({
  invitation,
  editable = false,
  onOrderChange,
}: InvitationSectionRendererProps) {
  const order = normalizeInvitationSectionOrder(invitation.sectionOrder);

  const visibleOrder = order.filter((sectionId) => {
    const sectionConfig = INVITATION_SECTIONS.find(
      (section) => section.id === sectionId,
    );

    if (!sectionConfig?.enabledKey) {
      return true;
    }

    return Boolean(invitation[sectionConfig.enabledKey]);
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!editable || !onOrderChange) return;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id as InvitationSectionId);
    const newIndex = order.indexOf(over.id as InvitationSectionId);

    if (oldIndex < 0 || newIndex < 0) return;

    onOrderChange(arrayMove(order, oldIndex, newIndex));
  };

  if (!editable) {
    return (
      <>
        {visibleOrder.map((sectionId) => {
          const SectionComponent = sectionMap[sectionId];

          return <SectionComponent key={sectionId} invitation={invitation} />;
        })}
      </>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleOrder}
        strategy={verticalListSortingStrategy}
      >
        {visibleOrder.map((sectionId) => (
          <SortablePreviewSection
            key={sectionId}
            sectionId={sectionId}
            invitation={invitation}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
