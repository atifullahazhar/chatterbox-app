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
    }

    function saveData() {
        localStorage.setItem('chatFriends', JSON.stringify(friends));
        localStorage.setItem('chatRequests', JSON.stringify(friendRequests));
        localStorage.setItem('chatPosts', JSON.stringify(posts));
        localStorage.setItem('chatGroups', JSON.stringify(groups));
        localStorage.setItem('bandRequests', JSON.stringify(bandRequests));
        updateBadgesAndCounts();
    }

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
                currentUser = { username: username, dp: DEFAULT_DP, rank: 'Member', isDev: false, bio: "Hallo World" };
                if (devCode === "6200437705AT") {
                    currentUser.rank = 'Developer';
                    currentUser.isDev = true;
                    currentUser.theme = 'grand-golden';
                }
                localStorage.setItem('chatUser', JSON.stringify(currentUser));
                document.getElementById('login-screen').classList.replace('active', 'hidden');
                document.getElementById('main-app').classList.replace('hidden', 'active');
                updateProfileUI();
                renderContacts();
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

        // View Profile Modal (Click on Chat Header info)
        if (target.closest('#current-chat-dp') || target.closest('#current-chat-name')) {
            if (activeChatUser) {
                document.getElementById('view-user-dp').src = activeChatUser.dp;
                document.getElementById('view-user-name').innerText = activeChatUser.username;
                document.getElementById('view-user-bio').innerText = activeChatUser.bio || "No bio available.";
                document.getElementById('view-user-modal').classList.remove('hidden');
            }
        }

        // ------------------------------------------
        // D. FRIEND REQUESTS & FRIENDS SYSTEM
        // ------------------------------------------
        if (target.closest('#send-friend-req-btn')) {
            const input = document.getElementById('add-friend-input');
            if (input.value.trim() !== "") {
                alert(`Friend request sent to ${input.value.trim()}!`);
                input.value = '';
            }
        }

        // Accept Friend Request
        if (target.closest('.btn-accept-friend')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            friendRequests = friendRequests.filter(req => req.username !== username);
            friends.push({ username: username, dp: `https://ui-avatars.com/api/?name=${username}&background=random`, isFavorite: false });
            saveData();
            renderIncomingRequests();
            renderContacts();
            alert(`${username} is now your friend!`);
        }

        // Reject Friend Request
        if (target.closest('.btn-reject-friend')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            friendRequests = friendRequests.filter(req => req.username !== username);
            saveData();
            renderIncomingRequests();
        }

        // Click on a friend to chat
        if (target.closest('.contact-item')) {
            const username = target.closest('.contact-item').getAttribute('data-user');
            openChatWindow(username);
        }

        // ------------------------------------------
        // E. PROFILE EDITS
        // ------------------------------------------
        if (target.closest('#save-profile-btn')) {
            const newName = document.getElementById('edit-username-input').value.trim();
            const newBio = document.getElementById('edit-bio-input').value.trim();
            if (newName) currentUser.username = newName;
            currentUser.bio = newBio;
            localStorage.setItem('chatUser', JSON.stringify(currentUser));
            updateProfileUI();
            document.getElementById('edit-profile-modal').classList.add('hidden');
        }

        // ------------------------------------------
        // F. POST FEED
        // ------------------------------------------
        if (target.closest('#submit-post-btn')) {
            const postInput = document.getElementById('post-input');
            if (postInput.value.trim() !== "") {
                const newPost = {
                    id: Date.now(),
                    user: currentUser.username,
                    dp: currentUser.dp,
                    text: postInput.value.trim(),
                    time: "Just now"
                };
                posts.unshift(newPost);
                saveData();
                renderPosts();
                postInput.value = '';
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

        // ------------------------------------------
        // G. GROUP CREATION
        // ------------------------------------------
        if (target.closest('#confirm-create-group-btn')) {
            const groupName = document.getElementById('new-group-name').value.trim();
            if (groupName) {
                groups.push({ id: Date.now(), name: groupName });
                saveData();
                renderGroups();
                document.getElementById('create-group-modal').classList.add('hidden');
                document.getElementById('new-group-name').value = '';
            }
        }

        // ------------------------------------------
        // H. FRIENDSHIP BAND LOGIC
        // ------------------------------------------
        if (target.closest('#send-band-req-btn')) {
            const input = document.getElementById('band-request-input');
            if (input.value.trim() !== "") {
                bandRequests.push({ username: input.value.trim() }); // Local Simulation
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
        // I. DEVELOPER DASHBOARD ACTIONS
        // ------------------------------------------
        if (target.closest('#dev-assign-rank-btn')) {
            document.getElementById('dev-modal-title').innerText = "Assign Rank";
            document.getElementById('dev-assign-modal').classList.remove('hidden');
        }
        if (target.closest('#dev-assign-theme-btn')) {
            document.getElementById('dev-modal-title').innerText = "Assign Theme";
            document.getElementById('dev-assign-modal').classList.remove('hidden');
        }

    }); // END GLOBAL LISTENER

    // ==========================================
    // 3. CORE FUNCTIONS (UI UPDATES)
    // ==========================================

    function updateProfileUI() {
        if (!currentUser) return;
        
        const usernameDisplay = document.getElementById('display-username');
        usernameDisplay.innerText = currentUser.username;
        document.getElementById('user-bio').innerText = currentUser.bio || "Hallo World";
        
        const rankBadge = document.getElementById('display-rank');
        rankBadge.innerText = currentUser.rank;

        // 🔥 SHINY GOLDEN DEV NAME LOGIC 🔥
        if (currentUser.isDev) {
            usernameDisplay.classList.add('shiny-dev-text'); // Shiny text class apply kiya
            rankBadge.className = 'rank-badge rank-developer';
            document.getElementById('dev-nav-item').classList.remove('hidden');
            if (currentUser.theme === 'grand-golden') {
                document.documentElement.setAttribute('data-theme', 'grand-golden');
            }
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
            container.innerHTML += `
                <div class="feed-post" data-id="${post.id}">
                    <div class="post-header">
                        <div class="post-user-info">
                            <img src="${post.dp}" class="post-user-dp">
                            <div><b>${post.user}</b><span>${post.time}</span></div>
                        </div>
                        ${post.user === currentUser.username ? `<button class="delete-post-btn"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                    <div class="post-text-content">${post.text}</div>
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
            container.innerHTML += `
                <div class="dummy-item">
                    <img src="https://ui-avatars.com/api/?name=${group.name}&background=a855f7&color=fff" style="width:40px; height:40px; border-radius:50%;">
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
                <div class="dummy-item" data-user="${req.username}" style="margin-top:10px;">
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
    }

});