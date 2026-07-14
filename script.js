document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. STATE & LOCAL STORAGE (Persistent Login)
    // ==========================================
    // Using 'chatUser' to store persistent login
    let currentUser = JSON.parse(localStorage.getItem('chatUser')); 
    let registeredUsers = JSON.parse(localStorage.getItem('chatAppUsers')) || [];

    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    const socket = io("http://localhost:3000");

    // NEW: If user is already logged in, skip login screen
    if (currentUser) { 
        showMainApp(); 
        // Tell server this user reconnected
        socket.emit('user-reconnected', currentUser);
    }

    // ==========================================
    // 2. THEME LOGIC (Dark Mode & Gold Mode)
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
    // 3. SECURE LOGIN LOGIC (1 Email = 1 Account)
    // ==========================================
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username-input').value.trim();
        const emailInput = document.getElementById('email-input').value.trim().toLowerCase();
        const devInputRaw = document.getElementById('dev-code').value;
        const devCodeClean = devInputRaw.replace(/\s+/g, '');

        if (usernameInput === '') return alert('Username cannot be empty');
        if (emailInput === '') return alert('Email cannot be empty');

        // NEW: Check if Email is already used by another account
        const emailExists = registeredUsers.find(u => u.email === emailInput);
        if (emailExists && emailExists.username.toLowerCase() !== usernameInput.toLowerCase()) {
            return alert('This email is already registered to another username. One email per account allowed.');
        }

        const userExists = registeredUsers.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
        if (userExists && !emailExists) {
             return alert('This username is already taken!');
        }

        // NEW: The actual dev code validation should eventually happen on the server, 
        // but for now we keep it secure-ish here until we update server.js
        const isDev = (devCodeClean === '6200437705AT'); 

        currentUser = {
            username: usernameInput,
            email: emailInput,
            isDev: isDev,
            bio: "Hallo World",
            friends: 0,
            dp: "default-dp.png",
            banner: "",
            partner: null
        };

        if(!userExists) {
            registeredUsers.push(currentUser);
            localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
        }
        
        // Save to browser memory so they don't have to log in again
        localStorage.setItem('chatUser', JSON.stringify(currentUser));
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
            localStorage.setItem('chatUser', JSON.stringify(currentUser));
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
                    localStorage.setItem('chatUser', JSON.stringify(currentUser));
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
        if (btn.id === 'dark-mode-btn') return;

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

            if (targetId === 'dev-section-view') {
                document.documentElement.setAttribute('data-theme', 'gold');
                if (darkModeBtn) darkModeBtn.parentElement.style.display = 'none';
            } else {
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
    // 7. CHAT & @MENTION SYSTEM
    // ==========================================
    
    // Helper function for sending message
    function sendMessage(inputId, areaId) {
        const input = document.getElementById(inputId);
        const text = input.value.trim();
        if (text !== "") {
            // Emitting to server
            socket.emit("send_message", { sender: currentUser.username, text: text, area: areaId });
            
            // Add my own message to screen instantly
            appendMessageToScreen(text, areaId, 'me');
            input.value = "";
        }
    }

    // Generic append function
    function appendMessageToScreen(text, areaElementId, senderType = 'other') {
        const messageArea = document.getElementById(areaElementId);
        if(!messageArea) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message-bubble ${senderType === 'me' ? 'my-msg' : 'other-msg'}`;
        
        // Handle Mentions Highlighting
        let formattedText = text;
        if(text.includes('@' + currentUser.username) || text.includes('@everyone')) {
            msgDiv.classList.add('mentioned-msg');
            formattedText = text.replace(new RegExp(`(@${currentUser.username}|@everyone)`, 'g'), `<span class="mention-highlight">$1</span>`);
        }
        
        msgDiv.innerHTML = formattedText;
        messageArea.appendChild(msgDiv);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // Listen for incoming messages from server
    socket.on("receive_message", (data) => {
        // If it's my own message coming back, ignore it (already appended)
        if(data.sender === currentUser.username) return;
        
        // Play notification sound
        const audio = new Audio('notification.mp3'); // Ensure you have this file
        audio.play().catch(e => console.log('Audio blocked by browser.'));

        appendMessageToScreen(data.text, data.area, 'other');
    });

    // Setup input listeners for Enter key
    const setupInput = (inputId, areaId, btnId) => {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        if(btn) btn.addEventListener('click', () => sendMessage(inputId, areaId));
        if(input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage(inputId, areaId);
            });
            // Attach Mention listener
            setupMentionSystem(input, inputId);
        }
    };

    setupInput('world-message-input', 'world-messages-area', 'world-send-btn');
    setupInput('message-input', 'messages-area', 'send-btn');
    setupInput('group-message-input', 'group-messages-area', 'group-send-btn');

    // --- @MENTION LOGIC ---
    function setupMentionSystem(inputElement, id) {
        let dropdownId = 'private-mention-dropdown';
        if(id === 'group-message-input') dropdownId = 'group-mention-dropdown';
        if(id === 'world-message-input') dropdownId = 'world-mention-dropdown';
        
        const dropdown = document.getElementById(dropdownId);
        
        inputElement.addEventListener('input', (e) => {
            const val = inputElement.value;
            const cursorPosition = inputElement.selectionStart;
            const textBeforeCursor = val.substring(0, cursorPosition);
            
            // Check if typing @
            const match = textBeforeCursor.match(/@(\w*)$/);
            
            if (match) {
                const searchStr = match[1].toLowerCase();
                // Filter users
                const allUsers = registeredUsers.map(u => u.username);
                allUsers.push('everyone');
                
                const filtered = allUsers.filter(u => u.toLowerCase().startsWith(searchStr));
                
                if (filtered.length > 0) {
                    dropdown.innerHTML = '';
                    filtered.forEach(user => {
                        const div = document.createElement('div');
                        div.className = 'mention-item';
                        div.innerText = `@${user}`;
                        div.onclick = () => {
                            const newText = val.substring(0, cursorPosition - match[0].length) + `@${user} ` + val.substring(cursorPosition);
                            inputElement.value = newText;
                            dropdown.classList.add('hidden');
                            inputElement.focus();
                        };
                        dropdown.appendChild(div);
                    });
                    
                    // Position dropdown above input
                    dropdown.classList.remove('hidden');
                } else {
                    dropdown.classList.add('hidden');
                }
            } else {
                dropdown.classList.add('hidden');
            }
        });
        
        // Hide dropdown on blur
        document.addEventListener('click', (e) => {
            if(e.target !== inputElement && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }

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

        for (let i = 1; i <= 20; i++) { // Changed to 20 for Premium Focus
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

            // We will hook this up to CSS animations later
            if (type === 'ring') {
                box.style.borderRadius = '50%';
                box.classList.add(`ring-style-${i}`); // Adds CSS class
                box.style.border = `4px solid hsl(${(i * 18) % 360}, 80%, 60%)`; 
            }
            else if (type === 'theme') {
                box.classList.add(`theme-style-${i}`);
                box.style.background = `hsl(${(i * 18) % 360}, 60%, 50%)`;
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
        
        // Server emit logic will go here to update database
        socket.emit('assign_dev_power', { user: targetUser, power: currentDevAction });
        
        alert(`Successfully applied ${actionName} to user: ${targetUser}`);
        closeDevModal();
        document.getElementById('dev-target-user').value = '';
    });

    document.getElementById('confirm-ban-btn').addEventListener('click', () => {
        const targetUser = document.getElementById('ban-target-user').value;
        if (!targetUser) return alert("Please enter a target username!");
        
        socket.emit('ban_user', { user: targetUser });
        
        alert(`Action completed on user: ${targetUser}. Server database updated.`);
        closeDevModal();
        document.getElementById('ban-target-user').value = '';
    });
});