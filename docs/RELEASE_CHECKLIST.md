# Windows 릴리스 체크리스트

- [ ] `package.json`과 `src-tauri/Cargo.toml` 버전이 일치한다.
- [ ] `CHANGELOG.md`와 `/changelog`가 실제 완료 항목만 설명한다.
- [ ] `npm ci`, lint, 타입 검사, 웹 프로덕션 빌드가 성공한다.
- [ ] 여섯 PDF 도구를 데스크톱 개발 빌드에서 각각 검증한다.
- [ ] `npm run desktop:build`로 NSIS/MSI 설치 파일을 생성한다.
- [ ] 깨끗한 Windows 10·11 환경에서 설치, 실행, 제거를 검증한다.
- [ ] 설치 파일에 악성 코드 검사를 수행한다.
- [ ] 공개 배포라면 신뢰할 수 있는 Windows 코드 서명을 적용한다.
- [ ] 설치 파일 SHA-256 체크섬을 기록한다.
- [ ] GitHub Release에 설치 파일과 체크섬을 첨부한다.
- [ ] `NEXT_PUBLIC_WINDOWS_INSTALLER_URL`에 검증된 Release 자산 URL을 설정한다.
- [ ] `/download`의 링크, 버전, 시스템 요구사항과 네트워크 안내를 최종 확인한다.
