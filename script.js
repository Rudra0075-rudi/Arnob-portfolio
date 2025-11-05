document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
        });
    }
    
    if (mobileMenuClose && mobileNav) {
        mobileMenuClose.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    }
    
    // Close mobile nav when clicking on a link
    const mobileNavLinks = mobileNav?.querySelectorAll('.nav-link');
    mobileNavLinks?.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Handle navigation click
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active navigation
                updateActiveNavigation(this);
            }
        });
    });
    
    // Update active navigation on scroll
    function updateActiveNavigation(activeLink = null) {
        if (activeLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        } else {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const sectionHeight = section.offsetHeight;
                
                if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // Handle scroll events
    window.addEventListener('scroll', () => {
        updateActiveNavigation();
        handleScrollAnimations();
    });
    
    // Tab functionality for About section
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Scroll animations
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Add scroll animation classes to elements
    const animatedElements = document.querySelectorAll('.organization-card, .service-card, .project-card, .blog-card, .research-paper, .testimonial-card');
    animatedElements.forEach(element => {
        element.classList.add('fade-in-on-scroll');
    });
    
    // Initialize scroll animations
    handleScrollAnimations();
    
    // Interactive hover effects for cards
    const interactiveCards = document.querySelectorAll('.organization-card, .service-card, .project-card, .blog-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Floating animation for profile image
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        let floatDirection = 1;
        
        setInterval(() => {
            const currentTransform = profileImage.style.transform || '';
            const translateY = floatDirection * 10;
            profileImage.style.transform = `translateY(${translateY}px)`;
            floatDirection *= -1;
        }, 3000);
    }
    
    // Parallax effect for background elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-orb');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // ==================== VIDEO BACKGROUND HANDLING ====================
    const video = document.getElementById('background-video');
    if (video) {
        let isSeamlessLooping = false;
        
        // Preload the video for better performance
        video.preload = 'auto';
        video.muted=true;
        video.autoplay = true;
        video.playsInline = true;
        // Ensure video plays when ready
        video.addEventListener('loadeddata', function() {
            console.log('Video loaded, attempting to play...');
            video.muted = true;
            video.play().catch(error => {
                console.log('Autoplay prevented:', error);
                // Fallback: play on user interaction
                const playOnInteraction = () => {
                    video.play();
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('touchstart', playOnInteraction);
            });
        });
        
        // Seamless looping using timeupdate
        video.addEventListener('timeupdate', function() {
            // Start seamless looping when video is near the end
            if (!isSeamlessLooping && video.duration > 0) {
                if (video.currentTime >= video.duration - 0.3) { // 300ms before end
                    isSeamlessLooping = true;
                    startSeamlessLoop();
                }
            }
        });
        
        // Seamless loop function
        function startSeamlessLoop() {
            const loopThreshold = 0.2; // 200ms before end
            
            function checkLoop() {
                if (video.currentTime >= video.duration - loopThreshold) {
                    video.currentTime = 0;
                    video.play().catch(error => {
                        console.error('Video play error in loop:', error);
                    });
                }
                if (isSeamlessLooping) {
                    requestAnimationFrame(checkLoop);
                }
            }
            
            checkLoop();
        }
        
        // Backup method using ended event
        video.addEventListener('ended', function() {
            console.log('Video ended - restarting immediately');
            video.currentTime = 0;
            video.play().catch(error => {
                console.error('Video restart failed:', error);
            });
        });
        
        // Handle tab visibility changes
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                video.pause();
            } else {
                video.play().catch(error => {
                    console.log('Video play after tab switch failed:', error);
                });
            }
        });
        
        // Add loading states
        video.addEventListener('loadstart', function() {
            document.getElementById('home').classList.add('loading');
        });
        
        video.addEventListener('canplay', function() {
            document.getElementById('home').classList.remove('loading');
        });
        
        // Error handling
        video.addEventListener('error', function(e) {
            console.error('Video error:', e);
            // Fallback to background image if video fails
            document.querySelector('.video-container').style.backgroundImage = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)';
        });
    }
    // ==================== END VIDEO BACKGROUND HANDLING ====================
    
    // Intersection Observer for better scroll animations
    const observerOptions = {
        threshold: 0.01,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Blog slider functionality
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sliderDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            currentSlide = index;
            
            // Here you could add logic to change blog content
            // For now, just visual feedback
        });
    });
    
    // Auto-rotate slider dots (optional)
    setInterval(() => {
        sliderDots[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % sliderDots.length;
        sliderDots[currentSlide].classList.add('active');
    }, 5000);
    
    // Smooth reveal animations for service tags
    const serviceTags = document.querySelectorAll('.service-tag, .research-tag');
    serviceTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.classList.add('fade-in-on-scroll');
    });

    // Highlight selected service tag (since inputs come after labels in DOM)
    const serviceLabels = document.querySelectorAll('label.service-tag');
    const serviceInputs = document.querySelectorAll('input.services-toggle');
    function updateSelectedServiceTag() {
        serviceLabels.forEach(l => l.classList.remove('active'));
        const checked = document.querySelector('input.services-toggle:checked');
        if (checked) {
            const lbl = document.querySelector(`label[for="${checked.id}"]`);
            if (lbl) lbl.classList.add('active');
        }
    }
    serviceLabels.forEach(l => {
        l.addEventListener('click', () => {
            // Wait for the radio to be checked by label click
            setTimeout(updateSelectedServiceTag, 0);
        });
    });
    serviceInputs.forEach(inp => inp.addEventListener('change', updateSelectedServiceTag));
    updateSelectedServiceTag();
    
    // Interactive glow effect for buttons
    const buttons = document.querySelectorAll('.cta-button, .blog-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('interactive-glow');
        });
        
        button.addEventListener('mouseleave', function() {
            setTimeout(() => {
                this.classList.remove('interactive-glow');
            }, 500);
        });
    });
    
    // Social media icons hover effect
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    // Performance optimization: Throttle scroll events
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply throttling to scroll events
    const throttledScrollHandler = throttle(() => {
        updateActiveNavigation();
        handleScrollAnimations();
    }, 16); // ~60fps
    
    window.removeEventListener('scroll', updateActiveNavigation);
    window.addEventListener('scroll', throttledScrollHandler);
    
    // Initialize the page
    console.log('Arnab\'s Portfolio loaded successfully!');
    // ==================== ADMIN + BLOGS/PROJECTS/RESEARCH ====================
    const API_BASE = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : '';
    const ADMIN_SECRET_KEY = 'arnob_admin_secret';
    let adminSecret = localStorage.getItem(ADMIN_SECRET_KEY) || '';

    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const adminModal = document.getElementById('admin-modal');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminShowPassword = document.getElementById('admin-show-password');
    const adminCancel = document.getElementById('admin-cancel');
    const adminSubmit = document.getElementById('admin-submit');
    const blogsAdminControls = document.getElementById('blogs-admin-controls');
    const addBlogBtn = document.getElementById('add-blog-btn');

    const blogModal = document.getElementById('blog-modal');
    const blogModalTitle = document.getElementById('blog-modal-title');
    const blogCover = document.getElementById('blog-cover');
    const blogTitleInput = document.getElementById('blog-title-input');
    const blogContentInput = document.getElementById('blog-content-input');
    const blogCancel = document.getElementById('blog-cancel');
    const blogSave = document.getElementById('blog-save');
    const blogsGrid = document.getElementById('blogs-grid');

    const blogViewModal = document.getElementById('blog-view-modal');
    const blogViewCover = document.getElementById('blog-view-cover');
    const blogViewTitle = document.getElementById('blog-view-title');
    const blogViewContent = document.getElementById('blog-view-content');
    const blogViewClose = document.getElementById('blog-view-close');

    let editingBlogId = null;
    let editingProjectId = null;
    let editingResearchId = null;
    let editingRecentWorkId = null;
    let editingTestimonialId = null;

    // Projects elements
    const projectsAdminControls = document.getElementById('projects-admin-controls');
    const addProjectBtn = document.getElementById('add-project-btn');
    const projectsGrid = document.getElementById('projects-grid');
    const projectModal = document.getElementById('project-modal');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectCover = document.getElementById('project-cover');
    const projectTitleInput = document.getElementById('project-title-input');
    const projectDescInput = document.getElementById('project-desc-input');
    const projectCancel = document.getElementById('project-cancel');
    const projectSave = document.getElementById('project-save');
    const projectInsertImage = document.getElementById('project-insert-image');
    const projectViewModal = document.getElementById('project-view-modal');
    const projectViewCover = document.getElementById('project-view-cover');
    const projectViewTitle = document.getElementById('project-view-title');
    const projectViewContent = document.getElementById('project-view-content');
    const projectViewClose = document.getElementById('project-view-close');

    // Research elements
    const researchAdminControls = document.getElementById('research-admin-controls');
    const addResearchBtn = document.getElementById('add-research-btn');
    const researchGrid = document.getElementById('research-grid');

    // Recent Works elements
    const recentWorksAdminControls = document.getElementById('recent-works-admin-controls');
    const addRecentWorkBtn = document.getElementById('add-recent-work-btn');
    const recentWorksGrid = document.getElementById('recent-works-grid');
    const recentWorkModal = document.getElementById('recent-work-modal');
    const recentWorkModalTitle = document.getElementById('recent-work-modal-title');
    const recentWorkCover = document.getElementById('recent-work-cover');
    const recentWorkTitleInput = document.getElementById('recent-work-title-input');
    const recentWorkDescInput = document.getElementById('recent-work-desc-input');
    const recentWorkCancel = document.getElementById('recent-work-cancel');
    const recentWorkSave = document.getElementById('recent-work-save');
    const recentWorkViewModal = document.getElementById('recent-work-view-modal');
    const recentWorkViewCover = document.getElementById('recent-work-view-cover');
    const recentWorkViewTitle = document.getElementById('recent-work-view-title');
    const recentWorkViewContent = document.getElementById('recent-work-view-content');
    const recentWorkViewClose = document.getElementById('recent-work-view-close');

    // Testimonials elements
    const testimonialsAdminControls = document.getElementById('testimonials-admin-controls');
    const addTestimonialBtn = document.getElementById('add-testimonial-btn');
    const testimonialsScroll = document.getElementById('testimonials-scroll');
    const testimonialModal = document.getElementById('testimonial-modal');
    const testimonialModalTitle = document.getElementById('testimonial-modal-title');
    const testimonialPhoto = document.getElementById('testimonial-photo');
    const testimonialDescInput = document.getElementById('testimonial-desc-input');
    const testimonialCancel = document.getElementById('testimonial-cancel');
    const testimonialSave = document.getElementById('testimonial-save');
    const researchModal = document.getElementById('research-modal');
    const researchModalTitle = document.getElementById('research-modal-title');
    const researchCover = document.getElementById('research-cover');
    const researchTitleInput = document.getElementById('research-title-input');
    const researchAbstractInput = document.getElementById('research-abstract-input');
    const researchStatusInput = document.getElementById('research-status-input');
    const researchCancel = document.getElementById('research-cancel');
    const researchSave = document.getElementById('research-save');
    const researchInsertImage = document.getElementById('research-insert-image');
    const researchFilterButtons = document.querySelectorAll('[data-research-filter]');
    let researchCurrentFilter = 'ongoing';

    function applyAdminUI() {
        const isLoggedIn = Boolean(adminSecret);
        if (adminLoginBtn && adminLogoutBtn) {
            adminLoginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
            adminLogoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
        }
        if (blogsAdminControls) blogsAdminControls.style.display = isLoggedIn ? 'flex' : 'none';
        if (projectsAdminControls) projectsAdminControls.style.display = isLoggedIn ? 'flex' : 'none';
        if (researchAdminControls) researchAdminControls.style.display = isLoggedIn ? 'block' : 'none';
        if (recentWorksAdminControls) recentWorksAdminControls.style.display = isLoggedIn ? 'flex' : 'none';
        if (testimonialsAdminControls) testimonialsAdminControls.style.display = isLoggedIn ? 'flex' : 'none';
        // Show edit/delete buttons on cards when admin
        document.querySelectorAll('[data-admin-only]').forEach(el => {
            el.style.display = isLoggedIn ? 'inline-flex' : 'none';
        });
    }

    async function verifyAdmin(secret) {
        if (!secret) return false;
        try {
            const res = await fetch(API_BASE + '/api/admin/verify?adminSecret=' + encodeURIComponent(secret), {
                method: 'GET',
                headers: { 'x-admin-secret': secret }
            });
            return res.ok;
        } catch {
            return false;
        }
    }

    function openModal(el) { if (el) el.style.display = 'flex'; }
    function closeModal(el) { if (el) el.style.display = 'none'; }

    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => { openModal(adminModal); });
    }
    if (adminCancel) adminCancel.addEventListener('click', () => { closeModal(adminModal); });
    if (adminShowPassword) {
        adminShowPassword.addEventListener('change', () => {
            adminPasswordInput.type = adminShowPassword.checked ? 'text' : 'password';
        });
    }
    if (adminSubmit) {
        adminSubmit.addEventListener('click', async () => {
            const pwd = adminPasswordInput.value.trim();
            if (!pwd) return;
            const ok = await verifyAdmin(pwd);
            if (!ok) {
                alert('Invalid password');
                return;
            }
            adminSecret = pwd;
            localStorage.setItem(ADMIN_SECRET_KEY, adminSecret);
            adminPasswordInput.value = '';
            closeModal(adminModal);
            applyAdminUI();
        });
    }
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            adminSecret = '';
            localStorage.removeItem(ADMIN_SECRET_KEY);
            applyAdminUI();
        });
    }

    // API helpers
    async function apiGet(path) {
        const res = await fetch(API_BASE + path);
        return res.json();
    }
    async function apiForm(path, method, formData) {
        const headers = adminSecret ? { 'x-admin-secret': adminSecret } : {};
        const url = API_BASE + path ;
        console.log(`Making ${method} request to: ${url}`);
        console.log('Headers:', headers);
        try {
            const res = await fetch(url, {
                method,
                headers,
                body: formData
            });
            console.log(`Response status: ${res.status}`);
            if (!res.ok) {
                const err = await safeJson(res);
                throw new Error(err && err.message ? err.message : `Request failed (${res.status})`);
            }
            return res.json();
        } catch (e) {
            alert(`Failed: ${e.message}. Is the server running?`);
            throw e;
        }
    }
    async function apiJson(path, method, data) {
        const headers = { 'Content-Type': 'application/json' };
        if (adminSecret) headers['x-admin-secret'] = adminSecret;
        try {
            const res = await fetch(API_BASE + path + (adminSecret ? `?adminSecret=${encodeURIComponent(adminSecret)}` : ''), {
                method,
                headers,
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const err = await safeJson(res);
                throw new Error(err && err.message ? err.message : `Request failed (${res.status})`);
            }
            return res.json();
        } catch (e) {
            alert(`Failed: ${e.message}. Is the server running?`);
            throw e;
        }
    }

    async function safeJson(res) {
        try { return await res.json(); } catch { return null; }
    }

    // Blogs rendering
    function renderBlogs(list) {
        if (!blogsGrid) return;
        blogsGrid.innerHTML = '';
        const displayList = list.slice(0, 3); // Show only first 3 items
        
        displayList.forEach((b, idx) => {
            const card = document.createElement('div');
            card.className = 'blog-card' + (idx === 0 ? ' featured' : '');
            const coverDiv = document.createElement('div');
            coverDiv.className = 'w-full h-48 rounded-lg mb-4';
            coverDiv.style.background = b.coverImageUrl ? `url('${b.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #4f46e5, #9333ea)';
            card.appendChild(coverDiv);

            const title = document.createElement('h3');
            title.className = 'text-xl font-bold text-white mb-2';
            title.textContent = b.title;
            card.appendChild(title);

            const excerpt = document.createElement('p');
            excerpt.className = 'text-gray-400 text-sm mb-4';
            excerpt.textContent = (b.content || '').slice(0, 140) + (b.content && b.content.length > 140 ? '...' : '');
            card.appendChild(excerpt);

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '8px';

            const viewBtn = document.createElement('button');
            viewBtn.className = 'blog-btn';
            viewBtn.textContent = 'View Article';
            viewBtn.addEventListener('click', () => openBlogView(b));
            actions.appendChild(viewBtn);

            const adminGroup = document.createElement('div');
            adminGroup.setAttribute('data-admin-only', '');
            adminGroup.style.display = 'none';

            const editBtn = document.createElement('button');
            editBtn.className = 'blog-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openBlogEditor(b));
            adminGroup.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'blog-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this blog?')) return;
                await apiJson(`/api/blogs/${b._id}`, 'DELETE');
                await loadBlogs();
            });
            adminGroup.appendChild(delBtn);

            actions.appendChild(adminGroup);
            card.appendChild(actions);

            blogsGrid.appendChild(card);
        });

        // Add "View All" button if more than 3 items
        if (list.length > 3) {
            const viewAllBtn = document.createElement('div');
            viewAllBtn.className = 'flex justify-center mt-8';
            const btn = document.createElement('button');
            btn.className = 'cta-button primary';
            btn.textContent = 'View All Blogs';
            btn.addEventListener('click', () => {
                renderAllBlogs(list);
            });
            viewAllBtn.appendChild(btn);
            blogsGrid.appendChild(viewAllBtn);
        }
        
        applyAdminUI();
    }

    function renderAllBlogs(list) {
        if (!blogsGrid) return;
        blogsGrid.innerHTML = '';
        list.forEach((b, idx) => {
            const card = document.createElement('div');
            card.className = 'blog-card' + (idx === 0 ? ' featured' : '');
            const coverDiv = document.createElement('div');
            coverDiv.className = 'w-full h-48 rounded-lg mb-4';
            coverDiv.style.background = b.coverImageUrl ? `url('${b.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #4f46e5, #9333ea)';
            card.appendChild(coverDiv);

            const title = document.createElement('h3');
            title.className = 'text-xl font-bold text-white mb-2';
            title.textContent = b.title;
            card.appendChild(title);

            const excerpt = document.createElement('p');
            excerpt.className = 'text-gray-400 text-sm mb-4';
            excerpt.textContent = (b.content || '').slice(0, 140) + (b.content && b.content.length > 140 ? '...' : '');
            card.appendChild(excerpt);

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '8px';

            const viewBtn = document.createElement('button');
            viewBtn.className = 'blog-btn';
            viewBtn.textContent = 'View Article';
            viewBtn.addEventListener('click', () => openBlogView(b));
            actions.appendChild(viewBtn);

            const adminGroup = document.createElement('div');
            adminGroup.setAttribute('data-admin-only', '');
            adminGroup.style.display = 'none';

            const editBtn = document.createElement('button');
            editBtn.className = 'blog-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openBlogEditor(b));
            adminGroup.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'blog-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this blog?')) return;
                await apiJson(`/api/blogs/${b._id}`, 'DELETE');
                await loadBlogs();
            });
            adminGroup.appendChild(delBtn);

            actions.appendChild(adminGroup);
            card.appendChild(actions);

            blogsGrid.appendChild(card);
        });

        // Add "View Less" button at bottom
        const viewLessBtn = document.createElement('div');
        viewLessBtn.className = 'flex justify-center mt-12';
        const btn = document.createElement('button');
        btn.className = 'cta-button secondary';
        btn.textContent = 'View Less';
        btn.addEventListener('click', () => {
            loadBlogs();
        });
        viewLessBtn.appendChild(btn);
        blogsGrid.appendChild(viewLessBtn);
        
        applyAdminUI();
    }

    function openBlogEditor(blog) {
        editingBlogId = blog ? blog._id : null;
        blogModalTitle.textContent = blog ? 'Edit Blog' : 'Add Blog';
        blogTitleInput.value = blog ? blog.title : '';
        blogContentInput.value = blog ? blog.content : '';
        if (blogCover) blogCover.value = '';
        openModal(blogModal);
    }

    function openBlogView(blog) {
        blogViewTitle.textContent = blog.title;
        blogViewContent.innerHTML = sanitizeBlogHtml(blog.content || '');
        blogViewCover.style.background = blog.coverImageUrl ? `url('${blog.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #4f46e5, #9333ea)';
        openModal(blogViewModal);
    }

    function sanitizeBlogHtml(html) {
        const allowed = document.createElement('div');
        allowed.innerHTML = html;
        // remove scripts/styles
        allowed.querySelectorAll('script, style, iframe, object, embed').forEach(el => el.remove());
        // allow basic tags and attributes for images/links
        allowed.querySelectorAll('*').forEach(el => {
            const tag = el.tagName.toLowerCase();
            const allowedTags = ['p','br','strong','em','ul','ol','li','h1','h2','h3','h4','h5','h6','a','img','blockquote','pre','code','div','span'];
            if (!allowedTags.includes(tag)) {
                const replacement = document.createElement('div');
                replacement.innerHTML = el.innerHTML;
                el.replaceWith(...Array.from(replacement.childNodes));
                return;
            }
            // prune attributes
            Array.from(el.attributes).forEach(attr => {
                const name = attr.name.toLowerCase();
                if (tag === 'a' && (name === 'href' || name === 'title' || name === 'target' || name === 'rel')) return;
                if (tag === 'img' && (name === 'src' || name === 'alt' || name === 'title')) return;
                if (name.startsWith('data-')) return;
                el.removeAttribute(name);
            });
            // ensure links are safe
            if (tag === 'a') {
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener noreferrer');
            }
        });
        return allowed.innerHTML;
    }

    function stripHtmlToText(html) {
        if (!html) return '';
        const temp = document.createElement('div');
        temp.innerHTML = html;
        // remove scripts/styles
        temp.querySelectorAll('script, style, iframe, object, embed').forEach(el => el.remove());
        return (temp.textContent || '').replace(/\s+/g, ' ').trim();
    }

    async function saveBlog() {
        console.log('saveBlog called, adminSecret:', adminSecret);
        const fd = new FormData();
        fd.append('title', blogTitleInput.value.trim());
        fd.append('content', blogContentInput.value.trim());
        if (blogCover.files && blogCover.files[0]) fd.append('coverImage', blogCover.files[0]);

        try {
            if (editingBlogId) {
                await apiForm(`/api/blogs/${editingBlogId}`, 'PUT', fd);
            } else {
                await apiForm('/api/blogs', 'POST', fd);
            }
            closeModal(blogModal);
            await loadBlogs();
        } catch (e) {
            console.error('Save failed:', e);
        }
    }

    async function loadBlogs() {
        try {
            const list = await apiGet('/api/blogs');
            renderBlogs(list);
        } catch (e) {
            console.error('Failed to load blogs', e);
        }
    }

    if (addBlogBtn) addBlogBtn.addEventListener('click', () => openBlogEditor(null));
    if (blogCancel) blogCancel.addEventListener('click', () => closeModal(blogModal));
    if (blogSave) blogSave.addEventListener('click', saveBlog);
    if (blogViewClose) blogViewClose.addEventListener('click', () => closeModal(blogViewModal));

    // Insert inline image into blog content
    const blogInsertImageBtn = document.getElementById('blog-insert-image');
    if (blogInsertImageBtn) {
        blogInsertImageBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!adminSecret) {
                alert('Login as admin first');
                return;
            }
            const picker = document.createElement('input');
            picker.type = 'file';
            picker.accept = 'image/*';
            picker.addEventListener('change', async (evt) => {
                evt.preventDefault();
                const file = picker.files && picker.files[0];
                if (!file) return;
                const fd = new FormData();
                fd.append('image', file);
                try {
                    const res = await fetch(API_BASE + '/api/uploads', {
                        method: 'POST',
                        headers: { 'x-admin-secret': adminSecret },
                        body: fd
                    });
                    if (!res.ok) throw new Error('Upload failed');
                    const data = await res.json();
                    const url = data.url;
                    const insert = `\n<img src="${url}" alt="" />\n`;
                    const start = blogContentInput.selectionStart || blogContentInput.value.length;
                    const end = blogContentInput.selectionEnd || blogContentInput.value.length;
                    blogContentInput.value = blogContentInput.value.slice(0, start) + insert + blogContentInput.value.slice(end);
                    blogContentInput.focus();
                } catch (e) {
                    alert('Image upload failed');
                }
            });
            picker.click();
        });
    }

    // Bold text functionality for blog content
    const blogBoldTextBtn = document.getElementById('blog-bold-text');
    if (blogBoldTextBtn) {
        blogBoldTextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const textarea = blogContentInput;
            const start = textarea.selectionStart || textarea.value.length;
            const end = textarea.selectionEnd || textarea.value.length;
            const selectedText = textarea.value.slice(start, end);
            
            if (selectedText) {
                // Wrap selected text with bold tags
                const boldText = `<strong>${selectedText}</strong>`;
                textarea.value = textarea.value.slice(0, start) + boldText + textarea.value.slice(end);
                textarea.focus();
                textarea.setSelectionRange(start + 8, end + 8); // Position cursor after opening tag
            } else {
                // Insert bold text template if nothing is selected
                const boldTemplate = '<strong>Bold text here</strong>';
                textarea.value = textarea.value.slice(0, start) + boldTemplate + textarea.value.slice(end);
                textarea.focus();
                textarea.setSelectionRange(start + 8, start + 22); // Select "Bold text here"
            }
        });
    }

    // On load, verify any stored admin secret; clear if invalid
    (async () => {
        if (adminSecret) {
            const ok = await verifyAdmin(adminSecret);
            if (!ok) {
                adminSecret = '';
                localStorage.removeItem(ADMIN_SECRET_KEY);
            }
        }
        applyAdminUI();
    })();
    loadBlogs();

    // ===== Projects =====
    function renderProjects(list) {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';
        const displayList = list.slice(0, 2); // Show only first 2 items
        
        displayList.forEach(p => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const coverDiv = document.createElement('div');
            coverDiv.className = 'project-images';
            const inner = document.createElement('div');
            inner.className = 'h-48 rounded-lg';
            inner.style.background = p.coverImageUrl ? `url('${p.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #22c55e, #3b82f6)';
            coverDiv.appendChild(inner);
            card.appendChild(coverDiv);

            const title = document.createElement('h3');
            title.className = 'text-2xl font-bold text-white mb-4';
            title.textContent = p.title;
            card.appendChild(title);

            const desc = document.createElement('p');
            desc.className = 'text-gray-400 mb-6';
            const plain = stripHtmlToText(p.description || '');
            desc.textContent = plain.slice(0, 140) + (plain.length > 140 ? '…' : '');
            card.appendChild(desc);

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '8px';

            const viewBtn = document.createElement('button');
            viewBtn.className = 'blog-btn';
            viewBtn.textContent = 'View';
            viewBtn.addEventListener('click', () => openProjectView(p));
            actions.appendChild(viewBtn);

            const adminGroup = document.createElement('div');
            adminGroup.setAttribute('data-admin-only', '');
            adminGroup.style.display = 'none';

            const editBtn = document.createElement('button');
            editBtn.className = 'blog-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openProjectEditor(p));
            adminGroup.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'blog-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this project?')) return;
                await apiJson(`/api/projects/${p._id}`, 'DELETE');
                await loadProjects();
            });
            adminGroup.appendChild(delBtn);

            actions.appendChild(adminGroup);
            card.appendChild(actions);

            projectsGrid.appendChild(card);
        });

        // Add "View All" button if more than 2 items
        if (list.length > 2) {
            const viewAllBtn = document.createElement('div');
            viewAllBtn.className = 'flex justify-center mt-8';
            const btn = document.createElement('button');
            btn.className = 'cta-button primary';
            btn.textContent = 'View All Projects';
            btn.addEventListener('click', () => {
                renderAllProjects(list);
            });
            viewAllBtn.appendChild(btn);
            projectsGrid.appendChild(viewAllBtn);
        }
        
        applyAdminUI();
    }

    function renderAllProjects(list) {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';
        list.forEach(p => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const coverDiv = document.createElement('div');
            coverDiv.className = 'project-images';
            const inner = document.createElement('div');
            inner.className = 'h-48 rounded-lg';
            inner.style.background = p.coverImageUrl ? `url('${p.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #22c55e, #3b82f6)';
            coverDiv.appendChild(inner);
            card.appendChild(coverDiv);

            const title = document.createElement('h3');
            title.className = 'text-2xl font-bold text-white mb-4';
            title.textContent = p.title;
            card.appendChild(title);

            const desc = document.createElement('p');
            desc.className = 'text-gray-400 mb-6';
            const plain = stripHtmlToText(p.description || '');
            desc.textContent = plain.slice(0, 140) + (plain.length > 140 ? '…' : '');
            card.appendChild(desc);

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '8px';

            const viewBtn = document.createElement('button');
            viewBtn.className = 'blog-btn';
            viewBtn.textContent = 'View';
            viewBtn.addEventListener('click', () => openProjectView(p));
            actions.appendChild(viewBtn);

            const adminGroup = document.createElement('div');
            adminGroup.setAttribute('data-admin-only', '');
            adminGroup.style.display = 'none';

            const editBtn = document.createElement('button');
            editBtn.className = 'blog-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openProjectEditor(p));
            adminGroup.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'blog-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this project?')) return;
                await apiJson(`/api/projects/${p._id}`, 'DELETE');
                await loadProjects();
            });
            adminGroup.appendChild(delBtn);

            actions.appendChild(adminGroup);
            card.appendChild(actions);

            projectsGrid.appendChild(card);
        });

        // Add "View Less" button at bottom
        const viewLessBtn = document.createElement('div');
        viewLessBtn.className = 'flex justify-center mt-12';
        const btn = document.createElement('button');
        btn.className = 'cta-button secondary';
        btn.textContent = 'View Less';
        btn.addEventListener('click', () => {
            loadProjects();
        });
        viewLessBtn.appendChild(btn);
        projectsGrid.appendChild(viewLessBtn);
        
        applyAdminUI();
    }

    function openProjectEditor(project) {
        editingProjectId = project ? project._id : null;
        projectModalTitle.textContent = project ? 'Edit Project' : 'Add Project';
        projectTitleInput.value = project ? project.title : '';
        projectDescInput.value = project ? project.description : '';
        if (projectCover) projectCover.value = '';
        openModal(projectModal);
    }

    function openProjectView(project) {
        projectViewTitle.textContent = project.title;
        projectViewContent.innerHTML = sanitizeBlogHtml(project.description || '');
        projectViewCover.style.background = project.coverImageUrl ? `url('${project.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #22c55e, #3b82f6)';
        openModal(projectViewModal);
    }

    async function saveProject() {
        const fd = new FormData();
        fd.append('title', projectTitleInput.value.trim());
        fd.append('description', projectDescInput.value.trim());
        if (projectCover.files && projectCover.files[0]) fd.append('coverImage', projectCover.files[0]);
        try {
            if (editingProjectId) {
                await apiForm(`/api/projects/${editingProjectId}`, 'PUT', fd);
            } else {
                await apiForm('/api/projects', 'POST', fd);
            }
            closeModal(projectModal);
            await loadProjects();
        } catch {}
    }

    async function loadProjects() {
        try {
            const list = await apiGet('/api/projects');
            renderProjects(list);
        } catch (e) { console.error('Failed to load projects', e); }
    }

    if (addProjectBtn) addProjectBtn.addEventListener('click', () => openProjectEditor(null));
    if (projectCancel) projectCancel.addEventListener('click', () => closeModal(projectModal));
    if (projectSave) projectSave.addEventListener('click', saveProject);
    if (projectViewClose) projectViewClose.addEventListener('click', () => closeModal(projectViewModal));
    if (projectInsertImage) {
        projectInsertImage.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!adminSecret) { alert('Login as admin first'); return; }
            const picker = document.createElement('input');
            picker.type = 'file'; picker.accept = 'image/*';
            picker.addEventListener('change', async (evt) => {
                evt.preventDefault();
                const file = picker.files && picker.files[0];
                if (!file) return;
                const fd = new FormData(); fd.append('image', file);
                try {
                    const res = await fetch(API_BASE + '/api/uploads', { method: 'POST', headers: { 'x-admin-secret': adminSecret }, body: fd });
                    if (!res.ok) throw new Error('Upload failed');
                    const data = await res.json();
                    const url = data.url;
                    const insert = `\n<img src="${url}" alt="" />\n`;
                    const start = projectDescInput.selectionStart || projectDescInput.value.length;
                    const end = projectDescInput.selectionEnd || projectDescInput.value.length;
                    projectDescInput.value = projectDescInput.value.slice(0, start) + insert + projectDescInput.value.slice(end);
                    projectDescInput.focus();
                } catch { alert('Image upload failed'); }
            });
            picker.click();
        });
    }

    // Bold text functionality for project description
    const projectBoldTextBtn = document.getElementById('project-bold-text');
    if (projectBoldTextBtn) {
        projectBoldTextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const textarea = projectDescInput;
            const start = textarea.selectionStart || textarea.value.length;
            const end = textarea.selectionEnd || textarea.value.length;
            const selectedText = textarea.value.slice(start, end);
            
            if (selectedText) {
                const boldText = `<strong>${selectedText}</strong>`;
                textarea.value = textarea.value.slice(0, start) + boldText + textarea.value.slice(end);
                textarea.focus();
                textarea.setSelectionRange(start + 8, end + 8);
            } else {
                const boldTemplate = '<strong>Bold text here</strong>';
                textarea.value = textarea.value.slice(0, start) + boldTemplate + textarea.value.slice(end);
                textarea.focus();
                textarea.setSelectionRange(start + 8, start + 22);
            }
        });
    }

    loadProjects();

    // ===== Research =====
    const researchViewModal = document.getElementById('research-view-modal');
    const researchViewCover = document.getElementById('research-view-cover');
    const researchViewTitle = document.getElementById('research-view-title');
    const researchViewContent = document.getElementById('research-view-content');
    const researchViewClose = document.getElementById('research-view-close');

    function renderResearch(list) {
        if (!researchGrid) return;
        researchGrid.innerHTML = '';
        const displayList = list.slice(0, 3); // Show only first 3 items
        
        displayList.forEach(r => {
            const card = document.createElement('div');
            card.className = 'research-paper';
            const title = document.createElement('h3');
            title.className = 'text-xl font-bold text-white mb-4';
            title.textContent = r.title;
            card.appendChild(title);
            const img = document.createElement('div');
            img.className = 'research-image h-32 rounded-lg';
            img.style.background = r.coverImageUrl ? `url('${r.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #f59e0b, #ef4444)';
            card.appendChild(img);

            const abstractP = document.createElement('p');
            abstractP.className = 'text-gray-400 mt-3';
            abstractP.textContent = (r.abstract || '').slice(0, 120) + ((r.abstract || '').length > 120 ? '…' : '');
            card.appendChild(abstractP);

            const adminGroup = document.createElement('div');
            adminGroup.setAttribute('data-admin-only', '');
            adminGroup.style.display = 'none';
            adminGroup.style.marginTop = '10px';

            const editBtn = document.createElement('button');
            editBtn.className = 'blog-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openResearchEditor(r));
            adminGroup.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'blog-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this research?')) return;
                await apiJson(`/api/research/${r._id}`, 'DELETE');
                await loadResearch();
            });
            adminGroup.appendChild(delBtn);

            const viewBtn = document.createElement('button');
            viewBtn.className = 'blog-btn';
            viewBtn.textContent = 'View';
            viewBtn.addEventListener('click', () => openResearchView(r));
            card.appendChild(viewBtn);

            card.appendChild(adminGroup);
            researchGrid.appendChild(card);
        });

        // Add "View All" button if more than 3 items
        if (list.length > 3) {
            const viewAllBtn = document.createElement('div');
            viewAllBtn.className = 'flex justify-center mt-8';
            const btn = document.createElement('button');
            btn.className = 'cta-button primary';
            btn.textContent = 'View All Research';
            btn.addEventListener('click', () => {
                renderAllResearch(list);
            });
            viewAllBtn.appendChild(btn);
            researchGrid.appendChild(viewAllBtn);
        }
        
        applyAdminUI();
    }

    function renderAllResearch(list) {
        if (!researchGrid) return;
        researchGrid.innerHTML = '';
        list.forEach(r => {
            const card = document.createElement('div');
            card.className = 'research-paper';
            const title = document.createElement('h3');
            title.className = 'text-xl font-bold text-white mb-4';
            title.textContent = r.title;
            card.appendChild(title);
            const img = document.createElement('div');
            img.className = 'research-image h-32 rounded-lg';
            img.style.background = r.coverImageUrl ? `url('${r.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #f59e0b, #ef4444)';
            card.appendChild(img);

            const abstractP = document.createElement('p');
            abstractP.className = 'text-gray-400 mt-3';
            abstractP.textContent = (r.abstract || '').slice(0, 120) + ((r.abstract || '').length > 120 ? '…' : '');
            card.appendChild(abstractP);

            const adminGroup = document.createElement('div');
            adminGroup.setAttribute('data-admin-only', '');
            adminGroup.style.display = 'none';
            adminGroup.style.marginTop = '10px';

            const editBtn = document.createElement('button');
            editBtn.className = 'blog-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openResearchEditor(r));
            adminGroup.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'blog-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this research?')) return;
                await apiJson(`/api/research/${r._id}`, 'DELETE');
                await loadResearch();
            });
            adminGroup.appendChild(delBtn);

            const viewBtn = document.createElement('button');
            viewBtn.className = 'blog-btn';
            viewBtn.textContent = 'View';
            viewBtn.addEventListener('click', () => openResearchView(r));
            card.appendChild(viewBtn);

            card.appendChild(adminGroup);
            researchGrid.appendChild(card);
        });

        // Add "View Less" button at bottom
        const viewLessBtn = document.createElement('div');
        viewLessBtn.className = 'flex justify-center mt-12';
        const btn = document.createElement('button');
        btn.className = 'cta-button secondary';
        btn.textContent = 'View Less';
        btn.addEventListener('click', () => {
            loadResearch();
        });
        viewLessBtn.appendChild(btn);
        researchGrid.appendChild(viewLessBtn);
        
        applyAdminUI();
    }

    function openResearchView(paper) {
        researchViewTitle.textContent = paper.title;
        researchViewContent.innerHTML = sanitizeBlogHtml(paper.abstract || '');
        researchViewCover.style.background = paper.coverImageUrl ? `url('${paper.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #f59e0b, #ef4444)';
        openModal(researchViewModal);
    }

    function openResearchEditor(paper) {
        editingResearchId = paper ? paper._id : null;
        researchModalTitle.textContent = paper ? 'Edit Research' : 'Add Research';
        researchTitleInput.value = paper ? paper.title : '';
        researchAbstractInput.value = paper ? paper.abstract : '';
        researchStatusInput.value = paper ? paper.status : 'ongoing';
        if (researchCover) researchCover.value = '';
        openModal(researchModal);
    }

    async function saveResearch() {
        const fd = new FormData();
        fd.append('title', researchTitleInput.value.trim());
        fd.append('abstract', researchAbstractInput.value.trim());
        fd.append('status', researchStatusInput.value);
        if (researchCover.files && researchCover.files[0]) fd.append('coverImage', researchCover.files[0]);
        try {
            if (editingResearchId) {
                await apiForm(`/api/research/${editingResearchId}`, 'PUT', fd);
            } else {
                await apiForm('/api/research', 'POST', fd);
            }
            closeModal(researchModal);
            await loadResearch();
        } catch {}
    }

    async function loadResearch() {
        try {
            const list = await apiGet(`/api/research?status=${encodeURIComponent(researchCurrentFilter)}`);
            renderResearch(list);
        } catch (e) { console.error('Failed to load research', e); }
    }

    if (addResearchBtn) addResearchBtn.addEventListener('click', () => openResearchEditor(null));
    if (researchCancel) researchCancel.addEventListener('click', () => closeModal(researchModal));
    if (researchSave) researchSave.addEventListener('click', saveResearch);
    if (researchViewClose) researchViewClose.addEventListener('click', () => closeModal(researchViewModal));
    if (researchInsertImage) {
        researchInsertImage.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!adminSecret) { alert('Login as admin first'); return; }
            const picker = document.createElement('input');
            picker.type = 'file'; picker.accept = 'image/*';
            picker.addEventListener('change', async (evt) => {
                evt.preventDefault();
                const file = picker.files && picker.files[0];
                if (!file) return;
                const fd = new FormData(); fd.append('image', file);
                try {
                    const res = await fetch(API_BASE + '/api/uploads', { method: 'POST', headers: { 'x-admin-secret': adminSecret }, body: fd });
                    if (!res.ok) throw new Error('Upload failed');
                    const data = await res.json();
                    const url = data.url;
                    const insert = `\n<img src="${url}" alt="" />\n`;
                    const start = researchAbstractInput.selectionStart || researchAbstractInput.value.length;
                    const end = researchAbstractInput.selectionEnd || researchAbstractInput.value.length;
                    researchAbstractInput.value = researchAbstractInput.value.slice(0, start) + insert + researchAbstractInput.value.slice(end);
                    researchAbstractInput.focus();
                } catch { alert('Image upload failed'); }
            });
            picker.click();
        });
    }

    // Bold text functionality for research abstract
    const researchBoldTextBtn = document.getElementById('research-bold-text');
    if (researchBoldTextBtn) {
        researchBoldTextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const textarea = researchAbstractInput;
            const start = textarea.selectionStart || textarea.value.length;
            const end = textarea.selectionEnd || textarea.value.length;
            const selectedText = textarea.value.slice(start, end);
            
            if (selectedText) {
                const boldText = `<strong>${selectedText}</strong>`;
                textarea.value = textarea.value.slice(0, start) + boldText + textarea.value.slice(end);
                textarea.focus();
                textarea.setSelectionRange(start + 8, end + 8);
            } else {
                const boldTemplate = '<strong>Bold text here</strong>';
                textarea.value = textarea.value.slice(0, start) + boldTemplate + textarea.value.slice(end);
                textarea.focus();
                textarea.setSelectionRange(start + 8, start + 22);
            }
        });
    }
    researchFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            researchCurrentFilter = btn.getAttribute('data-research-filter');
            loadResearch();
        });
    });
    loadResearch();

    // ===== Recent Works =====
    function renderRecentWorks(list) {
        if (!recentWorksGrid) return;
        recentWorksGrid.innerHTML = '';
        const displayList = list.slice(0, 3); // Show only first 3 items
        
        displayList.forEach((rw, idx) => {
            const card = document.createElement('div');
            card.className = 'blog-card' + (idx === 0 ? ' featured' : '');
            const coverDiv = document.createElement('div');
            coverDiv.className = 'w-full h-48 rounded-lg mb-4';
            coverDiv.style.background = rw.coverImageUrl ? `url('${rw.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #22c55e, #3b82f6)';
            card.appendChild(coverDiv);

            const title = document.createElement('h3');
            title.className = 'text-xl font-bold text-white mb-2';
            title.textContent = rw.title;
            card.appendChild(title);

            const excerpt = document.createElement('p');
            excerpt.className = 'text-gray-400 text-sm mb-4';
            excerpt.textContent = (rw.description || '').slice(0, 140) + ((rw.description || '').length > 140 ? '...' : '');
            card.appendChild(excerpt);

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '8px';

            const viewBtn = document.createElement('button');
            viewBtn.className = 'blog-btn';
            viewBtn.textContent = 'View Article';
            viewBtn.addEventListener('click', () => openRecentWorkView(rw));
            actions.appendChild(viewBtn);

            const adminGroup = document.createElement('div');
            adminGroup.setAttribute('data-admin-only', '');
            adminGroup.style.display = 'none';

            const editBtn = document.createElement('button');
            editBtn.className = 'blog-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openRecentWorkEditor(rw));
            adminGroup.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'blog-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this recent work?')) return;
                await apiJson(`/api/recent-works/${rw._id}`, 'DELETE');
                await loadRecentWorks();
            });
            adminGroup.appendChild(delBtn);

            actions.appendChild(adminGroup);
            card.appendChild(actions);

            recentWorksGrid.appendChild(card);
        });

        // Add "View All" button if more than 3 items
        if (list.length > 3) {
            const viewAllBtn = document.createElement('div');
            viewAllBtn.className = 'flex justify-center mt-8';
            const btn = document.createElement('button');
            btn.className = 'cta-button primary';
            btn.textContent = 'View All Recent Works';
            btn.addEventListener('click', () => {
                // For now, just show all items in the grid
                renderAllRecentWorks(list);
            });
            viewAllBtn.appendChild(btn);
            recentWorksGrid.appendChild(viewAllBtn);
        }
        
        applyAdminUI();
    }

    function renderAllRecentWorks(list) {
        if (!recentWorksGrid) return;
        recentWorksGrid.innerHTML = '';
        list.forEach((rw, idx) => {
            const card = document.createElement('div');
            card.className = 'blog-card' + (idx === 0 ? ' featured' : '');
            const coverDiv = document.createElement('div');
            coverDiv.className = 'w-full h-48 rounded-lg mb-4';
            coverDiv.style.background = rw.coverImageUrl ? `url('${rw.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #22c55e, #3b82f6)';
            card.appendChild(coverDiv);

            const title = document.createElement('h3');
            title.className = 'text-xl font-bold text-white mb-2';
            title.textContent = rw.title;
            card.appendChild(title);

            const excerpt = document.createElement('p');
            excerpt.className = 'text-gray-400 text-sm mb-4';
            excerpt.textContent = (rw.description || '').slice(0, 140) + ((rw.description || '').length > 140 ? '...' : '');
            card.appendChild(excerpt);

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '8px';

            const viewBtn = document.createElement('button');
            viewBtn.className = 'blog-btn';
            viewBtn.textContent = 'View Article';
            viewBtn.addEventListener('click', () => openRecentWorkView(rw));
            actions.appendChild(viewBtn);

            const adminGroup = document.createElement('div');
            adminGroup.setAttribute('data-admin-only', '');
            adminGroup.style.display = 'none';

            const editBtn = document.createElement('button');
            editBtn.className = 'blog-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openRecentWorkEditor(rw));
            adminGroup.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'blog-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this recent work?')) return;
                await apiJson(`/api/recent-works/${rw._id}`, 'DELETE');
                await loadRecentWorks();
            });
            adminGroup.appendChild(delBtn);

            actions.appendChild(adminGroup);
            card.appendChild(actions);

            recentWorksGrid.appendChild(card);
        });

        // Add "View Less" button at bottom
        const viewLessBtn = document.createElement('div');
        viewLessBtn.className = 'flex justify-center mt-12';
        const btn = document.createElement('button');
        btn.className = 'cta-button secondary';
        btn.textContent = 'View Less';
        btn.addEventListener('click', () => {
            loadRecentWorks();
        });
        viewLessBtn.appendChild(btn);
        recentWorksGrid.appendChild(viewLessBtn);
        
        applyAdminUI();
    }

    function openRecentWorkEditor(work) {
        editingRecentWorkId = work ? work._id : null;
        recentWorkModalTitle.textContent = work ? 'Edit Recent Work' : 'Add Recent Work';
        recentWorkTitleInput.value = work ? work.title : '';
        recentWorkDescInput.value = work ? work.description : '';
        if (recentWorkCover) recentWorkCover.value = '';
        openModal(recentWorkModal);
    }

    function openRecentWorkView(work) {
        recentWorkViewTitle.textContent = work.title;
        recentWorkViewContent.innerHTML = sanitizeBlogHtml(work.description || '');
        recentWorkViewCover.style.background = work.coverImageUrl ? `url('${work.coverImageUrl}') center/cover no-repeat` : 'linear-gradient(135deg, #22c55e, #3b82f6)';
        openModal(recentWorkViewModal);
    }

    async function saveRecentWork() {
        const fd = new FormData();
        fd.append('title', recentWorkTitleInput.value.trim());
        fd.append('description', recentWorkDescInput.value.trim());
        if (recentWorkCover.files && recentWorkCover.files[0]) fd.append('coverImage', recentWorkCover.files[0]);
        try {
            if (editingRecentWorkId) {
                await apiForm(`/api/recent-works/${editingRecentWorkId}`, 'PUT', fd);
            } else {
                await apiForm('/api/recent-works', 'POST', fd);
            }
            closeModal(recentWorkModal);
            await loadRecentWorks();
        } catch {}
    }

    async function loadRecentWorks() {
        try {
            const list = await apiGet('/api/recent-works');
            renderRecentWorks(list);
        } catch (e) { console.error('Failed to load recent works', e); }
    }

    if (addRecentWorkBtn) addRecentWorkBtn.addEventListener('click', () => openRecentWorkEditor(null));
    if (recentWorkCancel) recentWorkCancel.addEventListener('click', () => closeModal(recentWorkModal));
    if (recentWorkSave) recentWorkSave.addEventListener('click', saveRecentWork);
    if (recentWorkViewClose) recentWorkViewClose.addEventListener('click', () => closeModal(recentWorkViewModal));

    loadRecentWorks();

    // ===== Testimonials =====
    function renderTestimonials(list) {
        if (!testimonialsScroll) return;
        testimonialsScroll.innerHTML = '';
        
        // If we have less than 3 testimonials, duplicate them to ensure smooth scrolling
        let displayList = [...list];
        if (list.length < 3) {
            // Duplicate the list multiple times to ensure we have at least 6 items for smooth scrolling
            const multiplier = Math.ceil(6 / list.length);
            displayList = [];
            for (let i = 0; i < multiplier; i++) {
                displayList.push(...list);
            }
        } else {
            // For 3 or more testimonials, just duplicate once for seamless loop
            displayList = [...list, ...list];
        }
        
        displayList.forEach(t => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            
            const photoDiv = document.createElement('div');
            photoDiv.className = 'w-16 h-16 rounded-full mx-auto mb-4';
            if (t.photoUrl) {
                photoDiv.style.background = `url('${t.photoUrl}') center/cover no-repeat`;
            } else {
                photoDiv.className += ' bg-gradient-to-br from-blue-500 to-purple-600';
            }
            card.appendChild(photoDiv);

            const text = document.createElement('p');
            text.className = 'text-gray-400 text-sm text-center';
            text.textContent = `"${t.description}"`;
            card.appendChild(text);

            const adminGroup = document.createElement('div');
            adminGroup.setAttribute('data-admin-only', '');
            adminGroup.style.display = 'none';
            adminGroup.style.marginTop = '10px';
            adminGroup.style.textAlign = 'center';

            const editBtn = document.createElement('button');
            editBtn.className = 'blog-btn';
            editBtn.textContent = 'Edit';
            editBtn.style.marginRight = '8px';
            editBtn.addEventListener('click', () => openTestimonialEditor(t));
            adminGroup.appendChild(editBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'blog-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this testimonial?')) return;
                await apiJson(`/api/testimonials/${t._id}`, 'DELETE');
                await loadTestimonials();
            });
            adminGroup.appendChild(delBtn);

            card.appendChild(adminGroup);
            testimonialsScroll.appendChild(card);
        });
        
        applyAdminUI();
    }

    function openTestimonialEditor(testimonial) {
        editingTestimonialId = testimonial ? testimonial._id : null;
        testimonialModalTitle.textContent = testimonial ? 'Edit Testimonial' : 'Add Testimonial';
        testimonialDescInput.value = testimonial ? testimonial.description : '';
        if (testimonialPhoto) testimonialPhoto.value = '';
        openModal(testimonialModal);
    }

    async function saveTestimonial() {
        const fd = new FormData();
        fd.append('description', testimonialDescInput.value.trim());
        if (testimonialPhoto.files && testimonialPhoto.files[0]) fd.append('photo', testimonialPhoto.files[0]);
        try {
            if (editingTestimonialId) {
                await apiForm(`/api/testimonials/${editingTestimonialId}`, 'PUT', fd);
            } else {
                await apiForm('/api/testimonials', 'POST', fd);
            }
            closeModal(testimonialModal);
            await loadTestimonials();
        } catch {}
    }

    async function loadTestimonials() {
        try {
            const list = await apiGet('/api/testimonials');
            renderTestimonials(list);
        } catch (e) { 
            console.error('Failed to load testimonials', e);
            // Load default testimonials if API fails
            const defaultTestimonials = [
                {
                    _id: '1',
                    description: "Working with him is always a good experience for me. His dedication in every work is highly praiseworthy. His keen eyes to every detail is beneficiary in all sense",
                    photoUrl: null
                },
                {
                    _id: '2', 
                    description: "Arnab's strategic thinking and creative approach to problem-solving have been invaluable to our team. He brings fresh perspectives to every project.",
                    photoUrl: null
                },
                {
                    _id: '3',
                    description: "His research skills are exceptional. Arnab has a unique ability to connect theoretical knowledge with practical applications in agriculture.",
                    photoUrl: null
                },
                {
                    _id: '4',
                    description: "As a youth leader, Arnab inspires everyone around him. His commitment to empowering young people is truly remarkable and impactful.",
                    photoUrl: null
                }
            ];
            renderTestimonials(defaultTestimonials);
        }
    }

    if (addTestimonialBtn) addTestimonialBtn.addEventListener('click', () => openTestimonialEditor(null));
    if (testimonialCancel) testimonialCancel.addEventListener('click', () => closeModal(testimonialModal));
    if (testimonialSave) testimonialSave.addEventListener('click', saveTestimonial);

    loadTestimonials();
});
