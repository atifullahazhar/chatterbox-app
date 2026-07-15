document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STATE MANAGEMENT & STORAGE
    // ==========================================
    let currentUser = JSON.parse(localStorage.getItem('chatUser')) || null;
    let friends = JSON.parse(localStorage.getItem('chatFriends')) || [];
    let friendRequests = JSON.parse(localStorage.getItem('chatRequests')) || [
        { username: "Nauras Daniyal", dp: "https://ui-avatars.com/api/?name=Nauras&background=eaddff&color=8b5cf6" }
    ];
    let bandRequests = JSON.parse(localStorage.getItem('bandRequests')) || [];
    let posts = JSON.parse(localStorage.getItem('chatPosts')) || [];
    let groups = JSON.parse(localStorage.getItem('chatGroups')) || [];
    let activeChatUser = null;

    const socket = (typeof io !== 'undefined') ? io() : { on: () => { }, emit: () => { } };
    const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";
    let isWorldMuted = false;
    let tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";
    let attachedPostImage = null;

    // App Initialization
    if (currentUser) {
        document.getElementById('login-screen').classList.replace('active', 'hidden');
        document.getElementById('main-app').classList.replace('hidden', 'active');
        updateProfileUI();
        renderContacts();
        updateBadgesAndCounts();
        renderPosts();
        renderGroups();
        renderBandRequests();
        applyTheme();
    }

    function saveData() {
        localStorage.setItem('chatUser', JSON.stringify(currentUser));
        localStorage.setItem('chatFriends', JSON.stringify(friends));
        localStorage.setItem('chatRequests', JSON.stringify(friendRequests));
        localStorage.setItem('chatPosts', JSON.stringify(posts));
        localStorage.setItem('chatGroups', JSON.stringify(groups));
        localStorage.setItem('bandRequests', JSON.stringify(bandRequests));
        updateBadgesAndCounts();
    }

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

    // Settings Dark Mode Toggle Logic
    document.getElementById('settings-dark-mode-toggle')?.addEventListener('change', (e) => {
        localStorage.setItem('darkMode', e.target.checked);
        applyTheme();
    });


    // ==========================================
    // 2. 🔥 THE ULTIMATE GLOBAL CLICK LISTENER
    // ==========================================
    document.addEventListener('click', (e) => {
        const target = e.target;

        // ------------------------------------------
        // A. LOGIN SYSTEM
        // ------------------------------------------
        if (target.closest('#join-btn')) {
            e.preventDefault();
            const username = document.getElementById('username-input').value.trim();
            const devCode = document.getElementById('dev-code').value.trim();

            if (username) {
                currentUser = { username: username, dp: DEFAULT_DP, banner: null, rank: 'Member', isDev: false, bio: "Hallo World", theme: "default" };
                if (devCode === "6200437705AT") {
                    currentUser.rank = 'Developer';
                    currentUser.isDev = true;
                    currentUser.theme = 'grand-golden';
                }
                saveData();
                document.getElementById('login-screen').classList.replace('active', 'hidden');
                document.getElementById('main-app').classList.replace('hidden', 'active');
                updateProfileUI();
                renderContacts();
                applyTheme();
            } else {
                alert("Please enter a username!");
            }
        }

        // ------------------------------------------
        // B. NAVIGATION & TABS
        // ------------------------------------------
        const navBtn = target.closest('.nav-btn');
        if (navBtn) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.content-view').forEach(c => c.classList.replace('active', 'hidden'));
            navBtn.classList.add('active');
            const targetId = navBtn.getAttribute('data-target');
            document.getElementById(targetId).classList.replace('hidden', 'active');
        }

        const chatTab = target.closest('.chat-tabs .tab-btn');
        if (chatTab) {
            document.querySelectorAll('.chat-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            chatTab.classList.add('active');
            renderContacts(chatTab.getAttribute('data-tab'));
        }

        // ------------------------------------------
        // C. MODALS (OPEN & CLOSE)
        // ------------------------------------------
        if (target.closest('.close-modal-btn')) {
            const modalId = target.closest('.close-modal-btn').getAttribute('data-modal');
            document.getElementById(modalId).classList.add('hidden');
        }

        if (target.closest('#open-requests-modal-btn')) {
            renderIncomingRequests();
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

        // View Profile
        if (target.closest('#current-chat-dp') || target.closest('#current-chat-name')) {
            if (activeChatUser) {
                document.getElementById('view-user-dp').src = activeChatUser.dp;
                document.getElementById('view-user-name').innerText = activeChatUser.username;
                document.getElementById('view-user-bio').innerText = activeChatUser.bio || "No bio available.";
                document.getElementById('view-user-modal').classList.remove('hidden');
            }
        }

        // ------------------------------------------
        // D. PROFILE EDITING (LOGO & BANNER UPLOAD)
        // ------------------------------------------
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
        }

        // ------------------------------------------
        // E. FRIEND REQUESTS & FRIENDS SYSTEM
        // ------------------------------------------
        if (target.closest('#send-friend-req-btn')) {
            const input = document.getElementById('add-friend-input');
            if (input.value.trim() !== "") {
                alert(`Friend request sent to ${input.value.trim()}!`);
                input.value = '';
            }
        }

        if (target.closest('.btn-accept-friend')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            friendRequests = friendRequests.filter(req => req.username !== username);
            friends.push({ username: username, dp: `https://ui-avatars.com/api/?name=${username}&background=random`, isFavorite: false });
            saveData();
            renderIncomingRequests();
            renderContacts();
            alert(`${username} is now your friend! Checked your 'General' tab.`);
        }

        if (target.closest('.btn-reject-friend')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            friendRequests = friendRequests.filter(req => req.username !== username);
            saveData();
            renderIncomingRequests();
        }

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
                    updateFavoriteButton();
                    renderContacts();
                }
            }
        }

        // ------------------------------------------
        // F. POST FEED (WITH IMAGE UPLOAD)
        // ------------------------------------------
        if (target.closest('#post-image-btn')) {
            document.getElementById('post-image-upload-input').click();
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
                    time: "Just now"
                };
                posts.unshift(newPost);
                saveData();
                renderPosts();
                postInput.value = '';
                attachedPostImage = null;
            } else {
                alert("Please write something or attach an image!");
            }
        }

        if (target.closest('.delete-post-btn')) {
            if (confirm("Delete this post?")) {
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
                btn.innerHTML = '<i class="fas fa-heart"></i> Liked';
            } else {
                btn.style.color = 'var(--text-muted)';
                btn.innerHTML = '<i class="far fa-heart"></i> Like';
            }
        }

        // ------------------------------------------
        // G. GROUP CREATION & ICONS
        // ------------------------------------------
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
            }
        }

        // ------------------------------------------
        // H. FRIENDSHIP BAND LOGIC
        // ------------------------------------------
        if (target.closest('#send-band-req-btn')) {
            const input = document.getElementById('band-request-input');
            if (input.value.trim() !== "") {
                bandRequests.push({ username: input.value.trim() });
                saveData();
                renderBandRequests();
                input.value = '';
                alert("Band Link Request Sent!");
            }
        }

        if (target.closest('.btn-accept-band')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            bandRequests = bandRequests.filter(req => req.username !== username);
            document.getElementById('fb-partner-dp-slot').innerHTML = `<img src="https://ui-avatars.com/api/?name=${username}" style="width:100%;height:100%;border-radius:50%;">`;
            document.getElementById('fb-partner-name').innerText = username;
            document.getElementById('band-level').innerText = "Level 1";
            document.getElementById('band-progress').style.width = "20%";
            saveData();
            renderBandRequests();
        }

        // ------------------------------------------
        // I. WORLD CHAT (MUTE & SEND)
        // ------------------------------------------
        if (target.closest('#world-mute-btn')) {
            isWorldMuted = !isWorldMuted;
            const muteBtn = document.getElementById('world-mute-btn');
            if (isWorldMuted) {
                muteBtn.classList.add('muted');
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span>Unmute</span>';
            } else {
                muteBtn.classList.remove('muted');
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Mute Chat</span>';
            }
        }

        if (target.closest('#world-send-btn')) {
            sendWorldMessage();
        }

        // ------------------------------------------
        // J. DEVELOPER DASHBOARD ACTIONS (ALL 9)
        // ------------------------------------------
        if (target.closest('#dev-assign-rank-btn')) { document.getElementById('dev-modal-title').innerText = "Assign Rank"; document.getElementById('dev-assign-modal').classList.remove('hidden'); generateOptionsGrid('rank'); }
        if (target.closest('#dev-assign-ring-btn')) { document.getElementById('dev-modal-title').innerText = "Assign Premium Profile Ring"; document.getElementById('dev-assign-modal').classList.remove('hidden'); generateOptionsGrid('ring'); }
        if (target.closest('#dev-assign-theme-btn')) { document.getElementById('dev-modal-title').innerText = "Assign Custom UI Theme"; document.getElementById('dev-assign-modal').classList.remove('hidden'); generateOptionsGrid('theme'); }
        
        if (target.closest('#dev-shadowban-btn')) openDevAction('Shadowban User');
        if (target.closest('#dev-ban-btn')) openDevAction('Ban User');
        if (target.closest('#dev-unban-btn')) openDevAction('Unban User');
        
        if (target.closest('#dev-mute-btn')) executeDevDirect('Global Mute');
        if (target.closest('#dev-wipe-btn')) executeDevDirect('Server Wipe');
        if (target.closest('#dev-maintenance-btn')) executeDevDirect('Maintenance Mode');
        
    }); // END GLOBAL LISTENER


    // ==========================================
    // 3. FILE UPLOADS (LISTENERS)
    // ==========================================
    
    // DP Upload
    document.getElementById('edit-dp-input')?.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => { currentUser.dp = e.target.result; saveUserData(); updateProfileUI(); alert("Logo updated!"); };
            reader.readAsDataURL(file);
        }
    });

    // Banner Upload
    document.getElementById('edit-banner-input')?.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => { currentUser.banner = e.target.result; saveUserData(); updateProfileUI(); alert("Banner updated!"); };
            reader.readAsDataURL(file);
        }
    });

    // Group Icon Upload
    document.getElementById('new-group-icon-input')?.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => { tempGroupIcon = e.target.result; document.getElementById('new-group-icon-preview').src = tempGroupIcon; };
            reader.readAsDataURL(file);
        }
    });

    // Post Image Upload
    document.getElementById('post-image-upload-input')?.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => { attachedPostImage = e.target.result; alert("Image attached! Write text and click Post."); };
            reader.readAsDataURL(file);
        }
    });


    // ==========================================
    // 4. ENTER KEY EVENT LISTENERS
    // ==========================================
    
    // Normal Chat Enter Key
    document.getElementById('message-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('send-btn').click();
    });

    // World Chat Enter Key
    document.getElementById('world-message-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendWorldMessage();
    });


    // ==========================================
    // 5. CORE FUNCTIONS (UI UPDATES & DEV)
    // ==========================================

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

    // Socket Receiver for World Chat
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
        document.getElementById('user-bio').innerText = currentUser.bio || "Hallo World";
        document.getElementById('user-dp').src = currentUser.dp || DEFAULT_DP;
        document.getElementById('fb-my-dp').src = currentUser.dp || DEFAULT_DP;
        
        const bannerImg = document.getElementById('banner-img');
        if (currentUser.banner) { bannerImg.src = currentUser.banner; bannerImg.classList.remove('hidden'); }
        else { bannerImg.classList.add('hidden'); }
        
        const rankBadge = document.getElementById('display-rank');
        rankBadge.innerText = currentUser.rank;

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

    function renderContacts(tab = 'general') {
        const container = document.getElementById('contact-list-container');
        container.innerHTML = '';
        let displayList = tab === 'favorite' ? friends.filter(f => f.isFavorite) : friends;
        
        if (displayList.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px;">No friends found here.</p>`;
            return;
        }
        displayList.forEach(friend => {
            let starIcon = friend.isFavorite ? `<i class="fas fa-star" style="color:#f59e0b;"></i>` : '';
            container.innerHTML += `
                <div class="dummy-item contact-item" data-user="${friend.username}">
                    <img src="${friend.dp}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                    <b>${friend.username}</b> ${starIcon}
                </div>
            `;
        });
    }

    function renderIncomingRequests() {
        const container = document.getElementById('incoming-requests-container');
        container.innerHTML = '';
        if (friendRequests.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px;">No pending requests.</p>`;
            return;
        }
        friendRequests.forEach(req => {
            container.innerHTML += `
                <div class="dummy-item" data-user="${req.username}" style="background:var(--bg-panel); border:1px solid var(--border-color);">
                    <img src="${req.dp}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                    <b>${req.username}</b>
                    <div class="req-action-btns">
                        <button class="btn-accept-friend btn-accept" title="Accept"><i class="fas fa-check"></i></button>
                        <button class="btn-reject-friend btn-reject" title="Reject"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
        });
    }

    function renderFriendsListModal() {
        const container = document.getElementById('modal-friend-list-container');
        container.innerHTML = '';
        if (friends.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px;">You have no friends yet.</p>`;
            return;
        }
        friends.forEach(friend => {
            container.innerHTML += `
                <div class="dummy-item">
                    <img src="${friend.dp}" style="width:45px; height:45px; border-radius:50%; object-fit:cover;">
                    <b style="font-size:1.2rem;">${friend.username}</b>
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
                            <div><b>${post.user}</b><span>${post.time}</span></div>
                        </div>
                        ${post.user === currentUser.username ? `<button class="delete-post-btn"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                    ${post.text ? `<div class="post-text-content">${post.text}</div>` : ''}
                    ${imgHtml}
                    <div class="post-footer">
                        <button class="action-btn like-btn"><i class="far fa-heart"></i> Like</button>
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
                <div class="dummy-item">
                    <img src="${icon}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                    <b>${group.name}</b>
                </div>
            `;
        });
    }

    function renderBandRequests() {
        const container = document.getElementById('band-incoming-requests');
        container.innerHTML = '';
        bandRequests.forEach(req => {
            container.innerHTML += `
                <div class="dummy-item" data-user="${req.username}" style="margin-top:10px; background:var(--bg-main);">
                    <b style="flex:1;">${req.username} wants to link!</b>
                    <button class="btn-accept-band btn-accept"><i class="fas fa-check"></i></button>
                </div>
            `;
        });
    }

    function openChatWindow(username) {
        document.getElementById('chat-placeholder').classList.add('hidden');
        document.getElementById('chat-header').classList.remove('hidden');
        document.getElementById('messages-area').classList.remove('hidden');
        document.getElementById('chat-input-area').classList.remove('hidden');
        
        activeChatUser = friends.find(f => f.username === username);
        document.getElementById('current-chat-name').innerText = activeChatUser.username;
        document.getElementById('current-chat-dp').src = activeChatUser.dp;
        updateFavoriteButton();
    }

    function updateFavoriteButton() {
        const favBtn = document.getElementById('favorite-user-btn');
        if (activeChatUser && activeChatUser.isFavorite) {
            favBtn.classList.add('starred');
            favBtn.innerHTML = '<i class="fas fa-star"></i>';
        } else {
            favBtn.classList.remove('starred');
            favBtn.innerHTML = '<i class="far fa-star"></i>';
        }
    }

    // DEV MODAL LOGIC
    let currentDevAction = "";
    let selectedDevOption = null;

    function openDevAction(title) {
        document.getElementById('dev-action-modal').classList.remove('hidden');
        document.getElementById('action-modal-title').innerText = title;
    }

    function executeDevDirect(title) {
        if (title === 'Server Wipe') {
            if (confirm("WARNING! This will clear all local data. Proceed?")) { localStorage.clear(); location.reload(); }
        } else {
            alert(`⚙️ ${title} Activated!`);
        }
    }

    function generateOptionsGrid(type) {
        currentDevAction = type;
        const grid = document.getElementById('dev-options-grid');
        grid.innerHTML = '';
        selectedDevOption = null;

        if (type === 'rank') {
            ['Operator', 'Elite', 'Legend', 'Pro', 'Member'].forEach(r => {
                const btn = document.createElement('button');
                btn.className = 'action-btn'; btn.style.width = '100%'; btn.innerText = r;
                btn.onclick = () => { selectedDevOption = r; Array.from(grid.children).forEach(c => c.style.border = '1px solid var(--border-color)'); btn.style.border = '2px solid var(--primary-color)'; };
                grid.appendChild(btn);
            });
            return;
        }

        if (type === 'theme') {
            const grandBtn = document.createElement('button');
            grandBtn.className = 'action-btn theme-style-grand';
            grandBtn.style.width = '100%'; grandBtn.style.gridColumn = '1 / -1'; grandBtn.innerText = '🌟 THE GRAND GOLDEN 🌟';
            grandBtn.onclick = () => { selectedDevOption = 'grand-golden'; Array.from(grid.children).forEach(c => c.style.outline = 'none'); grandBtn.style.outline = '3px solid var(--primary-color)'; };
            grid.appendChild(grandBtn);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'danger-btn'; removeBtn.style.width = '100%'; removeBtn.style.gridColumn = '1 / -1'; removeBtn.innerText = '❌ Remove Theme';
            removeBtn.onclick = () => { selectedDevOption = 'default'; Array.from(grid.children).forEach(c => c.style.outline = 'none'); removeBtn.style.outline = '3px solid var(--primary-color)'; };
            grid.appendChild(removeBtn);
        }

        for (let i = 1; i <= 20; i++) {
            const box = document.createElement('div');
            box.style.width = '100%'; box.style.aspectRatio = '1/1'; box.style.borderRadius = '50%'; box.style.cursor = 'pointer'; box.style.display = 'flex'; box.style.justifyContent = 'center'; box.style.alignItems = 'center'; box.style.color = 'white'; box.innerHTML = `${i}`;

            if (type === 'ring') { box.classList.add(`ring-style-${i}`); box.style.border = `2px solid hsl(${(i * 18) % 360}, 80%, 60%)`; }
            else if (type === 'theme') { box.style.background = `hsl(${(i * 18) % 360}, 60%, 50%)`; }

            box.addEventListener('click', () => {
                Array.from(grid.children).forEach(child => child.style.outline = 'none');
                box.style.outline = '3px solid var(--primary-color)';
                selectedDevOption = (type === 'theme') ? `premium-${i}` : i;
            });
            grid.appendChild(box);
        }
    }

    document.getElementById('confirm-assign-btn')?.addEventListener('click', () => {
        const targetUser = document.getElementById('dev-target-user').value;
        if (!targetUser || !selectedDevOption) return alert("Select user and option!");
        if (currentDevAction === 'rank') currentUser.rank = selectedDevOption;
        else if (currentDevAction === 'theme') currentUser.theme = selectedDevOption;
        saveData(); updateProfileUI(); applyTheme(); document.getElementById('dev-assign-modal').classList.add('hidden'); alert("Power applied!");
    });

});