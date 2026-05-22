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
 '/images/templates/classic-white-thumb.jpg',
 '/images/templates/classic-white-preview.jpg',
 'classic', 'standard',
 true, 1, NOW(), NOW()),

-- 2번 템플릿 데이터
(2, '모던 미니멀', 'modern-minimal',
 '/images/templates/modern-minimal-thumb.jpg',
 '/images/templates/modern-minimal-preview.jpg',
 'minimal', 'standard',
 true, 2, NOW(), NOW()),

-- 3번 템플릿 데이터
(3, '로맨틱 플로럴', 'romantic-floral',
 '/images/templates/romantic-floral-thumb.jpg',
 '/images/templates/romantic-floral-preview.jpg',
 'floral', 'standard',
 true, 3, NOW(), NOW()),

-- 4번 템플릿 데이터
(4, '내추럴 가든', 'natural-garden',
 '/images/templates/natural-garden-thumb.jpg',
 '/images/templates/natural-garden-preview.jpg',
 'nature', 'standard',
 true, 4, NOW(), NOW()),

-- 5번 템플릿 데이터
(5, '엘레강스 골드', 'elegance-gold',
 '/images/templates/elegance-gold-thumb.jpg',
 '/images/templates/elegance-gold-preview.jpg',
 'gold', 'standard',
 true, 5, NOW(), NOW()),

-- 6번 템플릿 데이터
(6, '심플 블랙', 'simple-black',
 '/images/templates/simple-black-thumb.jpg',
 '/images/templates/simple-black-preview.jpg',
 'dark', 'standard',
 true, 6, NOW(), NOW());


-- BGM 초기 데이터
INSERT IGNORE INTO bgms (id, title, file_url, mood, is_active, sort_order, created_at)
VALUES
(1, '봄날의 왈츠', 'https://dummy-s3.example.com/bgm/spring-waltz.mp3', '잔잔한', true, 1, NOW()),
(2, '설레는 오후', 'https://dummy-s3.example.com/bgm/lovely-afternoon.mp3', '밝은', true, 2, NOW()),
(3, '달빛 소나타', 'https://dummy-s3.example.com/bgm/moonlight-sonata.mp3', '감성적인', true, 3, NOW()),
(4, '사랑의 왈츠', 'https://dummy-s3.example.com/bgm/love-waltz.mp3', '로맨틱한', true, 4, NOW()),
(5, '하늘빛 선율', 'https://dummy-s3.example.com/bgm/sky-melody.mp3', '청아한', true, 5, NOW());