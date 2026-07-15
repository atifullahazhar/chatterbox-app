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
    if (typeof io !== 'undefined') { socket = io(); } else { socket = { on: () => {}, emit: () => {} }; }

    if (currentUser && currentUser.username) { 
        checkDailyStreak(); 
        showMainApp(); 
        socket.emit('user-reconnected', currentUser);
    }

    function checkDailyStreak() {
        const today = new Date().toDateString();
        if (!currentUser.lastLoginDate) { currentUser.streak = 1; } else if (currentUser.lastLoginDate !== today) {
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            if (currentUser.lastLoginDate === yesterday.toDateString()) { currentUser.streak = (currentUser.streak || 0) + 1; } else { currentUser.streak = 1; }
        }
        currentUser.lastLoginDate = today; saveUserData();
    }

    function saveUserData() {
        if(!currentUser || !currentUser.email) return;
        const index = registeredUsers.findIndex(u => u.email === currentUser.email);
        if(index > -1) { registeredUsers[index] = currentUser; } else { registeredUsers.push(currentUser); }
        try {
            localStorage.setItem('chatUser', JSON.stringify(currentUser));
            localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
        } catch (error) { alert("🚨 STORAGE FULL! Please use a smaller picture."); }
    }

    // ==========================================
    // 3. THEME MANAGER (Handles The Grand Golden)
    // ==========================================
    const settingsDarkModeToggle = document.getElementById('settings-dark-mode-toggle');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    function applyTheme() {
        // Grand Golden override
        if (currentUser && currentUser.theme === 'grand-golden') {
            document.documentElement.setAttribute('data-theme', 'grand-golden');
            if (settingsDarkModeToggle) { 
                settingsDarkModeToggle.checked = true; 
                settingsDarkModeToggle.disabled = true; // Lock switch for VIP
            }
        } 
        // Normal Premium Themes
        else if (currentUser && currentUser.theme && currentUser.theme !== 'default') {
            document.documentElement.setAttribute('data-theme', currentUser.theme);
            if (settingsDarkModeToggle) settingsDarkModeToggle.disabled = false;
        } 
        // Standard Light/Dark Mode
        else {
            if (settingsDarkModeToggle) settingsDarkModeToggle.disabled = false;
            if (isDarkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                if (settingsDarkModeToggle) settingsDarkModeToggle.checked = true;
            } else {
                document.documentElement.removeAttribute('data-theme');
                if (settingsDarkModeToggle) settingsDarkModeToggle.checked = false;
            }
        }
    }
    applyTheme();

    if (settingsDarkModeToggle) { 
        settingsDarkModeToggle.addEventListener('change', (e) => { 
            isDarkMode = e.target.checked; 
            localStorage.setItem('darkMode', isDarkMode); 
            applyTheme(); 
        }); 
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
                } else if (userExists.email !== emailInput) { return alert('This username is registered with a different email address!'); }
            } else {
                const emailExists = registeredUsers.find(u => u.email === emailInput);
                if (emailExists) return alert('This email is already used by another account.');
            }

            const isDev = (devCodeClean === '6200437705AT'); 

            if (!userExists) {
                currentUser = {
                    username: usernameInput, email: emailInput, isDev: isDev, bio: "Hallo World",
                    dp: `https://ui-avatars.com/api/?name=${usernameInput}&background=eaddff&color=8b5cf6`, banner: "",
                    rank: "Member", userColor: "", mood: "😎", statusMsg: "Available", streak: 1, 
                    theme: "default", ring: null, lastLoginDate: new Date().toDateString()
                };
            } else {
                currentUser = userExists; currentUser.isDev = isDev; 
                if(!currentUser.rank) currentUser.rank = "Member";
                if(!currentUser.mood) currentUser.mood = "😎";
                if(!currentUser.statusMsg) currentUser.statusMsg = "Available";
                if(!currentUser.theme) currentUser.theme = "default";
            }
            checkDailyStreak(); showMainApp();
        });
    }

    // ==========================================
    // 5. PROFILE UI & RING ASSIGNMENT
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

        let verifiedBadge = currentUser.isDev ? ' <i class="fas fa-check-circle" style="color: #10b981; font-size:1.5rem;" title="Verified Developer"></i>' : '';
        if(nameDisplay) nameDisplay.innerHTML = currentUser.username + verifiedBadge;
        if(bioDisplay) bioDisplay.innerText = currentUser.bio;
        if(statusDisplay) statusDisplay.innerText = `"${currentUser.statusMsg || 'Available'}"`;
        if(moodEmoji) moodEmoji.innerText = currentUser.mood || '😎';

        const rank = currentUser.rank || 'Member';
        if(rankDisplay) { rankDisplay.innerText = rank; rankDisplay.className = `rank-badge rank-${rank.toLowerCase()}`; }

        applyMedia(currentUser.dp, 'user-dp', 'user-dp-video');
        applyMedia(currentUser.banner, 'banner-img', 'banner-video');
        
        const fbMyDp = document.getElementById('fb-my-dp');
        if (fbMyDp) fbMyDp.src = (currentUser.dp && !currentUser.dp.startsWith('data:video')) ? currentUser.dp : DEFAULT_DP;

        if(nameDisplay) {
            nameDisplay.className = 'username-display'; nameDisplay.style.color = ''; nameDisplay.style.textShadow = '';
            if (rank === 'Operator' && currentUser.userColor) {
                nameDisplay.classList.add('shine-operator');
                nameDisplay.style.setProperty('--user-color', currentUser.userColor);
                nameDisplay.style.color = currentUser.userColor;
            }
        }

        if (rank === 'Operator') { if (colorSection) colorSection.classList.remove('hidden'); setupColorGrid(); } 
        else { if (colorSection) colorSection.classList.add('hidden'); }

        // Dynamic Ring Application
        if (dpWrapper) {
            dpWrapper.className = 'dp-container'; // reset
            if (currentUser.ring && currentUser.ring !== 'default') {
                dpWrapper.classList.add(`ring-style-${currentUser.ring}`);
            }
            if (currentUser.isDev) {
                dpWrapper.classList.add('dev-ring-active');
            }
        }

        if (currentUser.isDev) { if(devNavItem) devNavItem.classList.remove('hidden'); } 
        else { if(devNavItem) devNavItem.classList.add('hidden'); }
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
        applyTheme();
        loadProfileData();
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    const contentViews = document.querySelectorAll('.content-view');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            contentViews.forEach(c => { c.classList.remove('active'); c.classList.add('hidden'); });
            btn.classList.add('active');
            
            const targetId = btn.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if(targetView) { targetView.classList.remove('hidden'); targetView.classList.add('active'); }
            
            if (targetId === 'dev-section-view') {
                document.body.classList.add('dev-theme-active');
            } else {
                document.body.classList.remove('dev-theme-active');
            }

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

    let typingTimer;
    function handleTyping(areaId) {
        socket.emit('typing', { sender: currentUser.username, area: areaId });
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => { socket.emit('stop_typing', { sender: currentUser.username, area: areaId }); }, 1500); 
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
                if (now - lastWorldMessageTime < 3000 && !currentUser.isDev) { return alert("⏳ Global Slow Mode is active! Please wait 3 seconds."); }
                lastWorldMessageTime = now;
            }
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
            const sysDiv = document.createElement('div'); sysDiv.className = 'message-bubble system-msg';
            sysDiv.innerText = text; messageArea.appendChild(sysDiv); messageArea.scrollTop = messageArea.scrollHeight; return;
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
        messageArea.appendChild(msgDiv); messageArea.scrollTop = messageArea.scrollHeight;
    }

    socket.on("receive_message", (data) => {
        if(data.sender === currentUser.username) return;
        if(data.area === 'world-messages-area' && isWorldMuted) return; 
        if (!isWorldMuted) { notifySound.currentTime = 0; notifySound.play().catch(e => console.log('Audio blocked')); }
        appendMessageToScreen(`<strong>${data.sender}:</strong> ` + data.text, data.area, 'other');
    });

    const setupInput = (inputId, areaId, btnId) => {
        const input = document.getElementById(inputId); const btn = document.getElementById(btnId);
        if(input) input.addEventListener('input', () => handleTyping(areaId));
        if(btn) btn.addEventListener('click', () => sendMessage(inputId, areaId));
        if(input) { input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(inputId, areaId); }); }
    };

    setupInput('world-message-input', 'world-messages-area', 'world-send-btn');
    setupInput('message-input', 'messages-area', 'send-btn');
    setupInput('group-message-input', 'group-messages-area', 'group-send-btn');

    // ==========================================
    // 7. DEVELOPER ACTION LOGIC & GRAND GOLDEN
    // ==========================================
    let currentDevAction = "";
    let selectedDevOption = null;

    window.openDevModal = function (type) {
        currentDevAction = type;
        const assignModal = document.getElementById('dev-assign-modal');
        const title = document.getElementById('dev-modal-title');
        selectedDevOption = null;

        if (!assignModal || !title) return;

        assignModal.classList.remove('hidden');
        if (type === 'rank') title.innerText = "Assign Rank";
        if (type === 'ring') title.innerText = "Assign Premium Profile Ring";
        if (type === 'theme') title.innerText = "Assign Custom UI Theme";
        
        generateOptionsGrid(type);
    };

    function generateOptionsGrid(type) {
        const grid = document.getElementById('dev-options-grid');
        if(!grid) return;
        grid.innerHTML = '';
        
        if(type === 'rank') {
            ['Operator', 'Elite', 'Legend', 'Pro', 'Member'].forEach(r => {
                const btn = document.createElement('button');
                btn.className = 'action-btn'; btn.style.width = '100%'; btn.innerText = r;
                btn.onclick = () => {
                    selectedDevOption = r;
                    Array.from(grid.children).forEach(c => c.style.border = '1px solid var(--border-color)');
                    btn.style.border = '2px solid var(--primary-color)';
                };
                grid.appendChild(btn);
            });
            return;
        }

        // 🔥 THE GRAND GOLDEN THEME OPTIONS
        if (type === 'theme') {
            const grandBtn = document.createElement('button');
            grandBtn.className = 'action-btn theme-style-grand'; 
            grandBtn.style.width = '100%'; grandBtn.style.gridColumn = '1 / -1'; 
            grandBtn.innerText = '🌟 THE GRAND GOLDEN 🌟';
            grandBtn.onclick = () => {
                selectedDevOption = 'grand-golden';
                Array.from(grid.children).forEach(c => c.style.outline = 'none');
                grandBtn.style.outline = '3px solid var(--primary-color)';
            };
            grid.appendChild(grandBtn);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'danger-btn'; 
            removeBtn.style.width = '100%'; removeBtn.style.gridColumn = '1 / -1'; 
            removeBtn.innerText = '❌ Remove Theme (Reset to Default)';
            removeBtn.onclick = () => {
                selectedDevOption = 'default';
                Array.from(grid.children).forEach(c => c.style.outline = 'none');
                removeBtn.style.outline = '3px solid var(--primary-color)';
            };
            grid.appendChild(removeBtn);
        }

        // Theme and Rings Generator
        for (let i = 1; i <= 20; i++) { 
            const box = document.createElement('div');
            box.style.width = '100%'; box.style.aspectRatio = '1/1'; box.style.borderRadius = '50%';
            box.style.cursor = 'pointer'; box.style.display = 'flex'; box.style.justifyContent = 'center';
            box.style.alignItems = 'center'; box.style.color = 'white'; box.innerHTML = `${i}`;

            if (type === 'ring') { box.classList.add(`ring-style-${i}`); box.style.border = `2px solid hsl(${(i * 18) % 360}, 80%, 60%)`; }
            else if (type === 'theme') { box.classList.add(`theme-style-${i}`); box.style.background = `hsl(${(i * 18) % 360}, 60%, 50%)`; }

            box.addEventListener('click', () => {
                Array.from(grid.children).forEach(child => child.style.outline = 'none');
                box.style.outline = '3px solid var(--primary-color)';
                selectedDevOption = (type === 'theme') ? `premium-${i}` : i;
            });
            grid.appendChild(box);
        }

        // Add Ring Revoke Button
        if (type === 'ring') {
            const removeRingBtn = document.createElement('button');
            removeRingBtn.className = 'danger-btn'; 
            removeRingBtn.style.width = '100%'; removeRingBtn.style.gridColumn = '1 / -1'; 
            removeRingBtn.innerText = '❌ Remove Ring';
            removeRingBtn.onclick = () => {
                selectedDevOption = 'default';
                Array.from(grid.children).forEach(c => c.style.outline = 'none');
                removeRingBtn.style.outline = '3px solid var(--primary-color)';
            };
            grid.appendChild(removeRingBtn);
        }
    }

    const assignBtn = document.getElementById('confirm-assign-btn');
    if(assignBtn) {
        assignBtn.addEventListener('click', () => {
            const targetUser = document.getElementById('dev-target-user').value;
            if (!targetUser) return alert("Please enter a target username!");
            if (!selectedDevOption) return alert("Please select an option from the grid!");

            const targetObj = registeredUsers.find(u => u.username.toLowerCase() === targetUser.toLowerCase());
            if(!targetObj) return alert("User not found in local database!");

            if (currentDevAction === 'rank') {
                targetObj.rank = selectedDevOption;
                alert(`Rank updated! ${targetObj.username} is now ${selectedDevOption}`);
            } else if (currentDevAction === 'theme') {
                targetObj.theme = selectedDevOption;
                if(selectedDevOption === 'default') alert(`Theme removed for ${targetObj.username}.`);
                else alert(`Theme applied to ${targetObj.username}!`);
            } else if (currentDevAction === 'ring') {
                targetObj.ring = selectedDevOption;
                if(selectedDevOption === 'default') alert(`Ring removed for ${targetObj.username}.`);
                else alert(`Ring applied to ${targetObj.username}!`);
            }

            try { localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers)); } catch(e){}
            
            // Check if assigning to self
            if(targetUser.toLowerCase() === currentUser.username.toLowerCase()) {
                currentUser = targetObj; saveUserData(); loadProfileData();
                if(currentDevAction === 'theme') applyTheme();
            }
            
            closeDevModal();
        });
    }

    window.openDevAction = function(actionType) {
        currentDevAction = actionType;
        const modal = document.getElementById('dev-action-modal');
        const title = document.getElementById('action-modal-title');
        const btn = document.getElementById('confirm-action-btn');
        const box = document.getElementById('dev-action-box');
        
        if(!modal) return;
        modal.classList.remove('hidden'); document.getElementById('action-target-user').value = ""; 
        box.className = 'dev-modal-content'; 
        if(actionType === 'ban') { title.innerText = "Ban User"; btn.innerText = "Ban"; btn.className = "danger-btn"; box.classList.add('danger-border'); } 
        else if(actionType === 'unban') { title.innerText = "Unban User"; btn.innerText = "Unban"; btn.className = "primary-btn"; box.style.border = "2px solid #10b981"; } 
        else if(actionType === 'shadowban') { title.innerText = "Shadowban User"; btn.innerText = "Shadowban"; btn.className = "gold-btn"; box.style.border = "2px solid #a855f7"; }
    };

    const actionBtn = document.getElementById('confirm-action-btn');
    if(actionBtn) {
        actionBtn.addEventListener('click', () => {
            const targetUser = document.getElementById('action-target-user').value;
            if(!targetUser) return alert("Please enter a username!");
            alert(`✅ User '${targetUser}' has been successfully ${currentDevAction}ned!`);
            closeDevModal();
        });
    }

    window.executeDevDirect = function(action) {
        if(action === 'global_mute') alert('🔇 Global Mute activated!');
        else if(action === 'wipe') { if(confirm('☢️ WARNING: Wipe all server messages?')) { document.querySelectorAll('.messages-container').forEach(c => c.innerHTML = ''); alert('Server Wiped Clean!'); } } 
        else if(action === 'maintenance') alert('🚧 Maintenance Mode Toggled!');
    }

    window.closeDevModal = function () {
        document.getElementById('dev-assign-modal')?.classList.add('hidden');
        document.getElementById('dev-action-modal')?.classList.add('hidden');
    };
});