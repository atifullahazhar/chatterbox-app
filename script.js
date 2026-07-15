document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. STATE MANAGEMENT, LOCAL STORAGE & CORE VARIABLES
    // =========================================================================
    let currentUser = JSON.parse(localStorage.getItem('chatUser')) || null;
    let friends = JSON.parse(localStorage.getItem('chatFriends')) || [];
    
    // Default mock requests to show in the incoming request tabs
    let friendRequests = JSON.parse(localStorage.getItem('chatRequests')) || [
        { username: "Nauras Daniyal", dp: "https://ui-avatars.com/api/?name=Nauras&background=eaddff&color=8b5cf6", bio: "Always ready to code." },
        { username: "Rahul Sharma", dp: "https://ui-avatars.com/api/?name=Rahul&background=ffedd5&color=f97316", bio: "Gamer and Developer." }
    ];
    let bandRequests = JSON.parse(localStorage.getItem('bandRequests')) || [
        { username: "Sneha_007", dp: "https://ui-avatars.com/api/?name=Sneha&background=fce7f3&color=ec4899" }
    ];
    let posts = JSON.parse(localStorage.getItem('chatPosts')) || [];
    let groups = JSON.parse(localStorage.getItem('chatGroups')) || [];
    
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

    const socket = (typeof io !== 'undefined') ? io() : { on: () => { }, emit: () => { }, broadcast: { emit: () => {} } };
    const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";

    // App Initialization Logic
    if (currentUser) {
        document.getElementById('login-screen').classList.replace('active', 'hidden');
        document.getElementById('main-app').classList.replace('hidden', 'active');
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
        const darkModeToggle = document.getElementById('settings-dark-mode-toggle');
        
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
    // 2. 🔥 THE ULTIMATE GLOBAL CLICK EVENT DELEGATION LISTENER 🔥
    // =========================================================================
    document.addEventListener('click', (e) => {
        const target = e.target;

        // ---------------------------------------------------------
        // A. AUTHENTICATION & LOGIN PROCESS
        // ---------------------------------------------------------
        if (target.closest('#join-btn')) {
            e.preventDefault();
            const username = document.getElementById('username-input').value.trim();
            const devCode = document.getElementById('dev-code').value.trim();

            if (username) {
                currentUser = { 
                    username: username, dp: DEFAULT_DP, banner: null, 
                    rank: 'Member', isDev: false, bio: "Operational systems online. Ready to chat.", 
                    theme: "default" 
                };
                
                // Dev Code Verification
                if (devCode === "6200437705AT") {
                    currentUser.rank = 'Developer';
                    currentUser.isDev = true;
                    currentUser.theme = 'grand-golden';
                }
                
                saveData();
                document.getElementById('login-screen').classList.replace('active', 'hidden');
                document.getElementById('main-app').classList.replace('hidden', 'active');
                
                applyTheme();
                updateProfileUI();
                renderContacts();
            } else {
                alert("CRITICAL: Username verification failed. Please enter a valid identifier.");
            }
        }

        // ---------------------------------------------------------
        // B. PRIMARY NAVIGATION TABS (SIDEBAR)
        // ---------------------------------------------------------
        const navBtn = target.closest('.nav-btn');
        if (navBtn) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.content-view').forEach(c => c.classList.replace('active', 'hidden'));
            navBtn.classList.add('active');
            const targetId = navBtn.getAttribute('data-target');
            document.getElementById(targetId).classList.replace('hidden', 'active');
        }

        // ---------------------------------------------------------
        // C. CHAT WORKSPACE TABS (General, Favorite, Requests)
        // ---------------------------------------------------------
        const chatTab = target.closest('.chat-tabs .tab-btn');
        if (chatTab) {
            document.querySelectorAll('.chat-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            chatTab.classList.add('active');
            currentChatTab = chatTab.getAttribute('data-tab');
            
            // Layout Adjustments based on Tab
            if (currentChatTab === 'requests') {
                document.getElementById('request-sub-tabs-container').classList.remove('hidden');
                document.getElementById('search-friend-field-block').classList.add('hidden');
                renderRequestSubTabUI();
            } else {
                document.getElementById('request-sub-tabs-container').classList.add('hidden');
                document.getElementById('search-friend-field-block').classList.remove('hidden');
                // Ensure placeholder is visible instead of profile preview when leaving requests
                resetRightWorkspacePane();
                renderContacts();
            }
        }

        // Request Sub-Tabs Logic (Accept vs Send)
        if (target.closest('#sub-tab-accept-btn')) {
            currentRequestSubTab = 'accept';
            renderRequestSubTabUI();
            resetRightWorkspacePane();
        }
        if (target.closest('#sub-tab-send-btn')) {
            currentRequestSubTab = 'send';
            renderRequestSubTabUI();
        }

        // Request Search (Search Entity Logic) -> OPENS PROFILE PREVIEW ON RIGHT
        if (target.closest('#sidebar-action-search-trigger') && currentChatTab === 'requests' && currentRequestSubTab === 'send') {
            const searchVal = document.getElementById('chat-sidebar-search-input').value.trim();
            if (searchVal !== "") {
                // Mock search logic: Generates a dummy profile context to show in right pane
                searchedUserContext = {
                    username: searchVal,
                    dp: `https://ui-avatars.com/api/?name=${searchVal}&background=random&color=fff`,
                    bio: `This is a generated profile metadata for ${searchVal}. Waiting for interaction.`
                };
                openRightProfilePreviewPane(searchedUserContext);
            } else {
                alert("Please enter a username to search the network grid.");
            }
        }

        // Send Friend Request Button (Inside the Right Preview Pane)
        if (target.closest('#action-dispatch-friend-request-btn')) {
            if (searchedUserContext) {
                alert(`Friend Request Payload dispatched securely to [${searchedUserContext.username}]!`);
                document.getElementById('chat-sidebar-search-input').value = '';
                resetRightWorkspacePane(); // Close the preview after sending
            }
        }


        // ---------------------------------------------------------
        // D. FRIEND REQUESTS (ACCEPT / REJECT IN LEFT SIDEBAR)
        // ---------------------------------------------------------
        if (target.closest('.btn-accept-friend')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            // Remove from requests
            friendRequests = friendRequests.filter(req => req.username !== username);
            // Add to friends
            friends.push({ 
                username: username, 
                dp: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`, 
                isFavorite: false,
                bio: "New connection synchronized."
            });
            saveData();
            renderRequestSubTabUI();
            alert(`SUCCESS: Network connection established with ${username}. Node added to General Chat.`);
        }

        if (target.closest('.btn-reject-friend')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            friendRequests = friendRequests.filter(req => req.username !== username);
            saveData();
            renderRequestSubTabUI();
        }


        // ---------------------------------------------------------
        // E. MODAL WINDOWS (OPEN & CLOSE ROUTING)
        // ---------------------------------------------------------
        if (target.closest('.close-modal-btn')) {
            const modalId = target.closest('.close-modal-btn').getAttribute('data-modal');
            document.getElementById(modalId).classList.add('hidden');
        }

        if (target.closest('#open-requests-modal-btn')) {
            // Deprecated logic, now we use the main Requests tab. But keeping logic alive just in case.
            renderOldIncomingRequestsModal();
            document.getElementById('friend-requests-modal').classList.remove('hidden');
        }

        if (target.closest('#view-friends-list-btn')) {
            renderFriendsListModal();
            document.getElementById('friend-list-modal').classList.remove('hidden');
        }

        if (target.closest('#edit-profile-btn')) {
            document.getElementById('edit-username-input').value = currentUser.username;
            document.getElementById('edit-bio-input').value = currentUser.bio || '';
            document.getElementById('edit-profile-modal').classList.remove('hidden');
        }

        if (target.closest('#create-group-btn')) {
            document.getElementById('create-group-modal').classList.remove('hidden');
        }

        // View User Profile (Clicking Header Info)
        if (target.closest('#current-chat-dp') || target.closest('#current-chat-name')) {
            if (activeChatUser) {
                document.getElementById('view-user-dp').src = activeChatUser.dp;
                document.getElementById('view-user-name').innerText = activeChatUser.username;
                document.getElementById('view-user-bio').innerText = activeChatUser.bio || "No biographical metadata available for this node.";
                document.getElementById('view-user-modal').classList.remove('hidden');
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
                    
                    // If we are viewing the Favorite tab and we unfavorite someone, update the list
                    if(currentChatTab === 'favorite') {
                        renderContacts();
                        resetRightWorkspacePane();
                    }
                }
            }
        }


        // ---------------------------------------------------------
        // G. PROFILE EDITING (LOGO, BANNER, DETAILS SAVE)
        // ---------------------------------------------------------
        if (target.closest('#trigger-dp-upload')) {
            document.getElementById('edit-dp-input').click();
        }
        if (target.closest('#trigger-banner-upload')) {
            document.getElementById('edit-banner-input').click();
        }
        if (target.closest('#save-profile-btn')) {
            const newName = document.getElementById('edit-username-input').value.trim();
            const newBio = document.getElementById('edit-bio-input').value.trim();
            if (newName) currentUser.username = newName;
            currentUser.bio = newBio;
            saveData();
            updateProfileUI();
            document.getElementById('edit-profile-modal').classList.add('hidden');
            alert("Metadata re-indexed and profile configurations saved successfully.");
        }


        // ---------------------------------------------------------
        // H. POST FEED HUB ENGINE (IMAGE ATTACH, POST, DELETE, LIKE)
        // ---------------------------------------------------------
        if (target.closest('#post-image-btn')) {
            document.getElementById('post-image-upload-input').click();
        }
        
        if (target.closest('#action-remove-attached-post-file-buffer')) {
            attachedPostImage = null;
            document.getElementById('post-media-attachment-status-preview').classList.add('hidden');
            document.getElementById('post-image-upload-input').value = ""; // Clear file input
        }

        if (target.closest('#submit-post-btn')) {
            const postInput = document.getElementById('post-input');
            if (postInput.value.trim() !== "" || attachedPostImage) {
                const newPost = {
                    id: Date.now(),
                    user: currentUser.username,
                    dp: currentUser.dp,
                    text: postInput.value.trim(),
                    image: attachedPostImage,
                    time: "Just initialized"
                };
                posts.unshift(newPost);
                saveData();
                renderPosts();
                postInput.value = '';
                attachedPostImage = null;
                document.getElementById('post-media-attachment-status-preview').classList.add('hidden');
                document.getElementById('post-image-upload-input').value = "";
            } else {
                alert("SYSTEM HALT: Post payload empty. Please insert text strings or image binaries.");
            }
        }

        if (target.closest('.delete-post-btn')) {
            if (confirm("CRITICAL WARNING: Irreversible destruction of post block data. Proceed?")) {
                const id = target.closest('.feed-post').getAttribute('data-id');
                posts = posts.filter(p => p.id != id);
                saveData();
                renderPosts();
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
        // I. GROUP CHAT CREATION & ICONS
        // ---------------------------------------------------------
        if (target.closest('#trigger-group-icon-upload')) {
            document.getElementById('new-group-icon-input').click();
        }

        if (target.closest('#confirm-create-group-btn')) {
            const groupName = document.getElementById('new-group-name').value.trim();
            if (groupName) {
                groups.push({ id: Date.now(), name: groupName, icon: tempGroupIcon });
                saveData();
                renderGroups();
                document.getElementById('create-group-modal').classList.add('hidden');
                document.getElementById('new-group-name').value = '';
                tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";
                document.getElementById('new-group-icon-preview').src = tempGroupIcon;
            }
        }


        // ---------------------------------------------------------
        // J. FRIENDSHIP BAND MATRIX (SEND & ACCEPT)
        // ---------------------------------------------------------
        if (target.closest('#send-band-req-btn')) {
            const input = document.getElementById('band-request-input');
            if (input.value.trim() !== "") {
                // Simulating pushing to local inbound requests for testing
                bandRequests.push({ username: input.value.trim() });
                saveData();
                renderBandRequests();
                input.value = '';
                alert("Synchronization Handshake Outbound Signal Dispatched!");
            }
        }

        if (target.closest('.btn-accept-band')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            bandRequests = bandRequests.filter(req => req.username !== username);
            document.getElementById('fb-partner-dp-slot').innerHTML = `<img src="https://ui-avatars.com/api/?name=${username}&background=random&color=fff" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            document.getElementById('fb-partner-name').innerText = username;
            document.getElementById('band-level').innerText = "Synchronization Tier Level 1";
            document.getElementById('band-progress').style.width = "20%";
            document.getElementById('time-remaining').innerText = "Signal Line Secured & Synchronized";
            saveData();
            renderBandRequests();
        }


        // ---------------------------------------------------------
        // K. WORLD CHAT (MUTE & BROADCAST)
        // ---------------------------------------------------------
        if (target.closest('#world-mute-btn')) {
            isWorldMuted = !isWorldMuted;
            const muteBtn = document.getElementById('world-mute-btn');
            if (isWorldMuted) {
                muteBtn.classList.add('muted');
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span>Unmute Room</span>';
            } else {
                muteBtn.classList.remove('muted');
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Mute Global Space Room</span>';
            }
        }

        if (target.closest('#world-send-btn')) {
            sendWorldMessage();
        }


        // ---------------------------------------------------------
        // L. DEVELOPER DASHBOARD ALL 9 BUTTONS MATRIX
        // ---------------------------------------------------------
        // Modals (Rank, Ring, Theme)
        if (target.closest('#dev-assign-rank-btn')) { document.getElementById('dev-modal-title').innerText = "Modify Security Privileges Vector Framework (Rank)"; document.getElementById('dev-assign-modal').classList.remove('hidden'); generateDevOptionsGrid('rank'); }
        if (target.closest('#dev-assign-ring-btn')) { document.getElementById('dev-modal-title').innerText = "Modify Visual Profile Ring Configurations"; document.getElementById('dev-assign-modal').classList.remove('hidden'); generateDevOptionsGrid('ring'); }
        if (target.closest('#dev-assign-theme-btn')) { document.getElementById('dev-modal-title').innerText = "Modify Application Style Theme Matrix"; document.getElementById('dev-assign-modal').classList.remove('hidden'); generateDevOptionsGrid('theme'); }
        
        // Direct Actions (Ban, Unban)
        if (target.closest('#dev-ban-user-execution-btn')) openDevActionModal('Execute Target Permanent Ban Protocol');
        if (target.closest('#dev-unban-user-execution-btn')) openDevActionModal('Execute Target Profile Unban Protocol');
        
        // Toggle Actions (Shadowban, Global Mute, Maintenance)
        if (target.closest('#dev-shadowban-toggle-btn')) {
            devStates.shadowban = !devStates.shadowban;
            const btn = document.getElementById('dev-shadowban-toggle-btn');
            const icon = document.getElementById('dev-shadowban-icon-display');
            const desc = document.getElementById('dev-shadowban-desc-display');
            if (devStates.shadowban) {
                btn.style.borderColor = '#ef4444';
                icon.style.textShadow = '0 0 15px #ef4444';
                desc.innerHTML = '<b style="color:white;">STATUS: ACTIVE</b> // Shadowban filter engaged on targets.';
            } else {
                btn.style.borderColor = '#a855f7';
                icon.style.textShadow = '0 0 15px #a855f7';
                desc.innerHTML = 'CURRENT: SYSTEM NORMAL MONITORING RUNNING // Execute silent transmission routing filter.';
            }
        }

        if (target.closest('#dev-global-mute-toggle-btn')) {
            devStates.globalMute = !devStates.globalMute;
            const btn = document.getElementById('dev-global-mute-toggle-btn');
            const icon = document.getElementById('dev-global-mute-icon-display');
            const desc = document.getElementById('dev-global-mute-desc-display');
            if (devStates.globalMute) {
                btn.style.borderColor = '#ef4444';
                icon.style.textShadow = '0 0 15px #ef4444';
                icon.innerText = '🔇';
                desc.innerHTML = '<b style="color:white;">STATUS: MUTED</b> // All client parsing pipelines frozen.';
            } else {
                btn.style.borderColor = '#a855f7';
                icon.style.textShadow = '0 0 15px #a855f7';
                icon.innerText = '🤐';
                desc.innerHTML = 'CURRENT: TRANSMISSIONS OPEN UNRESTRICTED // Freeze or activate packet lines.';
            }
        }

        if (target.closest('#dev-maintenance-toggle-mode-btn')) {
            devStates.maintenance = !devStates.maintenance;
            const btn = document.getElementById('dev-maintenance-toggle-mode-btn');
            const icon = document.getElementById('dev-maintenance-icon-display');
            const desc = document.getElementById('dev-maintenance-desc-display');
            if (devStates.maintenance) {
                btn.style.borderColor = '#ef4444';
                icon.style.textShadow = '0 0 15px #ef4444';
                desc.innerHTML = '<b style="color:white;">STATUS: MAINTENANCE ACTIVE</b> // External pipelines restricted.';
            } else {
                btn.style.borderColor = '#f97316';
                icon.style.textShadow = '0 0 15px #f97316';
                desc.innerHTML = 'CURRENT: SYSTEM LIVE OPERATIONAL // Shut down client view screens pipelines.';
            }
        }

        // Wipe Button
        if (target.closest('#dev-wipe-server-data-btn')) {
            if (confirm("CRITICAL OVERRIDE: Destroy ALL local application workspace memory caches. This is irreversible. Proceed?")) { 
                localStorage.clear(); 
                location.reload(); 
            }
        }

        // Settings Toggles (Dark Mode handled natively above)
        if (target.closest('.toggle-switch')) {
            // Allowing native checkbox behavior, handled by CSS. No JS needed for simple visual toggles unless logic requires it.
        }

    }); // END GLOBAL CLICK EVENT LISTENER


    // =========================================================================
    // 3. FILE UPLOAD EVENT LISTENERS (HIDDEN INPUT TRIGGERS)
    // =========================================================================
    
    // DP (Profile Picture) Upload
    const editDpInput = document.getElementById('edit-dp-input');
    if(editDpInput) {
        editDpInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => { 
                    currentUser.dp = e.target.result; 
                    saveData(); 
                    updateProfileUI(); 
                    alert("System Success: Core Avatar Graphic Asset Overwritten."); 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Banner Upload
    const editBannerInput = document.getElementById('edit-banner-input');
    if(editBannerInput) {
        editBannerInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => { 
                    currentUser.banner = e.target.result; 
                    saveData(); 
                    updateProfileUI(); 
                    alert("System Success: Banner Layout Block Asset Synchronized."); 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Group Icon Upload
    const groupIconInput = document.getElementById('new-group-icon-input');
    if(groupIconInput) {
        groupIconInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => { 
                    tempGroupIcon = e.target.result; 
                    document.getElementById('new-group-icon-preview').src = tempGroupIcon; 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Post Content Media (Image) Upload
    const postImageInput = document.getElementById('post-image-upload-input');
    if(postImageInput) {
        postImageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => { 
                    attachedPostImage = e.target.result; 
                    document.getElementById('post-media-attachment-status-preview').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }


    // =========================================================================
    // 4. ENTER KEY EVENT LISTENERS FOR INPUT FIELDS
    // =========================================================================
    
    // Direct Chat Enter Key
    document.getElementById('message-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('send-btn').click();
    });

    // World Chat Enter Key
    document.getElementById('world-message-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendWorldMessage();
    });

    // Chat Sidebar Search Input Enter Key (Triggers Search)
    document.getElementById('chat-sidebar-search-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('sidebar-action-search-trigger').click();
    });


    // =========================================================================
    // 5. CORE UI UPDATE & RENDER LOGIC FUNCTIONS
    // =========================================================================

    // World Chat Core Dispatch Engine
    function sendWorldMessage() {
        const input = document.getElementById('world-message-input');
        if (input && input.value.trim() !== "") {
            socket.emit('send_message', { sender: currentUser.username, text: input.value.trim() });
            
            const area = document.getElementById('world-messages-area');
            const div = document.createElement('div');
            div.className = `message-bubble my-msg`;
            div.innerHTML = `<strong>${currentUser.username}:</strong> ${input.value}`;
            area.appendChild(div);
            area.scrollTop = area.scrollHeight;

            input.value = '';
        }
    }

    // Socket Payload Receiver Engine
    socket.on('receive_message', (data) => {
        if (!isWorldMuted && currentUser && data.sender !== currentUser.username) {
            const area = document.getElementById('world-messages-area');
            const div = document.createElement('div');
            div.className = `message-bubble other-msg`;
            div.innerHTML = `<strong>${data.sender}:</strong> ${data.text}`;
            area.appendChild(div);
            area.scrollTop = area.scrollHeight;
        }
    });

    function updateProfileUI() {
        if (!currentUser) return;
        
        const usernameDisplay = document.getElementById('display-username');
        usernameDisplay.innerText = currentUser.username;
        document.getElementById('user-bio').innerText = currentUser.bio || "No biographical information available.";
        document.getElementById('user-dp').src = currentUser.dp || DEFAULT_DP;
        document.getElementById('fb-my-dp').src = currentUser.dp || DEFAULT_DP;
        
        const bannerImg = document.getElementById('banner-img');
        if (currentUser.banner) { 
            bannerImg.src = currentUser.banner; 
            bannerImg.classList.remove('hidden'); 
        } else { 
            bannerImg.classList.add('hidden'); 
        }
        
        const rankBadge = document.getElementById('display-rank');
        rankBadge.innerText = currentUser.rank;

        // Shiny Dev Logic Update
        if (currentUser.isDev) {
            usernameDisplay.classList.add('shiny-dev-text');
            rankBadge.className = 'rank-badge rank-developer';
            document.getElementById('dev-nav-item').classList.remove('hidden');
        } else {
            usernameDisplay.classList.remove('shiny-dev-text');
        }
    }

    function updateBadgesAndCounts() {
        const reqBadge = document.getElementById('req-badge');
        if (friendRequests.length > 0) {
            reqBadge.innerText = friendRequests.length;
            reqBadge.classList.remove('hidden');
        } else {
            reqBadge.classList.add('hidden');
        }
        document.getElementById('total-friends-count').innerText = friends.length;
    }

    function renderContacts() {
        const container = document.getElementById('contact-list-container');
        container.innerHTML = '';
        
        // Tab Filtering Logic
        if (currentChatTab === 'general') {
            if (friends.length === 0) {
                container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px; font-weight:bold;">No general communication nodes found.</p>`;
                return;
            }
            friends.forEach(friend => {
                let starIcon = friend.isFavorite ? `<i class="fas fa-star" style="color:#f59e0b; margin-left: 5px;"></i>` : '';
                container.innerHTML += `
                    <div class="dummy-item contact-item" data-user="${friend.username}">
                        <img src="${friend.dp}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:1px solid var(--primary-color);">
                        <b>${friend.username} ${starIcon}</b>
                    </div>
                `;
            });
        } else if (currentChatTab === 'favorite') {
            let favList = friends.filter(f => f.isFavorite);
            if (favList.length === 0) {
                container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px; font-weight:bold;">No favorite nodes tagged in index.</p>`;
                return;
            }
            favList.forEach(friend => {
                container.innerHTML += `
                    <div class="dummy-item contact-item" data-user="${friend.username}">
                        <img src="${friend.dp}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid #f59e0b;">
                        <b>${friend.username} <i class="fas fa-star" style="color:#f59e0b;"></i></b>
                    </div>
                `;
            });
        }
    }

    function renderRequestSubTabUI() {
        const container = document.getElementById('contact-list-container');
        container.innerHTML = '';
        
        const acceptBtn = document.getElementById('sub-tab-accept-btn');
        const sendBtn = document.getElementById('sub-tab-send-btn');
        
        if (currentRequestSubTab === 'accept') {
            acceptBtn.classList.add('active-sub-tab');
            sendBtn.classList.remove('active-sub-tab');
            document.getElementById('search-friend-field-block').classList.add('hidden');
            
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
                            <button class="btn-accept-friend btn-accept" title="Accept Hook"><i class="fas fa-check"></i></button>
                            <button class="btn-reject-friend btn-reject" title="Reject Hook"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                `;
            });
        } else if (currentRequestSubTab === 'send') {
            acceptBtn.classList.remove('active-sub-tab');
            sendBtn.classList.add('active-sub-tab');
            document.getElementById('search-friend-field-block').classList.remove('hidden');
            
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px; padding: 20px;">Input username text pattern in search field to identify targets across database blocks.</p>`;
        }
    }

    function renderOldIncomingRequestsModal() {
        // Keeping this logic for backward compatibility if user clicks the button instead of tab
        const container = document.getElementById('incoming-requests-container');
        container.innerHTML = '';
        if (friendRequests.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding: 15px;">Queue is totally clear.</p>`;
            return;
        }
        friendRequests.forEach(req => {
            container.innerHTML += `
                <div class="dummy-item" data-user="${req.username}" style="background:var(--bg-main); border:1px solid var(--border-color);">
                    <img src="${req.dp}" style="width:45px; height:45px; border-radius:50%; object-fit:cover;">
                    <b style="flex:1;">${req.username}</b>
                    <div class="req-action-btns">
                        <button class="btn-accept-friend btn-accept"><i class="fas fa-check"></i></button>
                        <button class="btn-reject-friend btn-reject"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
        });
    }

    function renderFriendsListModal() {
        const container = document.getElementById('modal-friend-list-container');
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
        const container = document.getElementById('feed-container');
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
                        <button class="action-btn like-btn"><i class="far fa-heart"></i> Endorse Status</button>
                        <button class="action-btn"><i class="far fa-comment"></i> Query Node</button>
                    </div>
                </div>
            `;
        });
    }

    function renderGroups() {
        const container = document.getElementById('group-list-container');
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
        const container = document.getElementById('band-incoming-requests');
        container.innerHTML = '';
        if (bandRequests.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 10px;">No inbound synchronization requests pipeline active.</p>`;
            return;
        }
        bandRequests.forEach(req => {
            container.innerHTML += `
                <div class="dummy-item" data-user="${req.username}" style="margin-top:10px; background:var(--bg-main); padding: 15px;">
                    <b style="flex:1;">Incoming Matrix Signal From: ${req.username}</b>
                    <button class="btn-accept-band btn-accept" style="width:45px; height:45px;"><i class="fas fa-check"></i></button>
                </div>
            `;
        });
    }

    function openChatWindow(username) {
        document.getElementById('request-profile-preview-pane').classList.add('hidden');
        document.getElementById('chat-placeholder').classList.add('hidden');
        
        document.getElementById('chat-header').classList.remove('hidden');
        document.getElementById('messages-area').classList.remove('hidden');
        document.getElementById('chat-input-area').classList.remove('hidden');
        
        activeChatUser = friends.find(f => f.username === username);
        document.getElementById('current-chat-name').innerText = activeChatUser.username;
        document.getElementById('current-chat-dp').src = activeChatUser.dp;
        
        updateFavoriteButtonUI();
    }

    function updateFavoriteButtonUI() {
        const favBtn = document.getElementById('favorite-user-btn');
        if (activeChatUser && activeChatUser.isFavorite) {
            favBtn.classList.add('starred');
            favBtn.innerHTML = '<i class="fas fa-star"></i>';
        } else {
            favBtn.classList.remove('starred');
            favBtn.innerHTML = '<i class="far fa-star"></i>';
        }
    }

    // Opens the profile in the right side window when searched
    function openRightProfilePreviewPane(userContext) {
        // Hide standard active chat components
        document.getElementById('chat-placeholder').classList.add('hidden');
        document.getElementById('chat-header').classList.add('hidden');
        document.getElementById('messages-area').classList.add('hidden');
        document.getElementById('chat-input-area').classList.add('hidden');
        
        // Show Profile Preview Area
        const previewPane = document.getElementById('request-profile-preview-pane');
        previewPane.classList.remove('hidden');

        document.getElementById('preview-search-user-dp').src = userContext.dp;
        document.getElementById('preview-search-user-name').innerText = userContext.username;
        document.getElementById('preview-search-user-bio').innerText = userContext.bio;
    }

    // Resets the right window to the empty standard placeholder
    function resetRightWorkspacePane() {
        document.getElementById('request-profile-preview-pane').classList.add('hidden');
        document.getElementById('chat-header').classList.add('hidden');
        document.getElementById('messages-area').classList.add('hidden');
        document.getElementById('chat-input-area').classList.add('hidden');
        
        document.getElementById('chat-placeholder').classList.remove('hidden');
    }


    // =========================================================================
    // 6. DEVELOPER DASHBOARD ACTIONS (MODALS & MATRIX)
    // =========================================================================
    let currentDevActionType = "";
    let selectedDevOptionValue = null;

    function openDevActionModal(title) {
        document.getElementById('dev-action-modal').classList.remove('hidden');
        document.getElementById('action-modal-title').innerText = title;
    }

    function generateDevOptionsGrid(type) {
        currentDevActionType = type;
        const grid = document.getElementById('dev-options-grid');
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

    document.getElementById('confirm-assign-btn')?.addEventListener('click', () => {
        const targetUser = document.getElementById('dev-target-user').value;
        if (!targetUser || !selectedDevOptionValue) return alert("System Error: Identify target string identifier and parameter payload options.");
        
        // Simulating parameter application logic on the current user if matched
        if(targetUser === currentUser.username) {
            if (currentDevActionType === 'rank') currentUser.rank = selectedDevOptionValue;
            else if (currentDevActionType === 'theme') currentUser.theme = selectedDevOptionValue;
            saveData(); 
            updateProfileUI(); 
            applyTheme(); 
        }
        
        document.getElementById('dev-assign-modal').classList.add('hidden'); 
        alert(`Core Power Applied: Settings dispatched to vector target: [${targetUser}].`);
    });

    document.getElementById('confirm-action-btn')?.addEventListener('click', () => {
        const targetUser = document.getElementById('action-target-user').value;
        if (!targetUser) return alert("System Error: Identify target node vector identifier.");
        
        document.getElementById('dev-action-modal').classList.add('hidden'); 
        document.getElementById('action-target-user').value = '';
        alert(`CRITICAL EXECUTION: Action Payload processed on index node target: [${targetUser}].`);
    });

});