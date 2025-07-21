class ChatBot {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.apiKeyInput = document.getElementById('apiKey');
        this.themeToggle = document.getElementById('themeToggle');
        this.charCounter = document.getElementById('charCounter');
        this.statusDot = document.getElementById('statusDot');
        this.statusText = document.getElementById('statusText');
        this.clearChatBtn = document.getElementById('clearChat');
        this.toggleApiKeyBtn = document.getElementById('toggleApiKey');
        
        // 명언 데이터
        this.quotes = [
            "성공은 준비된 기회와 노력이 만나는 지점이다. - 루이 파스퇴르",
            "미래는 자신의 꿈의 아름다움을 믿는 사람들의 것이다. - 엘레노어 루즈벨트",
            "오늘 하루도 새로운 가능성으로 가득하다. - 오프라 윈프리",
            "변화를 원한다면 행동하라. 행동하지 않으면 아무것도 바뀌지 않는다. - 마하트마 간디",
            "최고의 시간은 바로 지금이다. - 중국 속담",
            "꿈을 꾸는 것은 첫 번째 단계일 뿐, 실현하는 것이 진짜다. - 월트 디즈니",
            "실패는 성공으로 가는 길의 디딤돌이다. - 토마스 에디슨",
            "인생은 10%의 일어나는 일과 90%의 그것에 대한 반응이다. - 찰스 스윈돌",
            "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 당신이 옳다. - 헨리 포드",
            "시작이 반이다. - 아리스토텔레스",
            "행복은 습관이다. 그것을 몸에 지니라. - 허버드",
            "불가능이라는 것은 사실이 아니라 의견이다. - 파울로 코엘료",
            "성공의 비밀은 시작하는 것이다. - 마크 트웨인",
            "오늘이 당신 인생의 첫날이라고 생각하라. - 애비 호프만",
            "위대한 일을 하려면 당신이 하는 일을 사랑해야 한다. - 스티브 잡스",
            "지혜로운 사람은 기회를 놓치지 않는다. - 윌리엄 셰익스피어",
            "꿈꾸는 자만이 꿈을 이룬다. - 앙투안 드 생텍쥐페리",
            "인생은 자전거를 타는 것과 같다. 균형을 잡으려면 계속 움직여야 한다. - 알베르트 아인슈타인",
            "가장 큰 위험은 위험을 감수하지 않는 것이다. - 마크 저커버그",
            "행동은 모든 성공의 핵심이다. - 파블로 피카소",
            "자신을 믿어라. 당신은 생각보다 강하다. - 익명",
            "포기하지 마라. 지금 겪고 있는 고통은 앞으로 겪을 성취보다 작다. - 익명",
            "모든 성취는 시도하려는 의지에서 시작된다. - 웨인 그레츠키",
            "당신의 한계는 당신이 설정한 것뿐이다. - 리스 윌리스",
            "성공은 끝이 아니고, 실패는 치명적이지 않다. 중요한 것은 계속하려는 용기다. - 윈스턴 처칠"
        ];
        
        this.initializeEventListeners();
        this.initializeTheme();
        this.setApiKey();
        this.showWelcomeMessage();
        this.updateStatus();
    }

    initializeEventListeners() {
        // 전송 버튼 클릭
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter 키로 메시지 전송
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 입력 글자 수 카운터
        this.userInput.addEventListener('input', () => {
            const length = this.userInput.value.length;
            this.charCounter.textContent = `${length}/500`;
            
            if (length > 450) {
                this.charCounter.style.color = 'var(--error-color)';
            } else if (length > 350) {
                this.charCounter.style.color = 'var(--warning-color)';
            } else {
                this.charCounter.style.color = 'var(--text-muted)';
            }
        });
        
        // API 키 입력
        this.apiKeyInput.addEventListener('input', () => {
            this.apiKey = this.apiKeyInput.value.trim();
            localStorage.setItem('openai_api_key', this.apiKey);
            this.updateStatus();
        });
        
        // 테마 토글
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // 채팅 지우기
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        
        // API 키 보기/숨기기 토글
        this.toggleApiKeyBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
        
        // 빠른 액션 버튼들
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.getAttribute('data-text');
                this.userInput.value = text;
                this.userInput.focus();
                this.userInput.dispatchEvent(new Event('input'));
            });
        });
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    updateStatus() {
        if (this.apiKey) {
            this.statusDot.style.background = 'var(--success-color)';
            this.statusText.textContent = '준비됨';
        } else {
            this.statusDot.style.background = 'var(--warning-color)';
            this.statusText.textContent = 'API 키 필요';
        }
    }

    clearChat() {
        if (confirm('채팅 기록을 모두 삭제하시겠습니까?')) {
            this.chatMessages.innerHTML = '';
            this.showWelcomeMessage();
        }
    }

    toggleApiKeyVisibility() {
        const type = this.apiKeyInput.type === 'password' ? 'text' : 'password';
        this.apiKeyInput.type = type;
        
        const icon = this.toggleApiKeyBtn.querySelector('svg');
        if (type === 'text') {
            icon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            icon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    }

    setApiKey() {
        if (this.apiKey) {
            this.apiKeyInput.value = this.apiKey;
        }
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        
        if (!message) return;
        
        if (!this.apiKey) {
            alert('OpenAI API 키를 먼저 입력해주세요.');
            this.apiKeyInput.focus();
            return;
        }

        // 사용자 메시지 추가
        this.addMessage(message, 'user');
        this.userInput.value = '';
        this.setButtonState(true);

        // 타이핑 인디케이터 표시
        const typingIndicator = this.showTypingIndicator();

        try {
            // ChatGPT API 호출
            const response = await this.callChatGPT(message);
            
            // 타이핑 인디케이터 제거
            this.removeTypingIndicator(typingIndicator);
            
            // 봇 응답 추가
            this.addMessage(response, 'bot');
            
        } catch (error) {
            // 타이핑 인디케이터 제거
            this.removeTypingIndicator(typingIndicator);
            
            console.error('Error:', error);
            let errorMessage = '죄송합니다. 오류가 발생했습니다.';
            
            if (error.message.includes('401')) {
                errorMessage = 'API 키가 유효하지 않습니다. 올바른 OpenAI API 키를 입력해주세요.';
            } else if (error.message.includes('429')) {
                errorMessage = 'API 사용량 한도에 도달했습니다. 잠시 후 다시 시도해주세요.';
            } else if (error.message.includes('Network')) {
                errorMessage = '네트워크 연결을 확인해주세요.';
            }
            
            this.addMessage(errorMessage, 'bot');
        } finally {
            this.setButtonState(false);
        }
    }

    async callChatGPT(message) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: '당신은 도움이 되고 친근한 AI 어시스턴트입니다. 한국어로 정중하고 자세하게 답변해주세요.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${this.formatMessage(content)}</p>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(content) {
        // 간단한 마크다운 스타일 적용
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        
        return typingDiv;
    }

    removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }

    setButtonState(isLoading) {
        this.sendButton.disabled = isLoading;
        this.userInput.disabled = isLoading;
        
        if (isLoading) {
            this.sendButton.innerHTML = '<div class="loading"></div>';
            this.statusDot.style.background = 'var(--warning-color)';
            this.statusText.textContent = '처리 중...';
        } else {
            this.sendButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
            `;
            this.updateStatus();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    getTodayQuote() {
        // 매번 랜덤하게 명언 선택
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[randomIndex];
    }

    showWelcomeMessage() {
        // 기존 웰컴 메시지 제거
        const existingWelcome = this.chatMessages.querySelector('.welcome-message');
        if (existingWelcome) {
            existingWelcome.remove();
        }

        const todayQuote = this.getTodayQuote();
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'message bot-message welcome-message';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        welcomeDiv.innerHTML = `
            <div class="message-content">
                <p>안녕하세요! 오늘도 좋은 하루 되세요! 😊</p>
                <br>
                <p><strong>📖 오늘의 명언</strong></p>
                <p style="font-style: italic; color: var(--accent-color); margin-top: 8px; padding: 12px; background: var(--glass-bg); border-radius: 12px; border-left: 4px solid var(--primary-color);">
                    "${todayQuote}"
                </p>
                <br>
                <p>💡 아래 빠른 버튼을 사용하거나 자유롭게 대화해보세요!</p>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        this.chatMessages.appendChild(welcomeDiv);
        this.scrollToBottom();
    }
}

// 페이지 로드 시 챗봇 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    // Ctrl + / 또는 Cmd + / 로 테마 토글
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('themeToggle').click();
    }
});
