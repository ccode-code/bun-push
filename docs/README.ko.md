# bun-push

<div align="center">

**monorepo와 단일 저장소를 모두 지원하는 npm 패키지 게시 도구로, CLI와 JS API 사용을 모두 지원합니다**

[🇨🇳 中文](../README.md) | [🇺🇸 English](README.en.md) | [🇯🇵 日本語](README.ja.md) | 🇰🇷 **한국어**

</div>

---

## ✨ 기능

- 🎯 **Monorepo 및 단일 저장소 지원**: 프로젝트 유형을 자동 감지하고 workspace 모드를 지원
- 📦 **대화형 게시 프로세스**: 사용자 친화적인 명령줄 인터페이스
- 🔄 **자동 버전 관리**: 시맨틱 버전 관리(semver) 지원
- 🏷️ **Git Tag 관리**: git tag를 자동으로 생성하고 푸시
- 📝 **Changelog 지원**: 게시 전 변경 로그를 기록하고 CHANGELOG.md 파일을 자동 생성
- 🛠️ **스크립트 실행**: 게시 전 빌드 스크립트(build 등) 실행 지원
- 🎨 **아름다운 UI**: 로딩 애니메이션과 성공 알림 포함
- 📚 **JS API**: Node.js 스크립트용 프로그래밍 API 제공
- 🌍 **다국어 지원**: 중국어, 영어, 일본어, 한국어를 지원하며 시스템 언어를 자동 감지

## 📦 설치

```bash
# bun 사용
bun add -g bun-push

# 또는 npm 사용
npm install -g bun-push

# 또는 yarn 사용
yarn global add bun-push

# 또는 pnpm 사용
pnpm add -g bun-push
```

## 🌍 다국어 지원

bun-push는 다음 언어를 지원합니다:
- 🇨🇳 중국어
- 🇺🇸 영어
- 🇯🇵 일본어
- 🇰🇷 한국어

### 언어 설정

도구는 시스템 언어를 자동으로 감지합니다. 언어를 수동으로 지정하려면 환경 변수를 사용하세요:

```bash
# 언어를 영어로 설정
export BUN_PUSH_LANG=en
bun-push

# 언어를 일본어로 설정
export BUN_PUSH_LANG=ja
bun-push

# 언어를 한국어로 설정
export BUN_PUSH_LANG=ko
bun-push

# 언어를 중국어로 설정
export BUN_PUSH_LANG=zh
bun-push
```

## 🚀 사용법

### CLI 모드

프로젝트 루트 디렉토리에서 실행:

```bash
bun-push
```

CLI는 다음 프로세스를 안내합니다:

1. **패키지 선택** (monorepo 모드에서)
   - workspace 설정을 자동 감지
   - 게시 가능한 모든 패키지를 나열하여 선택

2. **Changelog 입력**
   - 이번 릴리스의 변경 사항 설명 입력
   - 여러 줄 입력 지원, 한 줄에 하나의 항목
   - 형식: `추가됨: 설명`, `수정됨: 설명`, `변경됨: 설명` 등
   - 간단한 형식도 지원: `- 설명`

3. **버전 유형 선택**
   - `patch`: 패치 버전 (1.0.0 -> 1.0.1)
   - `minor`: 마이너 버전 (1.0.0 -> 1.1.0)
   - `major`: 메이저 버전 (1.0.0 -> 2.0.0)
   - `custom`: 사용자 정의 버전 번호

4. **실행할 스크립트 선택** (선택 사항)
   - 일반적으로 빌드를 위해 `build` 스크립트 선택
   - 스크립트 실행을 건너뛸 수도 있음

5. **Git Tag 푸시 확인**
   - git tag를 생성하고 푸시할지 선택

6. **CHANGELOG.md 파일 생성 확인**
   - CHANGELOG.md 파일을 자동으로 생성하거나 업데이트할지 선택
   - 파일은 [Keep a Changelog](https://keepachangelog.com/) 형식을 따름

7. **npm Registry 주소 확인**
   - 기본값은 공식 npm registry
   - 다른 registry(프라이빗 npm 등)로 전환 가능

8. **최종 확인**
   - 게시 구성을 미리보기
   - 확인 후 게시 시작

### JS API 모드

```typescript
import { NpmPush, publishPackage } from "bun-push";

// 방법 1: 클래스 사용
const npmPush = new NpmPush();

// workspace 정보 가져오기
const workspaceInfo = npmPush.getWorkspaceInfo();
console.log("monorepo 여부:", workspaceInfo.isMonorepo);

// 모든 패키지 가져오기
const packages = npmPush.getPackages();
console.log("패키지 목록:", packages.map((pkg) => pkg.name));

// 패키지 찾기
const pkg = npmPush.findPackage("my-package");

// 패키지 게시
await npmPush.publish({
  packagePath: "./packages/my-package",
  changelog: "수정됨: 중요한 버그 수정",
  version: "1.0.1",
  script: "build",
  pushTag: true,
  registry: "https://registry.npmjs.org/",
  generateChangelog: true, // CHANGELOG.md 파일 생성
});

// 방법 2: 함수형 API 사용
await publishPackage({
  packagePath: "./packages/my-package",
  changelog: "추가됨: 새 기능\n수정됨: 버그 수정",
  version: "1.1.0",
  script: "build",
  pushTag: true,
  registry: "https://registry.npmjs.org/",
  generateChangelog: true, // CHANGELOG.md 파일 생성
});
```

## 📖 API 문서

### `NpmPush` 클래스

#### 생성자

```typescript
new NpmPush(workingDir?: string)
```

- `workingDir`: 작업 디렉토리, 기본값은 현재 디렉토리

#### 메서드

##### `getWorkspaceInfo()`

workspace 정보를 가져옵니다.

반환: `WorkspaceInfo`

##### `getPackages()`

모든 패키지 목록을 가져옵니다.

반환: `PackageInfo[]`

##### `findPackage(packageName: string)`

패키지 이름으로 패키지를 찾습니다.

매개변수:
- `packageName`: 패키지 이름

반환: `PackageInfo | undefined`

##### `publish(options: PublishOptions)`

패키지를 게시합니다.

매개변수:
- `options.packagePath?`: 패키지 경로 (monorepo 모드에서는 필수)
- `options.skipConfirm?`: 대화형 확인을 건너뛸지 여부
- `options.version?`: 사용자 정의 버전 번호
- `options.changelog?`: changelog 내용
- `options.tag?`: git tag 이름
- `options.script?`: 실행할 스크립트
- `options.pushTag?`: git tag를 푸시할지 여부
- `options.registry?`: npm registry 주소
- `options.generateChangelog?`: CHANGELOG.md 파일을 생성할지 여부

### `publishPackage(options: PublishOptions)`

패키지를 게시하는 함수형 API.

## 📝 Changelog 형식

bun-push는 [Keep a Changelog](https://keepachangelog.com/) 표준을 준수하는 CHANGELOG.md 파일의 자동 생성을 지원합니다.

### 지원되는 형식

1. **유형 지정 형식** (권장):
   ```
   추가됨: 새 기능 추가
   수정됨: 중요한 버그 수정
   변경됨: 성능 개선
   제거됨: 사용 중단된 API 제거
   보안: 보안 취약점 수정
   ```

2. **간단한 형식**:
   ```
   - 새 기능 추가
   - 버그 수정
   - 성능 개선
   ```

### Changelog 유형

- `추가됨` / `added`: 새 기능
- `변경됨` / `changed`: 기존 기능에 대한 변경
- `사용 중단됨` / `deprecated`: 제거될 기능
- `제거됨` / `removed`: 제거된 기능
- `수정됨` / `fixed`: 버그 수정
- `보안` / `security`: 보안 관련 수정

생성된 CHANGELOG.md 파일은 자동으로 유형별로 그룹화되며 버전 번호와 릴리스 날짜가 포함됩니다.

## 🛠️ 개발

```bash
# 저장소 클론
git clone https://github.com/ccode/bun-push.git
cd bun-push

# 의존성 설치
bun install

# 개발 모드로 실행
bun run dev

# 빌드
bun run build

# 테스트 실행
bun test

# 커버리지와 함께 테스트 실행
bun test --coverage
```

## 📝 요구사항

- Bun >= 1.1.0
- TypeScript 5.7+

> 참고: 이것은 Bun의 네이티브 타입 시스템을 사용하는 완전한 Bun 프로젝트이며, Node.js 타입 정의에 의존하지 않습니다.

## 🤝 기여

Issue와 Pull Request를 환영합니다!

자세한 내용은 [기여 가이드](.github/CONTRIBUTING.ko.md)를 참조하세요.

## 📄 라이선스

이 프로젝트는 [MIT License](../LICENSE)에 따라 라이선스됩니다.

전체 라이선스 텍스트는 [LICENSE](../LICENSE) 파일을 참조하세요. 더 자세한 법적 정보는 [LEGAL.ko.md](LEGAL.ko.md)를 참조하세요.

Copyright (c) 2024 ccode
