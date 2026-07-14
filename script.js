document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. STATE & LOCAL STORAGE
    // ==========================================
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let registeredUsers = JSON.parse(localStorage.getItem('chatAppUsers')) || [];

    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    // Line 11 ke baad ye add karein:
    const socket = io("http://localhost:3000");

    if (currentUser) { showMainApp(); }

    // ==========================================
    // 2. THEME LOGIC (Dark Mode & Gold Mode)
    // ==========================================
    const darkModeBtn = document.getElementById('dark-mode-btn');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Normal theme applier
    function applyTheme() {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (darkModeBtn) darkModeBtn.innerText = '☀️ Light Mode';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (darkModeBtn) darkModeBtn.innerText = '🌙 Dark Mode';
        }
    }
    applyTheme(); // Apply on load

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            applyTheme();
        });
    }

    // ==========================================
    // 3. LOGIN LOGIC
    // ==========================================
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username-input').value.trim();
        const devInputRaw = document.getElementById('dev-code').value;
        const devCodeClean = devInputRaw.replace(/\s+/g, '');

        if (usernameInput === '') return alert('Username cannot be empty');

        const userExists = registeredUsers.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
        if (userExists) return alert('This username is already taken!');

        const isDev = (devCodeClean === '6200437705AT');

        currentUser = {
            username: usernameInput,
            isDev: isDev,
            bio: "Hallo World",
            friends: 0,
            dp: "default-dp.png",
            banner: "",
            partner: null
        };

        registeredUsers.push(currentUser);
        localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainApp();
    });

    // ==========================================
    // 4. MEDIA HANDLER (IMAGES & VIDEOS)
    // ==========================================
    function applyMedia(dataUrl, imgId, videoId) {
        const imgElement = document.getElementById(imgId);
        const videoElement = document.getElementById(videoId);

        if (!dataUrl || dataUrl === 'default-dp.png' || dataUrl === '') {
            if (dataUrl === 'default-dp.png') {
                imgElement.src = 'default-dp.png';
                imgElement.classList.remove('hidden');
                if (videoElement) videoElement.classList.add('hidden');
            } else {
                imgElement.classList.add('hidden');
                if (videoElement) videoElement.classList.add('hidden');
            }
            return;
        }

        if (dataUrl.startsWith('data:video')) {
            imgElement.classList.add('hidden');
            if (videoElement) {
                videoElement.src = dataUrl;
                videoElement.classList.remove('hidden');
                videoElement.play();
            }
        } else {
            if (videoElement) videoElement.classList.add('hidden');
            imgElement.src = dataUrl;
            imgElement.classList.remove('hidden');
        }
    }

    function showMainApp() {
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        mainApp.classList.add('active');
        loadProfileData();
    }

    function loadProfileData() {
        document.getElementById('display-username').innerText = currentUser.username;
        document.getElementById('user-bio').innerText = currentUser.bio;

        applyMedia(currentUser.dp, 'user-dp', 'user-dp-video');
        applyMedia(currentUser.banner, 'banner-img', 'banner-video');

        if (currentUser.dp && currentUser.dp.startsWith('data:video')) {
            document.getElementById('fb-my-dp').src = 'default-dp.png';
        } else {
            document.getElementById('fb-my-dp').src = currentUser.dp;
        }

        if (currentUser.isDev) {
            document.getElementById('display-username').classList.add('dev-username-style');
            document.getElementById('dp-wrapper').classList.add('dev-ring-active');
            document.getElementById('dev-nav-item').classList.remove('hidden');
        } else {
            document.getElementById('dev-nav-item').classList.add('hidden');
            document.getElementById('dp-wrapper').classList.remove('dev-ring-active');
        }

        if (currentUser.partner) connectDuoUI(currentUser.partner);
    }

    // Upload Logic
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        const newBio = prompt("Enter new description:", currentUser.bio);
        if (newBio) {
            currentUser.bio = newBio;
            document.getElementById('user-bio').innerText = currentUser.bio;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    });

    ['banner', 'dp'].forEach(type => {
        document.getElementById(`change-${type}-btn`).addEventListener('click', () => {
            document.getElementById(`${type}-upload-input`).click();
        });
        document.getElementById(`${type}-upload-input`).addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                if (file.size > 5000000) return alert("File is too large! Limit is 5MB for now.");
                const reader = new FileReader();
                reader.onload = function (e) {
                    currentUser[type] = e.target.result;
                    applyMedia(currentUser[type], type === 'banner' ? 'banner-img' : 'user-dp', type === 'banner' ? 'banner-video' : 'user-dp-video');
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // ==========================================
    // 5. SIDEBAR NAVIGATION & GOLD THEME TOGGLE
    // ==========================================
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentViews = document.querySelectorAll('.content-view');

    navButtons.forEach(btn => {
        if (btn.id === 'dark-mode-btn') return; // Skip dark mode toggle

        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            contentViews.forEach(c => {
                c.classList.remove('active');
                c.classList.add('hidden');
            });
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
            document.getElementById(targetId).classList.add('active');

            // MAGIC THEME SWAP: If it's the dev section, turn everything Gold!
            if (targetId === 'dev-section-view') {
                document.documentElement.setAttribute('data-theme', 'gold');
                // Hide dark mode button so it doesn't interrupt the gold theme
                if (darkModeBtn) darkModeBtn.parentElement.style.display = 'none';
            } else {
                // Restore regular theme (Light or Dark)
                applyTheme();
                if (darkModeBtn) darkModeBtn.parentElement.style.display = 'block';
            }
        });
    });

    // ==========================================
    // 6. POST FEED LOGIC
    // ==========================================
    const submitPostBtn = document.getElementById('submit-post-btn');
    const feedContainer = document.getElementById('feed-container');

    if (submitPostBtn) {
        submitPostBtn.addEventListener('click', () => {
            const text = document.getElementById('post-input').value;
            if (!text.trim()) return;

            const post = document.createElement('div');
            post.className = 'feed-post';
            const nameClass = currentUser.isDev ? 'dev-username-style' : '';
            const safeDpUrl = (currentUser.dp && !currentUser.dp.startsWith('data:video')) ? currentUser.dp : 'default-dp.png';

            post.innerHTML = `
                <div class="post-header">
                    <img src="${safeDpUrl}" style="object-fit:cover;">
                    <b class="${nameClass}" style="font-size:1.1rem; margin-left:10px;">${currentUser.username}</b> 
                    <span style="margin-left:10px;">• Just now</span>
                </div>
                <div class="post-content">${text}</div>
                <div class="post-footer">
                    <button class="like-btn" onclick="this.innerHTML='❤️ Liked'">🤍 Like</button>
                    <button class="comment-btn">💬 Comment</button>
                </div>
            `;
            feedContainer.prepend(post);
            document.getElementById('post-input').value = '';
        });
    }

    // ==========================================
    // 7. CHAT (WORLD, PRIVATE, GROUP)
    // ==========================================
    function appendMessage(inputElementId, areaElementId) {
        const input = document.getElementById(inputElementId);
        const text = input.value.trim();
        if (text === "") return;

        const messageArea = document.getElementById(areaElementId);
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-bubble';
        msgDiv.innerText = text;

        messageArea.appendChild(msgDiv);
        input.value = "";
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // World Chat
    const worldSendBtn = document.getElementById('world-send-btn');
    if (worldSendBtn) {
        worldSendBtn.addEventListener('click', () => appendMessage('world-message-input', 'world-messages-area'));
        document.getElementById('world-message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') appendMessage('world-message-input', 'world-messages-area');
        });
    }

    // Replace lines 264-267 with this:
    document.getElementById('send-btn').addEventListener('click', () => {
        const input = document.getElementById('message-input');
        const text = input.value.trim();
        if (text !== "") {
            socket.emit("send_message", text); // Message server ko bheja
            input.value = ""; // Input khali kiya
        }
    });

    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = document.getElementById('message-input');
            const text = input.value.trim();
            if (text !== "") {
                socket.emit("send_message", text);
                input.value = "";
            }
        }
    });

    // Voice Note UI Toggle
    const voiceBtn = document.getElementById('voice-note-btn');
    const cancelVoiceBtn = document.getElementById('cancel-voice-btn');
    const msgInput = document.getElementById('message-input');
    const visualizer = document.getElementById('voice-visualizer');

    if (voiceBtn && cancelVoiceBtn) {
        voiceBtn.addEventListener('click', () => {
            msgInput.classList.add('hidden');
            visualizer.classList.remove('hidden');
        });
        cancelVoiceBtn.addEventListener('click', () => {
            visualizer.classList.add('hidden');
            msgInput.classList.remove('hidden');
        });
    }

    // Open Chats Functions
    window.openChat = function (name) {
        document.getElementById('chat-placeholder').classList.add('hidden');
        document.getElementById('chat-header').classList.remove('hidden');
        document.getElementById('messages-area').classList.remove('hidden');
        document.getElementById('chat-input-area').classList.remove('hidden');
        document.getElementById('current-chat-name').innerText = name;
        document.getElementById('messages-area').innerHTML = '<div id="typing-indicator" class="hidden"><div class="typing-bubble"><span></span><span></span><span></span></div></div>';
    };

    window.openGroup = function (name) {
        document.getElementById('group-placeholder').classList.add('hidden');
        document.getElementById('group-header').classList.remove('hidden');
        document.getElementById('group-messages-area').classList.remove('hidden');
        document.getElementById('group-input-area').classList.remove('hidden');
        document.getElementById('current-group-name').innerText = name;
        document.getElementById('group-messages-area').innerHTML = '';
    };

    // ==========================================
    // 8. SUPREME DEVELOPER DASHBOARD LOGIC
    // ==========================================
    let currentDevAction = "";

    window.openDevModal = function (type) {
        currentDevAction = type;
        const assignModal = document.getElementById('dev-assign-modal');
        const banModal = document.getElementById('dev-ban-modal');
        const title = document.getElementById('dev-modal-title');

        if (type === 'ban' || type === 'unban') {
            banModal.classList.remove('hidden');
            document.getElementById('ban-modal-title').innerText = type === 'ban' ? 'Ban User' : 'Unban User';
            document.getElementById('confirm-ban-btn').innerText = type === 'ban' ? 'Drop Hammer' : 'Restore Access';
        } else {
            assignModal.classList.remove('hidden');
            if (type === 'ring') title.innerText = "Assign Premium Profile Ring";
            if (type === 'theme') title.innerText = "Assign Custom UI Theme";
            if (type === 'name-style') title.innerText = "Assign Username Style";
            generateOptionsGrid(type);
        }
    };

    window.closeDevModal = function () {
        document.getElementById('dev-assign-modal').classList.add('hidden');
        document.getElementById('dev-ban-modal').classList.add('hidden');
    };

    function generateOptionsGrid(type) {
        const grid = document.getElementById('dev-options-grid');
        grid.innerHTML = '';
        let selectedOption = null;

        for (let i = 1; i <= 100; i++) {
            const box = document.createElement('div');
            const isPremium = i <= 10;

            box.style.width = '100%';
            box.style.aspectRatio = '1/1';
            box.style.borderRadius = '10px';
            box.style.cursor = 'pointer';
            box.style.display = 'flex';
            box.style.justifyContent = 'center';
            box.style.alignItems = 'center';
            box.style.fontSize = '0.8rem';
            box.style.color = 'white';
            box.style.fontWeight = 'bold';

            if (isPremium) box.innerHTML = "👑";

            if (type === 'ring') {
                box.style.borderRadius = '50%';
                if (isPremium) {
                    box.style.background = 'linear-gradient(45deg, #ffcf33, #ff8c00)';
                    box.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
                } else {
                    box.style.border = `4px solid hsl(${(i * 15) % 360}, 80%, 60%)`;
                }
            }
            else if (type === 'theme') {
                if (isPremium) {
                    box.style.background = 'linear-gradient(135deg, #111, #333)';
                    box.style.border = '2px solid #fbbf24';
                } else {
                    box.style.background = `hsl(${(i * 25) % 360}, 60%, 50%)`;
                }
            }
            else if (type === 'name-style') {
                box.style.background = '#222';
                box.innerHTML = 'Aa';
                if (isPremium) {
                    box.style.color = '#fbbf24';
                    box.style.textShadow = '0 0 5px #fbbf24';
                } else {
                    box.style.color = `hsl(${(i * 40) % 360}, 90%, 60%)`;
                }
            }

            box.addEventListener('click', () => {
                Array.from(grid.children).forEach(child => child.style.outline = 'none');
                box.style.outline = '3px solid #fff';
                selectedOption = i;
            });

            grid.appendChild(box);
        }
    }

    document.getElementById('confirm-assign-btn').addEventListener('click', () => {
        const targetUser = document.getElementById('dev-target-user').value;
        if (!targetUser) return alert("Please enter a target username!");

        let actionName = currentDevAction === 'ring' ? 'Profile Ring' : currentDevAction === 'theme' ? 'UI Theme' : 'Username Style';
        alert(`Successfully applied ${actionName} to user: ${targetUser}`);
        closeDevModal();
        document.getElementById('dev-target-user').value = '';
    });

    document.getElementById('confirm-ban-btn').addEventListener('click', () => {
        const targetUser = document.getElementById('ban-target-user').value;
        if (!targetUser) return alert("Please enter a target username!");
        alert(`Action completed on user: ${targetUser}. Server database updated.`);
        closeDevModal();
        document.getElementById('ban-target-user').value = '';
        // Add this at the very bottom of script.js
        socket.on("receive_message", (data) => {
            const area = document.getElementById('messages-area'); // General chat area
            if (area) {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'message-bubble';
                msgDiv.innerText = data;
                area.appendChild(msgDiv);
                area.scrollTop = area.scrollHeight; // Auto-scroll to bottom
            }
        });
    });
});