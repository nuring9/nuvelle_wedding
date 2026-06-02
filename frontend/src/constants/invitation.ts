export interface ThemeOption {
  key: string;
  label: string;
  primaryColor: string;
  bgColor: string;
  description: string;
}

export interface FontOption {
  key: string;
  label: string;
  fontFamily: string;
  preview: string;
}

export interface GalleryLayoutOption {
  key: string;
  label: string;
  description: string;
  icon: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    key: "classic",
    label: "클래식 화이트",
    primaryColor: "#374151",
    bgColor: "#fafafa",
    description:
      "깨끗하고 정돈된 미니멀 화이트 테마 분위기에 맞춰 예식 정보를 자연스럽게 담을 수 있는 청첩장 템플릿입니다.",
  },
  {
    key: "sunshine",
    label: "브라이트 선샤인",
    primaryColor: "#da6d2a",
    bgColor: "#ffffff",
    description:
      "햇살처럼 밝고 화사한 오렌지 테마 분위기에 맞춰 예식 정보를 자연스럽게 담을 수 있는 청첩장 템플릿입니다.",
  },
  {
    key: "floral",
    label: "로맨틱 플로럴",
    primaryColor: "#e11d48",
    bgColor: "#fff1f2",
    description:
      "꽃잎이 흩날리듯 사랑스러운 핑크 테마 분위기에 맞춰 예식 정보를 자연스럽게 담을 수 있는 청첩장 템플릿입니다.",
  },
  {
    key: "nature",
    label: "내추럴 가든",
    primaryColor: "#16a34a",
    bgColor: "#f0fdf4",
    description:
      "싱그러운 그리너리 감성의 자연 친화적 테마 분위기에 맞춰 예식 정보를 자연스럽게 담을 수 있는 청첩장 템플릿입니다.",
  },
  {
    key: "gold",
    label: "엘레강스 골드",
    primaryColor: "#b45309",
    bgColor: "#fffbeb",
    description:
      "은은한 빛과 기품이 느껴지는 클래식 골드 테마 분위기에 맞춰 예식 정보를 자연스럽게 담을 수 있는 청첩장 템플릿입니다.",
  },
  {
    key: "dark",
    label: "심플 블랙",
    primaryColor: "#f9fafb",
    bgColor: "#111827",
    description:
      "감각적이고 세련된 모던 다크 테마 분위기에 맞춰 예식 정보를 자연스럽게 담을 수 있는 청첩장 템플릿입니다.",
  },
];

export const FONT_OPTIONS: FontOption[] = [
  {
    key: "noto-sans",
    label: "Pretendard",
    fontFamily: '"Pretendard", sans-serif',
    preview: "우리 두 사람이 하나가 되는 날",
  },
  {
    key: "noto-serif",
    label: "노토 세리프",
    fontFamily: '"Noto Serif KR", serif',
    preview: "우리 두 사람이 하나가 되는 날",
  },
  {
    key: "nanum-round",
    label: "나눔스퀘어라운드",
    fontFamily: '"NanumSquareRound", sans-serif',
    preview: "우리 두 사람이 하나가 되는 날",
  },
];

export const GALLERY_LAYOUT_OPTIONS: GalleryLayoutOption[] = [
  {
    key: "grid",
    label: "그리드형",
    description: "3열 정방형 그리드",
    icon: "⊞",
  },
  {
    key: "slider",
    label: "슬라이드형",
    description: "한 장씩 넘기는 와이드 슬라이드",
    icon: "▷",
  },
];
