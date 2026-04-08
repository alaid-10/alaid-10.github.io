document.addEventListener('DOMContentLoaded', () => {

    /* --- Splash Screen Logic --- */
    const splashScreen = document.getElementById('splash-screen');
    const greetingContainer = document.getElementById('splash-greeting-container');
    const footerPlaceholder = document.getElementById('footer-greeting-placeholder');
    let splashDismissed = false;

    const dismissSplash = (e) => {
        if (splashDismissed) return;
        
        // Ensure user is trying to scroll down (wheel > 0 or touch swipe up)
        if (e.type === 'wheel' && e.deltaY <= 0) return; 

        splashDismissed = true;
        document.body.classList.remove('no-scroll');
        splashScreen.classList.add('hide-splash');
        
        setTimeout(() => {
            if (footerPlaceholder && greetingContainer) {
                // Adjust some styles for the footer positioning before moving it
                greetingContainer.style.height = '120px';
                greetingContainer.style.marginBottom = '0';
                footerPlaceholder.appendChild(greetingContainer);
                splashScreen.remove();
            }
            // Trigger a manual scroll event to trigger intersection observers just in case
            window.dispatchEvent(new Event('scroll'));
        }, 800);
    };

    // Listen for scroll attempts to dismiss the splash
    window.addEventListener('wheel', dismissSplash);
    
    // For touch devices
    let touchStartY = 0;
    window.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, {passive: true});
    window.addEventListener('touchmove', e => {
        const touchEndY = e.touches[0].clientY;
        if (touchStartY - touchEndY > 20) { // swipe up (scroll down)
            dismissSplash({ type: 'touch' });
        }
    }, {passive: true});

    // Fallback: If user clicks the splash screen, dismiss it too
    if (splashScreen) {
        splashScreen.addEventListener('click', () => dismissSplash({ type: 'click' }));
    }

    // Auto-dismiss after 5 seconds if the user hasn't interacted
    setTimeout(() => {
        dismissSplash({ type: 'auto-timeout' });
    }, 5000);

    // If no splash screen exists (e.g. blog page), immediately reveal everything
    if (!splashScreen) {
        document.body.classList.remove('no-scroll');
        document.querySelectorAll('.reveal, .reveal-text').forEach(el => {
            el.classList.add('active');
        });
    }

    /* --- Dynamic Greetings (25 Languages) --- */
    const greetings = [
        "Hello",            // English
        "नमस्ते",              // Namaste (Hindi)
        "வணக்கம்",            // Vanakkam (Tamil)
        "നമസ്കാരം",          // Namaskaram (Malayalam)
        "నమస్కారం",          // Namaskaram (Telugu)
        "ನಮಸ್ಕಾರ",           // Namaskara (Kannada)
        "নমস্কার",            // Nomoshkar (Bengali)
        "નમસ્તે",             // Namaste (Gujarati)
        "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",       // Sat Sri Akal (Punjabi)
        "Hola",             // Spanish
        "Bonjour",          // French
        "Hallo",            // German
        "Ciao",             // Italian
        "Olá",              // Portuguese
        "Привет",           // Russian
        "你好",              // Chinese
        "こんにちは",          // Japanese
        "안녕하세요",          // Korean
        "مرحباً",             // Arabic
        "Merhaba",          // Turkish
        "Γεια σας",         // Greek
        "Shalom",           // Hebrew
        "Sawasdee",         // Thai
        "Xin chào",         // Vietnamese
        "Kamusta"           // Tagalog
    ];

    const greetingElement = document.getElementById('dynamic-greeting');
    let currentIndex = 0;

    if (greetingElement) {
        // Change greeting every 1 second with a faster fade effect
        setInterval(() => {
            // Fade out
            greetingElement.style.opacity = '0';
            greetingElement.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                // Update text
                currentIndex = (currentIndex + 1) % greetings.length;
                greetingElement.textContent = greetings[currentIndex];
                
                // Re-setup initial transform for fade in
                greetingElement.style.transform = 'translateY(20px)';
                
                // Force reflow
                void greetingElement.offsetWidth;
                
                // Fade in
                greetingElement.style.opacity = '1';
                greetingElement.style.transform = 'translateY(0)';
            }, 200); // Wait 200ms before swapping
        }, 1000); 

        // Initial greeting transition style setup
        greetingElement.style.transition = 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
    }


    /* --- Intersection Observer for Scroll Animations --- */
    const revealElements = document.querySelectorAll('.reveal, .reveal-text');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed if you only want it to happen once
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Immediately trigger Hero active states since they are mostly visible on load
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal-text').forEach(el => {
            el.classList.add('active');
        });
    }, 100);

    /* --- Internationalization (i18n) Logic --- */
    const translations = {
        en: {
            nav_blog: "Blog", nav_portfolio: "Portfolio", nav_about: "About", nav_work: "Work", nav_cert: "Certificates", nav_contact: "Contact", nav_lang: "Language",
            hero_hello: "Hello,", hero_title: "I'm Aidan Anu Sam.", hero_subtitle: "Aspiring Computer Science Engineer building the future.",
            hero_explore: "Explore My World", hero_resume: "Download Resume", scroll_indicator: "Scroll",
            about_heading: "My Journey",
            about_p1: "It started with curiosity. The need to understand how things worked beneath the surface.",
            about_p2: "I recently completed my 12th grade and am currently applying to colleges for a B.Tech in Computer Science Engineering. I am deeply passionate about technology, software development, and solving complex problems. Over time, that curiosity became focus. The more I learned, the more I wanted to build things that felt intentional.",
            about_p3: "What I build tomorrow is shaped by everything I am learning today: curiosity, discipline, and a constant drive to improve.",
            stat1_num: "12th", stat1_label: "Grade Completed", stat2_num: "B.Tech", stat2_label: "CSE Aspirant",
            projects_heading: "Featured Work",
            proj1_title: "Vision API Explorer", proj1_desc: "A web application built to test and explore image recognition technologies in real-time.",
            proj2_title: "Algorithm Visualizer", proj2_desc: "An interactive, educational tool allowing students to visualize sorting algorithms step-by-step.",
            proj3_title: "Portfolio V1", proj3_desc: "My personal portfolio built entirely with semantic HTML, vanilla CSS with deep dark mode aesthetics, and JavaScript.",
            cert_heading: "Certificates & Achievements",
            cert1_badge: "Certificate", cert1_title: "Introduction to Cybersecurity", cert1_desc: "Issued by Cisco Networking Academy.", tag_security: "Security",
            cert2_badge: "Certificate", cert2_title: "Python for Data Science", cert2_desc: "Issued by IBM via Coursera.",
            cert3_badge: "Certificate", cert3_title: "CS50: Introduction to Computer Science", cert3_desc: "Issued by Harvard University. Comprehensive foundation in algorithms and software development.",
            contact_heading: "Let's Connect",
            contact_quote: '"The Best Way to Predict the Future, Is To Create It."',
            contact_desc: "I'm constantly exploring new opportunities and taking on exciting projects. Whether you have a question or just want to say hi, feel free to reach out!",
            contact_btn: "Say Hello",
            footer_rights: "© 2026 Aidan Anu Sam. All rights reserved.", footer_top: "Back to top ↑"
        },
        ar: {
            nav_blog: "مدونة", nav_portfolio: "أعمالي البارزة", nav_about: "نبذة", nav_work: "أعمالي", nav_cert: "شهادات", nav_contact: "اتصال", nav_lang: "لغة",
            hero_hello: "مرحبًا،", hero_title: "أنا إيدان أنو سام.", hero_subtitle: "مهندس علوم كمبيوتر طموح يبني المستقبل.",
            hero_explore: "استكشف عالمي", hero_resume: "تحميل السيرة الذاتية", scroll_indicator: "تمرير",
            about_heading: "رحلتي",
            about_p1: "بدأ الأمر بفضول. الحاجة إلى فهم كيف تعمل الأشياء تحت السطح.",
            about_p2: "لقد أكملت للتو الصف الثاني عشر وأتقدم حاليًا للكليات للحصول على بكالوريوس في هندسة علوم الكمبيوتر. أنا شغوف جدًا بالتكنولوجيا وتطوير البرمجيات وحل المشكلات المعقدة. بمرور الوقت، أصبح هذا الفضول تركيزًا. كلما تعلمت أكثر، أردت بناء أشياء تبدو مقصودة.",
            about_p3: "ما أبنيه غدًا يتشكل بكل ما أتعلمه اليوم: الفضول، الانضباط، والدافع المستمر للتحسين.",
            stat1_num: "الـ 12", stat1_label: "اكتمل الصف", stat2_num: "بكالوريوس", stat2_label: "طالب علوم كمبيوتر",
            projects_heading: "الأعمال المميزة",
            proj1_title: "مستكشف واجهة برمجة تطبيقات الرؤية", proj1_desc: "تطبيق ويب تم إنشاؤه لاختبار واستكشاف تقنيات التعرف على الصور في الوقت الفعلي.",
            proj2_title: "مُصوِّر الخوارزميات", proj2_desc: "أداة تعليمية تفاعلية تتيح للطلاب تخيل خوارزميات الفرز خطوة بخطوة.",
            proj3_title: "ملف أعمالي الأول", proj3_desc: "محفظتي الشخصية مبنية بالكامل باستخدام HTML الدلالي، وCSS بواجهة الوضع المظلم، وجافاسكريبت.",
            cert_heading: "الشهادات والإنجازات",
            cert1_badge: "شهادة", cert1_title: "مقدمة في الأمن السيبراني", cert1_desc: "صادرة من أكاديمية سيسكو للشبكات.", tag_security: "أمن",
            cert2_badge: "شهادة", cert2_title: "بايثون لعلوم البيانات", cert2_desc: "صادرة من آي بي إم (IBM) عبر كورسيرا.",
            cert3_badge: "شهادة", cert3_title: "CS50: مقدمة في علوم الكمبيوتر", cert3_desc: "صادرة من جامعة هارفارد. أساس شامل في الخوارزميات وتطوير البرمجيات.",
            contact_heading: "دعنا نتواصل",
            contact_quote: '"أفضل طريقة للتنبؤ بالمستقبل، هي إنشاؤه."',
            contact_desc: "أستكشف دائمًا فرصًا جديدة وأتولى مشاريع مثيرة. سواء كان لديك سؤال أو تريد فقط أن تلقي التحية، لا تتردد في التواصل!",
            contact_btn: "تواصل معي",
            footer_rights: "© 2026 إيدان أنو سام. جميع الحقوق محفوظة.", footer_top: "العودة للأعلى ↑"
        },
        ml: {
            nav_blog: "ബ്ലോഗ്", nav_portfolio: "പോർട്ട്ഫോളിയോ", nav_about: "കുറിച്ച്", nav_work: "ജോലികൾ", nav_cert: "സർട്ടിഫിക്കറ്റുകൾ", nav_contact: "ബന്ധപ്പെടുക", nav_lang: "ഭാഷ",
            hero_hello: "നമസ്കാരം,", hero_title: "ഞാൻ ഐഡൻ അനു സാം.", hero_subtitle: "ഭാവി കെട്ടിപ്പടുക്കാൻ ആഗ്രഹിക്കുന്ന കമ്പ്യൂട്ടർ സയൻസ് എഞ്ചിനീയർ.",
            hero_explore: "എന്റെ ലോകം കാണുക", hero_resume: "റെസ്യൂമെ ഡൗൺലോഡ്", scroll_indicator: "താഴേക്ക്",
            about_heading: "എന്റെ യാത്ര",
            about_p1: "അത് ജിജ്ഞാസയോടെയാണ് തുടങ്ങിയത്. കാര്യങ്ങൾ എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് മനസ്സിലാക്കാനുള്ള ആഗ്രഹം.",
            about_p2: "ഞാൻ അടുത്തിടെ 12-ാം ക്ലാസ്സ് പൂർത്തിയാക്കി, ഇപ്പോൾ കമ്പ്യൂട്ടർ സയൻസ് എഞ്ചിനീയറിംഗിൽ ബി.ടെകിന് കോളേജുകളിൽ അപേക്ഷിക്കുകയാണ്. എനിക്ക് സാങ്കേതികവിദ്യയിലും സോഫ്റ്റ്‌വെയർ ഡെവലപ്‌മെൻ്റിലും സങ്കീർണ്ണമായ പ്രശ്നങ്ങൾ പരിഹരിക്കുന്നതിലും താത്പര്യമുണ്ട്. കാലക്രമേണ ആ ജിജ്ഞാസ ലക്ഷ്യമായി മാറി.",
            about_p3: "ഞാൻ നാളെ നിർമ്മിക്കുന്നത് ഇന്ന് പഠിക്കുന്നതിൽ നിന്നാണ് വരുന്നത്: ജിജ്ഞാസ, അച്ചടക്കം, മെച്ചപ്പെടാനുള്ള അടങ്ങാത്ത ആഗ്രഹം.",
            stat1_num: "12-ാം", stat1_label: "ക്ലാസ്സ് കഴിഞ്ഞു", stat2_num: "ബി.ടെക്", stat2_label: "സി.എസ്.ഇ. വിദ്യാർത്ഥി",
            projects_heading: "പ്രധാന ജോലികൾ",
            proj1_title: "വിഷൻ എപിഐ (Vision API) എക്സ്പ്ലോറർ", proj1_desc: "തത്സമയം ഇമേജ് റെക്കഗ്നിഷൻ സാങ്കേതികവിദ്യകൾ പരിശോധിക്കുന്നതിനുള്ള ഒരു വെബ് ആപ്ലിക്കേഷൻ.",
            proj2_title: "അൽഗോരിതം വിഷ്വലൈസർ", proj2_desc: "സോർട്ടിംഗ് അൽഗോരിതങ്ങൾ പടിപടിയായി മനസ്സിലാക്കാൻ വിദ്യാർത്ഥികളെ സഹായിക്കുന്ന സംവേദനാത്മക ഉപകരണം.",
            proj3_title: "പോർട്ട്ഫോളിയോ V1", proj3_desc: "എന്റെ വ്യക്തിഗത പോർട്ട്ഫോളിയോ പ്രധാനമായും HTML, CSS ഡാർക്ക് മോഡ്, Javascript എന്നിവയാൽ നിർമ്മിച്ചതാണ്.",
            cert_heading: "സർട്ടിഫിക്കറ്റുകളും നേട്ടങ്ങളും",
            cert1_badge: "സർട്ടിഫിക്കറ്റ്", cert1_title: "സൈബർ സുരക്ഷാ ആമുഖം", cert1_desc: "സിസ്കോ (Cisco) നെറ്റ്‌വർക്കിംഗ് അക്കാദമി നൽകിയത്.", tag_security: "സുരക്ഷ",
            cert2_badge: "സർട്ടിഫിക്കറ്റ്", cert2_title: "ഡാറ്റാ സയൻസിനുള്ള പൈത്തൺ", cert2_desc: "കോർസെറ വഴി IBM നൽകിയത്.",
            cert3_badge: "സർട്ടിഫിക്കറ്റ്", cert3_title: "CS50: കമ്പ്യൂട്ടർ സയൻസ് ആമുഖം", cert3_desc: "ഹാർവാർഡ് യൂണിവേഴ്സിറ്റി നൽകിയത്. സോഫ്റ്റ്‌വെയർ ഡെവലപ്‌മെൻ്റ് അടിസ്ഥാനം.",
            contact_heading: "നമുക്ക് ബന്ധപ്പെടാം",
            contact_quote: '"ഭാവി പ്രവചിക്കാനുള്ള ഏറ്റവും നല്ല മാർഗം അത് സൃഷ്ടിക്കുക എന്നതാണ്."',
            contact_desc: "ഞാൻ എപ്പോഴും പുതിയ അവസരങ്ങളും പ്രോജക്റ്റുകളും ഏറ്റെടുക്കാൻ തയ്യാറാണ്. നിങ്ങൾക്ക് എന്തെങ്കിലും സംശയങ്ങൾ ഉണ്ടെങ്കിൽ തീർച്ചയായും ബന്ധപ്പെടാം!",
            contact_btn: "ഹലോ പറയൂ",
            footer_rights: "© 2026 ഐഡൻ അനു സാം. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.", footer_top: "മുകളിലേക്ക് ↑"
        }
    };

    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            const lang = e.target.value;
            const dict = translations[lang];
            
            // Update all translated elements
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if(dict[key]) {
                    el.innerText = dict[key];
                }
            });

            // Update translated tooltips
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                if(dict[key]) {
                    el.title = dict[key];
                }
            });

            // Set RTL support for Arabic
            if(lang === 'ar') {
                document.documentElement.setAttribute('dir', 'rtl');
            } else {
                document.documentElement.removeAttribute('dir');
            }
        });
    }

    /* --- WhatsApp Blur Interaction --- */
    const waBtn = document.getElementById('wa-action-btn');
    if(waBtn) {
        waBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if(this.classList.contains('revealed')) {
                // If already revealed, navigate
                window.open(this.getAttribute('data-link'), '_blank');
            } else {
                // First click: reveal
                this.classList.add('revealed');
                const textEl = document.getElementById('wa-display-text');
                if(textEl) {
                    textEl.innerText = this.getAttribute('data-number');
                }
            }
        });
    }

    /* --- Comments Modal Logic --- */
    const openCommentsBtn = document.getElementById('open-comments');
    const closeCommentsBtn = document.getElementById('close-comments');
    const commentsModal = document.getElementById('comments-modal');

    if (openCommentsBtn && commentsModal) {
        openCommentsBtn.addEventListener('click', () => {
            commentsModal.classList.add('active');
            document.body.classList.add('modal-open');
        });

        const closeModal = () => {
            commentsModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        };

        if (closeCommentsBtn) {
            closeCommentsBtn.addEventListener('click', closeModal);
        }

        // Close on clicking outside the modal container
        commentsModal.addEventListener('click', (e) => {
            if (e.target === commentsModal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && commentsModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

});
