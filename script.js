document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SAFE STATE & LOCAL STORAGE (Crash-Proof)
    // ==========================================
    let currentUser = null;
    let registeredUsers = [];
    const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";
    
    try {
        const storedUser = localStorage.getItem('chatUser');
        if (storedUser) currentUser = JSON.parse(storedUser);
        
        const storedAppUsers = localStorage.getItem('chatAppUsers');
        if (storedAppUsers) registeredUsers = JSON.parse(storedAppUsers);
    } catch (error) {
        console.warn("Memory limit exceeded. Clearing storage.");
        localStorage.removeItem('chatUser');
        localStorage.removeItem('chatAppUsers');
    }

    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    
    let socket;
    if (typeof io !== 'undefined') {
        socket = io();
    } else {
        socket = { on: () => {}, emit: () => {} };
    }

    if (currentUser && currentUser.username) { 
        checkDailyStreak(); 
        showMainApp(); 
        socket.emit('user-reconnected', currentUser);
    }

    function checkDailyStreak() {
        const today = new Date().toDateString();
        if (!currentUser.lastLoginDate) {
            currentUser.streak = 1;
        } else if (currentUser.lastLoginDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (currentUser.lastLoginDate === yesterday.toDateString()) {
                currentUser.streak = (currentUser.streak || 0) + 1;
            } else {
                currentUser.streak = 1; 
            }
        }
        currentUser.lastLoginDate = today;
        saveUserData();
    }

    function saveUserData() {
        if(!currentUser || !currentUser.email) return;
        const index = registeredUsers.findIndex(u => u.email === currentUser.email);
        if(index > -1) { registeredUsers[index] = currentUser; } else { registeredUsers.push(currentUser); }
        
        try {
            localStorage.setItem('chatUser', JSON.stringify(currentUser));
            localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
        } catch (error) {
            alert("🚨 STORAGE FULL! Please use a smaller picture.");
        }
    }

    // ==========================================
    // 3. THEME & SIDEBAR
    // ==========================================
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const settingsDarkModeToggle = document.getElementById('settings-dark-mode-toggle');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    function applyTheme() {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            if (settingsDarkModeToggle) settingsDarkModeToggle.checked = true;
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            if (settingsDarkModeToggle) settingsDarkModeToggle.checked = false;
        }
    }
    applyTheme();

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => { isDarkMode = !isDarkMode; localStorage.setItem('darkMode', isDarkMode); applyTheme(); });
    }
    if (settingsDarkModeToggle) {
        settingsDarkModeToggle.addEventListener('change', (e) => { isDarkMode = e.target.checked; localStorage.setItem('darkMode', isDarkMode); applyTheme(); });
    }

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');

    if (hamburgerBtn && sidebar) hamburgerBtn.addEventListener('click', () => sidebar.classList.add('mobile-open'));
    if (closeSidebarBtn && sidebar) closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('mobile-open'));

    // ==========================================
    // 4. SECURE LOGIN
    // ==========================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const usernameInput = document.getElementById('username-input').value.trim();
            const emailInput = document.getElementById('email-input').value.trim().toLowerCase();
            const devCodeClean = document.getElementById('dev-code').value.replace(/\s+/g, '');

            if (usernameInput === '') return alert('Username cannot be empty');
            if (emailInput === '') return alert('Email cannot be empty');

            const userExists = registeredUsers.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
            
            if (userExists) {
                if (!userExists.email) {
                    userExists.email = emailInput;
                    try { localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers)); } catch(e){}
                } else if (userExists.email !== emailInput) {
                    return alert('This username is registered with a different email address!');
                }
            } else {
                const emailExists = registeredUsers.find(u => u.email === emailInput);
                if (emailExists) return alert('This email is already used by another account.');
            }

            const isDev = (devCodeClean === '6200437705AT'); 

            if (!userExists) {
                currentUser = {
                    username: usernameInput,
                    email: emailInput,
                    isDev: isDev,
                    bio: "Hallo World",
                    dp: `https://ui-avatars.com/api/?name=${usernameInput}&background=eaddff&color=8b5cf6`,
                    banner: "",
                    rank: "Member",
                    userColor: "",
                    mood: "😎",
                    statusMsg: "Available",
                    streak: 1,
                    lastLoginDate: new Date().toDateString()
                };
            } else {
                currentUser = userExists;
                currentUser.isDev = isDev; 
                if(!currentUser.rank) currentUser.rank = "Member";
                if(!currentUser.mood) currentUser.mood = "😎";
                if(!currentUser.statusMsg) currentUser.statusMsg = "Available";
            }
            checkDailyStreak(); showMainApp();
        });
    }

    // ==========================================
    // 5. PROFILE UI
    // ==========================================
    const operatorColors = ["#FF0000", "#FF1493", "#8A2BE2", "#0000FF", "#1E90FF", "#00FFFF", "#00FA9A", "#32CD32", "#FFD700", "#FF8C00", "#FF4500", "#FFFFFF"];

    function loadProfileData() {
        if(!currentUser) return;
        
        const nameDisplay = document.getElementById('display-username');
        const bioDisplay = document.getElementById('user-bio');
        const dpWrapper = document.getElementById('dp-wrapper');
        const rankDisplay = document.getElementById('display-rank');
        const colorSection = document.getElementById('operator-color-section');
        const statusDisplay = document.getElementById('custom-status-text');
        const moodEmoji = document.getElementById('mood-emoji');
        const devNavItem = document.getElementById('dev-nav-item');

        // NEW: Verification Badge Sync
        let verifiedBadge = currentUser.isDev ? ' <i class="fas fa-check-circle" style="color: #10b981; font-size:1.5rem;" title="Verified Developer"></i>' : '';
        if(nameDisplay) nameDisplay.innerHTML = currentUser.username + verifiedBadge;
        
        if(bioDisplay) bioDisplay.innerText = currentUser.bio;
        if(statusDisplay) statusDisplay.innerText = `"${currentUser.statusMsg || 'Available'}"`;
        if(moodEmoji) moodEmoji.innerText = currentUser.mood || '😎';

        const rank = currentUser.rank || 'Member';
        if(rankDisplay) {
            rankDisplay.innerText = rank;
            rankDisplay.className = `rank-badge rank-${rank.toLowerCase()}`;
        }

        applyMedia(currentUser.dp, 'user-dp', 'user-dp-video');
        applyMedia(currentUser.banner, 'banner-img', 'banner-video');
        
        const fbMyDp = document.getElementById('fb-my-dp');
        if (fbMyDp) fbMyDp.src = (currentUser.dp && !currentUser.dp.startsWith('data:video')) ? currentUser.dp : DEFAULT_DP;

        if(nameDisplay) {
            nameDisplay.className = 'username-display'; 
            nameDisplay.style.color = ''; nameDisplay.style.textShadow = '';
            if (rank === 'Operator' && currentUser.userColor) {
                nameDisplay.classList.add('shine-operator');
                nameDisplay.style.setProperty('--user-color', currentUser.userColor);
                nameDisplay.style.color = currentUser.userColor;
            }
        }

        if (rank === 'Operator') {
            if (colorSection) colorSection.classList.remove('hidden'); setupColorGrid();
        } else {
            if (colorSection) colorSection.classList.add('hidden');
        }

        if (currentUser.isDev) {
            if(nameDisplay) nameDisplay.classList.add('dev-username-style');
            if(rankDisplay) rankDisplay.innerText = "Developer 👑";
            if(dpWrapper) dpWrapper.classList.add('dev-ring-active');
            if(devNavItem) devNavItem.classList.remove('hidden');
        } else {
            if(devNavItem) devNavItem.classList.add('hidden');
            if(dpWrapper) dpWrapper.classList.remove('dev-ring-active');
        }
    }

    function setupColorGrid() {
        const grid = document.getElementById('operator-color-grid');
        if(!grid) return; grid.innerHTML = '';
        operatorColors.forEach(color => {
            const div = document.createElement('div');
            div.className = 'color-option'; div.style.background = color;
            div.style.width = '30px'; div.style.height = '30px'; div.style.borderRadius = '50%'; div.style.cursor = 'pointer';
            if (currentUser.userColor === color) div.style.border = '2px solid white';
            div.onclick = () => { currentUser.userColor = color; saveUserData(); loadProfileData(); };
            grid.appendChild(div);
        });
    }

    const statusText = document.getElementById('custom-status-text');
    if(statusText) {
        statusText.addEventListener('click', () => {
            const newStatus = prompt("What's on your mind?", currentUser.statusMsg);
            if(newStatus !== null) { currentUser.statusMsg = newStatus.substring(0, 30); saveUserData(); loadProfileData(); }
        });
    }

    const editBtn = document.getElementById('edit-profile-btn');
    const editModal = document.getElementById('edit-profile-modal');
    const editUserIn = document.getElementById('edit-username-input');
    const editBioIn = document.getElementById('edit-bio-input');

    if(editBtn && editModal) {
        editBtn.addEventListener('click', () => {
            editUserIn.value = currentUser.username; editBioIn.value = currentUser.bio;
            editModal.classList.remove('hidden');
        });
    }

    window.closeEditProfile = () => { if(editModal) editModal.classList.add('hidden'); };

    window.saveProfileDetails = () => {
        const newName = editUserIn.value.trim();
        if(newName !== '') {
            currentUser.username = newName; currentUser.bio = editBioIn.value.trim();
            saveUserData(); loadProfileData(); closeEditProfile();
        }
    };

    ['banner', 'dp'].forEach(type => {
        const input = document.getElementById(`${type}-upload-input`);
        if(input) {
            input.addEventListener('change', function () {
                const file = this.files[0];
                if (file) {
                    if (file.size > 1500000) return alert("File is too large! Please select an image smaller than 1.5MB.");
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        currentUser[type] = e.target.result;
                        applyMedia(currentUser[type], type === 'banner' ? 'banner-img' : 'user-dp', type === 'banner' ? 'banner-video' : 'user-dp-video');
                        saveUserData();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    });

    function applyMedia(dataUrl, imgId, videoId) {
        const imgElement = document.getElementById(imgId); const videoElement = document.getElementById(videoId);
        if (!dataUrl || dataUrl === 'default-dp.png' || dataUrl === '') {
            if (imgElement) { imgElement.src = DEFAULT_DP; imgElement.classList.remove('hidden'); }
            if (videoElement) videoElement.classList.add('hidden'); return;
        }
        if (dataUrl.startsWith('data:video')) {
            if (imgElement) imgElement.classList.add('hidden');
            if (videoElement) { videoElement.src = dataUrl; videoElement.classList.remove('hidden'); videoElement.play(); }
        } else {
            if (videoElement) videoElement.classList.add('hidden');
            if (imgElement) { imgElement.src = dataUrl; imgElement.classList.remove('hidden'); }
        }
    }

    function showMainApp() {
        if(loginScreen && mainApp) {
            loginScreen.classList.remove('active'); loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden'); mainApp.classList.add('active');
        }
        loadProfileData();
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    const contentViews = document.querySelectorAll('.content-view');
    navButtons.forEach(btn => {
        if (btn.id === 'dark-mode-btn') return;
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            contentViews.forEach(c => { c.classList.remove('active'); c.classList.add('hidden'); });
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if(targetView) { targetView.classList.remove('hidden'); targetView.classList.add('active'); }
            if (window.innerWidth <= 768 && sidebar) sidebar.classList.remove('mobile-open');
        });
    });

    // ==========================================
    // 6. CHAT, TYPING INDICATOR & SOUND LOGIC
    // ==========================================
    let isWorldMuted = false;
    let lastWorldMessageTime = 0;
    const notifySound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

    const muteWorldBtn = document.getElementById('world-mute-btn');
    if(muteWorldBtn) {
        muteWorldBtn.addEventListener('click', () => {
            isWorldMuted = !isWorldMuted;
            muteWorldBtn.innerHTML = isWorldMuted ? '<i class="fas fa-volume-up"></i> Unmute Chat' : '<i class="fas fa-volume-mute"></i> Mute Chat';
            muteWorldBtn.style.background = isWorldMuted ? '#10b981' : '#ef4444';
        });
    }

    // NEW: Typing Indicator Logic
    let typingTimer;
    function handleTyping(areaId) {
        socket.emit('typing', { sender: currentUser.username, area: areaId });
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            socket.emit('stop_typing', { sender: currentUser.username, area: areaId });
        }, 1500); // Stop typing after 1.5 seconds of inactivity
    }

    socket.on('typing', (data) => {
        if(data.sender === currentUser.username) return;
        if(data.area === 'world-messages-area') {
            document.querySelector('.world-header p').innerHTML = `<i><span style="color:#10b981;">${data.sender}</span> is typing... ✍️</i>`;
        } else if (data.area === 'group-messages-area') {
            document.getElementById('current-group-name').innerHTML = `Group <span style="font-size:0.8rem; color:#8b5cf6;">(${data.sender} typing...)</span>`;
        }
    });

    socket.on('stop_typing', (data) => {
        if(data.sender === currentUser.username) return;
        if(data.area === 'world-messages-area') {
            document.querySelector('.world-header p').innerHTML = `Global slow mode: 3s`;
        } else if (data.area === 'group-messages-area') {
            document.getElementById('current-group-name').innerHTML = `Group`;
        }
    });

    function sendMessage(inputId, areaId) {
        const input = document.getElementById(inputId);
        if(!input) return;
        const text = input.value.trim();
        
        if (text !== "") {
            if (areaId === 'world-messages-area') {
                const now = Date.now();
                if (now - lastWorldMessageTime < 3000 && !currentUser.isDev) {
                    return alert("⏳ Global Slow Mode is active! Please wait 3 seconds.");
                }
                lastWorldMessageTime = now;
            }

            // Also emit stop typing when message is sent
            socket.emit('stop_typing', { sender: currentUser.username, area: areaId });
            socket.emit("send_message", { sender: currentUser.username, text: text, area: areaId });
            appendMessageToScreen(text, areaId, 'me');
            input.value = "";
        }
    }

    function appendMessageToScreen(text, areaElementId, senderType = 'other') {
        const messageArea = document.getElementById(areaElementId);
        if(!messageArea) return;

        if (senderType === 'system') {
            const sysDiv = document.createElement('div');
            sysDiv.className = 'message-bubble system-msg';
            sysDiv.innerText = text;
            messageArea.appendChild(sysDiv);
            messageArea.scrollTop = messageArea.scrollHeight;
            return;
        }

        const msgDiv = document.createElement('div');
        msgDiv.className = `message-bubble ${senderType === 'me' ? 'my-msg' : 'other-msg'}`;
        
        let formattedText = text;
        if(text.includes('@' + currentUser.username) || text.includes('@everyone')) {
            msgDiv.classList.add('mentioned-msg');
            formattedText = text.replace(new RegExp(`(@${currentUser.username}|@everyone)`, 'g'), `<span class="mention-highlight">$1</span>`);
            if(senderType === 'other' && !isWorldMuted) { notifySound.play().catch(e=>{}); }
        }
        
        msgDiv.innerHTML = formattedText;
        messageArea.appendChild(msgDiv);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    socket.on("receive_message", (data) => {
        if(data.sender === currentUser.username) return;
        if(data.area === 'world-messages-area' && isWorldMuted) return; 
        if (!isWorldMuted) { notifySound.currentTime = 0; notifySound.play().catch(e => console.log('Audio blocked')); }
        appendMessageToScreen(`<strong>${data.sender}:</strong> ` + data.text, data.area, 'other');
    });

    const setupInput = (inputId, areaId, btnId) => {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        
        // Attach Typing Listener
        if(input) input.addEventListener('input', () => handleTyping(areaId));
        
        if(btn) btn.addEventListener('click', () => sendMessage(inputId, areaId));
        if(input) { input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(inputId, areaId); }); }
    };

    setupInput('world-message-input', 'world-messages-area', 'world-send-btn');
    setupInput('message-input', 'messages-area', 'send-btn');
    setupInput('group-message-input', 'group-messages-area', 'group-send-btn');

    // ==========================================
    // 7. STORIES, GROUPS & GAMES LOGIC
    // ==========================================
    const addStatusBtn = document.getElementById('add-status-btn');
    if (addStatusBtn) {
        addStatusBtn.addEventListener('click', () => {
            const statusText = prompt("Enter your text status:");
            if (statusText) {
                const newStory = document.createElement('div');
                newStory.className = 'story-item';
                newStory.innerHTML = `<div class="story-avatar" style="border-color: #10b981;"><img src="${currentUser.dp || DEFAULT_DP}" alt="DP"></div><span>You</span>`;
                newStory.onclick = () => alert(`Status:\n\n${statusText}`);
                addStatusBtn.insertAdjacentElement('afterend', newStory);
            }
        });
    }

    const createGroupBtn = document.getElementById('create-group-btn');
    const createGroupModal = document.getElementById('create-group-modal');
    const confirmCreateGroupBtn = document.getElementById('confirm-create-group-btn');
    let tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";

    if (createGroupBtn) createGroupBtn.addEventListener('click', () => createGroupModal.classList.remove('hidden'));

    document.getElementById('new-group-icon-input')?.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => { tempGroupIcon = e.target.result; document.getElementById('new-group-icon-preview').src = tempGroupIcon; };
            reader.readAsDataURL(file);
        }
    });

    if (confirmCreateGroupBtn) {
        confirmCreateGroupBtn.addEventListener('click', () => {
            const name = document.getElementById('new-group-name').value.trim();
            if(name) {
                const groupList = document.getElementById('group-list-container');
                const newGroup = document.createElement('div');
                newGroup.className = 'dummy-item';
                newGroup.innerHTML = `<img src="${tempGroupIcon}" class="contact-avatar" style="border-radius:50%; width:40px; height:40px; border: 2px solid var(--primary-color);"><b>${name}</b>`;
                newGroup.onclick = () => {
                    document.getElementById('group-placeholder')?.classList.add('hidden');
                    document.getElementById('group-header')?.classList.remove('hidden');
                    document.getElementById('group-messages-area')?.classList.remove('hidden');
                    document.getElementById('group-input-area')?.classList.remove('hidden');
                    if(document.getElementById('current-group-name')) document.getElementById('current-group-name').innerText = name;
                    document.getElementById('group-header-img').src = tempGroupIcon;
                };
                groupList.appendChild(newGroup);
                createGroupModal.classList.add('hidden');
            } else { alert("Group name is required!"); }
        });
    }

    const ticTacToeBtn = document.getElementById('tictactoe-btn');
    const coinFlipBtn = document.getElementById('coinflip-btn');
    if (ticTacToeBtn) ticTacToeBtn.addEventListener('click', () => alert("🎮 Tic-Tac-Toe requires a connected Duo partner."));
    if (coinFlipBtn) coinFlipBtn.addEventListener('click', () => alert(`Flipping coin... \n\nResult: ${Math.random() > 0.5 ? "🪙 Heads!" : "🪙 Tails!"}`));

    // ==========================================
    // 8. DEVELOPER DASHBOARD
    // ==========================================
    window.openDevModal = function (type) {
        const assignModal = document.getElementById('dev-assign-modal');
        const banModal = document.getElementById('dev-ban-modal');
        if (type === 'ban') { banModal.classList.remove('hidden'); } else { assignModal.classList.remove('hidden'); }
    };
    window.closeDevModal = function () {
        document.getElementById('dev-assign-modal')?.classList.add('hidden');
        document.getElementById('dev-ban-modal')?.classList.add('hidden');
    };
});