document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SAFE STATE & LOCAL STORAGE
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
        showMainApp(); 
        socket.emit('user-reconnected', currentUser);
    }

    // ==========================================
    // 2. THEME LOGIC
    // ==========================================
    const darkModeBtn = document.getElementById('dark-mode-btn');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    function applyTheme() {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (darkModeBtn) darkModeBtn.innerText = '☀️ Light Mode';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (darkModeBtn) darkModeBtn.innerText = '🌙 Dark Mode';
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

    // ==========================================
    // 3. MOBILE SIDEBAR LOGIC (Hamburger Menu)
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');

    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.add('mobile-open');
        });
    }

    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
        });
    }

    // ==========================================
    // 4. SECURE LOGIN & RANK LOGIC
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
                    friends: 0,
                    dp: "default-dp.png",
                    banner: "",
                    partner: null,
                    rank: "Member", // Default rank
                    userColor: ""   // Default color
                };
                registeredUsers.push(currentUser);
                localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
            } else {
                currentUser = userExists;
                currentUser.isDev = isDev; 
                if(!currentUser.rank) currentUser.rank = "Member";
            }
            
            localStorage.setItem('chatUser', JSON.stringify(currentUser));
            showMainApp();
        });
    }

    // ==========================================
    // 5. PUBLIC PROFILE (Read-Only)
    // ==========================================
    window.viewPublicProfile = function(username) {
        const user = registeredUsers.find(u => u.username === username);
        if(!user) return alert("Profile not found in database!");
        
        const modal = document.getElementById('public-profile-modal');
        const nameDisplay = document.getElementById('public-profile-name');
        const bioDisplay = document.getElementById('public-profile-bio');
        const dpImg = document.getElementById('public-profile-dp');
        const rankBadge = document.getElementById('public-profile-rank');

        nameDisplay.innerText = user.username;
        bioDisplay.innerText = user.bio || "No bio available.";
        dpImg.src = (user.dp && !user.dp.startsWith('data:video')) ? user.dp : 'default-dp.png';
        
        const rank = user.rank || 'Member';
        rankBadge.innerText = rank;
        rankBadge.className = `rank-badge rank-${rank.toLowerCase()}`;

        nameDisplay.className = '';
        nameDisplay.style.color = '';
        nameDisplay.style.textShadow = '';
        
        if (rank === 'Operator' && user.userColor) {
            nameDisplay.classList.add('shine-operator');
            nameDisplay.style.setProperty('--user-color', user.userColor);
            nameDisplay.style.color = user.userColor;
        }

        modal.classList.remove('hidden');
    };

    window.closePublicProfile = function() {
        document.getElementById('public-profile-modal').classList.add('hidden');
    };

    // ==========================================
    // 6. LOAD PROFILE & OPERATOR COLORS
    // ==========================================
    const operatorColors = [
        "#FF0000", "#FF1493", "#FF00FF", "#8A2BE2", "#4B0082", "#483D8B", "#0000FF", "#0000CD", 
        "#1E90FF", "#00BFFF", "#87CEFA", "#00FFFF", "#40E0D0", "#00FA9A", "#00FF7F", "#3CB371", 
        "#2E8B57", "#008000", "#32CD32", "#ADFF2F", "#7FFF00", "#7CFC00", "#FFFF00", "#FFD700", 
        "#FFA500", "#FF8C00", "#FF4500", "#FF6347", "#FF7F50", "#DC143C", "#B22222", "#8B0000",
        "#FF69B4", "#C71585", "#DA70D6", "#D8BFD8", "#DDA0DD", "#E6E6FA", "#D2B48C", "#F4A460", 
        "#CD853F", "#D2691E", "#A0522D", "#8B4513", "#800000", "#FFFFFF", "#C0C0C0", "#808080",
        "#000000", "#333333"
    ];

    function loadProfileData() {
        if(!currentUser) return;
        
        const nameDisplay = document.getElementById('display-username');
        const bioDisplay = document.getElementById('user-bio');
        const myDpDisplay = document.getElementById('fb-my-dp');
        const dpWrapper = document.getElementById('dp-wrapper');
        const devNavItem = document.getElementById('dev-nav-item');
        const rankDisplay = document.getElementById('display-rank');
        const colorSection = document.getElementById('operator-color-section');

        if(nameDisplay) nameDisplay.innerText = currentUser.username;
        if(bioDisplay) bioDisplay.innerText = currentUser.bio;

        // Rank Display Setup
        const rank = currentUser.rank || 'Member';
        if(rankDisplay) {
            rankDisplay.innerText = rank;
            rankDisplay.className = `rank-badge rank-${rank.toLowerCase()}`;
        }

        // DP and Media
        applyMedia(currentUser.dp, 'user-dp', 'user-dp-video');
        applyMedia(currentUser.banner, 'banner-img', 'banner-video');
        if (myDpDisplay) myDpDisplay.src = (currentUser.dp && !currentUser.dp.startsWith('data:video')) ? currentUser.dp : 'default-dp.png';

        // Operator Color System
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

        // Supreme Developer UI
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
        if(!grid) return;
        grid.innerHTML = '';
        operatorColors.forEach(color => {
            const div = document.createElement('div');
            div.className = 'color-option';
            div.style.background = color;
            if (currentUser.userColor === color) div.style.borderColor = 'black';
            
            div.onclick = () => {
                currentUser.userColor = color;
                // Update specific user in local storage array
                const index = registeredUsers.findIndex(u => u.username === currentUser.username);
                if(index > -1) registeredUsers[index].userColor = color;
                
                localStorage.setItem('chatUser', JSON.stringify(currentUser));
                localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
                loadProfileData(); // Reload UI
            };
            grid.appendChild(div);
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
    }

    // Upload Logic
    const editBtn = document.getElementById('edit-profile-btn');
    if(editBtn) {
        editBtn.addEventListener('click', () => {
            const newBio = prompt("Enter new bio:", currentUser.bio);
            if (newBio) {
                currentUser.bio = newBio;
                const index = registeredUsers.findIndex(u => u.username === currentUser.username);
                if(index > -1) registeredUsers[index].bio = newBio;

                document.getElementById('user-bio').innerText = currentUser.bio;
                localStorage.setItem('chatUser', JSON.stringify(currentUser));
                localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
            }
        });
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

            if (window.innerWidth <= 768 && sidebar) sidebar.classList.remove('mobile-open'); // Auto close on mobile

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
    // 7. CHAT & MENTION SYSTEM
    // ==========================================
    function sendMessage(inputId, areaId) {
        const input = document.getElementById(inputId);
        if(!input) return;
        const text = input.value.trim();
        if (text !== "") {
            socket.emit("send_message", { sender: currentUser.username, text: text, area: areaId });
            appendMessageToScreen(text, areaId, 'me');
            input.value = "";
        }
    }

    function appendMessageToScreen(text, areaElementId, senderType = 'other') {
        const messageArea = document.getElementById(areaElementId);
        if(!messageArea) return;
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

    window.openChat = function (name) {
        const ph = document.getElementById('chat-placeholder');
        const header = document.getElementById('chat-header');
        const area = document.getElementById('messages-area');
        const inputArea = document.getElementById('chat-input-area');
        const chatName = document.getElementById('current-chat-name');
        
        if(ph) ph.classList.add('hidden');
        if(header) header.classList.remove('hidden');
        if(area) area.classList.remove('hidden');
        if(inputArea) inputArea.classList.remove('hidden');
        if(chatName) chatName.innerText = name;
    };

    window.openGroup = function (name) {
        const ph = document.getElementById('group-placeholder');
        const header = document.getElementById('group-header');
        const area = document.getElementById('group-messages-area');
        const inputArea = document.getElementById('group-input-area');
        const groupName = document.getElementById('current-group-name');

        if(ph) ph.classList.add('hidden');
        if(header) header.classList.remove('hidden');
        if(area) area.classList.remove('hidden');
        if(inputArea) inputArea.classList.remove('hidden');
        if(groupName) groupName.innerText = name;
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

        if (type === 'ban' || type === 'unban') {
            banModal.classList.remove('hidden');
            document.getElementById('ban-modal-title').innerText = type === 'ban' ? 'Ban User' : 'Unban User';
            document.getElementById('confirm-ban-btn').innerText = type === 'ban' ? 'Drop Hammer' : 'Restore Access';
        } else {
            assignModal.classList.remove('hidden');
            if (type === 'rank') title.innerText = "Assign Rank";
            if (type === 'ring') title.innerText = "Assign Premium Profile Ring";
            if (type === 'theme') title.innerText = "Assign Custom UI Theme";
            generateOptionsGrid(type);
        }
    };

    window.closeDevModal = function () {
        const assignModal = document.getElementById('dev-assign-modal');
        const banModal = document.getElementById('dev-ban-modal');
        if(assignModal) assignModal.classList.add('hidden');
        if(banModal) banModal.classList.add('hidden');
    };

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
                    Array.from(grid.children).forEach(c => c.style.border = 'none');
                    btn.style.border = '2px solid #fff';
                };
                grid.appendChild(btn);
            });
            return;
        }

        for (let i = 1; i <= 20; i++) { 
            const box = document.createElement('div');
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
            box.innerHTML = `V${i}`;

            if (type === 'ring') {
                box.style.borderRadius = '50%';
                box.classList.add(`ring-style-${i}`); 
                box.style.border = `4px solid hsl(${(i * 18) % 360}, 80%, 60%)`; 
            }
            else if (type === 'theme') {
                box.classList.add(`theme-style-${i}`);
                box.style.background = `hsl(${(i * 18) % 360}, 60%, 50%)`;
            }

            box.addEventListener('click', () => {
                Array.from(grid.children).forEach(child => child.style.outline = 'none');
                box.style.outline = '3px solid #fff';
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
            if (!selectedDevOption) return alert("Please select an option from the grid!");

            if (currentDevAction === 'rank') {
                const targetObj = registeredUsers.find(u => u.username.toLowerCase() === targetUser.toLowerCase());
                if(targetObj) {
                    targetObj.rank = selectedDevOption;
                    localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
                    alert(`Rank updated! ${targetObj.username} is now ${selectedDevOption}`);
                    if(targetUser.toLowerCase() === currentUser.username.toLowerCase()) {
                        currentUser.rank = selectedDevOption;
                        localStorage.setItem('chatUser', JSON.stringify(currentUser));
                        loadProfileData();
                    }
                } else {
                    alert("User not found in local database!");
                }
            } else {
                socket.emit('assign_dev_power', { user: targetUser, power: currentDevAction, value: selectedDevOption });
                alert(`Successfully applied feature to user: ${targetUser}`);
            }
            closeDevModal();
            document.getElementById('dev-target-user').value = '';
        });
    }

    const banBtn = document.getElementById('confirm-ban-btn');
    if(banBtn) {
        banBtn.addEventListener('click', () => {
            const targetUser = document.getElementById('ban-target-user').value;
            if (!targetUser) return alert("Please enter a target username!");
            socket.emit('ban_user', { user: targetUser });
            alert(`Action completed on user: ${targetUser}.`);
            closeDevModal();
            document.getElementById('ban-target-user').value = '';
        });
    }
});