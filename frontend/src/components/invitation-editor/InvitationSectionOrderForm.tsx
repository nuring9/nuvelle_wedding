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

interface InvitationSectionOrderFormProps {
  sectionOrder?: string[];
  onChange: (sectionOrder: InvitationSectionId[]) => void;
}

interface SortableSectionRowProps {
  sectionId: InvitationSectionId;
  index: number;
  order: InvitationSectionId[];
  label: string;
  onChange: (sectionOrder: InvitationSectionId[]) => void;
}

function SortableSectionRow({
  sectionId,
  index,
  order,
  label,
  onChange,
}: SortableSectionRowProps) {
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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextIndex = Number(event.target.value) - 1;
    onChange(arrayMove(order, index, nextIndex));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-sm ${
        isDragging ? "z-10 opacity-70" : ""
      }`}
    >
      <button
        type="button"
        aria-label={`${label} 순서 변경`}
        className="cursor-grab text-sm text-gray-400 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        ☰
      </button>

      <select
        value={index + 1}
        onChange={handleSelectChange}
        className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700"
      >
        {order.map((_, optionIndex) => (
          <option key={optionIndex} value={optionIndex + 1}>
            {optionIndex + 1}
          </option>
        ))}
      </select>

      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}

export default function InvitationSectionOrderForm({
  sectionOrder,
  onChange,
}: InvitationSectionOrderFormProps) {
  const order = normalizeInvitationSectionOrder(sectionOrder);

  const sectionLabelMap = new Map(
    INVITATION_SECTIONS.map((section) => [section.id, section.label]),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id as InvitationSectionId);
    const newIndex = order.indexOf(over.id as InvitationSectionId);

    if (oldIndex < 0 || newIndex < 0) return;

    onChange(arrayMove(order, oldIndex, newIndex));
  };

  return (
    <div className="flex flex-col gap-3 pt-6">
      <div className="mt-10">
        <h4 className="text-sm font-semibold text-gray-800">섹션 순서</h4>
        <p className="mt-1 text-xs text-gray-500">
          숫자를 바꾸거나 항목을 드래그해서 표시 순서를 변경할 수 있어요.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {order.map((sectionId, index) => (
              <SortableSectionRow
                key={sectionId}
                sectionId={sectionId}
                index={index}
                order={order}
                label={sectionLabelMap.get(sectionId) ?? sectionId}
                onChange={onChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
