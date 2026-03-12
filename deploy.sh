#!/bin/bash

# 김프(GIMP) 웹사이트 배포 스크립트
# 사용법: ./deploy.sh [옵션]
# 옵션:
#   --dev      개발 서버 실행
#   --build    프로젝트 빌드
#   --deploy   Firebase에 배포
#   --all      전체 배포 프로세스 실행

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 의존성 확인
check_dependencies() {
    log_info "의존성 확인 중..."
    
    # Node.js 확인
    if ! command -v node &> /dev/null; then
        log_error "Node.js가 설치되어 있지 않습니다."
        exit 1
    fi
    
    # npm 확인
    if ! command -v npm &> /dev/null; then
        log_error "npm이 설치되어 있지 않습니다."
        exit 1
    fi
    
    # Firebase CLI 확인
    if ! command -v firebase &> /dev/null; then
        log_warning "Firebase CLI가 설치되어 있지 않습니다."
        read -p "Firebase CLI를 설치하시겠습니까? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install -g firebase-tools
            log_success "Firebase CLI 설치 완료"
        else
            log_error "Firebase CLI가 필요합니다."
            exit 1
        fi
    fi
    
    log_success "의존성 확인 완료"
}

# 개발 서버 실행
run_dev_server() {
    log_info "개발 서버 시작 중..."
    
    # Python HTTP 서버 사용 (포트 8080)
    if command -v python3 &> /dev/null; then
        log_info "Python HTTP 서버 실행 (포트 8080)"
        python3 -m http.server 8080 --directory public &
        SERVER_PID=$!
        log_success "개발 서버가 http://localhost:8080 에서 실행 중입니다."
        log_info "서버를 중지하려면 Ctrl+C를 누르세요."
        wait $SERVER_PID
    else
        log_error "Python3가 설치되어 있지 않습니다."
        exit 1
    fi
}

# 프로젝트 빌드
build_project() {
    log_info "프로젝트 빌드 중..."
    
    # public 디렉토리 확인
    if [ ! -d "public" ]; then
        log_error "public 디렉토리가 없습니다."
        exit 1
    fi
    
    # 빌드 타임스탬프 추가
    BUILD_TIME=$(date +"%Y-%m-%d %H:%M:%S")
    echo "<!-- Build: $BUILD_TIME -->" >> public/index.html
    
    log_success "프로젝트 빌드 완료 ($BUILD_TIME)"
}

# Firebase 배포
deploy_to_firebase() {
    log_info "Firebase에 배포 중..."
    
    # Firebase 로그인 확인
    if ! firebase projects:list &> /dev/null; then
        log_warning "Firebase에 로그인되어 있지 않습니다."
        firebase login
    fi
    
    # Firebase 프로젝트 확인
    if [ ! -f ".firebaserc" ] && [ ! -f "firebase.json" ]; then
        log_warning "Firebase 프로젝트가 초기화되지 않았습니다."
        read -p "Firebase 프로젝트를 초기화하시겠습니까? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            firebase init hosting
        else
            log_error "Firebase 프로젝트 초기화가 필요합니다."
            exit 1
        fi
    fi
    
    # 배포 실행
    firebase deploy --only hosting
    
    log_success "Firebase 배포 완료"
}

# 전체 배포 프로세스
deploy_all() {
    log_info "전체 배포 프로세스 시작"
    
    check_dependencies
    build_project
    deploy_to_firebase
    
    log_success "전체 배포 프로세스 완료"
}

# 도움말 표시
show_help() {
    echo "김프(GIMP) 웹사이트 배포 스크립트"
    echo ""
    echo "사용법: $0 [옵션]"
    echo ""
    echo "옵션:"
    echo "  --dev      개발 서버 실행"
    echo "  --build    프로젝트 빌드"
    echo "  --deploy   Firebase에 배포"
    echo "  --all      전체 배포 프로세스 실행"
    echo "  --help     이 도움말 표시"
    echo ""
    echo "예제:"
    echo "  $0 --dev      # 개발 서버 실행"
    echo "  $0 --all      # 전체 배포"
    echo ""
}

# 메인 실행
main() {
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi
    
    case $1 in
        --dev)
            check_dependencies
            run_dev_server
            ;;
        --build)
            check_dependencies
            build_project
            ;;
        --deploy)
            check_dependencies
            deploy_to_firebase
            ;;
        --all)
            deploy_all
            ;;
        --help)
            show_help
            ;;
        *)
            log_error "알 수 없는 옵션: $1"
            show_help
            exit 1
            ;;
    esac
}

# 스크립트 실행
main "$@"