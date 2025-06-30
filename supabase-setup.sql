-- 메뉴판 저장을 위한 테이블 생성
CREATE TABLE menu_boards (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  store_name TEXT NOT NULL,
  store_address TEXT,
  tabs JSONB NOT NULL DEFAULT '[]',
  food_items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 업데이트 시간 자동 갱신을 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_menu_boards_updated_at 
    BEFORE UPDATE ON menu_boards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 활성화 - 모든 사용자가 읽기/쓰기 가능
ALTER TABLE menu_boards ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 모든 데이터에 접근할 수 있도록 정책 설정
CREATE POLICY "Anyone can select menu_boards" ON menu_boards
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert menu_boards" ON menu_boards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update menu_boards" ON menu_boards
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete menu_boards" ON menu_boards
    FOR DELETE USING (true);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_menu_boards_name ON menu_boards(name);
CREATE INDEX idx_menu_boards_store_name ON menu_boards(store_name);
CREATE INDEX idx_menu_boards_created_at ON menu_boards(created_at DESC); 