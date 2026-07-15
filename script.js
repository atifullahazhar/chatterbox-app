document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 0. CRASH-PROOF HELPER FUNCTIONS (KABHI KOI ERROR NAHI AAYEGI)
    // =========================================================================
    const safeEl = id => document.getElementById(id);
    const sAdd = (id, cls) => { const el = safeEl(id); if(el) el.classList.add(cls); };
    const sRem = (id, cls) => { const el = safeEl(id); if(el) el.classList.remove(cls); };
    const sText = (id, txt) => { const el = safeEl(id); if(el) el.innerText = txt; };
    const sHtml = (id, html) => { const el = safeEl(id); if(el) el.innerHTML = html; };
    const sVal = (id, val) => { const el = safeEl(id); if(el) el.value = val; };
    const gVal = (id) => { const el = safeEl(id); return el ? el.value.trim() : ''; };
    const sSrc = (id, src) => { const el = safeEl(id); if(el) el.src = src; };

    // =========================================================================
    // 1. STATE MANAGEMENT, LOCAL STORAGE & CORE VARIABLES
    // =========================================================================
    let currentUser = null;
    let friends = [];
    let friendRequests = [];
    let bandRequests = [];
    let posts = [];
    let groups = [];

    // Safely load from local storage
    try {
        currentUser = JSON.parse(localStorage.getItem('chatUser')) || null;
        friends = JSON.parse(localStorage.getItem('chatFriends')) || [];
        friendRequests = JSON.parse(localStorage.getItem('chatRequests')) || [
            { username: "Nauras Daniyal", dp: "https://ui-avatars.com/api/?name=Nauras&background=eaddff&color=8b5cf6", bio: "Always ready to code." },
            { username: "Rahul Sharma", dp: "https://ui-avatars.com/api/?name=Rahul&background=ffedd5&color=f97316", bio: "Gamer and Developer." }
        ];
        bandRequests = JSON.parse(localStorage.getItem('bandRequests')) || [
            { username: "Sneha_007", dp: "https://ui-avatars.com/api/?name=Sneha&background=fce7f3&color=ec4899" }
        ];
        posts = JSON.parse(localStorage.getItem('chatPosts')) || [];
        groups = JSON.parse(localStorage.getItem('chatGroups')) || [];
    } catch (e) {
        console.error("Local storage processing error:", e);
    }
    
    let activeChatUser = null;
    let currentChatTab = 'general'; // 'general', 'favorite', 'requests'
    let currentRequestSubTab = 'accept'; // 'accept', 'send'
    let searchedUserContext = null;

    // Toggle States for Developer Options
    let isWorldMuted = false;
    let devStates = { shadowban: false, globalMute: false, maintenance: false };
    
    // Temp Variables for File Uploads
    let tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";
    let attachedPostImage = null;

    const socket = (typeof io !== 'undefined') ? io() : { on: () => {}, emit: () => {} };
    const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";

    // App Initialization Logic
    if (currentUser && currentUser.username) {
        sRem('login-screen', 'active');
        sAdd('login-screen', 'hidden');
        sRem('main-app', 'hidden');
        sAdd('main-app', 'active');
        
        applyTheme();
        updateProfileUI();
        renderContacts();
        updateBadgesAndCounts();
        renderPosts();
        renderGroups();
        renderBandRequests();
    }

    // Comprehensive Data Save Engine
    function saveData() {
        localStorage.setItem('chatUser', JSON.stringify(currentUser));
        localStorage.setItem('chatFriends', JSON.stringify(friends));
        localStorage.setItem('chatRequests', JSON.stringify(friendRequests));
        localStorage.setItem('chatPosts', JSON.stringify(posts));
        localStorage.setItem('chatGroups', JSON.stringify(groups));
        localStorage.setItem('bandRequests', JSON.stringify(bandRequests));
        updateBadgesAndCounts();
    }

    // Theme Engine Processor
    function applyTheme() {
        if (!currentUser) return;
        const darkModeToggle = safeEl('settings-dark-mode-toggle');
        
        if (currentUser.theme === 'grand-golden') {
            document.documentElement.setAttribute('data-theme', 'grand-golden');
            if (darkModeToggle) { darkModeToggle.checked = true; darkModeToggle.disabled = true; }
        } else if (currentUser.theme && currentUser.theme !== 'default') {
            document.documentElement.setAttribute('data-theme', currentUser.theme);
            if (darkModeToggle) darkModeToggle.disabled = false;
        } else {
            let isDarkMode = localStorage.getItem('darkMode') === 'true';
            if (darkModeToggle) {
                darkModeToggle.disabled = false;
                darkModeToggle.checked = isDarkMode;
            }
            if (isDarkMode) document.documentElement.setAttribute('data-theme', 'dark');
            else document.documentElement.removeAttribute('data-theme');
        }
    }

    // =========================================================================
    // 2. 🔥 LOGIN ENGINE (CRASH PROOF & RELOAD PROOF) 🔥
    // =========================================================================
    function performLoginProcess(e) {
        if(e) e.preventDefault(); // Stop page reload immediately
        
        const username = gVal('username-input');
        const devCode = gVal('dev-code');

        if (username) {
            currentUser = { 
                username: username, 
                dp: DEFAULT_DP, 
                banner: null, 
                rank: 'Member', 
                isDev: false, 
                bio: "Operational systems online. Ready to chat.", 
                theme: "default" 
            };
            
            // Dev Code Verification
            if (devCode === "6200437705AT") {
                currentUser.rank = 'Developer';
                currentUser.isDev = true;
                currentUser.theme = 'grand-golden';
            }
            
            saveData();
            
            // Transition Screens safely
            sRem('login-screen', 'active');
            sAdd('login-screen', 'hidden');
            sRem('main-app', 'hidden');
            sAdd('main-app', 'active');
            
            // Initialize Systems safely
            applyTheme();
            updateProfileUI();
            renderContacts();
            updateBadgesAndCounts();
            renderPosts();
            renderGroups();
            renderBandRequests();
        } else {
            alert("CRITICAL: Username verification failed. Please enter a valid identifier.");
        }
    }

    // Bind to Form Submit (Pressing Enter inside input)
    const loginForm = safeEl('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', performLoginProcess);
    }

    // =========================================================================
    // 3. 🔥 THE ULTIMATE GLOBAL CLICK EVENT DELEGATION LISTENER 🔥
    // =========================================================================
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;

        // Login Button Backup Check
        if (target.closest('#join-btn')) {
            performLoginProcess(e);
            return;
        }

        // ---------------------------------------------------------
        // B. PRIMARY NAVIGATION TABS (SIDEBAR)
        // ---------------------------------------------------------
        const navBtn = target.closest('.nav-btn');
        if (navBtn) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.content-view').forEach(c => {
                c.classList.remove('active');
                c.classList.add('hidden');
            });
            navBtn.classList.add('active');
            const targetId = navBtn.getAttribute('data-target');
            sRem(targetId, 'hidden');
            sAdd(targetId, 'active');
        }

        // ---------------------------------------------------------
        // C. CHAT WORKSPACE TABS (General, Favorite, Requests)
        // ---------------------------------------------------------
        const chatTab = target.closest('.chat-tabs .tab-btn');
        if (chatTab) {
            document.querySelectorAll('.chat-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            chatTab.classList.add('active');
            currentChatTab = chatTab.getAttribute('data-tab');
            
            if (currentChatTab === 'requests') {
                sRem('request-sub-tabs-container', 'hidden');
                sAdd('search-friend-field-block', 'hidden');
                renderRequestSubTabUI();
            } else {
                sAdd('request-sub-tabs-container', 'hidden');
                sRem('search-friend-field-block', 'hidden');
                resetRightWorkspacePane();
                renderContacts();
            }
        }

        if (target.closest('#sub-tab-accept-btn')) {
            currentRequestSubTab = 'accept';
            renderRequestSubTabUI();
            resetRightWorkspacePane();
        }
        if (target.closest('#sub-tab-send-btn')) {
            currentRequestSubTab = 'send';
            renderRequestSubTabUI();
        }

        if (target.closest('#sidebar-action-search-trigger') && currentChatTab === 'requests' && currentRequestSubTab === 'send') {
            const searchVal = gVal('chat-sidebar-search-input');
            if (searchVal !== "") {
                searchedUserContext = {
                    username: searchVal,
                    dp: `https://ui-avatars.com/api/?name=${searchVal}&background=random&color=fff`,
                    bio: `This is generated profile metadata for ${searchVal}. Waiting for interaction.`
                };
                openRightProfilePreviewPane(searchedUserContext);
            } else {
                alert("Please enter a username to search the network grid.");
            }
        }

        if (target.closest('#action-dispatch-friend-request-btn')) {
            if (searchedUserContext) {
                alert(`Friend Request Payload dispatched securely to [${searchedUserContext.username}]!`);
                sVal('chat-sidebar-search-input', '');
                resetRightWorkspacePane();
            }
        }

        // ---------------------------------------------------------
        // D. FRIEND REQUESTS (ACCEPT / REJECT)
        // ---------------------------------------------------------
        if (target.closest('.btn-accept-friend')) {
            const closestItem = target.closest('.dummy-item');
            if(closestItem) {
                const username = closestItem.getAttribute('data-user');
                friendRequests = friendRequests.filter(req => req.username !== username);
                friends.push({ 
                    username: username, 
                    dp: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`, 
                    isFavorite: false,
                    bio: "New connection synchronized."
                });
                saveData();
                renderRequestSubTabUI();
                alert(`SUCCESS: Network connection established with ${username}.`);
            }
        }

        if (target.closest('.btn-reject-friend')) {
            const closestItem = target.closest('.dummy-item');
            if(closestItem) {
                const username = closestItem.getAttribute('data-user');
                friendRequests = friendRequests.filter(req => req.username !== username);
                saveData();
                renderRequestSubTabUI();
            }
        }

        // ---------------------------------------------------------
        // E. MODAL WINDOWS (OPEN & CLOSE ROUTING)
        // ---------------------------------------------------------
        if (target.closest('.close-modal-btn')) {
            const modalId = target.closest('.close-modal-btn').getAttribute('data-modal');
            sAdd(modalId, 'hidden');
        }

        if (target.closest('#view-friends-list-btn')) {
            renderFriendsListModal();
            sRem('friend-list-modal', 'hidden');
        }

        if (target.closest('#edit-profile-btn')) {
            sVal('edit-username-input', currentUser.username);
            sVal('edit-bio-input', currentUser.bio || '');
            sRem('edit-profile-modal', 'hidden');
        }

        if (target.closest('#create-group-btn')) {
            sRem('create-group-modal', 'hidden');
        }

        if (target.closest('#current-chat-dp') || target.closest('#current-chat-name')) {
            if (activeChatUser) {
                sSrc('view-user-dp', activeChatUser.dp);
                sText('view-user-name', activeChatUser.username);
                sText('view-user-bio', activeChatUser.bio || "No biographical metadata available.");
                sRem('view-user-modal', 'hidden');
            }
        }

        // ---------------------------------------------------------
        // F. DIRECT CHAT OPERATIONS & FAVORITE TOGGLE
        // ---------------------------------------------------------
        if (target.closest('.contact-item')) {
            const username = target.closest('.contact-item').getAttribute('data-user');
            openChatWindow(username);
        }

        if (target.closest('#favorite-user-btn')) {
            if (activeChatUser) {
                const friendIndex = friends.findIndex(f => f.username === activeChatUser.username);
                if (friendIndex !== -1) {
                    friends[friendIndex].isFavorite = !friends[friendIndex].isFavorite;
                    saveData();
                    updateFavoriteButtonUI();
                    if(currentChatTab === 'favorite') {
                        renderContacts();
                        resetRightWorkspacePane();
                    }
                }
            }
        }

        // ---------------------------------------------------------
        // G. PROFILE EDITING (SAVE BUTTON)
        // ---------------------------------------------------------
        if (target.closest('#trigger-dp-upload')) {
            const dpInput = safeEl('edit-dp-input');
            if(dpInput) dpInput.click();
        }
        if (target.closest('#trigger-banner-upload')) {
            const bannerInput = safeEl('edit-banner-input');
            if(bannerInput) bannerInput.click();
        }
        if (target.closest('#save-profile-btn')) {
            const newName = gVal('edit-username-input');
            const newBio = gVal('edit-bio-input');
            if (newName) currentUser.username = newName;
            currentUser.bio = newBio;
            saveData();
            updateProfileUI();
            sAdd('edit-profile-modal', 'hidden');
            alert("Metadata re-indexed and profile configurations saved successfully.");
        }

        // ---------------------------------------------------------
        // H. POST FEED HUB ENGINE
        // ---------------------------------------------------------
        if (target.closest('#post-image-btn')) {
            const postImgInput = safeEl('post-image-upload-input');
            if(postImgInput) postImgInput.click();
        }
        
        if (target.closest('#action-remove-attached-post-file-buffer')) {
            attachedPostImage = null;
            sAdd('post-media-attachment-status-preview', 'hidden');
            sVal('post-image-upload-input', ''); 
        }

        if (target.closest('#submit-post-btn')) {
            const postText = gVal('post-input');
            if (postText !== "" || attachedPostImage) {
                const newPost = {
                    id: Date.now(),
                    user: currentUser.username,
                    dp: currentUser.dp,
                    text: postText,
                    image: attachedPostImage,
                    time: "Just initialized"
                };
                posts.unshift(newPost);
                saveData();
                renderPosts();
                sVal('post-input', '');
                attachedPostImage = null;
                sAdd('post-media-attachment-status-preview', 'hidden');
                sVal('post-image-upload-input', '');
            } else {
                alert("SYSTEM HALT: Post payload empty. Please insert text strings or image binaries.");
            }
        }

        if (target.closest('.delete-post-btn')) {
            if (confirm("CRITICAL WARNING: Irreversible destruction of post block data. Proceed?")) {
                const closestPost = target.closest('.feed-post');
                if(closestPost) {
                    const id = closestPost.getAttribute('data-id');
                    posts = posts.filter(p => p.id != id);
                    saveData();
                    renderPosts();
                }
            }
        }

        if (target.closest('.like-btn')) {
            const btn = target.closest('.like-btn');
            btn.classList.toggle('liked');
            if (btn.classList.contains('liked')) {
                btn.style.color = '#ef4444';
                btn.innerHTML = '<i class="fas fa-heart"></i> Endorsed';
            } else {
                btn.style.color = 'var(--text-muted)';
                btn.innerHTML = '<i class="far fa-heart"></i> Endorse';
            }
        }

        // ---------------------------------------------------------
        // I. GROUP CREATION
        // ---------------------------------------------------------
        if (target.closest('#trigger-group-icon-upload')) {
            const grpInput = safeEl('new-group-icon-input');
            if(grpInput) grpInput.click();
        }

        if (target.closest('#confirm-create-group-btn')) {
            const groupName = gVal('new-group-name');
            if (groupName) {
                groups.push({ id: Date.now(), name: groupName, icon: tempGroupIcon });
                saveData();
                renderGroups();
                sAdd('create-group-modal', 'hidden');
                sVal('new-group-name', '');
                tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";
                sSrc('new-group-icon-preview', tempGroupIcon);
            }
        }

        // ---------------------------------------------------------
        // J. FRIENDSHIP BAND MATRIX
        // ---------------------------------------------------------
        if (target.closest('#send-band-req-btn')) {
            const inputVal = gVal('band-request-input');
            if (inputVal !== "") {
                bandRequests.push({ username: inputVal });
                saveData();
                renderBandRequests();
                sVal('band-request-input', '');
                alert("Synchronization Handshake Outbound Signal Dispatched!");
            }
        }

        if (target.closest('.btn-accept-band')) {
            const closestItem = target.closest('.dummy-item');
            if(closestItem) {
                const username = closestItem.getAttribute('data-user');
                bandRequests = bandRequests.filter(req => req.username !== username);
                sHtml('fb-partner-dp-slot', `<img src="https://ui-avatars.com/api/?name=${username}&background=random&color=fff" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`);
                sText('fb-partner-name', username);
                sText('band-level', "Synchronization Tier Level 1");
                const bandProgress = safeEl('band-progress');
                if(bandProgress) bandProgress.style.width = "20%";
                sText('time-remaining', "Signal Line Secured & Synchronized");
                saveData();
                renderBandRequests();
            }
        }

        // ---------------------------------------------------------
        // K. WORLD CHAT (MUTE & BROADCAST)
        // ---------------------------------------------------------
        if (target.closest('#world-mute-btn')) {
            isWorldMuted = !isWorldMuted;
            const muteBtn = safeEl('world-mute-btn');
            if(muteBtn) {
                if (isWorldMuted) {
                    muteBtn.classList.add('muted');
                    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span>Unmute Room</span>';
                } else {
                    muteBtn.classList.remove('muted');
                    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Mute Global Space</span>';
                }
            }
        }

        if (target.closest('#world-send-btn')) {
            sendWorldMessage();
        }

        // ---------------------------------------------------------
        // L. DEVELOPER DASHBOARD ALL 9 BUTTONS MATRIX
        // ---------------------------------------------------------
        if (target.closest('#dev-assign-rank-btn')) { sText('dev-modal-title', "Modify Security Privileges (Rank)"); sRem('dev-assign-modal', 'hidden'); generateDevOptionsGrid('rank'); }
        if (target.closest('#dev-assign-ring-btn')) { sText('dev-modal-title', "Modify Visual Profile Ring"); sRem('dev-assign-modal', 'hidden'); generateDevOptionsGrid('ring'); }
        if (target.closest('#dev-assign-theme-btn')) { sText('dev-modal-title', "Modify Application Theme Matrix"); sRem('dev-assign-modal', 'hidden'); generateDevOptionsGrid('theme'); }
        
        if (target.closest('#dev-ban-user-execution-btn')) openDevActionModal('Execute Permanent Ban Protocol');
        if (target.closest('#dev-unban-user-execution-btn')) openDevActionModal('Execute Profile Unban Protocol');
        
        if (target.closest('#dev-shadowban-toggle-btn')) {
            devStates.shadowban = !devStates.shadowban;
            const btn = safeEl('dev-shadowban-toggle-btn');
            const icon = safeEl('dev-shadowban-icon-display');
            if (devStates.shadowban) {
                if(btn) btn.style.borderColor = '#ef4444';
                if(icon) icon.style.textShadow = '0 0 15px #ef4444';
                sHtml('dev-shadowban-desc-display', '<b style="color:white;">STATUS: ACTIVE</b> // Shadowban filter engaged.');
            } else {
                if(btn) btn.style.borderColor = '#a855f7';
                if(icon) icon.style.textShadow = '0 0 15px #a855f7';
                sText('dev-shadowban-desc-display', 'CURRENT: SYSTEM NORMAL MONITORING RUNNING.');
            }
        }

        if (target.closest('#dev-global-mute-toggle-btn')) {
            devStates.globalMute = !devStates.globalMute;
            const btn = safeEl('dev-global-mute-toggle-btn');
            const icon = safeEl('dev-global-mute-icon-display');
            if (devStates.globalMute) {
                if(btn) btn.style.borderColor = '#ef4444';
                if(icon) { icon.style.textShadow = '0 0 15px #ef4444'; icon.innerText = '🔇'; }
                sHtml('dev-global-mute-desc-display', '<b style="color:white;">STATUS: MUTED</b> // All client parsing pipelines frozen.');
            } else {
                if(btn) btn.style.borderColor = '#a855f7';
                if(icon) { icon.style.textShadow = '0 0 15px #a855f7'; icon.innerText = '🤐'; }
                sText('dev-global-mute-desc-display', 'CURRENT: TRANSMISSIONS OPEN UNRESTRICTED.');
            }
        }

        if (target.closest('#dev-maintenance-toggle-mode-btn')) {
            devStates.maintenance = !devStates.maintenance;
            const btn = safeEl('dev-maintenance-toggle-mode-btn');
            const icon = safeEl('dev-maintenance-icon-display');
            if (devStates.maintenance) {
                if(btn) btn.style.borderColor = '#ef4444';
                if(icon) icon.style.textShadow = '0 0 15px #ef4444';
                sHtml('dev-maintenance-desc-display', '<b style="color:white;">STATUS: MAINTENANCE ACTIVE</b> // Pipelines restricted.');
            } else {
                if(btn) btn.style.borderColor = '#f97316';
                if(icon) icon.style.textShadow = '0 0 15px #f97316';
                sText('dev-maintenance-desc-display', 'CURRENT: SYSTEM LIVE OPERATIONAL.');
            }
        }

        if (target.closest('#dev-wipe-server-data-btn')) {
            if (confirm("CRITICAL OVERRIDE: Destroy ALL local application caches. Proceed?")) { 
                localStorage.clear(); 
                location.reload(); 
            }
        }
    });

    // =========================================================================
    // 4. FILE UPLOADS (SAFE LISTENERS)
    // =========================================================================
    function setupFileInput(id, callback) {
        const el = safeEl(id);
        if(el) {
            el.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = e => callback(e.target.result);
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    setupFileInput('edit-dp-input', (res) => { currentUser.dp = res; saveData(); updateProfileUI(); alert("Logo updated!"); });
    setupFileInput('edit-banner-input', (res) => { currentUser.banner = res; saveData(); updateProfileUI(); alert("Banner updated!"); });
    setupFileInput('new-group-icon-input', (res) => { tempGroupIcon = res; sSrc('new-group-icon-preview', tempGroupIcon); });
    setupFileInput('post-image-upload-input', (res) => { 
        attachedPostImage = res; 
        sRem('post-media-attachment-status-preview', 'hidden');
    });

    // =========================================================================
    // 5. ENTER KEY EVENT LISTENERS FOR INPUT FIELDS
    // =========================================================================
    const handleEnter = (id, triggerId) => {
        const el = safeEl(id);
        if(el) {
            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const btn = safeEl(triggerId);
                    if(btn) btn.click();
                }
            });
        }
    };
    handleEnter('message-input', 'send-btn');
    handleEnter('world-message-input', 'world-send-btn');
    handleEnter('chat-sidebar-search-input', 'sidebar-action-search-trigger');

    // =========================================================================
    // 6. CORE UI UPDATE & RENDER LOGIC FUNCTIONS
    // =========================================================================
    function sendWorldMessage() {
        const inputVal = gVal('world-message-input');
        if (inputVal !== "") {
            socket.emit('send_message', { sender: currentUser.username, text: inputVal });
            const area = safeEl('world-messages-area');
            if(area) {
                const div = document.createElement('div');
                div.className = `message-bubble my-msg`;
                div.innerHTML = `<strong>${currentUser.username}:</strong> ${inputVal}`;
                area.appendChild(div);
                area.scrollTop = area.scrollHeight;
            }
            sVal('world-message-input', '');
        }
    }

    socket.on('receive_message', (data) => {
        if (!isWorldMuted && currentUser && data.sender !== currentUser.username) {
            const area = safeEl('world-messages-area');
            if(area) {
                const div = document.createElement('div');
                div.className = `message-bubble other-msg`;
                div.innerHTML = `<strong>${data.sender}:</strong> ${data.text}`;
                area.appendChild(div);
                area.scrollTop = area.scrollHeight;
            }
        }
    });

    function updateProfileUI() {
        if (!currentUser) return;
        
        sText('display-username', currentUser.username);
        sText('user-bio', currentUser.bio || "No bio available.");
        sSrc('user-dp', currentUser.dp || DEFAULT_DP);
        sSrc('fb-my-dp', currentUser.dp || DEFAULT_DP);
        
        if (currentUser.banner) { 
            sSrc('banner-img', currentUser.banner); 
            sRem('banner-img', 'hidden'); 
        } else { 
            sAdd('banner-img', 'hidden'); 
        }
        
        sText('display-rank', currentUser.rank);

        const usernameDisplay = safeEl('display-username');
        const rankBadge = safeEl('display-rank');

        if (currentUser.isDev) {
            if(usernameDisplay) usernameDisplay.classList.add('shiny-dev-text');
            if(rankBadge) rankBadge.className = 'rank-badge rank-developer';
            sRem('dev-nav-item', 'hidden');
        } else {
            if(usernameDisplay) usernameDisplay.classList.remove('shiny-dev-text');
        }
    }

    function updateBadgesAndCounts() {
        const reqBadge = safeEl('req-badge');
        if(reqBadge) {
            if (friendRequests.length > 0) {
                reqBadge.innerText = friendRequests.length;
                reqBadge.classList.remove('hidden');
            } else {
                reqBadge.classList.add('hidden');
            }
        }
        sText('total-friends-count', friends.length);
    }

    function renderContacts() {
        const container = safeEl('contact-list-container');
        if(!container) return;
        container.innerHTML = '';
        
        let displayList = currentChatTab === 'favorite' ? friends.filter(f => f.isFavorite) : friends;
        
        if (displayList.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px; font-weight:bold;">No nodes found.</p>`;
            return;
        }
        displayList.forEach(friend => {
            let starIcon = friend.isFavorite ? `<i class="fas fa-star" style="color:#f59e0b; margin-left: 5px;"></i>` : '';
            container.innerHTML += `
                <div class="dummy-item contact-item" data-user="${friend.username}">
                    <img src="${friend.dp}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:1px solid var(--primary-color);">
                    <b>${friend.username} ${starIcon}</b>
                </div>
            `;
        });
    }

    function renderRequestSubTabUI() {
        const container = safeEl('contact-list-container');
        if(!container) return;
        container.innerHTML = '';
        
        const acceptBtn = safeEl('sub-tab-accept-btn');
        const sendBtn = safeEl('sub-tab-send-btn');
        
        if (currentRequestSubTab === 'accept') {
            if(acceptBtn) acceptBtn.classList.add('active-sub-tab');
            if(sendBtn) sendBtn.classList.remove('active-sub-tab');
            sAdd('search-friend-field-block', 'hidden');
            
            if (friendRequests.length === 0) {
                container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px; padding: 20px;">No inbound verification requests detected.</p>`;
                return;
            }
            friendRequests.forEach(req => {
                container.innerHTML += `
                    <div class="dummy-item" data-user="${req.username}" style="background:var(--bg-main); border:1px solid var(--border-color);">
                        <img src="${req.dp}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                        <b style="font-size:0.9rem;">${req.username}</b>
                        <div class="req-action-btns">
                            <button class="btn-accept-friend btn-accept" title="Accept"><i class="fas fa-check"></i></button>
                            <button class="btn-reject-friend btn-reject" title="Reject"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                `;
            });
        } else if (currentRequestSubTab === 'send') {
            if(acceptBtn) acceptBtn.classList.remove('active-sub-tab');
            if(sendBtn) sendBtn.classList.add('active-sub-tab');
            sRem('search-friend-field-block', 'hidden');
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px; padding: 20px;">Input username text pattern in search field to identify targets.</p>`;
        }
    }

    function renderFriendsListModal() {
        const container = safeEl('modal-friend-list-container');
        if(!container) return;
        container.innerHTML = '';
        if (friends.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px;">0 Synchronized nodes logged.</p>`;
            return;
        }
        friends.forEach(friend => {
            container.innerHTML += `
                <div class="dummy-item" style="border-bottom: 1px solid var(--border-color); padding: 15px;">
                    <img src="${friend.dp}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color);">
                    <b style="font-size:1.25rem;">${friend.username}</b>
                </div>
            `;
        });
    }

    function renderPosts() {
        const container = safeEl('feed-container');
        if(!container) return;
        container.innerHTML = '';
        posts.forEach(post => {
            let imgHtml = post.image ? `<img src="${post.image}" class="post-media-img">` : '';
            container.innerHTML += `
                <div class="feed-post" data-id="${post.id}">
                    <div class="post-header">
                        <div class="post-user-info">
                            <img src="${post.dp}" class="post-user-dp">
                            <div><b style="font-size:1.15rem;">${post.user}</b><span style="color:var(--text-muted); font-size:0.85rem; display:block;">${post.time}</span></div>
                        </div>
                        ${post.user === currentUser.username ? `<button class="delete-post-btn"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                    ${post.text ? `<div class="post-text-content">${post.text}</div>` : ''}
                    ${imgHtml}
                    <div class="post-footer">
                        <button class="action-btn like-btn"><i class="far fa-heart"></i> Endorse</button>
                    </div>
                </div>
            `;
        });
    }

    function renderGroups() {
        const container = safeEl('group-list-container');
        if(!container) return;
        container.innerHTML = '';
        groups.forEach(group => {
            let icon = group.icon || `https://ui-avatars.com/api/?name=${group.name}&background=a855f7&color=fff`;
            container.innerHTML += `
                <div class="dummy-item" style="padding: 15px;">
                    <img src="${icon}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:1px solid var(--border-color);">
                    <b style="font-size: 1.15rem;">${group.name}</b>
                </div>
            `;
        });
    }

    function renderBandRequests() {
        const container = safeEl('band-incoming-requests');
        if(!container) return;
        container.innerHTML = '';
        if (bandRequests.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 10px;">No inbound requests.</p>`;
            return;
        }
        bandRequests.forEach(req => {
            container.innerHTML += `
                <div class="dummy-item" data-user="${req.username}" style="margin-top:10px; background:var(--bg-main); padding: 15px;">
                    <b style="flex:1;">Incoming Link From: ${req.username}</b>
                    <button class="btn-accept-band btn-accept" style="width:45px; height:45px;"><i class="fas fa-check"></i></button>
                </div>
            `;
        });
    }

    function openChatWindow(username) {
        sAdd('request-profile-preview-pane', 'hidden');
        sAdd('chat-placeholder', 'hidden');
        
        sRem('chat-header', 'hidden');
        sRem('messages-area', 'hidden');
        sRem('chat-input-area', 'hidden');
        
        activeChatUser = friends.find(f => f.username === username);
        if(activeChatUser) {
            sText('current-chat-name', activeChatUser.username);
            sSrc('current-chat-dp', activeChatUser.dp);
            updateFavoriteButtonUI();
        }
    }

    function updateFavoriteButtonUI() {
        const favBtn = safeEl('favorite-user-btn');
        if(favBtn) {
            if (activeChatUser && activeChatUser.isFavorite) {
                favBtn.classList.add('starred');
                favBtn.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                favBtn.classList.remove('starred');
                favBtn.innerHTML = '<i class="far fa-star"></i>';
            }
        }
    }

    function openRightProfilePreviewPane(userContext) {
        sAdd('chat-placeholder', 'hidden');
        sAdd('chat-header', 'hidden');
        sAdd('messages-area', 'hidden');
        sAdd('chat-input-area', 'hidden');
        
        sRem('request-profile-preview-pane', 'hidden');
        sSrc('preview-search-user-dp', userContext.dp);
        sText('preview-search-user-name', userContext.username);
        sText('preview-search-user-bio', userContext.bio);
    }

    function resetRightWorkspacePane() {
        sAdd('request-profile-preview-pane', 'hidden');
        sAdd('chat-header', 'hidden');
        sAdd('messages-area', 'hidden');
        sAdd('chat-input-area', 'hidden');
        sRem('chat-placeholder', 'hidden');
    }

    // DEV MODAL LOGIC
    let currentDevActionType = "";
    let selectedDevOptionValue = null;

    function openDevActionModal(title) {
        sRem('dev-action-modal', 'hidden');
        sText('action-modal-title', title);
    }

    function generateDevOptionsGrid(type) {
        currentDevActionType = type;
        const grid = safeEl('dev-options-grid');
        if(!grid) return;
        grid.innerHTML = '';
        selectedDevOptionValue = null;

        if (type === 'rank') {
            ['Operator', 'Elite', 'Legend', 'Pro', 'Member'].forEach(r => {
                const btn = document.createElement('button');
                btn.className = 'action-btn'; btn.style.width = '100%'; btn.innerText = r;
                btn.onclick = () => { 
                    selectedDevOptionValue = r; 
                    Array.from(grid.children).forEach(c => c.style.border = '1px solid var(--border-color)'); 
                    btn.style.border = '2px solid var(--primary-color)'; 
                };
                grid.appendChild(btn);
            });
            return;
        }

        if (type === 'theme') {
            const grandBtn = document.createElement('button');
            grandBtn.className = 'action-btn theme-style-grand';
            grandBtn.style.width = '100%'; grandBtn.style.gridColumn = '1 / -1'; grandBtn.innerText = '🌟 INJECT GRAND GOLDEN VIP THEME 🌟';
            grandBtn.onclick = () => { 
                selectedDevOptionValue = 'grand-golden'; 
                Array.from(grid.children).forEach(c => c.style.outline = 'none'); 
                grandBtn.style.outline = '3px solid var(--primary-color)'; 
            };
            grid.appendChild(grandBtn);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'danger-btn'; removeBtn.style.width = '100%'; removeBtn.style.gridColumn = '1 / -1'; removeBtn.innerText = '❌ Remove Active Theme';
            removeBtn.onclick = () => { 
                selectedDevOptionValue = 'default'; 
                Array.from(grid.children).forEach(c => c.style.outline = 'none'); 
                removeBtn.style.outline = '3px solid var(--primary-color)'; 
            };
            grid.appendChild(removeBtn);
        }

        for (let i = 1; i <= 20; i++) {
            const box = document.createElement('div');
            box.style.width = '100%'; box.style.aspectRatio = '1/1'; box.style.borderRadius = '50%'; 
            box.style.cursor = 'pointer'; box.style.display = 'flex'; box.style.justifyContent = 'center'; 
            box.style.alignItems = 'center'; box.style.color = 'white'; box.style.fontWeight = 'bold'; box.innerHTML = `${i}`;

            if (type === 'ring') { 
                box.classList.add(`ring-style-${i}`); 
                box.style.border = `3px solid hsl(${(i * 18) % 360}, 80%, 60%)`; 
            } else if (type === 'theme') { 
                box.style.background = `hsl(${(i * 18) % 360}, 60%, 50%)`; 
            }

            box.addEventListener('click', () => {
                Array.from(grid.children).forEach(child => child.style.outline = 'none');
                box.style.outline = '4px solid var(--primary-color)';
                selectedDevOptionValue = (type === 'theme') ? `premium-${i}` : i;
            });
            grid.appendChild(box);
        }
    }

});