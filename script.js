document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SAFE STATE & LOCAL STORAGE (Database Prep)
    // ==========================================
    let currentUser = null;
    let registeredUsers = [];
    
    try {
        const storedUser = localStorage.getItem('chatUser');
        if (storedUser) currentUser = JSON.parse(storedUser);
        
        const storedAppUsers = localStorage.getItem('chatAppUsers');
        if (storedAppUsers) registeredUsers = JSON.parse(storedAppUsers);
    } catch (error) {
        console.warn("Clearing corrupted local storage.");
        localStorage.removeItem('chatUser');
        localStorage.removeItem('chatAppUsers');
    }

    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    
    // SAFE SOCKET CONNECTION
    let socket;
    if (typeof io !== 'undefined') {
        socket = io();
    } else {
        socket = { on: () => {}, emit: () => {} };
    }

    if (currentUser && currentUser.username) { 
        checkDailyStreak(); // Calculate streak on auto-login
        showMainApp(); 
        socket.emit('user-reconnected', currentUser);
    }

    // ==========================================
    // 2. DAILY LOGIN STREAK LOGIC
    // ==========================================
    function checkDailyStreak() {
        const today = new Date().toDateString();
        if (!currentUser.lastLoginDate) {
            currentUser.streak = 1;
        } else if (currentUser.lastLoginDate !== today) {
            // Check if it was exactly yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (currentUser.lastLoginDate === yesterday.toDateString()) {
                currentUser.streak = (currentUser.streak || 0) + 1;
            } else {
                currentUser.streak = 1; // Streak broken
            }
        }
        currentUser.lastLoginDate = today;
        saveUserData();
    }

    function saveUserData() {
        const index = registeredUsers.findIndex(u => u.username === currentUser.username);
        if(index > -1) registeredUsers[index] = currentUser;
        localStorage.setItem('chatUser', JSON.stringify(currentUser));
        localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
    }

    // ==========================================
    // 3. THEME & MOBILE SIDEBAR LOGIC
    // ==========================================
    const darkModeBtn = document.getElementById('dark-mode-btn');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    function applyTheme() {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    }
    applyTheme();

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            applyTheme();
        });
    }

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');

    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener('click', () => sidebar.classList.add('mobile-open'));
    }
    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
    }

    // ==========================================
    // 4. SECURE LOGIN & INITIALIZATION
    // ==========================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const usernameInput = document.getElementById('username-input').value.trim();
            const emailInput = document.getElementById('email-input').value.trim().toLowerCase();
            const devInputRaw = document.getElementById('dev-code').value;
            const devCodeClean = devInputRaw.replace(/\s+/g, '');

            if (usernameInput === '') return alert('Username cannot be empty');
            if (emailInput === '') return alert('Email cannot be empty');

            const userExists = registeredUsers.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
            
            if (userExists) {
                if (!userExists.email) {
                    userExists.email = emailInput;
                    localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
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
                    dp: "default-dp.png",
                    banner: "",
                    rank: "Member",
                    userColor: "",
                    mood: "😎",
                    zodiac: "♈ Aries",
                    country: "🇮🇳 India",
                    statusMsg: "Busy building the future...",
                    streak: 1,
                    lastLoginDate: new Date().toDateString(),
                    visitors: Math.floor(Math.random() * 50) + 1
                };
                registeredUsers.push(currentUser);
            } else {
                currentUser = userExists;
                currentUser.isDev = isDev; 
                if(!currentUser.rank) currentUser.rank = "Member";
                if(!currentUser.mood) currentUser.mood = "😎";
                if(!currentUser.visitors) currentUser.visitors = Math.floor(Math.random() * 50) + 1;
            }
            
            checkDailyStreak();
            showMainApp();
        });
    }

    // ==========================================
    // 5. PROFILE UI & MOOD ENGINE
    // ==========================================
    const operatorColors = [
        "#FF0000", "#FF1493", "#8A2BE2", "#0000FF", "#1E90FF", "#00FFFF", 
        "#00FA9A", "#32CD32", "#FFD700", "#FF8C00", "#FF4500", "#FFFFFF"
    ];

    function loadProfileData() {
        if(!currentUser) return;
        
        const nameDisplay = document.getElementById('display-username');
        const bioDisplay = document.getElementById('user-bio');
        const dpWrapper = document.getElementById('dp-wrapper');
        const rankDisplay = document.getElementById('display-rank');
        const colorSection = document.getElementById('operator-color-section');
        const statusDisplay = document.getElementById('custom-status-text');
        const visitorTag = document.getElementById('visitor-count');
        const moodEmoji = document.getElementById('mood-emoji');
        const devNavItem = document.getElementById('dev-nav-item');

        if(nameDisplay) nameDisplay.innerText = currentUser.username;
        if(bioDisplay) bioDisplay.innerText = currentUser.bio;
        if(statusDisplay) statusDisplay.innerText = `"${currentUser.statusMsg || 'Available'}"`;
        if(moodEmoji) moodEmoji.innerText = currentUser.mood || '😎';

        // Update Tags
        const tags = document.querySelectorAll('.profile-tags .tag');
        if(tags.length >= 2) {
            tags[0].innerHTML = currentUser.zodiac || "♈ Aries";
            tags[1].innerHTML = currentUser.country || "🌍 Earth";
        }

        const rank = currentUser.rank || 'Member';
        if(rankDisplay) {
            rankDisplay.innerText = rank;
            rankDisplay.className = `rank-badge rank-${rank.toLowerCase()}`;
        }

        applyMedia(currentUser.dp, 'user-dp', 'user-dp-video');
        applyMedia(currentUser.banner, 'banner-img', 'banner-video');
        
        const fbMyDp = document.getElementById('fb-my-dp');
        if (fbMyDp) fbMyDp.src = (currentUser.dp && !currentUser.dp.startsWith('data:video')) ? currentUser.dp : 'default-dp.png';

        if(nameDisplay) {
            nameDisplay.className = 'username-display'; 
            nameDisplay.style.color = '';
            nameDisplay.style.textShadow = '';
            if (rank === 'Operator' && currentUser.userColor) {
                nameDisplay.classList.add('shine-operator');
                nameDisplay.style.setProperty('--user-color', currentUser.userColor);
                nameDisplay.style.color = currentUser.userColor;
            }
        }

        if (rank === 'Operator') {
            if (colorSection) colorSection.classList.remove('hidden');
            setupColorGrid();
        } else {
            if (colorSection) colorSection.classList.add('hidden');
        }

        // Feature: Hide Visitors for Developers
        if (currentUser.isDev) {
            if(nameDisplay) nameDisplay.classList.add('dev-username-style');
            if(rankDisplay) rankDisplay.innerText = "Developer 👑";
            if(dpWrapper) dpWrapper.classList.add('dev-ring-active');
            if(devNavItem) devNavItem.classList.remove('hidden');
            if(visitorTag) visitorTag.style.display = 'none'; // Hidden for Devs
        } else {
            if(devNavItem) devNavItem.classList.add('hidden');
            if(dpWrapper) dpWrapper.classList.remove('dev-ring-active');
            if(visitorTag) {
                visitorTag.style.display = 'flex';
                visitorTag.innerHTML = `<i class="fas fa-eye"></i> ${currentUser.visitors} Views`;
            }
        }
    }

    function setupColorGrid() {
        const grid = document.getElementById('operator-color-grid');
        if(!grid) return;
        grid.innerHTML = '';
        operatorColors.forEach(color => {
            const div = document.createElement('div');
            div.className = 'color-option';
            div.style.background = color;
            div.style.width = '30px'; div.style.height = '30px'; div.style.borderRadius = '50%'; div.style.cursor = 'pointer';
            if (currentUser.userColor === color) div.style.border = '2px solid white';
            
            div.onclick = () => {
                currentUser.userColor = color;
                saveUserData();
                loadProfileData(); 
            };
            grid.appendChild(div);
        });
    }

    // Interactive Profile Edits
    const moodEmojiBtn = document.getElementById('mood-emoji');
    if(moodEmojiBtn) {
        moodEmojiBtn.addEventListener('click', () => {
            const newMood = prompt("Enter an emoji for your mood (e.g. 🥳, 😡, 😭):", currentUser.mood);
            if(newMood) {
                currentUser.mood = newMood.substring(0, 2); // Keep it short
                saveUserData();
                loadProfileData();
            }
        });
    }

    const editBtn = document.getElementById('edit-profile-btn');
    if(editBtn) {
        editBtn.addEventListener('click', () => {
            const newBio = prompt("Enter new bio:", currentUser.bio);
            const newStatus = prompt("Enter custom status:", currentUser.statusMsg);
            if (newBio) currentUser.bio = newBio;
            if (newStatus) currentUser.statusMsg = newStatus;
            saveUserData();
            loadProfileData();
        });
    }

    function applyMedia(dataUrl, imgId, videoId) {
        const imgElement = document.getElementById(imgId);
        const videoElement = document.getElementById(videoId);
        if (!dataUrl || dataUrl === 'default-dp.png' || dataUrl === '') {
            if (imgElement) { imgElement.src = 'default-dp.png'; imgElement.classList.remove('hidden'); }
            if (videoElement) videoElement.classList.add('hidden');
            return;
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
            loginScreen.classList.remove('active');
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            mainApp.classList.add('active');
        }
        loadProfileData();
        
        // Automated Welcome Bot
        setTimeout(() => {
            appendMessageToScreen(`🤖 Welcome back to Chatterbox Global, ${currentUser.username}!`, 'world-messages-area', 'system');
        }, 1000);
    }

    // Sidebar View Navigation
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

            if (targetId === 'dev-section-view') {
                document.documentElement.setAttribute('data-theme', 'gold');
                if (darkModeBtn && darkModeBtn.parentElement) darkModeBtn.parentElement.style.display = 'none';
            } else {
                applyTheme();
                if (darkModeBtn && darkModeBtn.parentElement) darkModeBtn.parentElement.style.display = 'block';
            }
        });
    });

    // ==========================================
    // 6. CHAT & WORLD CHAT (Mute & 3s Slow Mode)
    // ==========================================
    let isWorldMuted = false;
    let lastWorldMessageTime = 0;

    const muteWorldBtn = document.getElementById('world-mute-btn');
    if(muteWorldBtn) {
        muteWorldBtn.addEventListener('click', () => {
            isWorldMuted = !isWorldMuted;
            muteWorldBtn.innerHTML = isWorldMuted ? '<i class="fas fa-volume-up"></i> Unmute Chat' : '<i class="fas fa-volume-mute"></i> Mute Chat';
            muteWorldBtn.style.background = isWorldMuted ? '#10b981' : '#ef4444';
        });
    }

    function sendMessage(inputId, areaId) {
        const input = document.getElementById(inputId);
        if(!input) return;
        const text = input.value.trim();
        
        if (text !== "") {
            // Feature: 3s Slow Mode
            if (areaId === 'world-messages-area') {
                const now = Date.now();
                if (now - lastWorldMessageTime < 3000 && !currentUser.isDev) {
                    return alert("⏳ Global Slow Mode is active! Please wait 3 seconds.");
                }
                lastWorldMessageTime = now;
            }

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
        }
        
        msgDiv.innerHTML = formattedText;
        messageArea.appendChild(msgDiv);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    socket.on("receive_message", (data) => {
        if(data.sender === currentUser.username) return;
        
        // Feature: World Chat Mute Logic
        if(data.area === 'world-messages-area' && isWorldMuted) return; 

        appendMessageToScreen(data.text, data.area, 'other');
    });

    const setupInput = (inputId, areaId, btnId) => {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        if(btn) btn.addEventListener('click', () => sendMessage(inputId, areaId));
        if(input) {
            input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(inputId, areaId); });
        }
    };

    setupInput('world-message-input', 'world-messages-area', 'world-send-btn');
    setupInput('message-input', 'messages-area', 'send-btn');
    setupInput('group-message-input', 'group-messages-area', 'group-send-btn');

    // ==========================================
    // 7. BUG FIX: GROUP CREATION
    // ==========================================
    const createGroupBtn = document.getElementById('create-group-btn');
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', () => {
            const groupName = prompt("Enter a name for the new group:");
            if (groupName && groupName.trim() !== "") {
                const groupList = document.getElementById('group-list-container');
                const newGroup = document.createElement('div');
                newGroup.className = 'dummy-item';
                newGroup.innerHTML = `<div class="contact-avatar"><span>👥</span></div><b>${groupName}</b>`;
                newGroup.onclick = () => window.openGroup(groupName);
                groupList.appendChild(newGroup);
            }
        });
    }

    window.openChat = function (name) {
        document.getElementById('chat-placeholder')?.classList.add('hidden');
        document.getElementById('chat-header')?.classList.remove('hidden');
        document.getElementById('messages-area')?.classList.remove('hidden');
        document.getElementById('chat-input-area')?.classList.remove('hidden');
        if(document.getElementById('current-chat-name')) document.getElementById('current-chat-name').innerText = name;
    };

    window.openGroup = function (name) {
        document.getElementById('group-placeholder')?.classList.add('hidden');
        document.getElementById('group-header')?.classList.remove('hidden');
        document.getElementById('group-messages-area')?.classList.remove('hidden');
        document.getElementById('group-input-area')?.classList.remove('hidden');
        if(document.getElementById('current-group-name')) document.getElementById('current-group-name').innerText = name;
    };

    // ==========================================
    // 8. DEVELOPER DASHBOARD LOGIC
    // ==========================================
    let currentDevAction = "";
    let selectedDevOption = null;

    window.openDevModal = function (type) {
        currentDevAction = type;
        const assignModal = document.getElementById('dev-assign-modal');
        const banModal = document.getElementById('dev-ban-modal');
        const title = document.getElementById('dev-modal-title');
        selectedDevOption = null;

        if (!assignModal || !banModal || !title) return;

        if (type === 'ban') {
            banModal.classList.remove('hidden');
        } else {
            assignModal.classList.remove('hidden');
            if (type === 'rank') title.innerText = "Assign Rank";
            if (type === 'ring') title.innerText = "Assign Premium Profile Ring";
            if (type === 'theme') title.innerText = "Assign Custom UI Theme";
            generateOptionsGrid(type);
        }
    };

    window.closeDevModal = function () {
        document.getElementById('dev-assign-modal')?.classList.add('hidden');
        document.getElementById('dev-ban-modal')?.classList.add('hidden');
        document.getElementById('public-profile-modal')?.classList.add('hidden');
    };

    window.closePublicProfile = window.closeDevModal;

    function generateOptionsGrid(type) {
        const grid = document.getElementById('dev-options-grid');
        if(!grid) return;
        grid.innerHTML = '';
        
        if(type === 'rank') {
            ['Operator', 'Elite', 'Legend', 'Pro', 'Member'].forEach(r => {
                const btn = document.createElement('button');
                btn.className = 'action-btn';
                btn.style.width = '100%';
                btn.innerText = r;
                btn.onclick = () => {
                    selectedDevOption = r;
                    Array.from(grid.children).forEach(c => c.style.border = '1px solid var(--border-color)');
                    btn.style.border = '2px solid var(--primary-color)';
                };
                grid.appendChild(btn);
            });
            return;
        }

        for (let i = 1; i <= 20; i++) { 
            const box = document.createElement('div');
            box.style.width = '100%';
            box.style.aspectRatio = '1/1';
            box.style.borderRadius = '50%';
            box.style.cursor = 'pointer';
            box.style.display = 'flex';
            box.style.justifyContent = 'center';
            box.style.alignItems = 'center';
            box.style.color = 'white';
            box.innerHTML = `${i}`;

            if (type === 'ring') {
                box.classList.add(`ring-style-${i}`); 
                box.style.border = `2px solid hsl(${(i * 18) % 360}, 80%, 60%)`; 
            }
            else if (type === 'theme') {
                box.classList.add(`theme-style-${i}`);
                box.style.background = `hsl(${(i * 18) % 360}, 60%, 50%)`;
            }

            box.addEventListener('click', () => {
                Array.from(grid.children).forEach(child => child.style.outline = 'none');
                box.style.outline = '3px solid var(--primary-color)';
                selectedDevOption = i;
            });
            grid.appendChild(box);
        }
    }

    const assignBtn = document.getElementById('confirm-assign-btn');
    if(assignBtn) {
        assignBtn.addEventListener('click', () => {
            const targetUser = document.getElementById('dev-target-user').value;
            if (!targetUser) return alert("Please enter a target username!");
            if (!selectedDevOption) return alert("Please select an option!");

            if (currentDevAction === 'rank') {
                const targetObj = registeredUsers.find(u => u.username.toLowerCase() === targetUser.toLowerCase());
                if(targetObj) {
                    targetObj.rank = selectedDevOption;
                    localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
                    alert(`Rank updated! ${targetObj.username} is now ${selectedDevOption}`);
                    if(targetUser.toLowerCase() === currentUser.username.toLowerCase()) {
                        currentUser.rank = selectedDevOption;
                        saveUserData();
                        loadProfileData();
                    }
                } else {
                    alert("User not found in local database!");
                }
            }
            closeDevModal();
        });
    }
});