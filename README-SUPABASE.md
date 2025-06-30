# 🌐 클라우드 저장소 설정 가이드 (Supabase)

이 가이드를 따라하면 **모든 사용자가 공유하는 클라우드 메뉴판 저장소**를 설정할 수 있습니다.

## 🚀 1단계: Supabase 계정 생성

1. [supabase.com](https://supabase.com)에 접속
2. **"Start your project"** 클릭
3. GitHub/Google 계정으로 회원가입 (무료)

## 📋 2단계: 새 프로젝트 생성

1. **"New Project"** 클릭
2. 프로젝트 정보 입력:
   - **Name**: `hiorder-simulator` (또는 원하는 이름)
   - **Database Password**: 안전한 비밀번호 입력 (꼭 기록해두세요!)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서버)
3. **"Create new project"** 클릭
4. ⏳ 약 2분 정도 기다리면 프로젝트가 생성됩니다

## 🔑 3단계: API 키 확인

1. 프로젝트 대시보드에서 **Settings** → **API** 클릭
2. 다음 정보를 복사해둡니다:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🗄️ 4단계: 데이터베이스 테이블 생성

1. 프로젝트 대시보드에서 **SQL Editor** 클릭
2. **"New query"** 클릭
3. `supabase-setup.sql` 파일의 내용을 복사해서 붙여넣기
4. **"RUN"** 버튼 클릭

## ⚙️ 5단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_public_키_붙여넣기
```

**예시:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY4ODEyMzQ1NiwiZXhwIjoyMDAzNjk5NDU2fQ.example-key-here
```

## 🔄 6단계: 개발 서버 재시작

```bash
# 개발 서버 중지 (Ctrl+C)
# 다시 시작
npm run dev
```

## ✅ 7단계: 테스트

1. 키오스크에서 **설정** → **불러오기** 탭 이동
2. **클라우드 저장소** 토글을 켜기
3. 매장 설정에서 **"클라우드에 저장"** 버튼 클릭
4. 다른 브라우저나 기기에서도 같은 데이터가 보이는지 확인

## 🎉 완료!

이제 모든 사용자가 메뉴판을 공유할 수 있습니다:

- ✅ **실시간 동기화**: 누군가 저장하면 모든 사용자에게 즉시 반영
- ✅ **무료 사용**: Supabase 무료 플랜으로 충분 (월 500MB, 50만 요청)
- ✅ **검색 기능**: 매장명, 주소로 빠른 검색
- ✅ **안전한 저장**: PostgreSQL 기반의 안정적인 데이터베이스

## 🛠️ 문제 해결

### 연결 오류가 발생하는 경우:
1. `.env.local` 파일의 URL과 키가 정확한지 확인
2. 개발 서버를 재시작했는지 확인
3. Supabase 프로젝트가 완전히 생성되었는지 확인 (2-3분 소요)

### 권한 오류가 발생하는 경우:
1. `supabase-setup.sql`의 모든 명령이 실행되었는지 확인
2. RLS 정책이 올바르게 설정되었는지 확인

### 데이터가 보이지 않는 경우:
1. 브라우저 새로고침
2. 클라우드 저장소 토글이 켜져있는지 확인
3. 네트워크 연결 상태 확인

## 💡 추가 기능

원한다면 다음 기능들도 추가할 수 있습니다:
- 사용자 인증 (로그인/회원가입)
- 메뉴판 소유자 관리
- 댓글/평점 시스템
- 이미지 업로드 (Supabase Storage)

---

더 자세한 내용은 [Supabase 공식 문서](https://supabase.com/docs)를 참고하세요. 