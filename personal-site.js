        const pageLanguage = document.documentElement.lang || 'zh-CN';
        const normalizedLanguage = pageLanguage.toLowerCase();
        const isEnglishPage = normalizedLanguage.startsWith('en');
        const isGermanPage = normalizedLanguage.startsWith('de');
        const siteCopy = isGermanPage ? {
            formSuccess: 'Nachricht erfolgreich gesendet! Ich antworte so schnell wie möglich.',
            contactMethod: 'Kontaktmethode',
            contactLabels: {
                email: 'E-Mail',
                phone: 'Telefon',
                qq: 'QQ',
                wechat: 'WeChat',
                whatsapp: 'WhatsApp'
            },
            requesting: (label) => `${label} wird vom Server angefragt...`,
            serverValidationFailed: 'Serververifizierung fehlgeschlagen. Bitte versuche es später erneut.',
            noContactContent: 'Der Server hat keine Kontaktdaten zurückgegeben.',
            shown: (label) => `${label} wird jetzt angezeigt.`,
            requestFailed: 'Anfrage fehlgeschlagen. Bitte versuche es später erneut.',
            turnstileKeyMissing: 'Bitte konfiguriere den Cloudflare-Turnstile-Site-Key in contact-de.html.',
            loadingTurnstile: 'Cloudflare Turnstile wird geladen, bitte warten...',
            verificationExpired: 'Die Verifizierung ist abgelaufen. Bitte schließe sie erneut ab.',
            verificationLoadFailed: 'Die Verifizierung konnte nicht geladen werden. Bitte aktualisiere die Seite und versuche es erneut.',
            verifyToShow: (label) => `Bitte schließe die Verifizierung ab, um ${label} anzuzeigen.`
        } : isEnglishPage ? {
            formSuccess: 'Message sent successfully! I will reply as soon as possible.',
            contactMethod: 'contact method',
            contactLabels: {
                email: 'email',
                phone: 'phone',
                qq: 'QQ',
                wechat: 'WeChat',
                whatsapp: 'WhatsApp'
            },
            requesting: (label) => `Requesting ${label} from the server...`,
            serverValidationFailed: 'Server verification failed. Please try again later.',
            noContactContent: 'The server did not return contact details.',
            shown: (label) => `${label} is now shown.`,
            requestFailed: 'Request failed. Please try again later.',
            turnstileKeyMissing: 'Please configure the Cloudflare Turnstile site key in contact-en.html.',
            loadingTurnstile: 'Loading Cloudflare Turnstile, please wait...',
            verificationExpired: 'Verification expired. Please complete it again.',
            verificationLoadFailed: 'Verification failed to load. Please refresh the page and try again.',
            verifyToShow: (label) => `Please complete verification to show ${label}.`
        } : {
            formSuccess: '消息已发送成功！我会尽快回复你。',
            contactMethod: '联系方式',
            contactLabels: {
                email: '电子邮箱',
                phone: '电话',
                qq: 'QQ',
                wechat: '微信',
                whatsapp: 'WhatsApp'
            },
            requesting: (label) => `正在向服务器请求${label}...`,
            serverValidationFailed: '服务器验证失败，请稍后再试。',
            noContactContent: '服务器没有返回联系方式内容。',
            shown: (label) => `${label}已显示。`,
            requestFailed: '请求失败，请稍后再试。',
            turnstileKeyMissing: '请先在 contact.html 中填写 Cloudflare Turnstile 站点密钥。',
            loadingTurnstile: '正在加载 Cloudflare Turnstile，请稍候...',
            verificationExpired: '验证已过期，请重新完成验证。',
            verificationLoadFailed: '验证加载失败，请刷新页面后重试。',
            verifyToShow: (label) => `请完成验证以显示${label}。`
        };

        const languageSelectors = document.querySelectorAll('.language-selector');
        const closeLanguageSelectors = (exceptSelector = null) => {
            languageSelectors.forEach(selector => {
                if (selector === exceptSelector) return;
                selector.classList.remove('open');
                selector.querySelector('.language-trigger')?.setAttribute('aria-expanded', 'false');
            });
        };

        languageSelectors.forEach(selector => {
            const trigger = selector.querySelector('.language-trigger');
            if (!trigger) return;

            trigger.addEventListener('click', (event) => {
                event.stopPropagation();
                const willOpen = !selector.classList.contains('open');
                closeLanguageSelectors(selector);
                selector.classList.toggle('open', willOpen);
                trigger.setAttribute('aria-expanded', String(willOpen));
            });

            selector.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        });

        document.addEventListener('click', () => {
            closeLanguageSelectors();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeLanguageSelectors();
            }
        });

        // Add interactive parallax effect to background shapes
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const xPos = (x - 0.5) * speed * 20;
                const yPos = (y - 0.5) * speed * 20;
                shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        });

        // Add scroll-based animations
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.bg-shapes');
            if (!parallax) return;
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });

        // Add click ripple effect to glass elements
        document.querySelectorAll('.glass').forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('div');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Form submission handling
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Create success message
                const successMsg = document.createElement('div');
                successMsg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(46, 204, 113, 0.9);
                    color: white;
                    padding: 20px 40px;
                    border-radius: 10px;
                    backdrop-filter: blur(20px);
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                `;
                successMsg.textContent = siteCopy.formSuccess;
                
                document.body.appendChild(successMsg);
                
                // Remove message after 3 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
                
                // Reset form
                this.reset();
            });
        }

        // Secure contact reveal through Cloudflare Turnstile + Worker API
        const secureContact = document.getElementById('secure-contact');
        if (secureContact) {
            const apiUrl = secureContact.dataset.apiUrl;
            const siteKey = secureContact.dataset.turnstileSiteKey;
            const turnstileContainer = document.getElementById('contact-turnstile');
            const statusText = document.getElementById('contact-reveal-status');
            const revealButtons = secureContact.querySelectorAll('.reveal-contact-button');
            const typeLabels = siteCopy.contactLabels;
            let selectedType = null;
            let turnstileWidgetId = null;

            const setStatus = (message) => {
                if (statusText) statusText.textContent = message;
            };

            const setButtonsDisabled = (disabled) => {
                revealButtons.forEach(button => {
                    button.disabled = disabled;
                });
            };

            const clearTurnstile = () => {
                if (window.turnstile && turnstileWidgetId !== null) {
                    window.turnstile.remove(turnstileWidgetId);
                    turnstileWidgetId = null;
                }
                if (turnstileContainer) {
                    turnstileContainer.innerHTML = '';
                }
            };

            const extractContactValue = (payload, type) => {
                if (typeof payload === 'string') return payload;
                if (!payload || typeof payload !== 'object') return '';

                const candidates = [
                    payload.value,
                    payload.contact,
                    payload.contact?.[type],
                    payload.data,
                    payload.data?.value,
                    payload.data?.contact,
                    payload.data?.[type],
                    payload[type],
                    payload.text,
                    payload.result
                ];

                for (const candidate of candidates) {
                    const value = extractContactValue(candidate, type);
                    if (value) return value;
                }

                return '';
            };

            const revealContact = async (token) => {
                if (!selectedType) return;
                setButtonsDisabled(true);
                setStatus(siteCopy.requesting(typeLabels[selectedType] || siteCopy.contactMethod));
                let revealSucceeded = false;

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            type: selectedType,
                            token
                        })
                    });

                    const responseText = await response.text();
                    let data = responseText;
                    try {
                        data = JSON.parse(responseText);
                    } catch {
                        // Plain text responses are valid too.
                    }

                    if (!response.ok) {
                        throw new Error(data.error || siteCopy.serverValidationFailed);
                    }

                    const value = extractContactValue(data, selectedType);

                    if (!value) {
                        throw new Error(siteCopy.noContactContent);
                    }

                    const item = secureContact.querySelector(`[data-contact-type="${selectedType}"]`);
                    const valueNode = item?.querySelector('.contact-value');
                    if (valueNode) valueNode.textContent = value;
                    revealSucceeded = true;
                    clearTurnstile();
                    setStatus(siteCopy.shown(typeLabels[selectedType] || siteCopy.contactMethod));
                } catch (error) {
                    setStatus(error.message || siteCopy.requestFailed);
                } finally {
                    setButtonsDisabled(false);
                    if (!revealSucceeded && window.turnstile && turnstileWidgetId !== null) {
                        window.turnstile.reset(turnstileWidgetId);
                    }
                }
            };

            const renderTurnstile = () => {
                if (!siteKey || siteKey === 'YOUR_TURNSTILE_SITE_KEY') {
                    setStatus(siteCopy.turnstileKeyMissing);
                    return;
                }

                if (!window.turnstile) {
                    setStatus(siteCopy.loadingTurnstile);
                    window.setTimeout(renderTurnstile, 400);
                    return;
                }

                if (turnstileWidgetId === null) {
                    turnstileWidgetId = window.turnstile.render(turnstileContainer, {
                        sitekey: siteKey,
                        callback: revealContact,
                        'expired-callback': () => setStatus(siteCopy.verificationExpired),
                        'error-callback': () => setStatus(siteCopy.verificationLoadFailed)
                    });
                } else {
                    window.turnstile.reset(turnstileWidgetId);
                }
            };

            revealButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const item = button.closest('.secure-contact-item');
                    selectedType = item?.dataset.contactType || null;
                    if (!selectedType) return;

                    clearTurnstile();
                    setStatus(siteCopy.verifyToShow(typeLabels[selectedType] || siteCopy.contactMethod));
                    renderTurnstile();
                });
            });
        }

        // Add fade in animation
        const fadeStyle = document.createElement('style');
        fadeStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(fadeStyle);
