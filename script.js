document.addEventListener('DOMContentLoaded', () => {
    // 🔥 GLOBAL CLICK LISTENER (FIXED)
    document.addEventListener('click', (e) => {

        // 1. World Chat Send Logic
        if (e.target.closest('#world-send-btn')) {
            const input = document.getElementById('world-message-input'); // ID Corrected
            if (input && input.value.trim() !== "") {
                console.log("Sending to World: " + input.value);
                // World chat logic:
                // socket.emit('send_message', { sender: currentUser.username, text: input.value });
                input.value = '';
            } else {
                alert("Bhai, message toh likho!");
            }
        }

        // 2. Post Like Button
        if (e.target.closest('.like-btn')) {
            const btn = e.target.closest('.like-btn');
            btn.classList.toggle('liked');
            if (btn.classList.contains('liked')) {
                btn.style.color = '#ef4444';
                btn.innerHTML = '<i class="fas fa-heart"></i> Liked';
            } else {
                btn.style.color = '';
                btn.innerHTML = '<i class="far fa-heart"></i> Like';
            }
        }

        // 3. Delete Post Button
        if (e.target.closest('.delete-post-btn')) {
            if (confirm("Delete this post?")) {
                e.target.closest('.feed-post').remove();
            }
        }
    });
});
// ==========================================
// 1. SAFE STATE & STORAGE
// ==========================================
let currentUser = null;
let registeredUsers = [];
const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";

try {
    currentUser = JSON.parse(localStorage.getItem('chatUser'));
    registeredUsers = JSON.parse(localStorage.getItem('chatAppUsers') || '[]');
} catch (e) { }

const socket = (typeof io !== 'undefined') ? io() : { on: () => { }, emit: () => { } };

function saveUserData() {
    localStorage.setItem('chatUser', JSON.stringify(currentUser));
    localStorage.setItem('chatAppUsers', JSON.stringify(registeredUsers));
}

// ==========================================
// 2. THEME MANAGER & UI NAVIGATION
// ==========================================
const settingsDarkModeToggle = document.getElementById('settings-dark-mode-toggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function applyTheme() {
    if (currentUser && currentUser.theme === 'grand-golden') {
        document.documentElement.setAttribute('data-theme', 'grand-golden');
        if (settingsDarkModeToggle) { settingsDarkModeToggle.checked = true; settingsDarkModeToggle.disabled = true; }
    } else if (currentUser && currentUser.theme && currentUser.theme !== 'default') {
        document.documentElement.setAttribute('data-theme', currentUser.theme);
        if (settingsDarkModeToggle) settingsDarkModeToggle.disabled = false;
    } else {
        if (settingsDarkModeToggle) settingsDarkModeToggle.disabled = false;
        if (isDarkMode) { document.documentElement.setAttribute('data-theme', 'dark'); if (settingsDarkModeToggle) settingsDarkModeToggle.checked = true; }
        else { document.documentElement.removeAttribute('data-theme'); if (settingsDarkModeToggle) settingsDarkModeToggle.checked = false; }
    }
}

if (settingsDarkModeToggle) {
    settingsDarkModeToggle.addEventListener('change', (e) => {
        isDarkMode = e.target.checked; localStorage.setItem('darkMode', isDarkMode); applyTheme();
    });
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.content-view').forEach(c => { c.classList.remove('active'); c.classList.add('hidden'); });
        const target = document.getElementById(btn.dataset.target);
        if (target) { target.classList.remove('hidden'); target.classList.add('active'); }

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.target === 'dev-section-view') document.body.classList.add('dev-theme-active');
        else document.body.classList.remove('dev-theme-active');
    });
});

const chatTabs = document.querySelectorAll('.chat-tabs .tab-btn');
chatTabs.forEach(btn => {
    btn.addEventListener('click', () => {
        chatTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ==========================================
// 3. AUTH & PROFILE UI
// ==========================================
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username-input').value.trim();
        const email = document.getElementById('email-input').value.trim();
        const devCode = document.getElementById('dev-code').value.replace(/\s+/g, '');

        currentUser = { username: user, email: email, isDev: (devCode === '6200437705AT'), rank: "Member", theme: "default", ring: null, bio: "Hallo World", dp: DEFAULT_DP };
        saveUserData(); showMainApp();
    });
}

if (currentUser && currentUser.username) { showMainApp(); }

function showMainApp() {
    document.getElementById('login-screen').classList.replace('active', 'hidden');
    document.getElementById('main-app').classList.replace('hidden', 'active');
    applyTheme(); loadProfileData();
}

function loadProfileData() {
    if (!currentUser) return;

    // 🔥 Auto-Upgrade: Agar user Dev hai toh rank "Developer" kar do
    if (currentUser.isDev) {
        currentUser.rank = "Developer";
        saveUserData();
    }

    document.getElementById('display-username').innerText = currentUser.username;
    document.getElementById('user-bio').innerText = currentUser.bio || "Hallo World";
    document.getElementById('user-dp').src = currentUser.dp || DEFAULT_DP;
    document.getElementById('fb-my-dp').src = currentUser.dp || DEFAULT_DP;

    const rankEl = document.getElementById('display-rank');
    rankEl.innerText = currentUser.rank || "Member";
    rankEl.className = `rank-badge rank-${(currentUser.rank || 'Member').toLowerCase()}`;

    const ringWrapper = document.getElementById('dp-wrapper');
    ringWrapper.className = 'dp-container';
    if (currentUser.ring && currentUser.ring !== 'default') ringWrapper.classList.add(`ring-style-${currentUser.ring}`);

    // 🔥 Developer Ring Activation
    if (currentUser.isDev) {
        ringWrapper.classList.add('dev-ring-active');
        document.getElementById('dev-nav-item').classList.remove('hidden');
    }
}

document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
    document.getElementById('edit-username-input').value = currentUser.username;
    document.getElementById('edit-bio-input').value = currentUser.bio || "";
    document.getElementById('edit-profile-modal').classList.remove('hidden');
});
window.closeEditProfile = () => document.getElementById('edit-profile-modal').classList.add('hidden');
window.saveProfileDetails = () => {
    currentUser.username = document.getElementById('edit-username-input').value;
    currentUser.bio = document.getElementById('edit-bio-input').value;
    saveUserData(); loadProfileData(); closeEditProfile();
};

document.getElementById('dp-upload-input')?.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => { currentUser.dp = e.target.result; saveUserData(); loadProfileData(); };
        reader.readAsDataURL(file);
    }
});

// ==========================================
// 4. CHAT SYSTEM
// ==========================================
const msgInput = document.getElementById('message-input');
const msgArea = document.getElementById('messages-area');
const notifySound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

function appendMessage(sender, text, type) {
    if (!msgArea) return;
    const div = document.createElement('div');
    div.className = `message-bubble ${type === 'me' ? 'my-msg' : 'other-msg'}`;
    div.innerHTML = `<strong>${sender}:</strong><br>${text}`;
    msgArea.appendChild(div);
    msgArea.scrollTop = msgArea.scrollHeight;
}

function sendMessage() {
    if (!msgInput) return;
    const text = msgInput.value.trim();
    if (text) {
        socket.emit('send_message', { sender: currentUser.username, text: text });
        msgInput.value = '';
        appendMessage(currentUser.username, text, 'me');
    }
}

document.getElementById('send-btn')?.addEventListener('click', sendMessage);
msgInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
msgInput?.addEventListener('input', () => socket.emit('typing', { sender: currentUser.username }));

socket.on('receive_message', (data) => {
    if (data.sender !== currentUser.username) {
        appendMessage(data.sender, data.text, 'other');
        notifySound.play().catch(() => { });
    }
});

socket.on('typing', (data) => {
    if (data.sender !== currentUser.username) {
        const statusEl = document.querySelector('.status-text');
        if (statusEl) {
            statusEl.innerText = `${data.sender} is typing...`;
            setTimeout(() => statusEl.innerText = 'Online', 2000);
        }
    }
});

// ==========================================
// 5. DEV DASHBOARD
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
    if (!grid) return;
    grid.innerHTML = '';

    if (type === 'rank') {
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
        removeBtn.innerText = '❌ Remove Theme';
        removeBtn.onclick = () => {
            selectedDevOption = 'default';
            Array.from(grid.children).forEach(c => c.style.outline = 'none');
            removeBtn.style.outline = '3px solid var(--primary-color)';
        };
        grid.appendChild(removeBtn);
    }

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
}

document.getElementById('confirm-assign-btn')?.addEventListener('click', () => {
    const targetUser = document.getElementById('dev-target-user').value;
    if (!targetUser || !selectedDevOption) return alert("Select user and option!");

    if (currentDevAction === 'rank') currentUser.rank = selectedDevOption;
    else if (currentDevAction === 'theme') currentUser.theme = selectedDevOption;
    else if (currentDevAction === 'ring') currentUser.ring = selectedDevOption;

    saveUserData(); loadProfileData(); applyTheme(); closeDevModal(); alert("Power applied!");
});

window.openDevAction = (actionType) => {
    document.getElementById('dev-action-modal').classList.remove('hidden');
    document.getElementById('action-modal-title').innerText = actionType.toUpperCase();
};

document.getElementById('confirm-action-btn')?.addEventListener('click', () => {
    alert(`✅ User '${document.getElementById('action-target-user').value}' targeted!`);
    closeDevModal();
});

window.executeDevDirect = (action) => {
    if (action === 'wipe') { if (confirm('⚠️ Wipe server messages?')) document.querySelectorAll('.messages-container').forEach(c => c.innerHTML = ''); }
    else alert(action.replace('_', ' ').toUpperCase() + " executed!");
};

window.closeDevModal = () => {
    document.getElementById('dev-assign-modal')?.classList.add('hidden');
    document.getElementById('dev-action-modal')?.classList.add('hidden');
};

// ==========================================
// 6. GROUPS & GAMES 
// ==========================================
const createGroupBtn = document.getElementById('create-group-btn');
const createGroupModal = document.getElementById('create-group-modal');
let tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";

if (createGroupBtn) createGroupBtn.addEventListener('click', () => createGroupModal.classList.remove('hidden'));

document.getElementById('new-group-icon-input')?.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => { tempGroupIcon = e.target.result; document.getElementById('new-group-icon-preview').src = tempGroupIcon; };
        reader.readAsDataURL(file);
    }
});

document.getElementById('confirm-create-group-btn')?.addEventListener('click', () => {
    const name = document.getElementById('new-group-name').value;
    if (name) {
        const div = document.createElement('div');
        div.className = 'dummy-item';
        div.innerHTML = `<img src="${tempGroupIcon}" class="contact-avatar" style="border-radius:50%; width:40px; height:40px;"><b>${name}</b>`;
        document.getElementById('group-list-container').appendChild(div);
        createGroupModal.classList.add('hidden');
    } else { alert("Please enter a group name"); }
});

document.getElementById('tictactoe-btn')?.addEventListener('click', () => alert("🎮 Tic-Tac-Toe requires a connected partner."));
document.getElementById('coinflip-btn')?.addEventListener('click', () => alert(`Flipping coin... \n\nResult: ${Math.random() > 0.5 ? "🪙 Heads!" : "🪙 Tails!"}`));

// ==========================================
// 7. POST FEED LOGIC & MEDIA ATTACHMENTS 
// ==========================================
const postInput = document.getElementById('post-input');
const submitPostBtn = document.getElementById('submit-post-btn');
const feedContainer = document.getElementById('feed-container');
let attachedImageURL = null;

const hiddenFileInput = document.createElement('input');
hiddenFileInput.type = 'file';
hiddenFileInput.accept = 'image/*';
hiddenFileInput.style.display = 'none';
document.body.appendChild(hiddenFileInput);

document.getElementById('post-image-btn')?.addEventListener('click', () => {
    hiddenFileInput.click();
});

hiddenFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            attachedImageURL = e.target.result;
            alert('📸 Image attached successfully! Type something and click "Post".');
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('post-gif-btn')?.addEventListener('click', () => {
    const gifUrl = prompt("Enter a GIF URL:");
    if (gifUrl) {
        attachedImageURL = gifUrl;
        alert('🎞️ GIF attached successfully!');
    }
});

document.getElementById('post-meme-btn')?.addEventListener('click', () => {
    alert("😂 Meme Creator is currently in Beta mode! Feature coming soon.");
});

// POST BUTTON CLICK HANDLER
if (submitPostBtn) {
    submitPostBtn.addEventListener('click', () => {
        const text = postInput ? postInput.value.trim() : '';

        if (text || attachedImageURL) {
            const postDiv = document.createElement('div');
            postDiv.className = 'feed-post';

            let textHTML = text ? `<p class="post-text-content">${text}</p>` : '';
            let mediaHTML = attachedImageURL ? `<img src="${attachedImageURL}" class="post-media-img">` : '';
            let safeName = currentUser ? currentUser.username : 'User';
            let safeDp = (currentUser && currentUser.dp) ? currentUser.dp : DEFAULT_DP;

            postDiv.innerHTML = `
                    <div class="post-header">
                        <div class="post-user-info">
                            <img src="${safeDp}" alt="User" class="post-user-dp">
                            <div>
                                <b>${safeName}</b>
                                <span>Just now</span>
                            </div>
                        </div>
                        <button class="delete-post-btn" title="Delete Post"><i class="fas fa-trash-alt"></i></button>
                    </div>
                    <div class="post-content">
                        ${textHTML}
                        ${mediaHTML}
                    </div>
                    <div class="post-footer">
                        <button class="like-btn" onclick="this.classList.toggle('liked'); if(this.classList.contains('liked')){ this.innerHTML='<i class=\\'fas fa-heart\\'></i> Liked'; this.style.color='#ef4444'; this.style.background='#fee2e2'; this.style.borderColor='#fca5a5'; } else { this.innerHTML='<i class=\\'far fa-heart\\'></i> Like'; this.style.color=''; this.style.background=''; this.style.borderColor=''; }"><i class="far fa-heart"></i> Like</button>
                        <button class="comment-btn"><i class="far fa-comment"></i> Comment</button>
                    </div>
                `;

            // Delete Event
            const deleteBtn = postDiv.querySelector('.delete-post-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm("Are you sure you want to delete this post?")) {
                        postDiv.remove();
                    }
                });
            }

            feedContainer.prepend(postDiv);

            if (postInput) postInput.value = '';
            attachedImageURL = null;
        } else {
            alert("⚠️ Please write something or attach an image to post!");
        }
    });
}
;
// 🔥 CLEAN GLOBAL CLICK LISTENER
    document.addEventListener('click', (e) => {
        // 1. World Chat Send Logic
        if (e.target.closest('#world-send-btn')) {
            const input = document.getElementById('world-message-input');
            if (input && input.value.trim() !== "") {
                // Yahan direct sendMessage logic call karo
                socket.emit('send_message', { sender: currentUser.username, text: input.value });
                input.value = ''; 
                console.log("Message sent to world!");
            }
        }

        // 2. Post Like Button
        if (e.target.closest('.like-btn')) {
            const btn = e.target.closest('.like-btn');
            btn.classList.toggle('liked');
            btn.style.color = btn.classList.contains('liked') ? '#ef4444' : '';
            btn.innerHTML = btn.classList.contains('liked') ? '<i class="fas fa-heart"></i> Liked' : '<i class="far fa-heart"></i> Like';
        }
        
        // 3. Delete Post
        if (e.target.closest('.delete-post-btn')) {
            if (confirm("Delete this post?")) {
                e.target.closest('.feed-post').remove();
            }
        }
    });