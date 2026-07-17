// =========================================================================
// 🔥 CHATTERBOX VIP ECOSYSTEM - CORE JAVASCRIPT MASTER ENGINE V37 🔥
// Privileges: SUPREME CORE ROOT OPERATOR
// Optimization: STRICTLY DISABLED. ANTI-CRASH SHIELD ACTIVE.
// Features: 20 Theme Library, 15 Dev Tools, Hierarchy System, AI, Rings
// =========================================================================

console.log("🔥 CHATTERBOX VIP ECOSYSTEM INTERFACE RUNTIME SYSTEMS ONLINE 🔥");

// =========================================================================
// 0. CORE DOM UTILITIES (SAFE WRAPPERS TO PREVENT CRASHES)
// =========================================================================
function safeEl(id) { 
    return document.getElementById(id); 
}

function sAdd(id, className) { 
    const el = safeEl(id); 
    if (el) {
        el.classList.add(className); 
    }
}

function sRem(id, className) { 
    const el = safeEl(id); 
    if (el) {
        el.classList.remove(className); 
    }
}

function sText(id, textValue) { 
    const el = safeEl(id); 
    if (el) {
        el.innerText = textValue; 
    }
}

function sHtml(id, htmlValue) { 
    const el = safeEl(id); 
    if (el) {
        el.innerHTML = htmlValue; 
    }
}

function sVal(id, value) { 
    const el = safeEl(id); 
    if (el) {
        el.value = value; 
    }
}

function gVal(id) { 
    const el = safeEl(id); 
    return el ? el.value.trim() : ''; 
}

function sSrc(id, sourceUrl) { 
    const el = safeEl(id); 
    if (el) {
        el.src = sourceUrl; 
    }
}

// =========================================================================
// 1. DYNAMIC SYSTEM DATABASE & STATE VARIABLES
// =========================================================================
let currentUser = null;
let friends = [];
let friendRequests = [];
let bandRequests = [];
let posts = [];
let groups = [];
let systemBugReports = [];
let profileViews = 0;

// Persistent Chat History Database
let chatHistory = { 
    direct: {}, 
    group: {}, 
    world: [], 
    ai: [] 
};

// Security & Moderation Database (Saved in localStorage)
let bannedUsers = [];
let shadowBannedUsers = [];
let worldMutedUsers = [];
let worldBannedUsers = []; 
let serverStopped = false;

let activeChatUser = null;
let currentChatTab = 'general';
let currentRequestSubTab = 'accept';
let currentDevActionTarget = ''; 

let tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";
let attachedPostImage = null;

// Call System Variables
let activeCallTimerInterval = null;
let outgoingCallTimeout = null;
let currentCallSeconds = 0;
let localMediaStreamTracker = null;
let isLocalCamOn = true;
let isLocalMicOn = true;
let activeEmojiTargetId = null;

const emojiLibrary = ["😀","😂","🤣","😊","😍","🥰","😘","😜","😎","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻","💀","👽","👾","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾","❤️","🔥","👍","👎","👏","🙌","👐","🤲","🤝","🙏","✌️","🤞","🖖","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐","🖖","👋","🤙","💪","🖕","✍️","🤳","💅","🙇","🙋","💁","🙆","🙅","🤷","🤦","🙍","🙎","🧏"];

const systemVerifiedUserDirectory = [
    { username: "Atifullah Azhar", uid: "62004377", dp: "https://ui-avatars.com/api/?name=Atifullah+Azhar&background=ffd700&color=000", bio: "Developer and Creator of Chatterbox VIP.", rank: "Developer", isDev: true },
    { username: "Chatterbox AI", uid: "00000007", dp: "https://ui-avatars.com/api/?name=AI&background=8b5cf6&color=fff", bio: "Your dedicated AI Intelligence assistant.", rank: "Verified AI Bot", isDev: false }
];

const socket = (typeof io !== 'undefined') ? io() : { on: () => { }, emit: () => { } };
const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";


// =========================================================================
// 2. MASTER INITIALIZATION & ANTI-CRASH DATA LOADER
// =========================================================================

function getSafeArray(key) {
    try {
        let parsed = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(parsed)) {
            return parsed;
        } else {
            return [];
        }
    } catch(e) { 
        return []; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Bootstrapping Chatterbox VIP Core Engine with Hierarchical Security...");

    try {
        currentUser = JSON.parse(localStorage.getItem('chatUser')) || null;
        friends = getSafeArray('chatFriends');
        friendRequests = getSafeArray('chatRequests');
        bandRequests = getSafeArray('bandRequests');
        posts = getSafeArray('chatPosts');
        groups = getSafeArray('chatGroups');
        systemBugReports = getSafeArray('chatBugReports');
        
        bannedUsers = getSafeArray('cb_bannedUsers');
        shadowBannedUsers = getSafeArray('cb_shadowBannedUsers');
        worldMutedUsers = getSafeArray('cb_worldMutedUsers');
        worldBannedUsers = getSafeArray('cb_worldBannedUsers');
        
        if (localStorage.getItem('cb_serverStopped') === 'true') {
            serverStopped = true;
        } else {
            serverStopped = false;
        }
        
        let loadedHistory = JSON.parse(localStorage.getItem('chatHistory'));
        if (loadedHistory) {
            chatHistory.direct = loadedHistory.direct || {};
            chatHistory.group = loadedHistory.group || {};
            chatHistory.world = loadedHistory.world || [];
            chatHistory.ai = loadedHistory.ai || [];
        }
        
        profileViews = parseInt(localStorage.getItem('chatProfileViews')) || 0;
        profileViews++; 
        localStorage.setItem('chatProfileViews', profileViews);
    } catch (error) { 
        console.error("CRITICAL: Database corrupted! Auto-cleaning to save app.", error); 
        localStorage.clear(); 
    }

    if (currentUser && currentUser.username) {
        // Stop Banned Users
        if (bannedUsers.includes(currentUser.username) || bannedUsers.includes(currentUser.uid)) {
            document.body.innerHTML = "<div style='display:flex; height:100vh; width:100vw; justify-content:center; align-items:center; background:#000; color:red; flex-direction:column;'><h1 style='font-size:4rem;'><i class='fas fa-ban'></i></h1><h2>YOU ARE PERMANENTLY BANNED FROM CHATTERBOX</h2><p>Contact the Developer if you think this is a mistake.</p></div>";
            return;
        }

        sRem('login-screen', 'active'); 
        sAdd('login-screen', 'hidden');
        sRem('main-app', 'hidden'); 
        sAdd('main-app', 'active');

        applySystemThemePalette(); 
        enforceHierarchyPermissions(); 
        updateProfileUI(); 
        renderContacts(); 
        updateBadgesAndCounts();
        renderPosts(); 
        renderGroups(); 
        renderBandRequests();
        
        setTimeout(() => { 
            loadChatHistoryToView('world'); 
            loadChatHistoryToView('ai');
        }, 500);

        socket.emit('user_connected', currentUser.username);
        
        initEmojiPickerEngine();
        attachRealVoiceNoteRecordingListeners();
        setupLiveSearchFilter();
        
        // Setup the 20 Theme Selectors
        setupThemeLibraryEngine();
        
    } else {
        sRem('login-screen', 'hidden'); 
        sAdd('login-screen', 'active');
        sRem('main-app', 'active'); 
        sAdd('main-app', 'hidden');
    }
});

// =========================================================================
// 3. CORE FUNCTIONS AND SECURITY HIERARCHY
// =========================================================================

window.saveData = function() {
    try {
        localStorage.setItem('chatUser', JSON.stringify(currentUser));
        localStorage.setItem('chatFriends', JSON.stringify(friends));
        localStorage.setItem('chatRequests', JSON.stringify(friendRequests));
        localStorage.setItem('chatPosts', JSON.stringify(posts));
        localStorage.setItem('chatGroups', JSON.stringify(groups));
        localStorage.setItem('bandRequests', JSON.stringify(bandRequests));
        localStorage.setItem('chatBugReports', JSON.stringify(systemBugReports));
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        
        localStorage.setItem('cb_bannedUsers', JSON.stringify(bannedUsers));
        localStorage.setItem('cb_shadowBannedUsers', JSON.stringify(shadowBannedUsers));
        localStorage.setItem('cb_worldMutedUsers', JSON.stringify(worldMutedUsers));
        localStorage.setItem('cb_worldBannedUsers', JSON.stringify(worldBannedUsers));
        localStorage.setItem('cb_serverStopped', serverStopped.toString());

        updateBadgesAndCounts();
    } catch(err) { 
        console.error("Storage Error:", err); 
    }
}

function applySystemThemePalette() {
    if (!currentUser) {
        return;
    }
    
    const btn = safeEl('activate-golden-theme-btn');
    
    if (currentUser.theme) {
        document.documentElement.setAttribute('data-theme', currentUser.theme);
        
        if (currentUser.theme === 'grand-golden') {
            document.body.classList.add('dev-theme-active');
            if(btn) {
                btn.innerText = 'Deactivate';
                btn.style.background = '#ef4444';
                btn.style.color = 'white';
                btn.style.border = 'none';
            }
        } else {
            document.body.classList.remove('dev-theme-active');
            if(btn) {
                btn.innerText = 'Activate';
                btn.style.background = 'transparent';
                btn.style.color = '#ffd700';
                btn.style.border = '1px solid #ffd700';
            }
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'default');
    }
}

function setupThemeLibraryEngine() {
    document.querySelectorAll('.theme-selection-box').forEach(box => {
        box.addEventListener('click', function() {
            const selectedTheme = this.getAttribute('data-theme-name');
            currentUser.theme = selectedTheme;
            document.documentElement.setAttribute('data-theme', selectedTheme);
            window.saveData();
            applySystemThemePalette();
            sAdd('theme-selector-modal', 'hidden');
            alert(`Premium Theme applied successfully!`);
        });
    });
}

// 👑 HIERARCHY ENGINE
function enforceHierarchyPermissions() {
    if (!currentUser) {
        return;
    }
    
    let rank = currentUser.rank || 'Member';
    const devNavItem = safeEl('dev-nav-item');
    const goldenOptionRow = safeEl('golden-theme-setting-row');
    const roleText = safeEl('dev-status-role-text');

    document.querySelectorAll('.dev-box').forEach(box => {
        box.style.display = 'none';
    });

    if (rank === 'Developer') {
        if(devNavItem) {
            devNavItem.classList.remove('hidden');
        }
        if(goldenOptionRow) {
            goldenOptionRow.classList.remove('hidden');
        }
        if(roleText) {
            roleText.innerText = "SYSTEM STATUS: ACTIVE // ROLE: SUPREME DEVELOPER";
        }
        document.querySelectorAll('.dev-box').forEach(box => {
            box.style.display = 'block';
        });
    } 
    else if (rank === 'Operator') {
        if(devNavItem) {
            devNavItem.classList.remove('hidden');
        }
        if(goldenOptionRow) {
            goldenOptionRow.classList.remove('hidden');
        }
        if(roleText) {
            roleText.innerText = "SYSTEM STATUS: ACTIVE // ROLE: OPERATOR";
        }
        ['dev-ban-btn', 'dev-unban-btn', 'dev-mute-world-btn', 'dev-unmute-world-btn', 'dev-ban-world-btn', 'dev-unban-world-btn'].forEach(id => {
            if(safeEl(id)) {
                safeEl(id).style.display = 'block';
            }
        });
    }
    else if (rank === 'Moderator') {
        if(devNavItem) {
            devNavItem.classList.remove('hidden');
        }
        if(goldenOptionRow) {
            goldenOptionRow.classList.add('hidden'); 
        }
        if(roleText) {
            roleText.innerText = "SYSTEM STATUS: ACTIVE // ROLE: MODERATOR";
        }
        ['dev-mute-world-btn', 'dev-unmute-world-btn', 'dev-ban-world-btn', 'dev-unban-world-btn'].forEach(id => {
            if(safeEl(id)) {
                safeEl(id).style.display = 'block';
            }
        });
    }
    else if (rank === 'Manager') {
        if(devNavItem) {
            devNavItem.classList.add('hidden'); 
        }
        if(goldenOptionRow) {
            goldenOptionRow.classList.add('hidden');
        }
    }
    else {
        if(devNavItem) {
            devNavItem.classList.add('hidden');
        }
        if(goldenOptionRow) {
            goldenOptionRow.classList.add('hidden');
        }
    }
}

// -------------------------------------------------------------------------
// FEED, GROUPS, BONDS
// -------------------------------------------------------------------------
function renderPosts() {
    const postsOutputContainerElement = safeEl('feed-container');
    if (!postsOutputContainerElement) {
        return;
    }
    postsOutputContainerElement.innerHTML = '';
    
    if (posts.length === 0) {
        postsOutputContainerElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-weight:bold; padding:40px; border:2px dashed var(--border-color); border-radius:20px; background:var(--bg-panel); margin-top:20px;">No feed content posts generated yet. Be the first to share an update!</p>`; 
        return;
    }

    posts.forEach(function (postObject) {
        let renderedImageHtmlString = postObject.image ? `<img src="${postObject.image}" class="post-media-img" style="margin-top:12px; border-radius:14px; width:100%;">` : '';
        let renderedTagsHtmlString = (postObject.tags && postObject.tags.length > 0) ? `<div style="color: var(--primary-color); font-weight: bold; margin-top: 8px; font-size:0.9rem;">${postObject.tags.join(' ')}</div>` : '';
        let renderedDeleteButtonHtmlString = postObject.user === currentUser.username ? `<button class="delete-post-btn" style="background:transparent; color:var(--text-muted); box-shadow:none; padding:8px;"><i class="fas fa-trash-alt"></i></button>` : '';
        let renderedTextContentHtmlString = postObject.text ? `<div class="post-text-content" style="margin-top:15px; font-size:1.1rem; line-height:1.6; color:var(--text-main); font-weight:600; white-space:pre-wrap;">${postObject.text}</div>` : '';

        postsOutputContainerElement.innerHTML += `
            <div class="feed-post" data-id="${postObject.id}" style="background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 20px; padding: 25px; margin-top:20px;">
                <div class="post-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <div class="post-user-info" style="display:flex; align-items:center; gap:12px;">
                        <img src="${postObject.dp || DEFAULT_DP}" class="post-user-dp" style="width:48px; height:48px; border-radius:50%; border:2px solid var(--primary-color); padding:2px;">
                        <div>
                            <b style="font-size:1.15rem; color:var(--text-main); display:block;">${postObject.user}</b>
                            <span style="color:var(--text-muted); font-size:0.8rem; font-weight:700; display:block; margin-top:2px;">${postObject.time} (${postObject.scope.toUpperCase()})</span>
                        </div>
                    </div>
                    ${renderedDeleteButtonHtmlString}
                </div>
                ${renderedTextContentHtmlString}
                ${renderedTagsHtmlString}
                ${renderedImageHtmlString}
                <div class="post-footer" style="margin-top:15px; border-top:1px solid var(--bg-main); padding-top:15px;">
                    <button class="action-btn like-btn" style="border-radius:20px; padding:8px 18px; font-size:0.85rem;"><i class="far fa-heart"></i> Like This Post</button>
                </div>
            </div>`;
    });
}

function renderGroups() {
    const groupsOutputContainerElement = safeEl('group-list-container');
    if (!groupsOutputContainerElement) {
        return;
    }
    
    groupsOutputContainerElement.innerHTML = '';
    
    if (groups.length === 0) {
        groupsOutputContainerElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px; font-weight:bold;">Zero active groups or network channels created yet.</p>`; 
        return;
    }

    groups.forEach(function (groupObject) {
        let processedIconSourceUrl = groupObject.icon || `https://ui-avatars.com/api/?name=${groupObject.name}&background=a855f7&color=fff`;
        groupsOutputContainerElement.innerHTML += `
            <div class="dummy-item group-item" data-group="${groupObject.name}" style="padding:15px; background:var(--bg-panel); border:1px solid rgba(0,0,0,0.02); border-radius:14px; display:flex; align-items:center; gap:12px; margin-bottom:8px; cursor:pointer;">
                <img src="${processedIconSourceUrl}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:1px solid var(--border-color); padding:2px;">
                <div>
                    <b style="font-size:1.1rem; color:var(--text-main); display:block;">${groupObject.name}</b>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Creator Status: @${groupObject.createdBy || 'System Admin'}</span>
                </div>
            </div>`;
    });
}

function renderBandRequests() {
    const bandOutputContainerElement = safeEl('band-incoming-requests');
    const emptyStatePlaceholderElement = safeEl('band-incoming-requests-empty-placeholder-string-element');
    
    if (!bandOutputContainerElement) {
        return;
    }
    
    bandOutputContainerElement.innerHTML = '';

    if (bandRequests.length === 0) {
        if (emptyStatePlaceholderElement) {
            emptyStatePlaceholderElement.classList.remove('hidden');
        }
        bandOutputContainerElement.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 15px; font-weight:bold;">There are currently zero pending Friendship Bond synchronization requests.</p>`; 
        return;
    }
    
    if (emptyStatePlaceholderElement) {
        emptyStatePlaceholderElement.classList.add('hidden');
    }

    bandRequests.forEach(function (bandRequestObject) {
        bandOutputContainerElement.innerHTML += `
            <div class="dummy-item" data-user="${bandRequestObject.username}" style="margin-top:10px; background:var(--bg-main); padding: 15px; border: 1px solid var(--border-color); border-radius:14px; display:flex; align-items:center; justify-content:space-between; gap:15px;">
                <b style="flex:1; font-size:1rem; color:var(--text-main);"><i class="fas fa-handshake" style="color:var(--primary-color); margin-right:6px;"></i> Incoming Bond Request received from target: @${bandRequestObject.username}</b>
                <button class="btn-accept-band btn-accept" style="width:45px; height:45px; border-radius:50%; background:#10b981; color:#fff;" title="Accept Friendship Bond Connection"><i class="fas fa-check"></i></button>
            </div>`;
    });
}

function renderMessageToDOM(msgObj, containerElement) {
    if(!containerElement) {
        return;
    }
    
    const div = document.createElement('div');
    
    if (msgObj.isMe) {
        div.className = "message-bubble my-msg";
        div.innerHTML = `<button class="unsend-btn" data-id="${msgObj.id}" title="Unsend Message"><i class="fas fa-times"></i></button><strong>Me:</strong> ${msgObj.text}`;
    } else {
        div.className = "message-bubble other-msg";
        if(msgObj.sender === 'SYSTEM') { 
            div.innerHTML = `${msgObj.text}`; 
        } else { 
            div.innerHTML = `<strong>${msgObj.sender}:</strong> ${msgObj.text}`; 
        }
    }
    
    containerElement.appendChild(div);
    containerElement.scrollTop = containerElement.scrollHeight;
}

function loadChatHistoryToView(type, targetName = null) {
    let area;
    let messages = [];
    
    try {
        if (type === 'world') {
            area = safeEl('world-messages-area');
            if (area) {
                area.innerHTML = '<div class="message-bubble system-msg">🤖 Notice: Welcome to World Chat. Be respectful.</div>';
            }
            messages = chatHistory.world || [];
        } else if (type === 'ai') {
            area = safeEl('ai-messages-area');
            if (area) {
                area.innerHTML = '<div class="message-bubble system-msg" style="align-self: center; background: rgba(139, 92, 246, 0.1); border: 1px dashed var(--primary-color); color: var(--text-main); max-width: 80%; border-radius: 12px; padding: 12px;">🤖 <strong>Welcome to Chatterbox AI!</strong><br>Main aapka friendly chatbot hoon. Mujhse aap kuch bhi pooch sakte hain.</div>';
            }
            messages = chatHistory.ai || [];
        } else if (type === 'direct') {
            area = safeEl('messages-area');
            if (area) {
                area.innerHTML = '';
            }
            messages = chatHistory.direct[targetName] || [];
        } else if (type === 'group') {
            area = safeEl('group-messages-area');
            if (area) {
                area.innerHTML = '';
            }
            messages = chatHistory.group[targetName] || [];
        }
        
        if (area && messages.length > 0) { 
            messages.forEach(msg => {
                renderMessageToDOM(msg, area);
            }); 
        }
    } catch(err) { 
        console.error("Error loading chat history:", err); 
    }
}

function sendMessageWithSave(type, htmlTextString, targetName = null) {
    try {
        // SECURITY SHIELDS
        if (serverStopped) { 
            alert("SYSTEM ALERT: The server has been stopped by the Administrator. Messaging is temporarily disabled."); 
            return; 
        }
        
        if (shadowBannedUsers.includes(currentUser.username) || shadowBannedUsers.includes(currentUser.uid)) {
            const msgObj = { id: Date.now(), text: htmlTextString, sender: currentUser.username, isMe: true };
            if (type === 'direct') { 
                renderMessageToDOM(msgObj, safeEl('messages-area')); 
            } 
            else if (type === 'group') { 
                renderMessageToDOM(msgObj, safeEl('group-messages-area')); 
            } 
            else if (type === 'world') { 
                renderMessageToDOM(msgObj, safeEl('world-messages-area')); 
            }
            return; 
        }
        
        if (type === 'world') {
            if (worldMutedUsers.includes(currentUser.username) || worldMutedUsers.includes(currentUser.uid)) {
                alert("SYSTEM MODERATION: You have been muted in World Chat. You cannot send messages."); 
                return;
            }
            if (worldBannedUsers.includes(currentUser.username) || worldBannedUsers.includes(currentUser.uid)) {
                alert("SYSTEM MODERATION: You are kicked from World Chat."); 
                return;
            }
        }

        const msgObj = { id: Date.now(), text: htmlTextString, sender: currentUser.username, isMe: true };
        let emitData = { type: type, text: htmlTextString, sender: currentUser.username };

        if (type === 'direct') {
            const targetUser = targetName || (activeChatUser ? activeChatUser.username : 'Unknown');
            if (!chatHistory.direct[targetUser]) {
                chatHistory.direct[targetUser] = [];
            }
            chatHistory.direct[targetUser].push(msgObj);
            emitData.to = targetUser;
            renderMessageToDOM(msgObj, safeEl('messages-area'));
        } else if (type === 'ai') {
            chatHistory.ai.push(msgObj);
            renderMessageToDOM(msgObj, safeEl('ai-messages-area'));
            simulateChatterboxAIResponse(htmlTextString);
        } else if (type === 'group') {
            const groupName = targetName || (safeEl('current-group-name') ? safeEl('current-group-name').innerText : 'Unknown Group');
            if (!chatHistory.group[groupName]) {
                chatHistory.group[groupName] = [];
            }
            chatHistory.group[groupName].push(msgObj);
            emitData.groupName = groupName;
            renderMessageToDOM(msgObj, safeEl('group-messages-area'));
        } else if (type === 'world') {
            chatHistory.world.push(msgObj);
            renderMessageToDOM(msgObj, safeEl('world-messages-area'));
        }
        
        window.saveData(); 
        if(type !== 'ai') {
            socket.emit('send_message', emitData);
        }
    } catch(err) { 
        console.error("Error sending message:", err); 
    }
}

function simulateChatterboxAIResponse(userMessage) {
    const area = safeEl('ai-messages-area');
    if(!area) {
        return;
    }

    const typingIndicator = document.createElement('div');
    typingIndicator.className = "message-bubble other-msg";
    typingIndicator.innerHTML = "<em>Chatterbox AI is thinking...</em>";
    area.appendChild(typingIndicator);
    area.scrollTop = area.scrollHeight;

    setTimeout(() => {
        typingIndicator.remove();
        let aiText = "";
        let lowerMsg = userMessage.toLowerCase();

        if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
            aiText = "Hello! I am Chatterbox AI. I am here to assist you with anything you need. How can I help you today?";
        } else if (lowerMsg.includes("who created you") || lowerMsg.includes("developer") || lowerMsg.includes("creator")) {
            aiText = "I was integrated into the Chatterbox VIP Ecosystem by the Supreme Root Operator, Atifullah Azhar.";
        } else if (lowerMsg.includes("theme") || lowerMsg.includes("dark mode")) {
            aiText = "You can change your appearance in the Settings tab using the Theme Library!";
        } else {
            aiText = "I have processed your query successfully. Currently I am running in local sandbox mode, but I am learning every day!";
        }

        const aiMsgObj = { id: Date.now(), text: aiText, sender: "Chatterbox AI", isMe: false };
        chatHistory.ai.push(aiMsgObj);
        window.saveData();
        renderMessageToDOM(aiMsgObj, area);

    }, 1500);
}

socket.on('receive_message', (data) => {
    try {
        if (!currentUser) {
            return;
        }
        
        const msgObj = { id: Date.now(), text: data.text, sender: data.sender, isMe: false };

        if (data.type === 'world') {
            if(data.text.includes("SYSTEM_WIPE")) { 
                chatHistory.world = []; 
                window.saveData(); 
                loadChatHistoryToView('world'); 
                return; 
            }
            if(data.text.includes("SERVER_STOP")) { 
                serverStopped = true; 
                window.saveData(); 
                return; 
            }
            if(data.text.includes("SERVER_START")) { 
                serverStopped = false; 
                window.saveData(); 
                return; 
            }
            
            chatHistory.world.push(msgObj); 
            window.saveData();
            
            const area = safeEl('world-messages-area');
            if (area && data.sender !== currentUser.username) {
                renderMessageToDOM(msgObj, area);
            }
        }
        else if (data.type === 'direct' && data.to === currentUser.username) {
            if (!chatHistory.direct[data.sender]) {
                chatHistory.direct[data.sender] = [];
            }
            
            chatHistory.direct[data.sender].push(msgObj); 
            window.saveData();
            
            if (activeChatUser && activeChatUser.username === data.sender) {
                const area = safeEl('messages-area');
                if (area) {
                    renderMessageToDOM(msgObj, area);
                }
            } else { 
                alert(`📩 New Message from ${data.sender}`); 
            }
        }
        else if (data.type === 'group') {
            const isMember = groups.some(g => g.name === data.groupName);
            if (isMember) {
                if (!chatHistory.group[data.groupName]) {
                    chatHistory.group[data.groupName] = [];
                }
                chatHistory.group[data.groupName].push(msgObj); 
                window.saveData();
                
                const area = safeEl('group-messages-area');
                if (area && safeEl('current-group-name').innerText === data.groupName && data.sender !== currentUser.username) {
                    renderMessageToDOM(msgObj, area);
                }
            }
        }
    } catch(err) { 
        console.error("Socket Receive Error:", err); 
    }
});

// =========================================================================
// 4. CALLING ENGINE & WEB-RTC SIMULATION (SILENT ROOMS)
// =========================================================================
function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateCallTimers() {
    currentCallSeconds++;
    const timeStr = formatTime(currentCallSeconds);
    sText('call-duration-timer', timeStr); 
    sText('minimized-call-timer-display', timeStr);
}

window.initiateOutgoingCall = function(isVideo) {
    sAdd('incoming-call-ring-modal', 'hidden'); 
    sRem('active-call-window', 'hidden');
    sText('call-duration-timer', 'Calling...'); 
    initLocalCameraStream(isVideo, true, 'direct');
}

async function initLocalCameraStream(isVideoCall, isOutgoing = false, chatType = 'direct') {
    const gridContainer = safeEl('call-grid-container');
    gridContainer.className = 'call-grid-wrapper'; 
    gridContainer.innerHTML = ''; 

    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("MediaDevices blocked.");
        }
        
        localMediaStreamTracker = await navigator.mediaDevices.getUserMedia({ video: isVideoCall, audio: true });
        isLocalCamOn = isVideoCall; 
        isLocalMicOn = true;
    } catch (error) {
        console.warn("Camera/Mic Error:", error); 
        isLocalCamOn = false; 
        isLocalMicOn = false;
    }

    let rName = 'Unknown Peer'; 
    let rDp = DEFAULT_DP;
    
    if (chatType === 'direct') { 
        rName = activeChatUser ? activeChatUser.username : 'Unknown Peer'; 
        rDp = activeChatUser ? activeChatUser.dp : DEFAULT_DP; 
    } 
    else if (chatType === 'group') { 
        rName = safeEl('current-group-name') ? safeEl('current-group-name').innerText : 'Group Room'; 
        rDp = 'https://ui-avatars.com/api/?name=G&background=a855f7&color=fff'; 
    } 
    else if (chatType === 'world') { 
        rName = '🌍 Global Stage'; 
        rDp = 'https://ui-avatars.com/api/?name=W&background=8b5cf6&color=fff'; 
    }
    
    sSrc('minimized-caller-dp', rDp);

    // DYNAMIC INSTAGRAM GRID INJECTION
    if (chatType === 'direct') {
        gridContainer.classList.add('call-grid-2');
        gridContainer.innerHTML = `
            <div class="call-video-cell">
                <div class="avatar-fallback">
                    <img src="${rDp}" style="width:140px; height:140px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:4px solid var(--primary-color);">
                    <h2 style="color:white; font-size:1.8rem; text-shadow: 0 2px 5px rgba(0,0,0,0.8);">${rName}</h2>
                </div>
            </div>
            <div class="call-video-cell">
                <video id="local-video" autoplay muted playsinline style="transform: scaleX(-1); display:${isLocalCamOn?'block':'none'};"></video>
                <div class="avatar-fallback" id="local-audio-fallback" style="display:${isLocalCamOn?'none':'flex'}; background:#111;">
                    <img src="${currentUser.dp}" style="width:140px; height:140px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:4px solid #10b981;">
                    <h2 style="color:white; font-size:1.8rem; text-shadow: 0 2px 5px rgba(0,0,0,0.8);">You</h2>
                </div>
            </div>
        `;
    } else {
        // Group & World Call -> 4-Way Grid Layout (Simulation)
        gridContainer.classList.add('call-grid-4');
        let p1 = "https://ui-avatars.com/api/?name=User1&background=random";
        let p2 = "https://ui-avatars.com/api/?name=User2&background=random";
        let p3 = "https://ui-avatars.com/api/?name=User3&background=random";
        
        gridContainer.innerHTML = `
            <div class="call-video-cell">
                <div class="avatar-fallback">
                    <img src="${p1}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--primary-color);">
                    <span class="call-user-label">Peer 1</span>
                </div>
            </div>
            <div class="call-video-cell">
                <div class="avatar-fallback" style="background:#1a1a1a;">
                    <img src="${p2}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--primary-color);">
                    <span class="call-user-label">Peer 2</span>
                </div>
            </div>
            <div class="call-video-cell">
                <div class="avatar-fallback" style="background:#0f0f0f;">
                    <img src="${p3}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--primary-color);">
                    <span class="call-user-label">Peer 3</span>
                </div>
            </div>
            <div class="call-video-cell">
                <video id="local-video" autoplay muted playsinline style="transform: scaleX(-1); display:${isLocalCamOn?'block':'none'};"></video>
                <div class="avatar-fallback" id="local-audio-fallback" style="display:${isLocalCamOn?'none':'flex'}; background:#111;">
                    <img src="${currentUser.dp}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid #10b981;">
                    <span class="call-user-label">You</span>
                </div>
            </div>
        `;
    }

    const localVideoNode = safeEl('local-video');
    if (localVideoNode && isLocalCamOn && localMediaStreamTracker) { 
        localVideoNode.srcObject = localMediaStreamTracker; 
    }

    if(isOutgoing && chatType === 'direct') {
        outgoingCallTimeout = setTimeout(() => { 
            currentCallSeconds = 0; 
            updateCallTimers(); 
            activeCallTimerInterval = setInterval(updateCallTimers, 1000); 
        }, 3000);
    } else {
        currentCallSeconds = 0; 
        updateCallTimers(); 
        activeCallTimerInterval = setInterval(updateCallTimers, 1000);
    }
}

function terminateActiveCall() {
    if (activeCallTimerInterval) {
        clearInterval(activeCallTimerInterval);
    }
    if (outgoingCallTimeout) {
        clearTimeout(outgoingCallTimeout);
    }
    if (localMediaStreamTracker) { 
        localMediaStreamTracker.getTracks().forEach(track => track.stop()); 
        localMediaStreamTracker = null; 
    }
    if (safeEl('local-video')) {
        safeEl('local-video').srcObject = null;
    }
    
    sAdd('active-call-window', 'hidden'); 
    sAdd('minimized-call-widget', 'hidden'); 
    sAdd('incoming-call-ring-modal', 'hidden'); 
    sText('call-duration-timer', '00:00');
}

// =========================================================================
// 5. EMOJI, VOICE RECORDER, PUBLIC PROFILE & GLOBAL SEARCH
// =========================================================================
function initEmojiPickerEngine() {
    const grid = safeEl('emoji-grid-container');
    if(!grid) {
        return;
    }
    
    grid.innerHTML = "";
    
    emojiLibrary.forEach(emoji => {
        const span = document.createElement('span'); 
        span.className = 'emoji-item'; 
        span.innerText = emoji;
        span.onclick = () => {
            if(activeEmojiTargetId) {
                const inputEl = safeEl(activeEmojiTargetId);
                if(inputEl) { 
                    inputEl.value += emoji; 
                    inputEl.focus(); 
                }
            }
        };
        grid.appendChild(span);
    });
}

function attachRealVoiceNoteRecordingListeners() {
    const voiceBtns = [
        { id: 'voice-note-btn', emitType: 'direct' }, 
        { id: 'group-voice-note-btn', emitType: 'group' }, 
        { id: 'world-voice-note-btn', emitType: 'world' }
    ];

    voiceBtns.forEach(btnData => {
        const btnNode = safeEl(btnData.id);
        if(!btnNode) {
            return;
        }
        
        let mediaRecorder;
        let audioChunks = [];
        let isRecording = false;
        
        const startRecord = async (e) => {
            e.preventDefault();
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    return;
                }
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start(); 
                isRecording = true;
                btnNode.classList.add('recording-active');
                
                mediaRecorder.addEventListener("dataavailable", e => { 
                    audioChunks.push(e.data); 
                });
            } catch(err) { 
                console.error("Mic error:", err); 
            }
        };

        const stopRecord = (e) => {
            e.preventDefault();
            if(!isRecording || !mediaRecorder || mediaRecorder.state === "inactive") {
                return;
            }
            
            isRecording = false; 
            btnNode.classList.remove('recording-active');
            
            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                audioChunks = [];
                const reader = new FileReader(); 
                
                reader.readAsDataURL(audioBlob);
                
                reader.onloadend = () => {
                    const base64Audio = reader.result;
                    const audioHtml = `<audio src="${base64Audio}" controls style="height:35px; max-width:220px; outline:none; border-radius:20px; background:rgba(0,0,0,0.1); padding:2px;"></audio>`;
                    const targetName = btnData.emitType === 'group' ? safeEl('current-group-name').innerText : (activeChatUser ? activeChatUser.username : null);
                    sendMessageWithSave(btnData.emitType, audioHtml, targetName);
                };
            });
            
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(t => track.stop()); 
        };

        btnNode.addEventListener('mousedown', startRecord); 
        btnNode.addEventListener('mouseup', stopRecord);
        btnNode.addEventListener('mouseleave', stopRecord); 
        btnNode.addEventListener('touchstart', startRecord, {passive: false});
        btnNode.addEventListener('touchend', stopRecord);
    });
}

function findUserGlobally(targetUsername) {
    let rootUser = systemVerifiedUserDirectory.find(x => x.username === targetUsername || x.uid === targetUsername);
    if(rootUser) {
        return rootUser;
    }
    
    let localReg = JSON.parse(localStorage.getItem('chatterbox_users_registry')) || [];
    let lu = localReg.find(x => x.username === targetUsername || x.uid === targetUsername);
    
    if(lu) { 
        return { 
            username: lu.username, 
            uid: lu.uid || "00000000", 
            dp: `https://ui-avatars.com/api/?name=${lu.username}&background=random&color=fff`, 
            rank: 'Member', 
            bio: "Hey there! I am using Chatterbox VIP.", 
            isDev: false 
        }; 
    }
    return null;
}

function renderGlobalUsersList(searchTerm = '') {
    const container = safeEl('global-users-list-container');
    if (!container) {
        return;
    }
    
    container.innerHTML = '';
    let localRegistry = JSON.parse(localStorage.getItem('chatterbox_users_registry')) || [];
    let allUsers = [...systemVerifiedUserDirectory];
    
    localRegistry.forEach(u => {
        if(!allUsers.find(su => su.username === u.username)) {
            allUsers.push({ 
                username: u.username, 
                uid: u.uid || '00000000', 
                rank: 'Member', 
                dp: `https://ui-avatars.com/api/?name=${u.username}&background=random&color=fff` 
            });
        }
    });

    if(currentUser) {
        allUsers = allUsers.filter(u => u.username !== currentUser.username);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        allUsers = allUsers.filter(u => u.username.toLowerCase().includes(term) || (u.uid && u.uid.includes(term)));
    }

    if(allUsers.length === 0) { 
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 20px;">No users found.</p>`; 
        return; 
    }

    allUsers.forEach(u => {
        let actionBtnHtml = u.username === "Chatterbox AI" ? "" : `<button class="primary-btn action-dispatch-global-req-btn" data-username="${u.username}" style="padding: 8px 14px; font-size:0.9rem; border-radius:10px;"><i class="fas fa-user-plus"></i></button>`;
        
        container.innerHTML += `
            <div class="global-user-item" data-username="${u.username}" style="cursor: pointer;">
                <img src="${u.dp}" style="width:42px; height:42px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color);">
                <div style="flex:1; margin-left:12px;">
                    <b style="font-size:1.05rem; color:var(--text-main); display:block;">${u.username}</b>
                    <span style="font-size:0.8rem; color:var(--primary-color); font-weight:800; font-family:monospace;">UID: #${u.uid}</span>
                </div>
                ${actionBtnHtml}
            </div>`;
    });
}

function setupLiveSearchFilter() {
    const searchInput = safeEl('chat-sidebar-search-input');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            if(currentChatTab === 'requests' && currentRequestSubTab === 'send') {
                renderGlobalUsersList(e.target.value);
            }
        });
    }
}

// =========================================================================
// 6. UI UPDATES & PROFILE PREVIEW RENDERING METHODS (NEW DESIGN CLASSES)
// =========================================================================

function updateProfileUI() {
    if (!currentUser) {
        return;
    }
    
    sText('display-username', currentUser.username); 
    sText('user-bio', currentUser.bio || "No biography details available.");
    sSrc('user-dp', currentUser.dp || DEFAULT_DP); 
    
    sText('display-uid', `UID: #${currentUser.uid || '00000000'}`);

    if (currentUser.banner) { 
        sSrc('banner-img', currentUser.banner); 
        sRem('banner-img', 'hidden'); 
    } else { 
        sAdd('banner-img', 'hidden'); 
    }
    
    sText('display-rank', currentUser.rank || 'Member');

    const usernameTextDisplayElement = safeEl('display-username');
    const rankBadgeDisplayElement = safeEl('display-rank');

    if (currentUser.isDev || currentUser.rank === 'Developer') {
        if (usernameTextDisplayElement) {
            usernameTextDisplayElement.classList.add('shiny-dev-text');
        }
        if (rankBadgeDisplayElement) {
            rankBadgeDisplayElement.className = 'new-pill rank-pill rank-badge rank-developer';
        }
        sRem('dev-nav-item', 'hidden'); 
    } 
    else if (currentUser.rank === 'Operator') {
        if (usernameTextDisplayElement) {
            usernameTextDisplayElement.style.textShadow = '0 0 10px silver';
        }
        if (rankBadgeDisplayElement) {
            rankBadgeDisplayElement.className = 'new-pill rank-pill rank-badge';
        }
        sRem('dev-nav-item', 'hidden');
    }
    else if (currentUser.rank === 'Moderator') {
        if (usernameTextDisplayElement) {
            usernameTextDisplayElement.style.textShadow = '0 0 10px red';
        }
        if (rankBadgeDisplayElement) {
            rankBadgeDisplayElement.className = 'new-pill rank-pill rank-badge';
        }
        sRem('dev-nav-item', 'hidden');
    }
    else {
        if (usernameTextDisplayElement) { 
            usernameTextDisplayElement.classList.remove('shiny-dev-text'); 
            usernameTextDisplayElement.style.textShadow = 'none'; 
        }
        if (rankBadgeDisplayElement) {
            rankBadgeDisplayElement.className = 'new-pill rank-pill rank-badge rank-member';
        }
    }
    
    sText('total-friends-count', friends.length);
    sText('profile-visitor-numerical-counter-view', profileViews);
}

function updateBadgesAndCounts() {
    if (currentUser) {
        sText('total-friends-count', friends.length);
    }
}

function renderContacts() {
    const contactListOutputContainerElement = safeEl('contact-list-container');
    if (!contactListOutputContainerElement) {
        return;
    }
    
    contactListOutputContainerElement.innerHTML = '';
    
    let processedListToRenderArray = currentChatTab === 'favorite' ? friends.filter(f => f.isFavorite === true) : friends;

    if (processedListToRenderArray.length === 0) {
        contactListOutputContainerElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.95rem; font-weight:bold; padding:25px;">No active friends found.</p>`; 
        return;
    }

    processedListToRenderArray.forEach(function (friendObject) {
        let renderedStarIconHtmlString = friendObject.isFavorite ? `<i class="fas fa-star" style="color:#f59e0b; margin-left: 6px;"></i>` : '';
        contactListOutputContainerElement.innerHTML += `
            <div class="dummy-item contact-item" data-user="${friendObject.username}" style="border: 1px solid rgba(0,0,0,0.02); background: var(--bg-panel); border-radius:14px; margin-bottom:8px; display:flex; align-items:center; gap:12px; padding:12px; cursor:pointer;">
                <img src="${friendObject.dp || DEFAULT_DP}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color);">
                <div style="display:flex; flex-direction:column; flex:1;">
                    <b style="font-size:1.1rem; color:var(--text-main);">${friendObject.username} ${renderedStarIconHtmlString}</b>
                    <span style="font-size:0.8rem; color:var(--system-success); font-weight:bold;"><i class="fas fa-circle" style="font-size:0.5rem; margin-right:3px;"></i> Online Status Active</span>
                </div>
            </div>`;
    });
}

function renderRequestSubTabUI() {
    const subTabOutputContainerElement = safeEl('contact-list-container');
    if (!subTabOutputContainerElement) {
        return;
    }
    
    subTabOutputContainerElement.innerHTML = '';

    const acceptTabSelectorBtnElement = safeEl('sub-tab-accept-btn'); 
    const sendTabSelectorBtnElement = safeEl('sub-tab-send-btn');
    
    if (currentRequestSubTab === 'accept') {
        if (acceptTabSelectorBtnElement) {
            acceptTabSelectorBtnElement.classList.add('active-sub-tab');
        }
        if (sendTabSelectorBtnElement) {
            sendTabSelectorBtnElement.classList.remove('active-sub-tab');
        }
        
        sAdd('search-friend-field-block', 'hidden');

        if (friendRequests.length === 0) { 
            subTabOutputContainerElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.9rem; font-weight:bold; padding:25px;">No pending incoming requests.</p>`; 
            return; 
        }

        friendRequests.forEach(function (requestObject) {
            subTabOutputContainerElement.innerHTML += `
                <div class="dummy-item global-user-item" data-username="${requestObject.username}" style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:14px; padding:12px; display:flex; align-items:center; gap:12px; margin-bottom:8px; cursor:pointer;">
                    <img src="${requestObject.dp || DEFAULT_DP}" style="width:42px; height:42px; border-radius:50%; object-fit:cover;">
                    <div style="flex:1;"><b style="font-size:1rem; color:var(--text-main); display:block;">${requestObject.username}</b></div>
                    <div class="req-action-btns">
                        <button class="btn-accept-friend btn-accept" style="color:#fff;"><i class="fas fa-check"></i></button>
                        <button class="btn-reject-friend btn-reject" style="color:#fff;"><i class="fas fa-times"></i></button>
                    </div>
                </div>`;
        });
    } else if (currentRequestSubTab === 'send') {
        if (acceptTabSelectorBtnElement) {
            acceptTabSelectorBtnElement.classList.remove('active-sub-tab');
        }
        if (sendTabSelectorBtnElement) {
            sendTabSelectorBtnElement.classList.add('active-sub-tab');
        }
        sRem('search-friend-field-block', 'hidden');
        renderGlobalUsersList(safeEl('chat-sidebar-search-input') ? safeEl('chat-sidebar-search-input').value : '');
    }
}

function showPublicProfileModal(userObj) {
    sSrc('modal-public-user-dp', userObj.dp || DEFAULT_DP); 
    sText('modal-public-user-name', userObj.username);
    sText('modal-public-user-uid', `UID: #${userObj.uid || '00000000'}`); 
    sText('modal-public-user-bio', userObj.bio || "No biography details available.");
    sText('modal-public-user-rank', userObj.rank || 'Member');
    
    if (userObj.banner) { 
        sSrc('modal-public-user-banner', userObj.banner); 
        sRem('modal-public-user-banner', 'hidden'); 
    } else { 
        sAdd('modal-public-user-banner', 'hidden'); 
    }

    const nameEl = safeEl('modal-public-user-name'); 
    const rankEl = safeEl('modal-public-user-rank');
    
    if (userObj.isDev || userObj.rank === 'Developer') {
        if(nameEl) {
            nameEl.classList.add('shiny-dev-text');
        }
        if(rankEl) {
            rankEl.className = 'new-pill rank-pill rank-badge rank-developer';
        }
    } else {
        if(nameEl) {
            nameEl.classList.remove('shiny-dev-text');
        }
        if(rankEl) {
            rankEl.className = 'new-pill rank-pill rank-badge rank-member';
        }
    }
    
    sRem('public-profile-modal', 'hidden');
}

function openRightProfilePreviewPane(selectedUserObj) {
    sAdd('chat-placeholder', 'hidden'); 
    sAdd('chat-header', 'hidden'); 
    sAdd('messages-area', 'hidden'); 
    sAdd('chat-input-area', 'hidden');
    sRem('request-profile-preview-pane', 'hidden');
    
    sSrc('preview-search-user-dp', selectedUserObj.dp || DEFAULT_DP); 
    sText('preview-search-user-name', selectedUserObj.username);
    sText('preview-search-user-uid', `UID: #${selectedUserObj.uid || '00000000'}`); 
    sText('preview-search-user-bio', selectedUserObj.bio || "No biography available."); 
    sText('preview-search-user-rank', selectedUserObj.rank || "Verified Member");
    
    if (selectedUserObj.banner) { 
        sSrc('preview-search-user-banner', selectedUserObj.banner); 
        sRem('preview-search-user-banner', 'hidden'); 
    } else { 
        sAdd('preview-search-user-banner', 'hidden'); 
    }

    const nameEl = safeEl('preview-search-user-name'); 
    const rankEl = safeEl('preview-search-user-rank'); 
    const btn = safeEl('action-dispatch-friend-request-btn');

    if (selectedUserObj.isDev || selectedUserObj.rank === 'Developer') {
        if(nameEl) {
            nameEl.classList.add('shiny-dev-text');
        }
        if(rankEl) {
            rankEl.className = 'new-pill rank-pill rank-badge rank-developer';
        }
    } else {
        if(nameEl) {
            nameEl.classList.remove('shiny-dev-text');
        }
        if(rankEl) {
            rankEl.className = 'new-pill rank-pill rank-badge rank-member';
        }
    }
    
    if (btn) {
        if(selectedUserObj.username === "Chatterbox AI") {
            btn.style.display = 'none'; 
        } else {
            btn.style.display = 'inline-flex';
            btn.onclick = () => { 
                alert(`Handshake request dispatched to ${selectedUserObj.username}!`); 
                resetRightWorkspacePane(); 
            }; 
        }
    }
}

function resetRightWorkspacePane() {
    sAdd('request-profile-preview-pane', 'hidden'); 
    sAdd('chat-header', 'hidden'); 
    sAdd('messages-area', 'hidden'); 
    sAdd('chat-input-area', 'hidden');
    sRem('chat-placeholder', 'hidden');
}


// =========================================================================
// 7. DEVELOPER TOOLS LOGIC ENGINES (15 FEATURES)
// =========================================================================

function openDevActionModal(title, actionType) {
    sText('dev-action-title', title);
    currentDevActionTarget = actionType;
    sVal('dev-action-target-input', '');
    sRem('dev-action-modal', 'hidden');
}

function executeDevAction() {
    const target = gVal('dev-action-target-input');
    
    if(!target) {
        return alert("Please enter a valid UID or Username.");
    }

    const isDev = currentUser.rank === 'Developer' || currentUser.isDev;
    const isOp = currentUser.rank === 'Operator';
    const isMod = currentUser.rank === 'Moderator';
    
    let targetUserObj = findUserGlobally(target);
    
    if(targetUserObj && (targetUserObj.rank === 'Developer' || targetUserObj.isDev)) {
        return alert("ACCESS DENIED: Supreme Developer accounts cannot be targeted by moderation tools.");
    }

    if(currentDevActionTarget === 'ban') {
        if(!isDev && !isOp) {
            return alert("Privilege Error");
        }
        bannedUsers.push(target); 
        window.saveData(); 
        alert(`User [${target}] has been PERMANENTLY BANNED.`);
    } 
    else if(currentDevActionTarget === 'unban') {
        if(!isDev && !isOp) {
            return alert("Privilege Error");
        }
        bannedUsers = bannedUsers.filter(x => x !== target); 
        window.saveData(); 
        alert(`User [${target}] UNBANNED.`);
    }
    else if(currentDevActionTarget === 'shadowban') {
        if(!isDev) {
            return alert("Privilege Error");
        }
        shadowBannedUsers.push(target); 
        window.saveData(); 
        alert(`User [${target}] SHADOW BANNED.`);
    }
    else if(currentDevActionTarget === 'shadowunban') {
        if(!isDev) {
            return alert("Privilege Error");
        }
        shadowBannedUsers = shadowBannedUsers.filter(x => x !== target); 
        window.saveData(); 
        alert(`User [${target}] SHADOW UNBANNED.`);
    }
    else if(currentDevActionTarget === 'mute_world') {
        if(!isDev && !isOp && !isMod) {
            return alert("Privilege Error");
        }
        worldMutedUsers.push(target); 
        window.saveData(); 
        alert(`User [${target}] MUTED in World Chat.`);
    }
    else if(currentDevActionTarget === 'unmute_world') {
        if(!isDev && !isOp && !isMod) {
            return alert("Privilege Error");
        }
        worldMutedUsers = worldMutedUsers.filter(x => x !== target); 
        window.saveData(); 
        alert(`User [${target}] UNMUTED in World Chat.`);
    }
    else if(currentDevActionTarget === 'ban_world') {
        if(!isDev && !isOp && !isMod) {
            return alert("Privilege Error");
        }
        worldBannedUsers.push(target); 
        window.saveData(); 
        alert(`User [${target}] KICKED/BANNED from World Chat.`);
    }
    else if(currentDevActionTarget === 'unban_world') {
        if(!isDev && !isOp && !isMod) {
            return alert("Privilege Error");
        }
        worldBannedUsers = worldBannedUsers.filter(x => x !== target); 
        window.saveData(); 
        alert(`User [${target}] ALLOWED back in World Chat.`);
    }
    else if(currentDevActionTarget === 'peak') {
        if(!isDev) {
            return alert("Privilege Error");
        }
        if(chatHistory.direct[target]) {
            alert(`PEAK HISTORY for [${target}]:\n\n` + JSON.stringify(chatHistory.direct[target], null, 2));
        } else {
            alert(`No direct chat history found for [${target}].`);
        }
    }
    
    sAdd('dev-action-modal', 'hidden');
}

function generateProfileRings() {
    const container = safeEl('ring-grid-container');
    
    if(!container) {
        return;
    }
    
    container.innerHTML = '';
    
    for(let i = 1; i <= 100; i++) {
        let r1 = Math.floor(Math.random() * 255); 
        let g1 = Math.floor(Math.random() * 255); 
        let b1 = Math.floor(Math.random() * 255);
        
        let r2 = Math.floor(Math.random() * 255); 
        let g2 = Math.floor(Math.random() * 255); 
        let b2 = Math.floor(Math.random() * 255);
        
        let grad = `linear-gradient(45deg, rgb(${r1},${g1},${b1}), rgb(${r2},${g2},${b2}))`;
        
        let ringDiv = document.createElement('div');
        ringDiv.style.width = '100%'; 
        ringDiv.style.aspectRatio = '1'; 
        ringDiv.style.borderRadius = '50%';
        ringDiv.style.background = grad; 
        ringDiv.style.cursor = 'pointer'; 
        ringDiv.style.border = '2px solid transparent';
        
        ringDiv.onclick = function() {
            document.querySelectorAll('#ring-grid-container div').forEach(d => {
                d.style.border = '2px solid transparent';
            });
            this.style.border = '3px solid white';
            localStorage.setItem('temp_selected_ring', grad);
        };
        
        container.appendChild(ringDiv);
    }
}


// =========================================================================
// 8. GLOBAL EVENT DELEGATION SYSTEM (ANTI-CRASH BULLETPROOF)
// =========================================================================

document.addEventListener('click', (eventObject) => {
    try {
        const target = eventObject.target;
        
        if (!target || typeof target.closest !== 'function') {
            return;
        }

        if (target.id === 'join-btn' || target.closest('#join-btn')) {
            return;
        }

        // -------------------------------------------------------------
        // NEW THEME LIBRARY MODAL TRIGGER
        // -------------------------------------------------------------
        if (target.closest('#open-theme-modal-btn')) {
            sRem('theme-selector-modal', 'hidden');
            return;
        }

        // -------------------------------------------------------------
        // DEVELOPER TOOLS EVENT BINDINGS
        // -------------------------------------------------------------
        if (target.closest('#activate-dev-mode-btn')) {
            const secret = gVal('settings-dev-code-input');
            if (secret === '6200437705AT') {
                currentUser.rank = 'Developer'; 
                currentUser.isDev = true; 
                currentUser.theme = 'grand-golden'; 
                window.saveData(); 
                alert("Supreme Root Access Granted! You are now a Developer. Reloading ecosystem..."); 
                window.location.reload();
            } else { 
                alert("Invalid Developer Code."); 
            } 
            return;
        }

        if (target.closest('#dev-rank-btn')) { 
            sVal('dev-rank-target-input', ''); 
            sRem('dev-rank-modal', 'hidden'); 
            return; 
        }
        
        if (target.closest('#confirm-dev-rank-btn')) {
            let tUser = gVal('dev-rank-target-input'); 
            let nRank = safeEl('dev-rank-select').value;
            
            if(!tUser) {
                return alert("Enter target.");
            }
            
            alert(`Rank Update Dispatched: [${tUser}] is now a ${nRank}.`);
            sAdd('dev-rank-modal', 'hidden'); 
            return;
        }

        if (target.closest('#dev-ban-btn')) { 
            openDevActionModal('Ban User', 'ban'); 
            return; 
        }
        
        if (target.closest('#dev-unban-btn')) { 
            openDevActionModal('Unban User', 'unban'); 
            return; 
        }
        
        if (target.closest('#dev-shadowban-btn')) { 
            openDevActionModal('Shadow Ban User', 'shadowban'); 
            return; 
        }
        
        if (target.closest('#dev-shadowunban-btn')) { 
            openDevActionModal('Shadow Unban User', 'shadowunban'); 
            return; 
        }
        
        if (target.closest('#dev-mute-world-btn')) { 
            openDevActionModal('Mute From World', 'mute_world'); 
            return; 
        }
        
        if (target.closest('#dev-unmute-world-btn')) { 
            openDevActionModal('Unmute From World', 'unmute_world'); 
            return; 
        }
        
        if (target.closest('#dev-ban-world-btn')) { 
            openDevActionModal('Kick From World', 'ban_world'); 
            return; 
        }
        
        if (target.closest('#dev-unban-world-btn')) { 
            openDevActionModal('Allow In World', 'unban_world'); 
            return; 
        }
        
        if (target.closest('#dev-peak-btn')) { 
            openDevActionModal('Peak Chat History', 'peak'); 
            return; 
        }
        
        if (target.id === 'confirm-dev-action-btn') { 
            executeDevAction(); 
            return; 
        }

        if (target.closest('#dev-format-btn')) {
            if(confirm("Format Server Cache? This deletes posts and temp variables but keeps users.")) {
                localStorage.removeItem('chatPosts'); 
                localStorage.removeItem('chatHistory');
                alert("Format Complete. Reloading..."); 
                window.location.reload();
            }
            return;
        }

        if (target.closest('#dev-stop-server-btn')) {
            if(confirm("Stop Server? No one will be able to message.")) {
                serverStopped = true; 
                window.saveData(); 
                socket.emit('send_message', { type: 'world', text: "SERVER_STOP" });
                alert("Server Stopped.");
            }
            return;
        }

        if (target.closest('#dev-start-server-btn')) {
            serverStopped = false; 
            window.saveData(); 
            socket.emit('send_message', { type: 'world', text: "SERVER_START" });
            alert("Server Running normally."); 
            return;
        }

        if (target.closest('#dev-wipe-server-btn')) { 
            sVal('dev-wipe-code-input', ''); 
            sRem('dev-wipe-modal', 'hidden'); 
            return; 
        }
        
        if (target.closest('#confirm-dev-wipe-btn')) {
            if(gVal('dev-wipe-code-input') === '6200437705AT') {
                localStorage.clear(); 
                socket.emit('send_message', { type: 'world', text: "SYSTEM_WIPE" });
                alert("SERVER COMPLETELY WIPED."); 
                window.location.reload();
            } else { 
                alert("Incorrect Passcode."); 
            }
            return;
        }

        if (target.closest('#dev-profile-ring-btn')) { 
            generateProfileRings(); 
            sRem('dev-ring-modal', 'hidden'); 
            return; 
        }
        
        if (target.closest('#confirm-dev-ring-btn')) {
            let t = gVal('ring-target-input'); 
            let anim = safeEl('ring-animation-select').value;
            let selRing = localStorage.getItem('temp_selected_ring');
            
            if(!t || !selRing) {
                return alert("Select a ring and enter a target.");
            }
            
            alert(`Premium Ring applied to [${t}] with ${anim} animation.`);
            sAdd('dev-ring-modal', 'hidden'); 
            return;
        }

        // -------------------------------------------------------------
        // NORMAL APP EVENT BINDINGS
        // -------------------------------------------------------------

        // World Chat Ban Block Check
        if (target.closest('.nav-btn') && target.closest('.nav-btn').getAttribute('data-target') === 'world-chat-section') {
            if(worldBannedUsers.includes(currentUser.username) || worldBannedUsers.includes(currentUser.uid)) {
                alert("SYSTEM MODERATION: You have been permanently kicked/banned from the Global World Chat. Access Denied.");
                return; // Blocks opening the tab
            }
        }

        // SETTINGS & THEME TOGGLE (THE FIX)
        if (target.closest('#activate-golden-theme-btn')) {
            const btn = target.closest('#activate-golden-theme-btn');
            if (currentUser.theme === 'grand-golden') {
                // Deactivate
                currentUser.theme = 'default'; 
                document.documentElement.setAttribute('data-theme', 'default');
                window.saveData(); 
                applySystemThemePalette();
                alert("Golden VIP Mode Deactivated.");
            } else {
                // Activate
                currentUser.theme = 'grand-golden';
                document.documentElement.setAttribute('data-theme', 'grand-golden');
                window.saveData(); 
                applySystemThemePalette();
                alert("Supreme Golden VIP Mode Activated!");
            }
            return;
        }

        // UNSEND (DELETE) MESSAGE LOGIC
        if (target.closest('.unsend-btn')) {
            if(confirm("Are you sure you want to Unsend this message for yourself?")) {
                const btn = target.closest('.unsend-btn');
                const msgId = btn.getAttribute('data-id');
                const bubble = btn.closest('.message-bubble');
                
                if(!bubble) {
                    return;
                }
                
                const containerId = bubble.parentElement ? bubble.parentElement.id : null; 
                bubble.remove();

                if (containerId === 'messages-area' && activeChatUser) {
                    if(chatHistory.direct[activeChatUser.username]) {
                        chatHistory.direct[activeChatUser.username] = chatHistory.direct[activeChatUser.username].filter(m => m.id != msgId);
                    }
                } else if (containerId === 'ai-messages-area') {
                    chatHistory.ai = chatHistory.ai.filter(m => m.id != msgId);
                } else if (containerId === 'group-messages-area') {
                    const groupName = safeEl('current-group-name') ? safeEl('current-group-name').innerText : '';
                    if(chatHistory.group[groupName]) {
                        chatHistory.group[groupName] = chatHistory.group[groupName].filter(m => m.id != msgId);
                    }
                } else if (containerId === 'world-messages-area') {
                    chatHistory.world = chatHistory.world.filter(m => m.id != msgId);
                }
                
                window.saveData();
            }
            return;
        }

        // Emoji Tray Closing Logic
        if (!target.closest('#emoji-picker-tray') && !target.closest('.emoji-trigger-btn') && !target.classList.contains('emoji-item')) {
            sAdd('emoji-picker-tray', 'hidden');
        }
        
        if (target.closest('.emoji-trigger-btn')) {
            const btn = target.closest('.emoji-trigger-btn');
            activeEmojiTargetId = btn.getAttribute('data-target');
            sRem('emoji-picker-tray', 'hidden');
            return;
        }

        // Public Profile Modal Trigger
        if (target.closest('.public-profile-trigger') || target.classList.contains('public-profile-trigger')) {
            if (activeChatUser) { 
                showPublicProfileModal(activeChatUser); 
            } 
            return;
        }

        // Right Pane Live Preview Trigger
        if (target.closest('.global-user-item') && !target.closest('.action-dispatch-global-req-btn') && !target.closest('.req-action-btns')) {
            const targetUsernameString = target.closest('.global-user-item').getAttribute('data-username');
            const userContext = findUserGlobally(targetUsernameString);
            
            if(userContext) {
                openRightProfilePreviewPane(userContext);
            }
            return;
        }

        // Mobile Sidebar Toggles
        if (target.id === 'hamburger-btn' || target.closest('#hamburger-btn')) {
            const mobileSidebarContainer = safeEl('sidebar');
            if (mobileSidebarContainer) {
                mobileSidebarContainer.style.display = 'flex'; 
                mobileSidebarContainer.style.position = 'fixed';
                mobileSidebarContainer.style.zIndex = '10000'; 
                mobileSidebarContainer.style.height = '100vh';
                mobileSidebarContainer.style.width = '80%'; 
                mobileSidebarContainer.style.flexDirection = 'column';
                mobileSidebarContainer.style.justifyContent = 'flex-start';
                
                const closeBtn = safeEl('close-sidebar-btn'); 
                if (closeBtn) {
                    closeBtn.classList.remove('hidden');
                }
                
                const navLinksContainer = mobileSidebarContainer.querySelector('.nav-links');
                if (navLinksContainer) { 
                    navLinksContainer.style.flexDirection = 'column'; 
                    navLinksContainer.style.overflowY = 'auto'; 
                }
            }
            return;
        }
        
        if (target.id === 'close-sidebar-btn' || target.closest('#close-sidebar-btn')) {
            const mobileSidebarContainer = safeEl('sidebar');
            if (mobileSidebarContainer) {
                mobileSidebarContainer.style.display = ''; 
                mobileSidebarContainer.style.position = '';
                mobileSidebarContainer.style.zIndex = ''; 
                mobileSidebarContainer.style.height = '';
                mobileSidebarContainer.style.width = ''; 
                mobileSidebarContainer.style.flexDirection = '';
                
                const closeBtn = safeEl('close-sidebar-btn'); 
                if (closeBtn) {
                    closeBtn.classList.add('hidden');
                }
                
                const navLinksContainer = mobileSidebarContainer.querySelector('.nav-links');
                if (navLinksContainer) { 
                    navLinksContainer.style.flexDirection = ''; 
                    navLinksContainer.style.overflowY = ''; 
                }
            }
            return;
        }

        // Sidebar Navigation
        const navigationButtonElement = target.closest('.nav-btn');
        if (navigationButtonElement && !navigationButtonElement.id.includes('report-bug') && !navigationButtonElement.id.includes('logout')) {
            document.querySelectorAll('.nav-links .nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.content-view').forEach(view => { 
                view.classList.remove('active'); 
                view.classList.add('hidden'); 
            });
            
            navigationButtonElement.classList.add('active');
            
            const targetSectionDisplayId = navigationButtonElement.getAttribute('data-target');
            sRem(targetSectionDisplayId, 'hidden'); 
            sAdd(targetSectionDisplayId, 'active');
            
            if(targetSectionDisplayId === 'ai-chat-section') {
                loadChatHistoryToView('ai');
            }
            return;
        }

        // Quick Actions
        if (target.closest('#sidebar-quick-report-bug-btn')) { 
            sVal('bug-report-text-input', ''); 
            sRem('bug-report-modal', 'hidden'); 
            return; 
        }
        
        if (target.closest('#sidebar-quick-logout-btn')) {
            if (confirm("Are you absolutely sure you want to log out of your secure session and terminate tracking connections?")) {
                localStorage.removeItem('chatUser'); 
                location.reload();
            }
            return;
        }

        // Chat View Sidebar Tabs
        const chatTabNavigationButtonElement = target.closest('.chat-tabs .tab-btn');
        if (chatTabNavigationButtonElement) {
            document.querySelectorAll('.chat-tabs .tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            chatTabNavigationButtonElement.classList.add('active');
            currentChatTab = chatTabNavigationButtonElement.getAttribute('data-tab');
            
            if (currentChatTab === 'requests') { 
                sRem('request-sub-tabs-container', 'hidden'); 
                sAdd('search-friend-field-block', 'hidden'); 
                renderRequestSubTabUI(); 
            } 
            else { 
                sAdd('request-sub-tabs-container', 'hidden'); 
                sRem('search-friend-field-block', 'hidden'); 
                resetRightWorkspacePane(); 
                renderContacts(); 
            }
            return;
        }

        if (target.closest('#sub-tab-accept-btn')) { 
            currentRequestSubTab = 'accept'; 
            renderRequestSubTabUI(); 
            resetRightWorkspacePane(); 
            return; 
        }
        
        if (target.closest('#sub-tab-send-btn')) { 
            currentRequestSubTab = 'send'; 
            renderRequestSubTabUI(); 
            return; 
        }

        if (target.closest('.action-dispatch-global-req-btn')) {
            const btn = target.closest('.action-dispatch-global-req-btn');
            const targetUsername = btn.getAttribute('data-username');
            alert(`Network Success: Secure Friend Request has been dispatched to [${targetUsername}].`);
            btn.innerHTML = '<i class="fas fa-check"></i>'; 
            btn.style.background = "var(--system-success)"; 
            btn.disabled = true; 
            return;
        }

        if (target.closest('.btn-accept-friend')) {
            const listRowItemElement = target.closest('.dummy-item');
            if (listRowItemElement) {
                const targetUsernameIdentificationKey = listRowItemElement.getAttribute('data-username') || listRowItemElement.getAttribute('data-user');
                
                friendRequests = friendRequests.filter(reqObject => reqObject.username !== targetUsernameIdentificationKey);
                
                friends.push({ 
                    username: targetUsernameIdentificationKey, 
                    dp: `https://ui-avatars.com/api/?name=${targetUsernameIdentificationKey}&background=8b5cf6&color=fff`, 
                    isFavorite: false, 
                    bio: "My newly verified active friend connection mapping node." 
                });
                
                window.saveData(); 
                renderRequestSubTabUI(); 
                alert(`Verification Protocol Complete: You are now permanently connected friends with ${targetUsernameIdentificationKey}!`);
            }
            return;
        }
        
        if (target.closest('.btn-reject-friend')) {
            const listRowItemElement = target.closest('.dummy-item');
            if (listRowItemElement) {
                const targetUsernameIdentificationKey = listRowItemElement.getAttribute('data-username') || listRowItemElement.getAttribute('data-user');
                friendRequests = friendRequests.filter(reqObject => reqObject.username !== targetUsernameIdentificationKey);
                window.saveData(); 
                renderRequestSubTabUI();
            }
            return;
        }

        // Open Direct Chat & LOAD HISTORY
        if (target.closest('.contact-item')) {
            const retrievedUsernameKey = target.closest('.contact-item').getAttribute('data-user');
            
            sAdd('request-profile-preview-pane', 'hidden'); 
            sAdd('chat-placeholder', 'hidden');
            sRem('chat-header', 'hidden'); 
            sRem('messages-area', 'hidden'); 
            sRem('chat-input-area', 'hidden');

            activeChatUser = friends.find(fObj => fObj.username === retrievedUsernameKey);
            
            if (activeChatUser) { 
                sText('current-chat-name', activeChatUser.username); 
                sSrc('current-chat-dp', activeChatUser.dp); 
                
                const favBtn = safeEl('favorite-user-btn');
                if (favBtn) {
                    favBtn.innerHTML = activeChatUser.isFavorite ? '<i class="fas fa-star" style="color:#f59e0b;"></i>' : '<i class="far fa-star"></i>';
                }
                
                loadChatHistoryToView('direct', activeChatUser.username);
            }
            return;
        }

        if (target.closest('#favorite-user-btn')) {
            if (activeChatUser) {
                const arrayIndexMatchFound = friends.findIndex(fObj => fObj.username === activeChatUser.username);
                if (arrayIndexMatchFound !== -1) {
                    friends[arrayIndexMatchFound].isFavorite = !friends[arrayIndexMatchFound].isFavorite;
                    window.saveData(); 
                    
                    const favBtn = safeEl('favorite-user-btn');
                    if (favBtn) {
                        favBtn.innerHTML = friends[arrayIndexMatchFound].isFavorite ? '<i class="fas fa-star" style="color:#f59e0b;"></i>' : '<i class="far fa-star"></i>';
                    }
                    
                    if (currentChatTab === 'favorite') { 
                        renderContacts(); 
                        resetRightWorkspacePane(); 
                    }
                }
            }
            return;
        }

        // CALLING SYSTEM
        if (target.closest('#direct-voice-call-btn')) { 
            initiateOutgoingCall(false); 
            return; 
        }
        
        if (target.closest('#direct-video-call-btn')) { 
            initiateOutgoingCall(true); 
            return; 
        }

        if (target.closest('#group-voice-call-btn') || target.closest('#group-video-call-btn')) {
            const isVideo = !!target.closest('#group-video-call-btn');
            sAdd('incoming-call-ring-modal', 'hidden'); 
            sRem('active-call-window', 'hidden'); 
            sText('call-duration-timer', 'Live Room'); 
            initLocalCameraStream(isVideo, false, 'group');
            return;
        }
        
        if (target.closest('#world-voice-call-btn') || target.closest('#world-video-call-btn')) {
            const isVideo = !!target.closest('#world-video-call-btn');
            sAdd('incoming-call-ring-modal', 'hidden'); 
            sRem('active-call-window', 'hidden'); 
            sText('call-duration-timer', 'Live Stage'); 
            initLocalCameraStream(isVideo, false, 'world');
            return;
        }

        if (target.closest('#end-active-call-btn') || target.closest('#end-minimized-call-btn')) { 
            terminateActiveCall(); 
            return; 
        }

        if (target.closest('#minimize-call-btn')) { 
            sAdd('active-call-window', 'hidden'); 
            sRem('minimized-call-widget', 'hidden'); 
            return; 
        }
        
        if (target.closest('#minimized-call-widget') && !target.closest('#end-minimized-call-btn')) {
            sAdd('minimized-call-widget', 'hidden'); 
            sRem('active-call-window', 'hidden'); 
            return;
        }

        if (target.closest('#toggle-cam-btn')) {
            if (localMediaStreamTracker) {
                const videoTrack = localMediaStreamTracker.getVideoTracks()[0];
                if (videoTrack) {
                    isLocalCamOn = !isLocalCamOn;
                    videoTrack.enabled = isLocalCamOn;
                    const toggleBtn = target.closest('#toggle-cam-btn');
                    
                    if (isLocalCamOn) {
                        toggleBtn.innerHTML = '<i class="fas fa-video"></i>'; 
                        toggleBtn.style.color = "white";
                        if(safeEl('local-video')) {
                            safeEl('local-video').style.display = 'block'; 
                        }
                        sAdd('local-audio-fallback', 'hidden');
                    } else {
                        toggleBtn.innerHTML = '<i class="fas fa-video-slash"></i>'; 
                        toggleBtn.style.color = "#ef4444"; 
                        if(safeEl('local-video')) {
                            safeEl('local-video').style.display = 'none'; 
                        }
                        sRem('local-audio-fallback', 'hidden');
                    }
                } else { 
                    alert("Camera hardware not detected on your device."); 
                }
            }
            return;
        }

        if (target.closest('#toggle-mic-btn')) {
            if (localMediaStreamTracker) {
                const audioTrack = localMediaStreamTracker.getAudioTracks()[0];
                if (audioTrack) {
                    isLocalMicOn = !isLocalMicOn;
                    audioTrack.enabled = isLocalMicOn;
                    const toggleBtn = target.closest('#toggle-mic-btn');
                    
                    if (isLocalMicOn) { 
                        toggleBtn.innerHTML = '<i class="fas fa-microphone"></i>'; 
                        toggleBtn.style.color = "white"; 
                    } else { 
                        toggleBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>'; 
                        toggleBtn.style.color = "#ef4444"; 
                    }
                }
            }
            return;
        }

        // MESSAGING
        if (target.closest('#send-btn')) {
            let rawMessageTextValue = gVal('message-input');
            if (rawMessageTextValue !== "" && activeChatUser) {
                sendMessageWithSave('direct', rawMessageTextValue, activeChatUser.username);
                sVal('message-input', '');
            }
            return;
        }
        
        if (target.closest('#ai-send-btn')) {
            let aiRawText = gVal('ai-message-input');
            if(aiRawText !== "") {
                sendMessageWithSave('ai', aiRawText);
                sVal('ai-message-input', '');
            }
            return;
        }

        if (target.closest('#group-send-btn')) {
            let groupMsgText = gVal('group-message-input');
            if (groupMsgText) {
                sendMessageWithSave('group', groupMsgText, safeEl('current-group-name').innerText);
                sVal('group-message-input', '');
            }
            return;
        }

        if (target.closest('#world-send-btn')) {
            let worldMsgText = gVal('world-message-input');
            if (worldMsgText) {
                sendMessageWithSave('world', worldMsgText);
                sVal('world-message-input', '');
            }
            return;
        }

        function startVoiceTypingEngine(inputId) {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                alert("System Info: Chrome Browser Required for Voice Typing."); 
                return;
            }
            
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN'; 
            recognition.interimResults = false; 
            recognition.maxAlternatives = 1;

            const inputEl = safeEl(inputId);
            if (!inputEl) {
                return;
            }

            const ogPlaceholder = inputEl.placeholder;
            inputEl.placeholder = "🎙️ Listening... Speak now!";
            
            recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                inputEl.value = inputEl.value ? (inputEl.value + " " + transcript) : transcript;
                inputEl.placeholder = ogPlaceholder;
            };
            
            recognition.onerror = () => { 
                inputEl.placeholder = ogPlaceholder; 
            };
            
            recognition.onend = () => { 
                inputEl.placeholder = ogPlaceholder; 
            };
            
            recognition.start();
        }

        // OTHER MODULES
        if (target.closest('#voice-type-btn')) { 
            startVoiceTypingEngine('message-input'); 
            return; 
        }
        
        if (target.closest('#group-voice-type-btn')) { 
            startVoiceTypingEngine('group-message-input'); 
            return; 
        }
        
        if (target.closest('#world-voice-type-btn')) { 
            startVoiceTypingEngine('world-message-input'); 
            return; 
        }

        if (target.closest('#attach-btn')) { 
            const uploadInput = safeEl('chat-media-upload-input'); 
            if(uploadInput) {
                uploadInput.click(); 
            }
            return; 
        }
        
        if (target.closest('#group-attach-btn')) { 
            const uploadInput = safeEl('group-media-upload-input'); 
            if(uploadInput) {
                uploadInput.click(); 
            }
            return; 
        }
        
        if (target.closest('#world-attach-btn')) { 
            const uploadInput = safeEl('world-media-upload-input'); 
            if(uploadInput) {
                uploadInput.click(); 
            }
            return; 
        }

        if (target.closest('#world-mute-btn')) {
            isWorldMuted = !isWorldMuted;
            const muteButtonElem = target.closest('#world-mute-btn');
            
            if (isWorldMuted) {
                muteButtonElem.innerHTML = '<i class="fas fa-volume-mute"></i>';
                muteButtonElem.classList.remove('danger-btn'); 
                muteButtonElem.classList.add('action-btn');
            } else {
                muteButtonElem.innerHTML = '<i class="fas fa-volume-up"></i>';
                muteButtonElem.classList.remove('action-btn'); 
                muteButtonElem.classList.add('danger-btn');
            }
            return;
        }

        if (target.closest('#trigger-dp-upload')) { 
            const hiddenUploadInputField = safeEl('edit-dp-input'); 
            if (hiddenUploadInputField) {
                hiddenUploadInputField.click(); 
            }
            return; 
        }
        
        if (target.closest('#trigger-banner-upload')) { 
            const hiddenUploadInputField = safeEl('edit-banner-input'); 
            if (hiddenUploadInputField) {
                hiddenUploadInputField.click(); 
            }
            return; 
        }

        if (target.closest('#save-profile-btn')) {
            const nicknameConfigurationInputValue = gVal('edit-username-input');
            const biographicalSummaryInputValue = gVal('edit-bio-input');
            
            if (nicknameConfigurationInputValue) {
                currentUser.username = nicknameConfigurationInputValue;
            }
            
            currentUser.bio = biographicalSummaryInputValue;
            window.saveData(); 
            updateProfileUI(); 
            sAdd('edit-profile-modal', 'hidden'); 
            return;
        }

        if (target.closest('#post-image-btn')) { 
            const hiddenImageUploadInputField = safeEl('post-image-upload-input'); 
            if (hiddenImageUploadInputField) {
                hiddenImageUploadInputField.click(); 
            }
            return; 
        }
        
        if (target.closest('#action-remove-attached-post-file-buffer')) { 
            attachedPostImage = null; 
            sAdd('post-media-attachment-status-preview', 'hidden'); 
            sVal('post-image-upload-input', ''); 
            return; 
        }
        
        if (target.closest('#submit-post-btn')) { 
            const text = gVal('post-input');
            if (!text && !attachedPostImage) { 
                alert("Please write something or attach an image."); 
                return; 
            }
            
            const newPost = { 
                id: Date.now(), 
                user: currentUser.username, 
                dp: currentUser.dp || DEFAULT_DP, 
                time: new Date().toLocaleTimeString(), 
                scope: safeEl('post-privacy-scope-configuration-level-toggle-select').value, 
                text: text, 
                tags: text.match(/#[a-zA-Z0-9_]+/g) || [], 
                image: attachedPostImage 
            };
            
            posts.unshift(newPost); 
            window.saveData(); 
            renderPosts(); 
            sVal('post-input', ''); 
            attachedPostImage = null; 
            sAdd('post-media-attachment-status-preview', 'hidden');
            return; 
        }
        
        if (target.closest('.delete-post-btn')) {
            if (confirm("Are you entirely sure you want to permanently delete this specific post from the global feed arrays?")) {
                const postCardElement = target.closest('.feed-post');
                if (postCardElement) {
                    const extractedPostId = parseInt(postCardElement.getAttribute('data-id'));
                    posts = posts.filter(postObj => postObj.id !== extractedPostId);
                    window.saveData(); 
                    renderPosts();
                }
            }
            return;
        }

        // Group Poll & Actions
        if (target.closest('#create-group-btn')) { 
            sRem('create-group-modal', 'hidden'); 
            return; 
        }
        
        if (target.closest('#trigger-group-icon-upload')) { 
            const hiddenGroupIconUploadInputField = safeEl('new-group-icon-input'); 
            if (hiddenGroupIconUploadInputField) {
                hiddenGroupIconUploadInputField.click(); 
            }
            return; 
        }

        if (target.closest('#confirm-create-group-btn')) {
            const groupTitleNameInputValue = gVal('new-group-name');
            if (groupTitleNameInputValue) {
                groups.push({ 
                    id: Date.now(), 
                    name: groupTitleNameInputValue, 
                    icon: tempGroupIcon, 
                    createdBy: currentUser.username 
                });
                
                window.saveData(); 
                renderGroups(); 
                sAdd('create-group-modal', 'hidden'); 
                sVal('new-group-name', '');
                
                tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff"; 
                sSrc('new-group-icon-preview', tempGroupIcon);
            }
            return;
        }

        if (target.closest('.group-item')) {
            const groupNameStringValue = target.closest('.group-item').getAttribute('data-group');
            
            sAdd('group-placeholder', 'hidden'); 
            sRem('group-header', 'hidden');
            sRem('group-messages-area', 'hidden'); 
            sRem('group-input-area', 'hidden');
            
            sText('current-group-name', groupNameStringValue);
            
            const selectedGroupObj = groups.find(x => x.name === groupNameStringValue);
            if(selectedGroupObj) { 
                sSrc('group-header-img', selectedGroupObj.icon || `https://ui-avatars.com/api/?name=${groupNameStringValue}&background=a855f7&color=fff`); 
            }
            
            loadChatHistoryToView('group', groupNameStringValue); 
            return;
        }

        if (target.closest('#group-channel-trigger-instantiate-poll-creation-modal-btn')) {
            sVal('group-poll-input-question-string-field', ''); 
            sVal('group-poll-input-option-string-field-1', ''); 
            sVal('group-poll-input-option-string-field-2', '');
            sRem('group-channel-poll-creation-modal-framework-overlay-window', 'hidden'); 
            return;
        }

        if (target.closest('#action-trigger-commit-publish-group-poll-to-channel-stream-btn')) {
            const pollQuestionTargetStringValue = gVal('group-poll-input-question-string-field');
            const pollOptionTargetStringValue1 = gVal('group-poll-input-option-string-field-1');
            const pollOptionTargetStringValue2 = gVal('group-poll-input-option-string-field-2');

            if (pollQuestionTargetStringValue && pollOptionTargetStringValue1 && pollOptionTargetStringValue2) {
                const pollHtml = `
                    <div style="font-weight:900; margin-bottom:8px;"><i class="fas fa-poll-h"></i> ACTIVE GROUP POLL VOTE:</div>
                    <div style="font-size:1.1rem; margin-bottom:10px;">${pollQuestionTargetStringValue}</div>
                    <button class="action-btn execution-vote-poll-track-node-btn" style="width:100%; text-align:left; margin-bottom:5px; font-size:0.9rem;" data-votes="0">🗳️ ${pollOptionTargetStringValue1} - [ <span class="vote-count-numerical-outlet-span">0</span> Votes ]</button>
                    <button class="action-btn execution-vote-poll-track-node-btn" style="width:100%; text-align:left; font-size:0.9rem;" data-votes="0">🗳️ ${pollOptionTargetStringValue2} - [ <span class="vote-count-numerical-outlet-span">0</span> Votes ]</button>
                `;
                sendMessageWithSave('group', pollHtml, safeEl('current-group-name').innerText);
                sAdd('group-channel-poll-creation-modal-framework-overlay-window', 'hidden');
            } else { 
                alert("Execution Halted: Please ensure all textual input blocks for the poll are fully complete."); 
            }
            return;
        }

        if (target.closest('.execution-vote-poll-track-node-btn')) {
            const pollSelectionButtonElement = target.closest('.execution-vote-poll-track-node-btn');
            let currentTrackedVotesCountValue = parseInt(pollSelectionButtonElement.getAttribute('data-votes')) || 0;
            currentTrackedVotesCountValue++;
            
            pollSelectionButtonElement.setAttribute('data-votes', currentTrackedVotesCountValue);
            
            const spanOutputValueElement = pollSelectionButtonElement.querySelector('.vote-count-numerical-outlet-span');
            if (spanOutputValueElement) { 
                spanOutputValueElement.innerText = currentTrackedVotesCountValue; 
            }
            
            pollSelectionButtonElement.disabled = true; 
            pollSelectionButtonElement.style.opacity = "0.7"; 
            return;
        }

        // Bonds
        if (target.closest('#send-band-req-btn')) {
            const bondTargetInputStringValue = gVal('band-request-input');
            if (bondTargetInputStringValue !== "") {
                bandRequests.push({ username: bondTargetInputStringValue });
                window.saveData(); 
                renderBandRequests(); 
                sVal('band-request-input', '');
            }
            return;
        }

        if (target.closest('.btn-accept-band')) {
            const bondRequestListItemElement = target.closest('.dummy-item');
            if (bondRequestListItemElement) {
                const bondSourceUsernameKey = bondRequestListItemElement.getAttribute('data-user');
                bandRequests = bandRequests.filter(reqObj => reqObj.username !== bondSourceUsernameKey);
                
                sHtml('fb-partner-dp-slot', `<img src="https://ui-avatars.com/api/?name=${bondSourceUsernameKey}&background=random&color=fff" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`);
                sText('fb-partner-name', bondSourceUsernameKey); 
                sText('band-level', "Bond Level 1 (Initial Handshake Verified)"); 
                sText('time-remaining', "You are now bonded securely!");
                
                const visualProgressBarElement = safeEl('band-progress'); 
                if (visualProgressBarElement) { 
                    visualProgressBarElement.style.width = "45%"; 
                }
                
                sRem('break-band-btn', 'hidden'); 
                window.saveData(); 
                renderBandRequests();
            }
            return;
        }

        if (target.closest('#break-band-btn')) {
            if (confirm("SEVERE ACTION WARNING: Are you absolutely sure you want to permanently break your Friendship Bond link sequence? All synchronized streak progress counters will be completely lost and zeroed out.")) {
                sHtml('fb-partner-dp-slot', '?'); 
                sText('fb-partner-name', "Partner Space Available");
                sText('band-level', "Bond Level 0 (Detached)"); 
                sText('time-remaining', "Currently Not Connected");
                
                const visualProgressBarElement = safeEl('band-progress'); 
                if (visualProgressBarElement) { 
                    visualProgressBarElement.style.width = "0%"; 
                }
                
                sAdd('break-band-btn', 'hidden'); 
                window.saveData();
            }
            return;
        }

        if (target.closest('#submit-bug-report-btn')) {
            const bugReportDescriptionTextValue = gVal('bug-report-text-input');
            if (bugReportDescriptionTextValue !== "") {
                systemBugReports.push({ 
                    id: systemBugReports.length + 1, 
                    submittedBy: currentUser ? currentUser.username : "Unknown Entity", 
                    traceLogContext: bugReportDescriptionTextValue, 
                    timestamp: new Date().toLocaleTimeString() 
                });
                
                window.saveData(); 
                renderDeveloperBugReportsAggregationPanelList(); 
                sAdd('bug-report-modal', 'hidden');
            }
            return;
        }

        if (target.closest('.close-modal-btn') || target.classList.contains('modal-overlay')) {
            let overlayToCloseElement = target.closest('.modal-overlay');
            if (!overlayToCloseElement) { 
                overlayToCloseElement = target; 
            }
            if (overlayToCloseElement.classList.contains('modal-overlay')) { 
                overlayToCloseElement.classList.add('hidden'); 
            }
            return;
        }

        if (target.closest('#action-clear-cache-btn')) {
            if (confirm("Notice: Are you absolutely positive you want to completely clear the application cache blocks?")) {
                localStorage.removeItem('chatPosts'); 
                posts = []; 
                renderPosts();
            }
            return;
        }

        if (target.closest('#view-friends-list-btn')) { 
            renderFriendsListModal(); 
            sRem('friend-list-modal', 'hidden'); 
            return; 
        }
        
        if (target.closest('#edit-profile-btn')) { 
            sVal('edit-username-input', currentUser.username); 
            sVal('edit-bio-input', currentUser.bio || ''); 
            sRem('edit-profile-modal', 'hidden'); 
            return; 
        }

    } catch (err) {
        console.error("Global Click Event Error Intercepted (App kept running):", err);
    }
}); 

// =========================================================================
// 8. FILE UPLOAD HELPERS & KEYPRESS LISTENERS
// =========================================================================

function setupFileInput(elementIdString, resultCallbackFunctionMethod) {
    const targetUploadInputElementNode = safeEl(elementIdString);
    if (targetUploadInputElementNode) {
        targetUploadInputElementNode.addEventListener('change', function () {
            const selectedFileObject = this.files[0];
            if (selectedFileObject) {
                const fileReaderInstanceObject = new FileReader();
                fileReaderInstanceObject.onload = function (eventObjectTriggerResult) {
                    resultCallbackFunctionMethod(eventObjectTriggerResult.target.result);
                };
                fileReaderInstanceObject.readAsDataURL(selectedFileObject);
            }
        });
    }
}

setupFileInput('edit-dp-input', (resultingBase64ImageStringCode) => { 
    currentUser.dp = resultingBase64ImageStringCode; 
    window.saveData(); 
    updateProfileUI(); 
});

setupFileInput('edit-banner-input', (resultingBase64ImageStringCode) => { 
    currentUser.banner = resultingBase64ImageStringCode; 
    window.saveData(); 
    updateProfileUI(); 
});

setupFileInput('new-group-icon-input', (resultingBase64ImageStringCode) => { 
    tempGroupIcon = resultingBase64ImageStringCode; 
    sSrc('new-group-icon-preview', tempGroupIcon); 
});

setupFileInput('post-image-upload-input', (resultingBase64ImageStringCode) => { 
    attachedPostImage = resultingBase64ImageStringCode; 
    sRem('post-media-attachment-status-preview', 'hidden'); 
});

function renderChatMediaMessage(base64MediaString, targetMessageAreaIdString, emitType) {
    const targetName = emitType === 'group' ? (safeEl('current-group-name') ? safeEl('current-group-name').innerText : null) : (emitType === 'direct' ? (activeChatUser ? activeChatUser.username : null) : null);
    sendMessageWithSave(emitType, `<br><img src="${base64MediaString}" style="max-width:220px; border-radius:12px; margin-top:8px; border:2px solid rgba(255,255,255,0.2);">`, targetName);
}

setupFileInput('chat-media-upload-input', (mediaBase64Data) => { 
    renderChatMediaMessage(mediaBase64Data, 'messages-area', 'direct'); 
});

setupFileInput('group-media-upload-input', (mediaBase64Data) => { 
    renderChatMediaMessage(mediaBase64Data, 'group-messages-area', 'group'); 
});

setupFileInput('world-media-upload-input', (mediaBase64Data) => { 
    renderChatMediaMessage(mediaBase64Data, 'world-messages-area', 'world'); 
});

const handleEnterKeypressRoutingPortAssignmentMethod = (targetInputIdString, triggerActionBtnIdString) => {
    const inputFieldTargetElement = safeEl(targetInputIdString);
    if (inputFieldTargetElement) {
        inputFieldTargetElement.addEventListener('keypress', (keypressEventObject) => {
            if (keypressEventObject.key === 'Enter') {
                keypressEventObject.preventDefault();
                const actionButtonTargetElement = safeEl(triggerActionBtnIdString);
                if (actionButtonTargetElement) { 
                    actionButtonTargetElement.click(); 
                }
            }
        });
    }
};

handleEnterKeypressRoutingPortAssignmentMethod('message-input', 'send-btn');
handleEnterKeypressRoutingPortAssignmentMethod('world-message-input', 'world-send-btn');
handleEnterKeypressRoutingPortAssignmentMethod('group-message-input', 'group-send-btn');
handleEnterKeypressRoutingPortAssignmentMethod('ai-message-input', 'ai-send-btn');
handleEnterKeypressRoutingPortAssignmentMethod('chat-sidebar-search-input', 'sidebar-action-search-trigger');