-- data.sql은 애플리케이션 시작 시 자동 실행될 수 있는 초기 SQL 파일이다.
-- 개발 초기에 기본 템플릿 데이터를 넣어두기 위해 사용한다.

-- spring.jpa.hibernate.ddl-auto=update 환경에서는
-- 이미 데이터가 들어있는 상태에서 서버를 재실행할 수 있다.

-- INSERT IGNORE는 MySQL에서 중복 오류를 무시하고 넘어가게 해준다.
-- 여기서는 id가 이미 존재하는 경우 중복 삽입 오류를 막기 위해 사용한다.

INSERT IGNORE INTO templates (

    -- 템플릿 ID
    id,

    -- 템플릿 이름
    name,

    -- 템플릿 고유 문자열
    slug,

    -- 템플릿 썸네일 이미지 URL
    thumbnail_url,

    -- 템플릿 미리보기 이미지 URL
    preview_image_url,

    -- 테마 구분 값
    theme_key,

    -- 레이아웃 구분 값
    layout_key,

    -- 활성화 여부
    is_active,

    -- 정렬 순서
    sort_order,

    -- 생성 시간
    created_at,

    -- 수정 시간
    updated_at
) VALUES

-- 1번 템플릿 데이터
(1, '클래식 화이트', 'classic-white',
 NULL,
 NULL,
 'classic', 'standard',
 true, 1, NOW(), NOW()),

-- 2번 템플릿 데이터
(2, '모던 미니멀', 'modern-minimal',
 NULL,
 NULL,
 'minimal', 'standard',
 true, 2, NOW(), NOW()),

-- 3번 템플릿 데이터
(3, '로맨틱 플로럴', 'romantic-floral',
 NULL,
 NULL,
 'floral', 'standard',
 true, 3, NOW(), NOW()),

-- 4번 템플릿 데이터
(4, '내추럴 가든', 'natural-garden',
 NULL,
 NULL,
 'nature', 'standard',
 true, 4, NOW(), NOW()),

-- 5번 템플릿 데이터
(5, '엘레강스 골드', 'elegance-gold',
 NULL,
 NULL,
 'gold', 'standard',
 true, 5, NOW(), NOW()),

-- 6번 템플릿 데이터
(6, '심플 블랙', 'simple-black',
 NULL,
 NULL,
 'dark', 'standard',
 true, 6, NOW(), NOW());



INSERT IGNORE INTO bgms (
    id,
    title,
    file_url,
    mood,
    is_active,
    sort_order,
    created_at
) VALUES
(1, '기본 BGM 1', 'https://nuvelle-wedding-prod-assets.s3.ap-northeast-2.amazonaws.com/bgm/its-your-day.mp3', '감성적인 분위기', true, 1, NOW()),
(2, '기본 BGM 2', 'https://nuvelle-wedding-prod-assets.s3.ap-northeast-2.amazonaws.com/bgm/nevilles-waltz.mp3', '우아한 분위기', true, 2, NOW()),
(3, '기본 BGM 3', 'https://nuvelle-wedding-prod-assets.s3.ap-northeast-2.amazonaws.com/bgm/proud-of-your-boy.mp3', '따뜻한 분위기', true, 3, NOW()),
(4, '기본 BGM 4', 'https://nuvelle-wedding-prod-assets.s3.ap-northeast-2.amazonaws.com/bgm/someday-my-prince-will-come.mp3', '화사한 분위기', true, 4, NOW());
