# PDF Toolkit 실행 및 데스크톱 빌드

## 요구사항

- Node.js 22 및 npm
- Windows 데스크톱 빌드: Rust stable MSVC 툴체인, Microsoft C++ Build Tools, WebView2

## 웹 앱

```powershell
npm install
npm run dev
```

프로덕션 검증은 `npm run build`로 실행합니다. 이 빌드는 분석 및 상태 확인 Route Handler를 포함하는 기존 웹앱 빌드입니다.

## 데스크톱 앱 로컬 실행

```powershell
npm run desktop:dev
```

Tauri가 Next.js 개발 서버를 시작하고 `http://localhost:3000`을 데스크톱 WebView에 연결합니다.

## Windows 설치 프로그램 빌드

```powershell
npm run desktop:build
```

프로덕션 데스크톱 빌드는 `DESKTOP_BUILD=1`로 Next.js 정적 내보내기를 생성한 뒤 Tauri에 포함합니다. 웹 전용 POST 분석 Route는 데스크톱 정적 빌드에서 제외됩니다. 결과는 다음 위치 아래에 생성됩니다.

- `src-tauri/target/release/bundle/nsis/`
- `src-tauri/target/release/bundle/msi/`

## 버전 변경

`package.json`의 `version`을 변경합니다. 웹 UI와 Tauri 번들 설정은 이 값을 읽습니다. Rust crate 자체의 버전도 릴리스 시 `src-tauri/Cargo.toml`에 동일하게 맞춥니다.

## GitHub Release 연결

1. [릴리스 체크리스트](./RELEASE_CHECKLIST.md)를 완료합니다.
2. GitHub에서 버전 태그와 Release를 만듭니다.
3. NSIS 또는 MSI 설치 파일과 체크섬을 Release에 첨부합니다.
4. 검증된 설치 파일의 HTTPS URL을 웹 배포 환경의 `NEXT_PUBLIC_WINDOWS_INSTALLER_URL`에 설정합니다.
5. 웹을 다시 빌드·배포하고 `/download`가 `Available`과 실제 다운로드 링크를 표시하는지 확인합니다.

비밀 키, 코드 서명 인증서 또는 비공개 환경 변수는 `NEXT_PUBLIC_` 변수나 데스크톱 프런트엔드에 넣지 않습니다.

## PDF 기능 호환성

현재 여섯 도구는 서버 처리 API가 아니라 브라우저의 File, Blob, Canvas API와 `pdf-lib`, `pdfjs-dist`, `JSZip`으로 실행됩니다.

| 기능 | 처리 방식 | 인터넷 |
| --- | --- | --- |
| PDF 합치기 | 완전 로컬 | 불필요 |
| PDF 나누기 | 완전 로컬 | 불필요 |
| 페이지 순서 변경·회전·삭제 | 완전 로컬 | 불필요 |
| PDF → JPG·PNG | 완전 로컬 | 불필요 |
| JPG·PNG → PDF | 완전 로컬 | 불필요 |
| PDF 다시 저장 | 완전 로컬 | 불필요 |

2026-07-22에 실제 Windows Tauri WebView에서 여섯 기능의 파일 처리와 결과 다운로드를 모두 검증했습니다. 상세 환경, 결과 파일 구조, 설치·실행·제거 기록은 [데스크톱 테스트 결과](../DESKTOP_TEST_RESULTS.txt)에 있습니다. 암호화되거나 심하게 손상된 PDF는 지원되지 않을 수 있고, 큰 파일은 기기 메모리 한계의 영향을 받습니다.

## PWA 상태

웹앱에는 manifest가 있지만 서비스 워커와 완전한 설치 아이콘 세트가 없어 신뢰할 수 있는 PWA 설치 기능으로 간주하지 않습니다. 따라서 `/download`에는 PWA 설치 버튼을 넣지 않았으며 향후 개선 항목으로 남깁니다.
