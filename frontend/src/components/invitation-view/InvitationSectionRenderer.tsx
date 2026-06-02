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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
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
import InvitationCalendarSection from "./InvitationCalendarSection";
import InvitationCoupleSection from "./InvitationCoupleSection";
import InvitationDdaySection from "./InvitationDdaySection";
import InvitationGallerySection from "./InvitationGallerySection";
import InvitationGreetingSection from "./InvitationGreetingSection";
import InvitationGuestbookSection from "./InvitationGuestbookSection";
import InvitationGuestPhotoSection from "./InvitationGuestPhotoSection";
import InvitationHeroSection from "./InvitationHeroSection";
import InvitationInterviewSection from "./InvitationInterviewSection";
import InvitationMapKakaoSection from "./InvitationMapKakaoSection";
import InvitationPhotoBannerSection from "./InvitationPhotoBannerSection";
import InvitationQrSection from "./InvitationQrSection";
import InvitationRsvpSection from "./InvitationRsvpSection";
import InvitationWeddingInfoSection from "./InvitationWeddingInfoSection";

interface InvitationSectionRendererProps {
  invitation: PublicInvitation;
  editable?: boolean;
  readOnlyInteractions?: boolean;
  disableSectionDrag?: boolean;
  mainImagePositionEditable?: boolean;
  onMainImagePositionChange?: (position: string) => void;
  photoBannerPositionEditable?: boolean;
  onPhotoBannerPositionChange?: (position: string) => void;
  onOrderChange?: (sectionOrder: InvitationSectionId[]) => void;
  interviewVersion?: number;
}

// Mirrors the null-return conditions inside each section component.
// Used to skip empty sections in the editable preview so it matches the public page.
const shouldShowSection: Partial<
  Record<InvitationSectionId, (inv: PublicInvitation) => boolean>
> = {
  greeting: (inv) => !!inv.greetingText,
  weddingInfo: (inv) => !!(inv.weddingDate || inv.venueName),
  map: (inv) => !!(inv.mapLat && inv.mapLng),
};

interface SortablePreviewSectionProps {
  sectionId: InvitationSectionId;
  invitation: PublicInvitation;
  readOnlyInteractions?: boolean;
  disabled?: boolean;
  isAlt?: boolean;
  mainImagePositionEditable?: boolean;
  onMainImagePositionChange?: (position: string) => void;
  photoBannerPositionEditable?: boolean;
  onPhotoBannerPositionChange?: (position: string) => void;
  interviewVersion?: number;
}

const sectionMap = {
  hero: InvitationHeroSection,
  couple: InvitationCoupleSection,
  greeting: InvitationGreetingSection,
  weddingInfo: InvitationWeddingInfoSection,
  calendar: InvitationCalendarSection,
  dday: InvitationDdaySection,
  interview: InvitationInterviewSection,
  gallery: InvitationGallerySection,
  photoBanner: InvitationPhotoBannerSection,
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
  readOnlyInteractions = false,
  disabled = false,
  isAlt = false,
  mainImagePositionEditable = false,
  onMainImagePositionChange,
  photoBannerPositionEditable = false,
  onPhotoBannerPositionChange,
  interviewVersion = 0,
}: SortablePreviewSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sectionId,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isAlt ? { "--section-bg": "var(--invite-section-alt)" } : {}),
  } as React.CSSProperties;

  const dragHandleProps = disabled ? {} : { ...attributes, ...listeners };
  const isHeroPositionTarget = sectionId === "hero" && mainImagePositionEditable;
  const isPhotoBannerTarget = sectionId === "photoBanner" && photoBannerPositionEditable;
  const isGuestPhotoReadOnly =
    sectionId === "guestPhoto" && readOnlyInteractions;
  const renderedSection = isHeroPositionTarget ? (
    <InvitationHeroSection
      invitation={invitation}
      editableMainImagePosition
      onMainImagePositionChange={onMainImagePositionChange}
    />
  ) : isPhotoBannerTarget ? (
    <InvitationPhotoBannerSection
      invitation={invitation}
      editablePosition
      onPositionChange={onPhotoBannerPositionChange}
    />
  ) : isGuestPhotoReadOnly ? (
    <InvitationGuestPhotoSection invitation={invitation} readOnly />
  ) : sectionId === "interview" ? (
    <InvitationInterviewSection invitation={invitation} interviewVersion={interviewVersion} />
  ) : (
    (() => {
      const SectionComponent = sectionMap[sectionId];
      return <SectionComponent invitation={invitation} />;
    })()
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative outline outline-1 outline-transparent hover:outline-primary-200 ${
        isDragging ? "z-20 opacity-70" : ""
      }`}
    >
      {!disabled && (
        <button
          type="button"
          aria-label="섹션 순서 변경"
          className="absolute right-2 top-2 z-20 cursor-grab rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-500 shadow-sm active:cursor-grabbing"
          {...dragHandleProps}
        >
          드래그
        </button>
      )}

      {renderedSection}
    </div>
  );
}

export default function InvitationSectionRenderer({
  invitation,
  editable = false,
  readOnlyInteractions = false,
  disableSectionDrag = false,
  mainImagePositionEditable = false,
  onMainImagePositionChange,
  photoBannerPositionEditable = false,
  onPhotoBannerPositionChange,
  onOrderChange,
  interviewVersion = 0,
}: InvitationSectionRendererProps) {
  const order = normalizeInvitationSectionOrder(invitation.sectionOrder);

  const visibleOrder = order.filter((sectionId) => {
    const sectionConfig = INVITATION_SECTIONS.find(
      (section) => section.id === sectionId,
    );

    if (!sectionConfig?.enabledKey) {
      const check = shouldShowSection[sectionId];
      return check ? check(invitation) : true;
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
        {visibleOrder.map((sectionId, index) => {
          const SectionComponent = sectionMap[sectionId];
          const isAlt = index % 2 === 1;

          const altStyle = isAlt
            ? ({ "--section-bg": "var(--invite-section-alt)" } as React.CSSProperties)
            : {};

          if (sectionId === "guestPhoto" && readOnlyInteractions) {
            return (
              <div key={sectionId} style={altStyle}>
                <InvitationGuestPhotoSection invitation={invitation} readOnly />
              </div>
            );
          }

          if (sectionId === "interview") {
            return (
              <div key={sectionId} style={altStyle}>
                <InvitationInterviewSection invitation={invitation} interviewVersion={interviewVersion} />
              </div>
            );
          }

          return (
            <div key={sectionId} style={altStyle}>
              <SectionComponent invitation={invitation} />
            </div>
          );
        })}
      </>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleOrder}
        strategy={verticalListSortingStrategy}
      >
        {visibleOrder.map((sectionId, index) => (
          <SortablePreviewSection
            key={sectionId}
            sectionId={sectionId}
            invitation={invitation}
            readOnlyInteractions={readOnlyInteractions}
            disabled={disableSectionDrag}
            isAlt={index % 2 === 1}
            mainImagePositionEditable={mainImagePositionEditable}
            onMainImagePositionChange={onMainImagePositionChange}
            photoBannerPositionEditable={photoBannerPositionEditable}
            onPhotoBannerPositionChange={onPhotoBannerPositionChange}
            interviewVersion={interviewVersion}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
