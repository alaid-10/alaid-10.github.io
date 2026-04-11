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
            // Trigger a manual scroll event to trigger intersection observers
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

    // Auto-dismiss safety fallback (moved to much longer to avoid cutting off sequence)
    setTimeout(() => {
        dismissSplash({ type: 'auto-timeout' });
    }, 15000);

    // If no splash screen exists (e.g. blog page), immediately reveal everything
    if (!splashScreen) {
        document.body.classList.remove('no-scroll');
        document.querySelectorAll('.reveal, .reveal-text').forEach(el => {
            el.classList.add('active');
        });
    }

    /* --- Dynamic Greetings (50 Languages) --- */
    const greetings = [
        "Hello", "नमस्ते", "നമസ്കാരം", "Hola", "Bonjour", "Hallo", "Ciao", "Olá", "Привет", "你好",
        "こんにちは", "안녕하세요", "مرحباً", "Merhaba", "Γεια σας", "Shalom", "Sawasdee", "Xin chào", "Kamusta", "Jambo",
        "Sawubona", "Dzień dobry", "Cześć", "Hej", "Hei", "Ahoj", "Szia", "Salut", "Halo", "Aloha"
    ];

    const greetingElement = document.getElementById('dynamic-greeting');
    let currentIndex = 1; 

    const updateGreeting = () => {
        if (!greetingElement) return;

        greetingElement.style.opacity = '0';
        greetingElement.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            let isFinal = false;
            if (currentIndex < greetings.length) {
                greetingElement.textContent = greetings[currentIndex];
                currentIndex++;
            } else if (currentIndex === greetings.length) {
                greetingElement.textContent = "Welcome!";
                currentIndex++;
                isFinal = true;
            }

            // Fade in setup
            greetingElement.style.transform = 'translateY(10px)';
            void greetingElement.offsetWidth;
            greetingElement.style.opacity = '1';
            greetingElement.style.transform = 'translateY(0)';

            if (isFinal) {
                // Show Welcome! for 1.2s then dismiss
                setTimeout(() => dismissSplash({ type: 'auto-sequence' }), 1200);
                return;
            }

            // Ultra-snappy speed up logic: Total duration ~2.5s
            const baseDelay = 100; // Even faster start
            const minDelay = 20; 
            const progress = currentIndex / greetings.length;
            const currentDelay = Math.max(minDelay, baseDelay - (Math.pow(progress, 2) * (baseDelay - minDelay)));
            
            setTimeout(updateGreeting, currentDelay);
        }, 60); // Fast swap time
    };

    if (greetingElement) {
        greetingElement.style.transition = 'all 0.08s ease-out';
        setTimeout(updateGreeting, 800); 
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
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Immediately trigger Hero active states
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
            about_p2: "I'm Aidan — a tech aspirant and the current Chief Marketing Officer at Blue Sky WLL, based in Bahrain. After completing 14 years at the Indian School Bahrain, I'm channelling that foundation toward a B.Tech in Computer Science Engineering at a top NIT in India.",
            about_p3: "I thrive at the intersection of technology and creativity — architecting intuitive web experiences, steering digital strategy, and solving complex problems with elegant code. What I build tomorrow is defined by the discipline and relentless curiosity I cultivate today.",
            stat1_num: "CMO", stat1_label: "Blue Sky WLL, Bahrain", stat2_num: "14 Yrs", stat2_label: "Indian School Bahrain", stat3_num: "NIT", stat3_label: "B.Tech CSE Aspirant",
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
            stat1_num: "CMO", stat1_label: "بلو سكاي، البحرين", stat2_num: "١٤ عام", stat2_label: "المدرسة الكندية البحرين", stat3_num: "NIT", stat3_label: "أطمح لـ هندسة الحاسوب",
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
            about_p1: "ജിജ്ഞാസയോടെയാണ് തുടങ്ങിയത്. കാര്യങ്ങൾ എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് മനസ്സിലാക്കാനുള്ള ആഗ്രഹം.",
            about_p2: "ഞാൻ ഐഡൻ - ബഹ്‌റൈൻ ആസ്ഥാനമായുള്ള ബ്ലൂ സ്കൈ WLL ലെ ചീഫ് മാർക്കറ്റിംഗ് ഓഫീസറും ഒരു ടെക് ആസ്പിരന്റുമാണ്. ബഹ്‌റൈൻ ഇന്ത്യൻ സ്‌കൂളിൽ 14 വർഷത്തെ പഠനം പൂർത്തിയാക്കിയ ശേഷം, ഞാൻ ഇപ്പോൾ ഇന്ത്യയിലെ ഒരു ടോപ്പ് NIT-യിൽ കമ്പ്യൂട്ടർ സയൻസ് എഞ്ചിനീയറിംഗിൽ ബി.ടെക് പഠനത്തിന് തയ്യാറെടുക്കുന്നു.",
            about_p3: "സാങ്കേതികവിദ്യയുടെയും സർഗ്ഗാത്മകതയുടെയും ഇടയിൽ ഞാൻ വളരുന്നു - വെബ് അനുഭവങ്ങൾ രൂപകൽപ്പന ചെയ്യുന്നു, ഡിജിറ്റൽ സ്ട്രാറ്റജിക്ക് നേതൃത്വം നൽകുന്നു, കൂടാതെ കോഡിലൂടെ സങ്കീർണ്ണമായ പ്രശ്നങ്ങൾ പരിഹരിക്കുന്നു. ഞാൻ നാളെ നിർമ്മിക്കുന്നത് ഇന്ന് പഠിക്കുന്നതിൽ നിന്നാണ് വരുന്നത്.",
            stat1_num: "CMO", stat1_label: "ബ്ലൂ സ്കൈ WLL, ബഹ്റൈൻ", stat2_num: "14 വർഷം", stat2_label: "ഇന്ത്യൻ സ്കൂൾ ബഹ്റൈൻ", stat3_num: "NIT", stat3_label: "ബി.ടെക് സി.എസ്.ഇ. വിദ്യാർത്ഥി",
            projects_heading: "പ്രധാന ജോലികൾ",
            proj1_title: "വിഷൻ എപിഐ (Vision API) എക്സ്പ്ലോറർ", proj1_desc: "തത്സമയം ഇമേജ് റെക്കഗ്നിഷൻ സാങ്കേതികവിദ്യകൾ പരിശോധിക്കുന്നതിനുള്ള ഒരു വെബ് ആപ്ലിക്കേഷൻ.",
            proj2_title: "അൽഗോരിതം വിഷ്വലൈസർ", proj2_desc: "സോർട്ടിംഗ് അൽഗോരിതങ്ങൾ പടിപടിയായി മനസ്സിലാക്കാൻ വിദ്യാർത്ഥികളെ സഹായിക്കുന്ന സംവേദനാത്മക ഉപകരണം.",
            proj3_title: "പോർട്ട്ഫോളിയോ V1", proj3_desc: "എന്റെ വ്യക്തിഗത പോർട്ട്ഫോളിയോ പ്രധാനമായും HTML, CSS ഡാർക്ക് മോഡ്, Javascript എന്നിവയാൽ നിർമ്മിച്ചതാണ്.",
            cert_heading: "സർട്ടിഫിക്കറ്റുകളും നേട്ടങ്ങളും",
            cert1_badge: "സർട്ടിഫിക്കറ്റ്", cert1_title: "സൈബർ സുരക്ഷാ ആമുഖം", cert1_desc: "സിസ്കോ (Cisco) നെറ്റ്‌വർക്കിംഗ് അക്കാദമി നൽകിയത്.", tag_security: "സുരക്ഷ",
            cert2_badge: "സർട്ടിഫിക്കറ്റ്", cert2_title: "ഡാറ്റാ സയൻസിനുള്ള പൈത്തൺ", cert2_desc: "കോർസെറ വഴി IBM നൽകിയത്.",
            cert3_badge: "സർട്ടിഫിക്കറ്റ്", cert3_title: "CS50: കമ്പ്யൂട്ടർ സയൻസ് ആമുഖം", cert3_desc: "ഹാർവാർഡ് യൂണിവേഴ്സിറ്റി നൽകിയത്. സോഫ്റ്റ്‌വെയർ ഡെവലപ്‌മെൻ്റ് അടിസ്ഥാനം.",
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
