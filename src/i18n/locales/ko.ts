/**
 * 한국어 언어 팩
 */
export default {
  // 공통
  common: {
    yes: "예",
    no: "아니오",
    skip: "건너뛰기",
    cancel: "취소",
    confirm: "확인",
    error: "오류",
    success: "성공",
  },

  // 패키지 선택
  package: {
    selectPackage: "게시할 패키지를 선택하세요",
    selectedPackage: "선택된 패키지",
  },

  // Changelog
  changelog: {
    input: "changelog를 입력하세요 (한 줄 입력, 여러 번 입력 지원, Enter 키로 종료)",
    singleLineHint: "여러 번의 한 줄 입력을 지원하며, Enter 키로 종료합니다. 입력이 비어 있으면 기본 버전 업그레이드 기록이 사용됩니다",
    empty: "changelog는 비어 있을 수 없습니다",
    generate: "CHANGELOG.md 파일을 생성하시겠습니까?",
    usingDefault: "기본 changelog 사용: 버전 업그레이드 기록",
    defaultContent: "버전 업그레이드: {currentVersion} → {newVersion}",
  },

  // 버전
  version: {
    selectType: "버전 유형 선택",
    currentVersion: "현재 버전",
    finalVersion: "최종 버전",
    customVersion: "사용자 정의 버전",
    customVersionDesc: "버전을 수동으로 입력",
    inputVersion: "버전 번호를 입력하세요",
    example: "예",
    versionEmpty: "버전은 비어 있을 수 없습니다",
    patch: "패치 버전 - 버그 수정",
    minor: "마이너 버전 - 새 기능, 하위 호환",
    major: "메이저 버전 - 주요 변경 사항",
    invalid: "유효하지 않은 버전 번호",
    invalidWithVersion: "유효하지 않은 버전 번호: {version}",
    cannotGenerate: "다음 버전을 생성할 수 없습니다",
    unsupportedType: "지원되지 않는 릴리스 유형",
    unsupportedTypeWithType: "지원되지 않는 릴리스 유형: {type}",
    versionFormat: "{current} -> {next}",
  },

  // 스크립트
  script: {
    select: "실행할 스크립트를 선택하세요 (보통 build)",
    noScripts: "이 패키지에는 스크립트가 없습니다",
    running: "스크립트 실행 중",
    success: "스크립트 실행 성공",
    failed: "스크립트 실행 실패",
    notFound: "스크립트를 찾을 수 없습니다",
    notFoundWithName: "스크립트 \"{name}\"를 찾을 수 없습니다",
    executionFailed: "스크립트 실행 실패, 종료 코드: {exitCode}",
  },

  // Git
  git: {
    pushTag: "git tag를 푸시하시겠습니까?",
    createTagFailed: "git tag 생성 실패, 종료 코드: {exitCode}",
    pushTagFailed: "git tag 푸시 실패, 종료 코드: {exitCode}",
  },

  // Registry
  registry: {
    input: "npm registry 주소를 입력하세요",
    empty: "registry 주소는 비어 있을 수 없습니다",
    invalid: "유효한 URL을 입력하세요",
  },

  // 게시
  publish: {
    preview: "게시 구성 미리보기",
    packageName: "패키지 이름",
    currentVersion: "현재 버전",
    newVersion: "새 버전",
    tag: "Tag",
    changelog: "Changelog",
    registry: "Registry",
    pushTag: "Tag 푸시",
    generateChangelog: "Changelog 생성",
    script: "스크립트",
    confirm: "게시를 확인하시겠습니까?",
    publishing: "npm에 게시 중...",
    success: "게시 성공!",
    failed: "게시 실패",
    cancelled: "게시 취소됨",
    error: "게시 중 오류 발생",
    generalError: "오류",
    npmPublishFailed: "npm 게시 실패, 종료 코드: {exitCode}",
    npmNotLoggedIn: "npm registry에 로그인하지 않았습니다: {registry}，먼저 'npm login --registry {registry}'를 실행하세요",
    npmAuthCheckFailed: "npm 로그인 상태 확인 실패 (registry: {registry}): {error}",
    needOtp: "npm 게시 일회용 코드(OTP)를 입력해야 합니까?",
    inputOtp: "일회용 코드(OTP)를 입력하세요",
    otpEmpty: "일회용 코드는 비어 있을 수 없습니다",
    otpInvalid: "일회용 코드는 6자리 숫자여야 합니다",
    otp: "일회용 코드(OTP)",
    rollingBack: "게시 실패, 변경 사항 롤백 중...",
    rollbackComplete: "롤백 완료",
    rollbackFailed: "롤백 실패, 버전과 changelog를 수동으로 복원하세요:",
  },

  // 성공 메시지
  success: {
    title: "게시 성공!",
    packageName: "패키지 이름",
    version: "버전",
    registry: "Registry",
    thanks: "bun-push를 사용해 주셔서 감사합니다!",
  },

  // Changelog 유형
  changelogTypes: {
    added: "추가됨",
    changed: "변경됨",
    deprecated: "사용 중단됨",
    removed: "제거됨",
    fixed: "수정됨",
    security: "보안",
  },

  // Workspace
  workspace: {
    packageJsonNotFound: "package.json 파일을 찾을 수 없습니다",
    workspacesConfigInvalid: "workspaces 구성이 유효하지 않습니다",
    packageNotFound: "패키지를 찾을 수 없습니다",
    packageNotFoundByPath: "경로 {path}에서 패키지를 찾을 수 없습니다",
    monorepoRequiresPath: "monorepo 모드에서는 packagePath를 지정하거나 CLI 모드를 사용해야 합니다",
  },
};
