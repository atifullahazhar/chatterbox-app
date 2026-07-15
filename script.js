document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. STATE MANAGEMENT & STORAGE
    // ==========================================
    let currentUser = JSON.parse(localStorage.getItem('chatUser')) || null;
    let friends = JSON.parse(localStorage.getItem('chatFriends')) || [];
    let friendRequests = JSON.parse(localStorage.getItem('chatRequests')) || [
        // Dummy Request taaki aap test kar sako ki request kaisa dikhta hai
        { username: "Nauras Daniyal", dp: "https://ui-avatars.com/api/?name=Nauras&background=eaddff&color=8b5cf6" }
    ];
    let activeChatUser = null;
    let currentChatTab = 'general'; // general, favorite, requests

    const socket = (typeof io !== 'undefined') ? io() : { on: () => {}, emit: () => {} };
    const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";

    // Initialize UI
    if (currentUser) {
        document.getElementById('login-screen').classList.replace('active', 'hidden');
        document.getElementById('main-app').classList.replace('hidden', 'active');
        updateProfileUI();
        renderContacts();
        updateRequestBadge();
    }

    function saveData() {
        localStorage.setItem('chatFriends', JSON.stringify(friends));
        localStorage.setItem('chatRequests', JSON.stringify(friendRequests));
    }

    // ==========================================
    // 2. 🔥 GLOBAL CLICK LISTENER (THE ULTIMATE FIX)
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
                currentUser = { username: username, dp: DEFAULT_DP, rank: 'Member', isDev: false };
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
        // B. NAVIGATION (SIDEBAR / BOTTOM NAV)
        // ------------------------------------------
        const navBtn = target.closest('.nav-btn');
        if (navBtn) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.content-view').forEach(c => c.classList.replace('active', 'hidden'));
            
            navBtn.classList.add('active');
            const targetId = navBtn.getAttribute('data-target');
            document.getElementById(targetId).classList.replace('hidden', 'active');
        }

        // ------------------------------------------
        // C. CHAT TABS (General / Favorite / Requests)
        // ------------------------------------------
        const chatTab = target.closest('.chat-tabs .tab-btn');
        if (chatTab) {
            document.querySelectorAll('.chat-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            chatTab.classList.add('active');
            currentChatTab = chatTab.getAttribute('data-tab');
            
            // Show/Hide Friend Request Area
            const reqArea = document.getElementById('friend-request-area');
            if(currentChatTab === 'requests') reqArea.classList.remove('hidden');
            else reqArea.classList.add('hidden');
            
            renderContacts();
        }

        // ------------------------------------------
        // D. FRIEND SYSTEM LOGIC
        // ------------------------------------------
        
        // 1. Send Friend Request
        if (target.closest('#send-friend-req-btn')) {
            const input = document.getElementById('add-friend-input');
            const newFriendName = input.value.trim();
            if (newFriendName !== "") {
                // Simulating sending request (in real app, goes to server)
                alert(`Friend request sent to ${newFriendName}!`);
                input.value = '';
            }
        }

        // 2. Accept Request
        if (target.closest('.btn-accept')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            // Remove from requests, add to friends
            friendRequests = friendRequests.filter(req => req.username !== username);
            friends.push({ username: username, dp: `https://ui-avatars.com/api/?name=${username}&background=random`, isFavorite: false });
            saveData();
            updateRequestBadge();
            renderContacts();
            alert(`${username} is now your friend! You can chat with them in the General tab.`);
        }

        // 3. Reject Request
        if (target.closest('.btn-reject')) {
            const username = target.closest('.dummy-item').getAttribute('data-user');
            friendRequests = friendRequests.filter(req => req.username !== username);
            saveData();
            updateRequestBadge();
            renderContacts();
        }

        // 4. Select Friend to Chat
        if (target.closest('.contact-item')) {
            const username = target.closest('.contact-item').getAttribute('data-user');
            openChatWindow(username);
        }

        // 5. Star / Favorite Button (Top Right in Chat)
        if (target.closest('#favorite-user-btn')) {
            if (activeChatUser) {
                const friendIndex = friends.findIndex(f => f.username === activeChatUser.username);
                if (friendIndex !== -1) {
                    friends[friendIndex].isFavorite = !friends[friendIndex].isFavorite;
                    saveData();
                    updateFavoriteButton();
                    renderContacts(); // Refresh list if favorite tab is open
                }
            }
        }

        // ------------------------------------------
        // E. WORLD CHAT SYSTEM
        // ------------------------------------------
        if (target.closest('#world-send-btn')) {
            const input = document.getElementById('world-message-input');
            if (input && input.value.trim() !== "") {
                const msgData = { sender: currentUser.username, text: input.value.trim() };
                
                // Realtime emit
                socket.emit('send_message', msgData);
                
                // Show locally immediately
                addMessageToWorldChat(msgData.sender, msgData.text, true);
                input.value = '';
            } else {
                alert("Message cannot be empty!");
            }
        }

        // ------------------------------------------
        // F. POST FEED
        // ------------------------------------------
        if (target.closest('#submit-post-btn')) {
            const postInput = document.getElementById('post-input');
            if (postInput && postInput.value.trim() !== "") {
                createPost(postInput.value.trim());
                postInput.value = '';
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

        if (target.closest('.delete-post-btn')) {
            if (confirm("Delete this post?")) {
                target.closest('.feed-post').remove();
            }
        }
    });

    // ==========================================
    // 3. CORE FUNCTIONS
    // ==========================================

    function updateProfileUI() {
        if (!currentUser) return;
        document.getElementById('display-username').innerText = currentUser.username;
        const rankBadge = document.getElementById('display-rank');
        rankBadge.innerText = currentUser.rank;
        
        if (currentUser.isDev) {
            rankBadge.className = 'rank-badge rank-developer';
            document.getElementById('dev-nav-item').classList.remove('hidden');
            if(currentUser.theme === 'grand-golden') {
                document.documentElement.setAttribute('data-theme', 'grand-golden');
            }
        }
    }

    // Render Contacts/Requests based on Tabs
    function renderContacts() {
        const container = document.getElementById('contact-list-container');
        container.innerHTML = '';

        if (currentChatTab === 'requests') {
            if (friendRequests.length === 0) {
                container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px;">No pending requests.</p>`;
                return;
            }
            friendRequests.forEach(req => {
                container.innerHTML += `
                    <div class="dummy-item" data-user="${req.username}">
                        <img src="${req.dp}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                        <b>${req.username}</b>
                        <div class="req-action-btns">
                            <button class="btn-accept" title="Accept"><i class="fas fa-check"></i></button>
                            <button class="btn-reject" title="Reject"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                `;
            });
        } else {
            let displayList = currentChatTab === 'favorite' ? friends.filter(f => f.isFavorite) : friends;
            
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
    }

    function updateRequestBadge() {
        const badge = document.getElementById('req-badge');
        if (friendRequests.length > 0) {
            badge.innerText = friendRequests.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
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

    function addMessageToWorldChat(sender, text, isMe) {
        const area = document.getElementById('world-messages-area');
        const div = document.createElement('div');
        div.className = `message-bubble ${isMe ? 'my-msg' : 'other-msg'}`;
        div.innerHTML = `<strong>${sender}:</strong> ${text}`;
        area.appendChild(div);
        area.scrollTop = area.scrollHeight;
    }

    function createPost(text) {
        const container = document.getElementById('feed-container');
        const postHTML = `
            <div class="feed-post">
                <div class="post-header">
                    <div class="post-user-info">
                        <img src="${currentUser.dp}" class="post-user-dp">
                        <div><b>${currentUser.username}</b><span>Just now</span></div>
                    </div>
                    <button class="delete-post-btn"><i class="fas fa-trash"></i></button>
                </div>
                <div class="post-text-content">${text}</div>
                <div class="post-footer">
                    <button class="action-btn like-btn"><i class="far fa-heart"></i> Like</button>
                    <button class="action-btn"><i class="far fa-comment"></i> Comment</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('afterbegin', postHTML);
    }

    // Socket Listener (World Chat Incoming)
    socket.on('receive_message', (data) => {
        if(currentUser && data.sender !== currentUser.username) {
            addMessageToWorldChat(data.sender, data.text, false);
        }
    });
});