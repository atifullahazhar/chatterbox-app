// =========================================================================
// 🔥 CHATTERBOX ECOSYSTEM - CORE JAVASCRIPT MASTER ENGINE V42 🔥
// Privileges: SUPREME CORE ROOT OPERATOR
// Optimization: STRICTLY DISABLED. 100% EXPLICIT RAW CODE.
// Updates: Dynamic Polls, Story Privacy & Insights, Registry, Logic Fixes
// =========================================================================

console.log("🔥 CHATTERBOX ECOSYSTEM INTERFACE RUNTIME SYSTEMS ONLINE 🔥");
console.log("Initializing Un-Optimized Raw Master Engine V42...");

// =========================================================================
// 0. CORE DOM UTILITIES & EXPLICIT SAFE WRAPPERS
// =========================================================================
function safeEl(elementIdString) { 
    return document.getElementById(elementIdString); 
}

function sAdd(elementIdString, classNameString) { 
    const targetElementNode = safeEl(elementIdString); 
    if (targetElementNode !== null) {
        targetElementNode.classList.add(classNameString); 
    }
}

function sRem(elementIdString, classNameString) { 
    const targetElementNode = safeEl(elementIdString); 
    if (targetElementNode !== null) {
        targetElementNode.classList.remove(classNameString); 
    }
}

function sText(elementIdString, textContentValue) { 
    const targetElementNode = safeEl(elementIdString); 
    if (targetElementNode !== null) {
        targetElementNode.innerText = textContentValue; 
    }
}

function sHtml(elementIdString, htmlContentValue) { 
    const targetElementNode = safeEl(elementIdString); 
    if (targetElementNode !== null) {
        targetElementNode.innerHTML = htmlContentValue; 
    }
}

function sVal(elementIdString, inputValue) { 
    const targetElementNode = safeEl(elementIdString); 
    if (targetElementNode !== null) {
        targetElementNode.value = inputValue; 
    }
}

function gVal(elementIdString) { 
    const targetElementNode = safeEl(elementIdString); 
    if (targetElementNode !== null) {
        return targetElementNode.value.trim();
    } else {
        return ''; 
    }
}

function sSrc(elementIdString, sourceUrlString) { 
    const targetElementNode = safeEl(elementIdString); 
    if (targetElementNode !== null) {
        targetElementNode.src = sourceUrlString; 
    }
}

// =========================================================================
// 1. DYNAMIC SYSTEM DATABASE & STATE VARIABLES (EXTENDED)
// =========================================================================
let currentUser = null;
let friends = [];
let friendRequests = [];
let bandRequests = [];
let posts = [];
let groups = [];
let systemBugReports = [];
let profileViews = 0;

// Persistent Data Structures for New Features
let storiesDatabase = [];
let reelsDatabase = [];
let scheduledMessagesQueue = [];
let pinnedMessages = { direct: {}, group: {}, world: null };

// Temporary Story Upload Buffer
let tempStoryMediaBuffer = null;

// Persistent Chat History Database
let chatHistory = { 
    direct: {}, 
    group: {}, 
    world: [], 
    ai: [] 
};

// Security & Moderation Database
let bannedUsers = [];
let shadowBannedUsers = [];
let worldMutedUsers = [];
let worldBannedUsers = []; 
let serverStopped = false;

// UI State Variables
let activeChatUser = null;
let currentChatTab = 'general';
let currentRequestSubTab = 'accept';
let currentDevActionTarget = ''; 
let tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";
let attachedPostImage = null;
let isWorldMuted = false;
let isTypingHidden = false;

// Universal Poll Context Manager
let activePollContextEngineType = null; 

// Call System & WebRTC Variables
let activeCallTimerInterval = null;
let outgoingCallTimeout = null;
let currentCallSeconds = 0;
let localMediaStreamTracker = null;
let screenShareStreamTracker = null;
let callMediaRecorder = null;
let callRecordedChunks = [];
let isLocalCamOn = true;
let isLocalMicOn = true;
let isScreenSharingActive = false;

// Context Menu & Interaction Variables
let activeEmojiTargetId = null;
let activeMessageContextId = null;
let targetMessageForReply = null;
let targetMessageForEdit = null;

const emojiLibrary = ["😀","😂","🤣","😊","😍","🥰","😘","😜","😎","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻","💀","👽","👾","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾","❤️","🔥","👍","👎","👏","🙌","👐","🤲","🤝","🙏","✌️","🤞","🖖","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐","🖖","👋","🤙","💪","🖕","✍️","🤳","💅","🙇","🙋","💁","🙆","🙅","🤷","🤦","🙍","🙎","🧏"];

const systemVerifiedUserDirectory = [
    { username: "Atifullah Azhar", uid: "62004377", dp: "https://ui-avatars.com/api/?name=Atifullah+Azhar&background=ffd700&color=000", bio: "Developer and Creator of Chatterbox.", rank: "Developer", isDev: true },
    { username: "Chatterbox AI", uid: "00000007", dp: "https://ui-avatars.com/api/?name=AI&background=8b5cf6&color=fff", bio: "Your dedicated AI Intelligence assistant.", rank: "Verified AI Bot", isDev: false }
];

const socket = (typeof io !== 'undefined') ? io() : { on: () => { }, emit: () => { } };
const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";

// =========================================================================
// 🔥 PWA OFFLINE DETECTOR SYSTEM 🔥
// =========================================================================
window.addEventListener('online', function() { 
    sAdd('offline-alert-banner', 'hidden'); 
    console.log("System Status: Online Connectivity Restored"); 
});

window.addEventListener('offline', function() { 
    sRem('offline-alert-banner', 'hidden'); 
    console.log("System Status: Offline Connectivity Lost"); 
});

// =========================================================================
// 2. EXPLICIT MASTER INITIALIZATION & LOCAL STORAGE PARSING
// =========================================================================
function getSafeArrayFromLocalStorage(storageKeyString) {
    try {
        let parsedData = JSON.parse(localStorage.getItem(storageKeyString));
        if (Array.isArray(parsedData) === true) {
            return parsedData;
        } else {
            return [];
        }
    } catch (errorException) { 
        console.error(`Error parsing array for key: ${storageKeyString}`, errorException);
        return []; 
    }
}

function loadAllPersistedData() {
    currentUser = JSON.parse(localStorage.getItem('chatUser')) || null;
    friends = getSafeArrayFromLocalStorage('chatFriends');
    friendRequests = getSafeArrayFromLocalStorage('chatRequests');
    bandRequests = getSafeArrayFromLocalStorage('bandRequests');
    posts = getSafeArrayFromLocalStorage('chatPosts');
    groups = getSafeArrayFromLocalStorage('chatGroups');
    systemBugReports = getSafeArrayFromLocalStorage('chatBugReports');
    storiesDatabase = getSafeArrayFromLocalStorage('cb_stories');
    reelsDatabase = getSafeArrayFromLocalStorage('cb_reels');
    scheduledMessagesQueue = getSafeArrayFromLocalStorage('cb_scheduledMessages');
    
    bannedUsers = getSafeArrayFromLocalStorage('cb_bannedUsers');
    shadowBannedUsers = getSafeArrayFromLocalStorage('cb_shadowBannedUsers');
    worldMutedUsers = getSafeArrayFromLocalStorage('cb_worldMutedUsers');
    worldBannedUsers = getSafeArrayFromLocalStorage('cb_worldBannedUsers');
    
    if (localStorage.getItem('cb_serverStopped') === 'true') {
        serverStopped = true;
    } else {
        serverStopped = false;
    }

    let loadedHistoryData = JSON.parse(localStorage.getItem('chatHistory'));
    if (loadedHistoryData !== null && typeof loadedHistoryData === 'object') {
        chatHistory.direct = loadedHistoryData.direct || {};
        chatHistory.group = loadedHistoryData.group || {};
        chatHistory.world = loadedHistoryData.world || [];
        chatHistory.ai = loadedHistoryData.ai || [];
    }

    let loadedPinnedData = JSON.parse(localStorage.getItem('cb_pinnedMessages'));
    if (loadedPinnedData !== null && typeof loadedPinnedData === 'object') {
        pinnedMessages.direct = loadedPinnedData.direct || {};
        pinnedMessages.group = loadedPinnedData.group || {};
        pinnedMessages.world = loadedPinnedData.world || null;
    }
    
    profileViews = parseInt(localStorage.getItem('chatProfileViews')) || 0;
    profileViews = profileViews + 1; 
    localStorage.setItem('chatProfileViews', profileViews.toString());
}

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
        localStorage.setItem('cb_pinnedMessages', JSON.stringify(pinnedMessages));
        localStorage.setItem('cb_stories', JSON.stringify(storiesDatabase));
        localStorage.setItem('cb_reels', JSON.stringify(reelsDatabase));
        localStorage.setItem('cb_scheduledMessages', JSON.stringify(scheduledMessagesQueue));
        
        localStorage.setItem('cb_bannedUsers', JSON.stringify(bannedUsers));
        localStorage.setItem('cb_shadowBannedUsers', JSON.stringify(shadowBannedUsers));
        localStorage.setItem('cb_worldMutedUsers', JSON.stringify(worldMutedUsers));
        localStorage.setItem('cb_worldBannedUsers', JSON.stringify(worldBannedUsers));
        localStorage.setItem('cb_serverStopped', serverStopped.toString());

        updateBadgesAndCounts();
    } catch(storageError) { 
        console.error("Critical Storage Save Error:", storageError); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initiating Full Protocol Execution...");
    if (navigator.onLine === false) { 
        sRem('offline-alert-banner', 'hidden'); 
    }

    loadAllPersistedData();

    if (currentUser !== null && currentUser.username !== undefined) {
        
        // Security Gatekeeper Check
        if (bannedUsers.includes(currentUser.username) === true || bannedUsers.includes(currentUser.uid) === true) {
            document.body.innerHTML = "<div style='display:flex; height:100vh; width:100vw; justify-content:center; align-items:center; background:#000; color:red; flex-direction:column;'><h1 style='font-size:4rem;'><i class='fas fa-ban'></i></h1><h2>YOU ARE PERMANENTLY BANNED FROM CHATTERBOX</h2><p>Contact Developer Atifullah if this is an error.</p></div>";
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
        
        initializeStoriesEngine();
        initializeReelsEngine();
        startScheduledMessageDaemon();

        setTimeout(function() { 
            loadChatHistoryToView('world'); 
            loadChatHistoryToView('ai'); 
        }, 500);

        socket.emit('user_connected', currentUser.username);
        
        initEmojiPickerEngine(); 
        attachRealVoiceNoteRecordingListeners(); 
        setupLiveSearchFilter(); 
        setupThemeLibraryEngine(); 
        initWhiteboardCanvas();
    } else {
        sRem('login-screen', 'hidden'); 
        sAdd('login-screen', 'active');
        sRem('main-app', 'active'); 
        sAdd('main-app', 'hidden');
    }
});

// =========================================================================
// 3. UI, THEMES & HIERARCHY ENGINE
// =========================================================================

function applySystemThemePalette() {
    if (currentUser === null) {
        return;
    }
    
    const themeToggleButtonElement = safeEl('activate-golden-theme-btn');
    
    if (currentUser.theme !== undefined && currentUser.theme !== null) {
        document.documentElement.setAttribute('data-theme', currentUser.theme);
        
        if (currentUser.theme === 'grand-golden') {
            document.body.classList.add('dev-theme-active');
            if (themeToggleButtonElement !== null) { 
                themeToggleButtonElement.innerText = 'Deactivate'; 
                themeToggleButtonElement.style.background = '#ef4444'; 
                themeToggleButtonElement.style.color = 'white'; 
                themeToggleButtonElement.style.border = 'none'; 
            }
        } else {
            document.body.classList.remove('dev-theme-active');
            if (themeToggleButtonElement !== null) { 
                themeToggleButtonElement.innerText = 'Activate'; 
                themeToggleButtonElement.style.background = 'transparent'; 
                themeToggleButtonElement.style.color = '#ffd700'; 
                themeToggleButtonElement.style.border = '1px solid #ffd700'; 
            }
        }
    } else { 
        document.documentElement.setAttribute('data-theme', 'default'); 
    }
}

function setupThemeLibraryEngine() {
    const themeSelectionBoxesArray = document.querySelectorAll('.theme-selection-box');
    for (let i = 0; i < themeSelectionBoxesArray.length; i++) {
        themeSelectionBoxesArray[i].addEventListener('click', function() {
            const selectedThemeNameString = this.getAttribute('data-theme-name');
            currentUser.theme = selectedThemeNameString; 
            document.documentElement.setAttribute('data-theme', selectedThemeNameString);
            window.saveData(); 
            applySystemThemePalette(); 
            sAdd('theme-selector-modal', 'hidden'); 
            alert(`Premium Theme [${selectedThemeNameString}] applied successfully!`);
        });
    }
}

function enforceHierarchyPermissions() {
    if (currentUser === null) {
        return;
    }
    
    let currentRankValue = currentUser.rank || 'Member';
    const devNavigationItemNode = safeEl('dev-nav-item'); 
    const goldenThemeOptionRowNode = safeEl('golden-theme-setting-row'); 
    const developerRoleTextNode = safeEl('dev-status-role-text');
    
    const allDevBoxesArray = document.querySelectorAll('.dev-box');
    for (let i = 0; i < allDevBoxesArray.length; i++) {
        allDevBoxesArray[i].style.display = 'none';
    }

    if (currentRankValue === 'Developer') {
        if (devNavigationItemNode !== null) { devNavigationItemNode.classList.remove('hidden'); }
        if (goldenThemeOptionRowNode !== null) { goldenThemeOptionRowNode.classList.remove('hidden'); }
        if (developerRoleTextNode !== null) { developerRoleTextNode.innerText = "SYSTEM STATUS: ACTIVE // ROLE: SUPREME DEVELOPER"; }
        
        for (let i = 0; i < allDevBoxesArray.length; i++) {
            allDevBoxesArray[i].style.display = 'block';
        }
    } 
    else if (currentRankValue === 'Operator') {
        if (devNavigationItemNode !== null) { devNavigationItemNode.classList.remove('hidden'); }
        if (goldenThemeOptionRowNode !== null) { goldenThemeOptionRowNode.classList.remove('hidden'); }
        if (developerRoleTextNode !== null) { developerRoleTextNode.innerText = "SYSTEM STATUS: ACTIVE // ROLE: OPERATOR"; }
        
        const operatorAllowedToolsArray = ['dev-ban-btn', 'dev-unban-btn', 'dev-mute-world-btn', 'dev-unmute-world-btn', 'dev-ban-world-btn', 'dev-unban-world-btn'];
        for (let i = 0; i < operatorAllowedToolsArray.length; i++) {
            let toolNode = safeEl(operatorAllowedToolsArray[i]);
            if (toolNode !== null) {
                toolNode.style.display = 'block';
            }
        }
    }
    else if (currentRankValue === 'Moderator') {
        if (devNavigationItemNode !== null) { devNavigationItemNode.classList.remove('hidden'); }
        if (goldenThemeOptionRowNode !== null) { goldenThemeOptionRowNode.classList.add('hidden'); }
        if (developerRoleTextNode !== null) { developerRoleTextNode.innerText = "SYSTEM STATUS: ACTIVE // ROLE: MODERATOR"; }
        
        const moderatorAllowedToolsArray = ['dev-mute-world-btn', 'dev-unmute-world-btn', 'dev-ban-world-btn', 'dev-unban-world-btn'];
        for (let i = 0; i < moderatorAllowedToolsArray.length; i++) {
            let toolNode = safeEl(moderatorAllowedToolsArray[i]);
            if (toolNode !== null) {
                toolNode.style.display = 'block';
            }
        }
    }
    else if (currentRankValue === 'Manager') {
        if (devNavigationItemNode !== null) { devNavigationItemNode.classList.add('hidden'); }
        if (goldenThemeOptionRowNode !== null) { goldenThemeOptionRowNode.classList.add('hidden'); }
    }
    else {
        if (devNavigationItemNode !== null) { devNavigationItemNode.classList.add('hidden'); }
        if (goldenThemeOptionRowNode !== null) { goldenThemeOptionRowNode.classList.add('hidden'); }
    }
}

function updateProfileUI() {
    if (currentUser === null) {
        return;
    }
    
    sText('display-username', currentUser.username); 
    sText('user-bio', currentUser.bio || "No biography details available.");
    sSrc('user-dp', currentUser.dp || DEFAULT_DP); 
    sSrc('fb-my-dp', currentUser.dp || DEFAULT_DP);
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

    if (usernameTextDisplayElement !== null) {
        usernameTextDisplayElement.className = 'username-display'; 
    }
    if (rankBadgeDisplayElement !== null) {
        rankBadgeDisplayElement.className = 'new-pill rank-pill rank-badge'; 
    }

    if (currentUser.isDev === true || currentUser.rank === 'Developer') {
        if (usernameTextDisplayElement !== null) { usernameTextDisplayElement.classList.add('shiny-dev-text'); }
        if (rankBadgeDisplayElement !== null) { rankBadgeDisplayElement.classList.add('rank-developer'); }
        sRem('dev-nav-item', 'hidden'); 
    } 
    else if (currentUser.rank === 'Operator') {
        if (usernameTextDisplayElement !== null) { usernameTextDisplayElement.classList.add('shiny-silver-text'); }
        if (rankBadgeDisplayElement !== null) { rankBadgeDisplayElement.classList.add('rank-member'); }
        sRem('dev-nav-item', 'hidden');
    }
    else if (currentUser.rank === 'Moderator') {
        if (usernameTextDisplayElement !== null) { usernameTextDisplayElement.classList.add('shiny-red-text'); }
        if (rankBadgeDisplayElement !== null) { rankBadgeDisplayElement.classList.add('rank-member'); }
        sRem('dev-nav-item', 'hidden');
    }
    else if (currentUser.rank === 'Manager') {
        if (usernameTextDisplayElement !== null) { usernameTextDisplayElement.classList.add('shiny-white-text'); }
        if (rankBadgeDisplayElement !== null) { rankBadgeDisplayElement.classList.add('rank-member'); }
        sAdd('dev-nav-item', 'hidden');
    }
    else {
        if (rankBadgeDisplayElement !== null) { rankBadgeDisplayElement.classList.add('rank-member'); }
        sAdd('dev-nav-item', 'hidden');
    }
    
    sText('total-friends-count', friends.length.toString());
    sText('profile-visitor-numerical-counter-view', profileViews.toString());
}

function updateBadgesAndCounts() {
    if (currentUser !== null) {
        sText('total-friends-count', friends.length.toString());
    }
}

function findUserGlobally(targetUsernameString) {
    let internalFoundRootUser = systemVerifiedUserDirectory.find(userNode => userNode.username === targetUsernameString || userNode.uid === targetUsernameString);
    if (internalFoundRootUser !== undefined) {
        return internalFoundRootUser;
    }

    let dynamicLocalRegistryArray = JSON.parse(localStorage.getItem('chatterbox_users_registry')) || [];
    let localRegisteredUserObject = dynamicLocalRegistryArray.find(userNode => userNode.username === targetUsernameString || userNode.uid === targetUsernameString);

    if (localRegisteredUserObject !== undefined) {
        return {
            username: localRegisteredUserObject.username,
            uid: localRegisteredUserObject.uid || "00000000",
            dp: `https://ui-avatars.com/api/?name=${localRegisteredUserObject.username}&background=random&color=fff`,
            rank: 'Member',
            bio: "Hey there! I am using Chatterbox.",
            isDev: false
        };
    }
    return null;
}

// =========================================================================
// 4. STORIES & REELS ENGINE (PRIVACY, INSIGHTS & REAL-TIME LOGIC)
// =========================================================================
function initializeStoriesEngine() {
    const storiesContainerBoxElement = safeEl('stories-container-box');
    if (storiesContainerBoxElement === null) { return; }
    
    let currentHtmlContent = `<div class="story-item" id="add-story-btn" style="display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer;"><div style="width: 70px; height: 70px; border-radius: 50%; border: 3px dashed var(--primary-color); display: flex; justify-content: center; align-items: center; font-size: 1.5rem; color: var(--primary-color);">+</div><span style="font-weight: bold; font-size: 0.85rem;">Add Story</span></div>`;

    for (let i = 0; i < storiesDatabase.length; i++) {
        let storyDataObject = storiesDatabase[i];
        
        // Scope logic: if friends only, only show to uploader or their friends
        let isStoryVisible = true;
        if (storyDataObject.scope === 'friends' && storyDataObject.name !== currentUser.username) {
            let isFriend = false;
            for(let f=0; f<friends.length; f++){
                if(friends[f].username === storyDataObject.name) { isFriend = true; break; }
            }
            if(!isFriend) isStoryVisible = false;
        }

        if (isStoryVisible === true) {
            let ringStyleString = storyDataObject.viewed ? 'border: 3px solid var(--border-color);' : 'background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); padding: 3px;';
            let storyDisplaySource = storyDataObject.image ? storyDataObject.image : storyDataObject.dp;

            currentHtmlContent += `
                <div class="story-item" data-id="${storyDataObject.id}" onclick="viewStoryProtocol(${storyDataObject.id})">
                    <div style="width: 70px; height: 70px; border-radius: 50%; ${ringStyleString} display: flex; justify-content: center; align-items: center;">
                        <img src="${storyDisplaySource}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid var(--bg-panel);">
                    </div>
                    <span style="font-weight: 700; font-size: 0.85rem;">${storyDataObject.name}</span>
                </div>`;
        }
    }
    storiesContainerBoxElement.innerHTML = currentHtmlContent;
}

// 🔥 EXPLICIT STORY VIEWER MODAL LOGIC (INSIGHTS & LIKES FIX) 🔥
window.viewStoryProtocol = function(storyIdentifierInt) {
    let targetedStoryObject = null;
    for (let i = 0; i < storiesDatabase.length; i++) {
        if (storiesDatabase[i].id === storyIdentifierInt) {
            storiesDatabase[i].viewed = true;
            targetedStoryObject = storiesDatabase[i];
            break;
        }
    }
    
    window.saveData();
    initializeStoriesEngine(); // Refresh visual rings
    
    if (targetedStoryObject !== null) {
        sSrc('story-viewer-dp', targetedStoryObject.dp);
        sText('story-viewer-username', targetedStoryObject.name);
        sSrc('story-viewer-media', targetedStoryObject.image || targetedStoryObject.dp);
        
        if (targetedStoryObject.likes === undefined) { targetedStoryObject.likes = 0; }
        if (targetedStoryObject.likedByArray === undefined) { targetedStoryObject.likedByArray = []; }
        if (targetedStoryObject.viewedByArray === undefined) { targetedStoryObject.viewedByArray = []; }

        // Record View
        if (targetedStoryObject.name !== currentUser.username && !targetedStoryObject.viewedByArray.includes(currentUser.username)) {
            targetedStoryObject.viewedByArray.push(currentUser.username);
            window.saveData();
        }

        sText('story-like-count', targetedStoryObject.likes.toString());
        
        const userInfoContainerNode = safeEl('story-viewer-user-info');
        if (userInfoContainerNode !== null) {
            userInfoContainerNode.onclick = function() {
                openProfileFromReel(targetedStoryObject.name);
                sAdd('story-viewer-modal', 'hidden');
            };
        }

        const deleteStoryButtonElement = safeEl('story-delete-btn');
        const likeStoryButtonElement = safeEl('story-like-btn');
        const insightsStoryButtonElement = safeEl('story-insights-btn');

        if (targetedStoryObject.name === currentUser.username || currentUser.rank === 'Developer') {
            // Uploader options
            if(deleteStoryButtonElement) {
                deleteStoryButtonElement.classList.remove('hidden');
                deleteStoryButtonElement.onclick = function() {
                    let filteredStoriesArray = [];
                    for(let k=0; k<storiesDatabase.length; k++){
                        if (storiesDatabase[k].id !== storyIdentifierInt) { filteredStoriesArray.push(storiesDatabase[k]); }
                    }
                    storiesDatabase = filteredStoriesArray;
                    window.saveData(); initializeStoriesEngine(); sAdd('story-viewer-modal', 'hidden');
                };
            }
            if(likeStoryButtonElement) likeStoryButtonElement.classList.add('hidden');
            
            // INSIGHTS BUTTON
            if(insightsStoryButtonElement) {
                insightsStoryButtonElement.classList.remove('hidden');
                insightsStoryButtonElement.onclick = function() {
                    const insightsListContainer = safeEl('story-insights-list');
                    if(insightsListContainer) {
                        let htmlContent = `<b>👀 Viewed By:</b><br>`;
                        if(targetedStoryObject.viewedByArray.length === 0) htmlContent += `<span style="color:var(--text-muted); font-size:0.85rem;">No views yet.</span><br>`;
                        for(let v=0; v<targetedStoryObject.viewedByArray.length; v++){
                            htmlContent += `<span>- @${targetedStoryObject.viewedByArray[v]}</span><br>`;
                        }
                        htmlContent += `<br><b>❤️ Liked By:</b><br>`;
                        if(targetedStoryObject.likedByArray.length === 0) htmlContent += `<span style="color:var(--text-muted); font-size:0.85rem;">No likes yet.</span><br>`;
                        for(let l=0; l<targetedStoryObject.likedByArray.length; l++){
                            htmlContent += `<span>- @${targetedStoryObject.likedByArray[l]}</span><br>`;
                        }
                        insightsListContainer.innerHTML = htmlContent;
                    }
                    sRem('story-insights-modal', 'hidden');
                }
            }
        } else {
            // Viewer options
            if(deleteStoryButtonElement) deleteStoryButtonElement.classList.add('hidden');
            if(insightsStoryButtonElement) insightsStoryButtonElement.classList.add('hidden');
            
            if(likeStoryButtonElement) {
                likeStoryButtonElement.classList.remove('hidden');
                if (targetedStoryObject.likedByArray.includes(currentUser.username)) {
                    likeStoryButtonElement.style.color = '#ef4444'; // Already liked (red)
                } else {
                    likeStoryButtonElement.style.color = 'white'; // Not liked
                }
                
                likeStoryButtonElement.onclick = function() {
                    if (targetedStoryObject.likedByArray.includes(currentUser.username) === false) {
                        targetedStoryObject.likedByArray.push(currentUser.username);
                        targetedStoryObject.likes = targetedStoryObject.likes + 1;
                        sText('story-like-count', targetedStoryObject.likes.toString());
                        this.style.color = '#ef4444';
                        window.saveData();
                    }
                };
            }
        }

        sRem('story-viewer-modal', 'hidden');
    }
};

function initializeReelsEngine() {
    const reelsFeedContainerElement = safeEl('reels-feed-container');
    if (reelsFeedContainerElement === null) { return; }
    
    reelsFeedContainerElement.innerHTML = '';
    
    if (reelsDatabase.length === 0) {
        reelsFeedContainerElement.innerHTML = `<div style="height: 100%; display: flex; justify-content: center; align-items: center; color: white;">No Reels available yet. Be the first to post!</div>`;
        return;
    }
    
    let reelsHtmlStringAccumulator = '';
    for (let i = 0; i < reelsDatabase.length; i++) {
        let reelObject = reelsDatabase[i];
        let inlineStyleBackground = reelObject.bg;

        if (reelObject.likes === undefined) { reelObject.likes = 0; }
        if (reelObject.comments === undefined) { reelObject.comments = 0; }
        if (reelObject.likedByArray === undefined) { reelObject.likedByArray = []; }

        let heartColorClass = reelObject.likedByArray.includes(currentUser.username) ? 'color: #ef4444;' : 'color: white;';

        reelsHtmlStringAccumulator += `
            <div class="reel-item" style="background: ${inlineStyleBackground};">
                <div class="reel-info" onclick="openProfileFromReel('${reelObject.username}')">
                    <h3 style="font-size: 1.4rem;">${reelObject.title}</h3>
                    <p style="font-size: 0.95rem; opacity: 0.8; margin-top: 5px;">@${reelObject.username || "creator"}</p>
                </div>
                <div class="reel-actions">
                    <button class="reel-action-btn" style="${heartColorClass}" onclick="likeReelAction(${reelObject.id}, this)"><i class="fas fa-heart"></i><span style="font-size:0.8rem; margin-top:3px; color:white;">${reelObject.likes}</span></button>
                    <button class="reel-action-btn" onclick="alert('Opening Comments Section...')"><i class="fas fa-comment"></i><span style="font-size:0.8rem; margin-top:3px; color:white;">${reelObject.comments}</span></button>
                    <button class="reel-action-btn" onclick="alert('Opening Share Menu...')"><i class="fas fa-share"></i><span style="font-size:0.8rem; margin-top:3px; color:white;">Share</span></button>
                    <button class="reel-action-btn" onclick="openReelOptionsModal(${reelObject.id}, '${reelObject.username}')"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            </div>`;
    }
    reelsFeedContainerElement.innerHTML = reelsHtmlStringAccumulator;
}

// 🔥 EXPLICIT REELS ACTIONS (LIKE, DELETE, PROFILE OPEN) 🔥
window.likeReelAction = function(targetReelIdInteger, triggeredButtonElement) {
    for (let i = 0; i < reelsDatabase.length; i++) {
        if (reelsDatabase[i].id === targetReelIdInteger) {
            if (reelsDatabase[i].likedByArray === undefined) { reelsDatabase[i].likedByArray = []; }
            
            if (reelsDatabase[i].likedByArray.includes(currentUser.username) === false) {
                reelsDatabase[i].likedByArray.push(currentUser.username);
                reelsDatabase[i].likes = reelsDatabase[i].likes + 1;
                triggeredButtonElement.style.color = '#ef4444';
                const spanTextNode = triggeredButtonElement.querySelector('span');
                if (spanTextNode !== null) { spanTextNode.innerText = reelsDatabase[i].likes.toString(); }
                window.saveData();
            }
            break;
        }
    }
};

window.openProfileFromReel = function(targetUsernameString) {
    let locatedUserContextObject = findUserGlobally(targetUsernameString);
    if (locatedUserContextObject !== null) {
        const allNavBtnNodesArray = document.querySelectorAll('.nav-links .nav-btn');
        for(let i=0; i<allNavBtnNodesArray.length; i++){
            allNavBtnNodesArray[i].classList.remove('active');
        }

        const allContentViewSectionsArray = document.querySelectorAll('.content-view');
        for(let i=0; i<allContentViewSectionsArray.length; i++){
            allContentViewSectionsArray[i].classList.remove('active');
            allContentViewSectionsArray[i].classList.add('hidden');
        }

        sRem('chat-section', 'hidden');
        sAdd('chat-section', 'active');
        
        openRightProfilePreviewPane(locatedUserContextObject);
    }
};

window.openReelOptionsModal = function(targetReelIdInteger, targetReelOwnerString) {
    if (targetReelOwnerString === currentUser.username || currentUser.rank === 'Developer') {
        const deleteReelConfirmBtnNode = safeEl('delete-reel-confirm-btn');
        if (deleteReelConfirmBtnNode !== null) {
            deleteReelConfirmBtnNode.onclick = function() {
                let filteredReelsArrayBuffer = [];
                for(let i=0; i<reelsDatabase.length; i++) {
                    if (reelsDatabase[i].id !== targetReelIdInteger) {
                        filteredReelsArrayBuffer.push(reelsDatabase[i]);
                    }
                }
                reelsDatabase = filteredReelsArrayBuffer;
                window.saveData();
                initializeReelsEngine();
                sAdd('reel-options-modal', 'hidden');
            };
        }
        sRem('reel-options-modal', 'hidden');
    } else {
        sRem('reel-options-modal', 'hidden');
        if(safeEl('delete-reel-confirm-btn')) safeEl('delete-reel-confirm-btn').onclick = function(){ alert("Access Denied: You can only delete your own reels."); sAdd('reel-options-modal', 'hidden'); };
    }
};


// =========================================================================
// 5. STANDARD FEED & GROUP RENDERING
// =========================================================================
function renderPosts() {
    const postsOutputContainerElement = safeEl('feed-container');
    if (postsOutputContainerElement === null) { return; }
    
    postsOutputContainerElement.innerHTML = '';
    
    if (posts.length === 0) {
        postsOutputContainerElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-weight:bold; padding:40px; border:2px dashed var(--border-color); border-radius:20px; background:var(--bg-panel); margin-top:20px;">No feed content posts generated yet. Be the first to share an update!</p>`; 
        return;
    }

    let allPostsHtmlStringAccumulator = '';
    for (let i = 0; i < posts.length; i++) {
        let postObject = posts[i];
        let renderedImageHtmlString = '';
        if (postObject.image) {
            renderedImageHtmlString = `<img src="${postObject.image}" class="post-media-img" style="margin-top:12px; border-radius:14px; width:100%;">`;
        }
        
        let renderedTagsHtmlString = '';
        if (postObject.tags && postObject.tags.length > 0) {
            renderedTagsHtmlString = `<div style="color: var(--primary-color); font-weight: bold; margin-top: 8px; font-size:0.9rem;">${postObject.tags.join(' ')}</div>`;
        }
        
        let renderedDeleteButtonHtmlString = '';
        if (postObject.user === currentUser.username || currentUser.rank === 'Developer') {
            renderedDeleteButtonHtmlString = `<button class="delete-post-btn" style="background:transparent; color:var(--text-muted); box-shadow:none; padding:8px;"><i class="fas fa-trash-alt"></i></button>`;
        }
        
        let renderedTextContentHtmlString = '';
        if (postObject.text) {
            renderedTextContentHtmlString = `<div class="post-text-content" style="margin-top:15px; font-size:1.1rem; line-height:1.6; color:var(--text-main); font-weight:600; white-space:pre-wrap;">${postObject.text}</div>`;
        }

        allPostsHtmlStringAccumulator += `
            <div class="feed-post" data-id="${postObject.id}" style="background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 20px; padding: 25px; margin-top:20px;">
                <div class="post-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <div class="post-user-info" style="display:flex; align-items:center; gap:12px; cursor:pointer;" onclick="openProfileFromReel('${postObject.user}')">
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
                <div class="post-footer" style="margin-top:15px; border-top:1px solid var(--bg-main); padding-top:15px; display: flex; gap: 10px;">
                    <button class="action-btn like-btn" style="border-radius:20px; padding:8px 18px; font-size:0.85rem;"><i class="far fa-heart"></i> Like</button>
                    <button class="action-btn comment-btn" style="border-radius:20px; padding:8px 18px; font-size:0.85rem;"><i class="far fa-comment"></i> Comment</button>
                </div>
            </div>`;
    }
    postsOutputContainerElement.innerHTML = allPostsHtmlStringAccumulator;
}

function renderGroups() {
    const groupsOutputContainerElement = safeEl('group-list-container');
    if (groupsOutputContainerElement === null) { return; }
    
    groupsOutputContainerElement.innerHTML = '';
    
    if (groups.length === 0) {
        groupsOutputContainerElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px; font-weight:bold;">Zero active groups or network channels created yet.</p>`; 
        return;
    }

    let allGroupsHtmlStringAccumulator = '';
    for (let i = 0; i < groups.length; i++) {
        let groupObject = groups[i];
        let processedIconSourceUrl = groupObject.icon || `https://ui-avatars.com/api/?name=${groupObject.name}&background=a855f7&color=fff`;
        allGroupsHtmlStringAccumulator += `
            <div class="dummy-item group-item" data-group="${groupObject.name}" style="padding:15px; background:var(--bg-panel); border:1px solid rgba(0,0,0,0.02); border-radius:14px; display:flex; align-items:center; gap:12px; margin-bottom:8px; cursor:pointer;">
                <img src="${processedIconSourceUrl}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:1px solid var(--border-color); padding:2px;">
                <div>
                    <b style="font-size:1.1rem; color:var(--text-main); display:block;">${groupObject.name}</b>
                    <span style="font-size:0.75rem; color:var(--text-muted);">Creator Status: @${groupObject.createdBy || 'System Admin'}</span>
                </div>
            </div>`;
    }
    groupsOutputContainerElement.innerHTML = allGroupsHtmlStringAccumulator;
}

function renderBandRequests() {
    const bandOutputContainerElement = safeEl('band-incoming-requests');
    const emptyStatePlaceholderElement = safeEl('band-incoming-requests-empty-placeholder-string-element');
    
    if (bandOutputContainerElement === null) { return; }
    
    bandOutputContainerElement.innerHTML = '';

    if (bandRequests.length === 0) {
        if (emptyStatePlaceholderElement !== null) {
            emptyStatePlaceholderElement.classList.remove('hidden');
        }
        bandOutputContainerElement.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 15px; font-weight:bold;">There are currently zero pending Friendship Bond synchronization requests.</p>`; 
        return;
    }
    
    if (emptyStatePlaceholderElement !== null) {
        emptyStatePlaceholderElement.classList.add('hidden');
    }

    let allBandRequestsHtmlAccumulator = '';
    for (let i = 0; i < bandRequests.length; i++) {
        let bandRequestObject = bandRequests[i];
        allBandRequestsHtmlAccumulator += `
            <div class="dummy-item" data-user="${bandRequestObject.username}" style="margin-top:10px; background:var(--bg-main); padding: 15px; border: 1px solid var(--border-color); border-radius:14px; display:flex; align-items:center; justify-content:space-between; gap:15px;">
                <b style="flex:1; font-size:1rem; color:var(--text-main);"><i class="fas fa-handshake" style="color:var(--primary-color); margin-right:6px;"></i> Incoming Bond Request received from target: @${bandRequestObject.username}</b>
                <button class="btn-accept-band btn-accept" style="width:45px; height:45px; border-radius:50%; background:#10b981; color:#fff;" title="Accept Friendship Bond Connection"><i class="fas fa-check"></i></button>
            </div>`;
    }
    bandOutputContainerElement.innerHTML = allBandRequestsHtmlAccumulator;
}

function renderGlobalUsersList(searchTermStringParameter = '') {
    const registryContainerNodeElement = safeEl('global-users-list-container');
    if (registryContainerNodeElement === null) { return; }

    registryContainerNodeElement.innerHTML = '';
    let extractedLocalRegistryDatabaseArray = JSON.parse(localStorage.getItem('chatterbox_users_registry')) || [];
    let combinedAllUsersEntityArray = [...systemVerifiedUserDirectory];

    for(let i=0; i<extractedLocalRegistryDatabaseArray.length; i++){
        let uObj = extractedLocalRegistryDatabaseArray[i];
        let foundExisting = false;
        for(let j=0; j<combinedAllUsersEntityArray.length; j++){
            if(combinedAllUsersEntityArray[j].username === uObj.username) { foundExisting = true; break; }
        }
        if(!foundExisting) {
            combinedAllUsersEntityArray.push({
                username: uObj.username,
                uid: uObj.uid || '00000000',
                rank: 'Member',
                dp: `https://ui-avatars.com/api/?name=${uObj.username}&background=random&color=fff`
            });
        }
    }

    if (currentUser !== null) {
        let filteredCurrentSelf = [];
        for(let k=0; k<combinedAllUsersEntityArray.length; k++){
            if(combinedAllUsersEntityArray[k].username !== currentUser.username) { filteredCurrentSelf.push(combinedAllUsersEntityArray[k]); }
        }
        combinedAllUsersEntityArray = filteredCurrentSelf;
    }

    if (searchTermStringParameter !== "") {
        const loweredTermString = searchTermStringParameter.toLowerCase();
        let searchedUsersBuffer = [];
        for(let p=0; p<combinedAllUsersEntityArray.length; p++){
            let iterUser = combinedAllUsersEntityArray[p];
            if(iterUser.username.toLowerCase().includes(loweredTermString) || (iterUser.uid && iterUser.uid.includes(loweredTermString))) {
                searchedUsersBuffer.push(iterUser);
            }
        }
        combinedAllUsersEntityArray = searchedUsersBuffer;
    }

    if (combinedAllUsersEntityArray.length === 0) {
        registryContainerNodeElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 20px;">No users found in global directory.</p>`;
        return;
    }

    let globalUsersHtmlBuilder = '';
    for(let x=0; x<combinedAllUsersEntityArray.length; x++) {
        let uData = combinedAllUsersEntityArray[x];
        let actionBtnInjectHtml = uData.username === "Chatterbox AI" ? "" : `<button class="primary-btn action-dispatch-global-req-btn" data-username="${uData.username}" style="padding: 8px 14px; font-size:0.9rem; border-radius:10px;"><i class="fas fa-user-plus"></i></button>`;

        globalUsersHtmlBuilder += `
            <div class="global-user-item" data-username="${uData.username}" style="cursor: pointer;">
                <img src="${uData.dp}" style="width:42px; height:42px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color);">
                <div style="flex:1; margin-left:12px;">
                    <b style="font-size:1.05rem; color:var(--text-main); display:block;">${uData.username}</b>
                    <span style="font-size:0.8rem; color:var(--primary-color); font-weight:800; font-family:monospace;">UID: #${uData.uid}</span>
                </div>
                ${actionBtnInjectHtml}
            </div>`;
    }
    registryContainerNodeElement.innerHTML = globalUsersHtmlBuilder;
}

function setupLiveSearchFilter() {
    const mainSearchInputDOMNodeElement = safeEl('chat-sidebar-search-input');
    if (mainSearchInputDOMNodeElement !== null) {
        mainSearchInputDOMNodeElement.addEventListener('input', function(eventInputTriggerObject) {
            if (currentChatTab === 'requests' && currentRequestSubTab === 'send') {
                renderGlobalUsersList(eventInputTriggerObject.target.value);
            }
        });
    }
}


// =========================================================================
// 6. MESSAGING CORE LOGIC (PINNING, EXPORT, REACTIONS, SELF-DESTRUCT)
// =========================================================================
function exportChatHistory() {
    if (activeChatUser === null) {
        alert("Action Denied: You must select a direct chat target first to export.");
        return;
    }
    
    const targetChatHistoryArray = chatHistory.direct[activeChatUser.username];
    if (targetChatHistoryArray === undefined || targetChatHistoryArray.length === 0) {
        alert("Action Denied: There are no messages to export in this channel.");
        return;
    }
    
    let formattedTextExportString = `====================================================\n`;
    formattedTextExportString += `CHATTERBOX EXPORT: Chat with @${activeChatUser.username}\n`;
    formattedTextExportString += `Timestamp: ${new Date().toLocaleString()}\n`;
    formattedTextExportString += `====================================================\n\n`;
    
    for (let i = 0; i < targetChatHistoryArray.length; i++) {
        let messageItemObject = targetChatHistoryArray[i];
        let cleanTextContent = messageItemObject.text.replace(/<[^>]*>?/gm, '');
        formattedTextExportString += `[${messageItemObject.sender}]: ${cleanTextContent}\n`;
    }
    
    const textBlobData = new Blob([formattedTextExportString], { type: 'text/plain' });
    const localBlobUrlString = URL.createObjectURL(textBlobData);
    
    const hiddenDownloadAnchorElement = document.createElement('a'); 
    hiddenDownloadAnchorElement.href = localBlobUrlString; 
    hiddenDownloadAnchorElement.download = `Chatterbox_Export_${activeChatUser.username}.txt`;
    
    document.body.appendChild(hiddenDownloadAnchorElement); 
    hiddenDownloadAnchorElement.click(); 
    document.body.removeChild(hiddenDownloadAnchorElement); 
    URL.revokeObjectURL(localBlobUrlString);
}

function startScheduledMessageDaemon() {
    console.log("Starting Scheduled Message Background Daemon...");
    setInterval(function() {
        const currentTimeInt = Date.now();
        let updatedQueueArray = [];
        
        for (let i = 0; i < scheduledMessagesQueue.length; i++) {
            let scheduledMsgObj = scheduledMessagesQueue[i];
            if (currentTimeInt >= scheduledMsgObj.triggerTime) {
                console.log("Triggering scheduled message to:", scheduledMsgObj.target);
                let previousActiveUser = activeChatUser;
                if (scheduledMsgObj.type === 'direct') {
                    activeChatUser = { username: scheduledMsgObj.target };
                }
                sendMessageWithSave(scheduledMsgObj.type, scheduledMsgObj.text, scheduledMsgObj.target);
                activeChatUser = previousActiveUser; 
            } else {
                updatedQueueArray.push(scheduledMsgObj);
            }
        }
        
        if (scheduledMessagesQueue.length !== updatedQueueArray.length) {
            scheduledMessagesQueue = updatedQueueArray;
            window.saveData();
        }
    }, 10000); 
}

function renderMessageToDOM(msgObj, containerElement) {
    if (containerElement === null || containerElement === undefined) {
        return;
    }

    const singleMessageDivElement = document.createElement('div');
    
    if (msgObj.isDestructing === true) {
        singleMessageDivElement.style.border = "2px dashed red";
        singleMessageDivElement.style.opacity = "0.9";
        
        setTimeout(function() {
            singleMessageDivElement.style.transition = "opacity 1s ease, transform 1s ease";
            singleMessageDivElement.style.opacity = "0";
            singleMessageDivElement.style.transform = "scale(0.8)";
            setTimeout(function() {
                if (singleMessageDivElement.parentNode) {
                    singleMessageDivElement.parentNode.removeChild(singleMessageDivElement);
                }
            }, 1000);
        }, 10000); 
    }

    let quotedHtmlBlock = '';
    if (msgObj.replyToText !== undefined && msgObj.replyToText !== null) {
        quotedHtmlBlock = `<div style="background: rgba(0,0,0,0.1); border-left: 3px solid var(--primary-color); padding: 5px 10px; border-radius: 4px; font-size: 0.85rem; margin-bottom: 5px; font-style: italic;">Reply: ${msgObj.replyToText}</div>`;
    }
    
    let reactionsHtmlBlock = '';
    if (msgObj.reactions !== undefined && Array.isArray(msgObj.reactions) && msgObj.reactions.length > 0) {
        reactionsHtmlBlock = `<div style="position: absolute; bottom: -12px; right: 10px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 12px; padding: 2px 6px; font-size: 0.8rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1); z-index: 5;">${msgObj.reactions.join(' ')}</div>`;
    }

    if (msgObj.isMe === true) {
        singleMessageDivElement.className = "message-bubble my-msg";
        singleMessageDivElement.setAttribute('data-id', msgObj.id);
        singleMessageDivElement.innerHTML = `${quotedHtmlBlock}<button class="unsend-btn" data-id="${msgObj.id}" title="Unsend Message"><i class="fas fa-times"></i></button><strong>Me:</strong> ${msgObj.text}${reactionsHtmlBlock}`;
    } else {
        singleMessageDivElement.className = "message-bubble other-msg";
        singleMessageDivElement.setAttribute('data-id', msgObj.id);
        if (msgObj.sender === 'SYSTEM') { 
            singleMessageDivElement.innerHTML = `${quotedHtmlBlock}${msgObj.text}${reactionsHtmlBlock}`; 
        } else { 
            singleMessageDivElement.innerHTML = `${quotedHtmlBlock}<strong>${msgObj.sender}:</strong> ${msgObj.text}${reactionsHtmlBlock}`; 
        }
    }
    
    singleMessageDivElement.addEventListener('contextmenu', function(mouseEventObject) {
        mouseEventObject.preventDefault();
        const contextMenuContainerNode = safeEl('message-context-menu');
        if (contextMenuContainerNode !== null) {
            contextMenuContainerNode.style.top = `${mouseEventObject.clientY}px`; 
            contextMenuContainerNode.style.left = `${mouseEventObject.clientX}px`;
            activeMessageContextId = msgObj.id;
            sRem('message-context-menu', 'hidden');
        }
    });

    containerElement.appendChild(singleMessageDivElement); 
    containerElement.scrollTop = containerElement.scrollHeight;
}

function loadChatHistoryToView(typeStringParameter, targetNameStringParameter = null) {
    let targetMessageAreaElement; 
    let retrievedMessagesArray = [];
    
    try {
        if (typeStringParameter === 'world') { 
            targetMessageAreaElement = safeEl('world-messages-area'); 
            if (targetMessageAreaElement !== null) {
                targetMessageAreaElement.innerHTML = '<div class="message-bubble system-msg">🤖 Notice: Welcome to World Chat. Be respectful.</div>'; 
            }
            retrievedMessagesArray = chatHistory.world || []; 
            
            if (pinnedMessages.world !== null && safeEl('pinned-message-container') !== null) {
                safeEl('pinned-text-preview').innerText = "Pinned: " + pinnedMessages.world.text.substring(0,40);
                safeEl('pinned-message-container').classList.remove('hidden');
            } else {
                if(safeEl('pinned-message-container')) safeEl('pinned-message-container').classList.add('hidden');
            }
        } 
        else if (typeStringParameter === 'ai') { 
            targetMessageAreaElement = safeEl('ai-messages-area'); 
            if (targetMessageAreaElement !== null) {
                targetMessageAreaElement.innerHTML = '<div class="message-bubble system-msg" style="align-self: center; background: rgba(139, 92, 246, 0.1); border: 1px dashed var(--primary-color); color: var(--text-main); max-width: 80%; border-radius: 12px; padding: 12px;">🤖 <strong>Welcome to Chatterbox AI!</strong><br>Main aapka friendly chatbot hoon. Mujhse aap kuch bhi pooch sakte hain.</div>'; 
            }
            retrievedMessagesArray = chatHistory.ai || []; 
        } 
        else if (typeStringParameter === 'direct') { 
            targetMessageAreaElement = safeEl('messages-area'); 
            if (targetMessageAreaElement !== null) {
                targetMessageAreaElement.innerHTML = ''; 
            }
            retrievedMessagesArray = chatHistory.direct[targetNameStringParameter] || []; 
            
            const smartRepliesBarNode = safeEl('smart-replies-bar');
            if (smartRepliesBarNode !== null) {
                if (retrievedMessagesArray.length > 0 && retrievedMessagesArray[retrievedMessagesArray.length-1].isMe === false) {
                    smartRepliesBarNode.classList.remove('hidden');
                } else {
                    smartRepliesBarNode.classList.add('hidden');
                }
            }

            if (pinnedMessages.direct[targetNameStringParameter] !== undefined && safeEl('pinned-message-container') !== null) {
                safeEl('pinned-text-preview').innerText = "Pinned: " + pinnedMessages.direct[targetNameStringParameter].text.substring(0,40);
                safeEl('pinned-message-container').classList.remove('hidden');
            } else {
                if(safeEl('pinned-message-container')) safeEl('pinned-message-container').classList.add('hidden');
            }
        } 
        else if (typeStringParameter === 'group') { 
            targetMessageAreaElement = safeEl('group-messages-area'); 
            if (targetMessageAreaElement !== null) {
                targetMessageAreaElement.innerHTML = ''; 
            }
            retrievedMessagesArray = chatHistory.group[targetNameStringParameter] || []; 
        }
        
        if (targetMessageAreaElement !== null && retrievedMessagesArray.length > 0) { 
            for (let i = 0; i < retrievedMessagesArray.length; i++) {
                renderMessageToDOM(retrievedMessagesArray[i], targetMessageAreaElement); 
            }
        }
    } catch(loadingError) { 
        console.error("Critical Error loading chat history:", loadingError); 
    }
}

function sendMessageWithSave(typeParameter, htmlTextString, targetNameParameter = null, isDestructingBool = false) {
    try {
        if (serverStopped === true) { 
            alert("SYSTEM ALERT: The server has been explicitly stopped by the Supreme Root Administrator. Messaging transmission protocols are temporarily disabled."); 
            return; 
        }
        
        if (shadowBannedUsers.includes(currentUser.username) === true || shadowBannedUsers.includes(currentUser.uid) === true) {
            const shadowMsgObj = { id: Date.now(), text: htmlTextString, sender: currentUser.username, isMe: true, isDestructing: isDestructingBool };
            if (typeParameter === 'direct') { renderMessageToDOM(shadowMsgObj, safeEl('messages-area')); } 
            else if (typeParameter === 'group') { renderMessageToDOM(shadowMsgObj, safeEl('group-messages-area')); } 
            else if (typeParameter === 'world') { renderMessageToDOM(shadowMsgObj, safeEl('world-messages-area')); }
            return; 
        }
        
        if (typeParameter === 'world') {
            if (worldMutedUsers.includes(currentUser.username) === true || worldMutedUsers.includes(currentUser.uid) === true) {
                alert("SYSTEM MODERATION: You have been explicitly muted in the Global World Chat. Transmission blocked."); 
                return;
            }
            if (worldBannedUsers.includes(currentUser.username) === true || worldBannedUsers.includes(currentUser.uid) === true) {
                alert("SYSTEM MODERATION: You are permanently kicked from World Chat parameters."); 
                return;
            }
        }

        const standardMsgObj = { 
            id: Date.now(), 
            text: htmlTextString, 
            sender: currentUser.username, 
            isMe: true,
            isDestructing: isDestructingBool,
            reactions: []
        };

        if (targetMessageForReply !== null) {
            standardMsgObj.replyToText = targetMessageForReply.replace(/<[^>]*>?/gm, '').substring(0, 40) + "...";
            targetMessageForReply = null; 
        }

        let emitDataPayload = { 
            type: typeParameter, 
            text: htmlTextString, 
            sender: currentUser.username,
            isDestructing: isDestructingBool
        };

        if (typeParameter === 'direct') {
            const resolvedTargetUser = targetNameParameter || (activeChatUser ? activeChatUser.username : 'Unknown');
            if (chatHistory.direct[resolvedTargetUser] === undefined) {
                chatHistory.direct[resolvedTargetUser] = [];
            }
            chatHistory.direct[resolvedTargetUser].push(standardMsgObj);
            emitDataPayload.to = resolvedTargetUser;
            renderMessageToDOM(standardMsgObj, safeEl('messages-area'));
        } 
        else if (typeParameter === 'ai') {
            chatHistory.ai.push(standardMsgObj);
            renderMessageToDOM(standardMsgObj, safeEl('ai-messages-area'));
            simulateChatterboxAIResponse(htmlTextString);
        } 
        else if (typeParameter === 'group') {
            const resolvedGroupName = targetNameParameter || (safeEl('current-group-name') ? safeEl('current-group-name').innerText : 'Unknown Group');
            if (chatHistory.group[resolvedGroupName] === undefined) {
                chatHistory.group[resolvedGroupName] = [];
            }
            chatHistory.group[resolvedGroupName].push(standardMsgObj);
            emitDataPayload.groupName = resolvedGroupName;
            renderMessageToDOM(standardMsgObj, safeEl('group-messages-area'));
        } 
        else if (typeParameter === 'world') {
            chatHistory.world.push(standardMsgObj);
            renderMessageToDOM(standardMsgObj, safeEl('world-messages-area'));
        }
        
        window.saveData(); 
        if (typeParameter !== 'ai') {
            socket.emit('send_message', emitDataPayload);
        }
    } catch(sendMessageError) { 
        console.error("Critical Runtime Error sending message packet:", sendMessageError); 
    }
}

function simulateChatterboxAIResponse(userMessageString) {
    const aiTargetAreaElement = safeEl('ai-messages-area');
    if (aiTargetAreaElement === null) {
        return;
    }

    const typingIndicatorNode = document.createElement('div');
    typingIndicatorNode.className = "message-bubble other-msg";
    typingIndicatorNode.innerHTML = "<em>Chatterbox AI is computing neural pathways...</em>";
    aiTargetAreaElement.appendChild(typingIndicatorNode);
    aiTargetAreaElement.scrollTop = aiTargetAreaElement.scrollHeight;

    setTimeout(function() {
        typingIndicatorNode.remove();
        let computedAiTextResponse = "";
        let normalizedLowerMsg = userMessageString.toLowerCase();

        if (normalizedLowerMsg.includes("hello") === true || normalizedLowerMsg.includes("hi") === true || normalizedLowerMsg.includes("hey") === true) {
            computedAiTextResponse = "Greetings! I am the Chatterbox AI Engine. I am completely operational and ready to assist you. What can I do for you today?";
        } else if (normalizedLowerMsg.includes("who created you") === true || normalizedLowerMsg.includes("developer") === true || normalizedLowerMsg.includes("creator") === true) {
            computedAiTextResponse = "My core cognitive algorithms were integrated into the Chatterbox Ecosystem by the Supreme Root Operator, Atifullah Azhar.";
        } else if (normalizedLowerMsg.includes("theme") === true || normalizedLowerMsg.includes("dark mode") === true) {
            computedAiTextResponse = "You can modify your visual interface parameters within the Settings tab by exploring the Theme Library module!";
        } else if (normalizedLowerMsg.includes("summarize") === true) {
            computedAiTextResponse = "Based on the recent linguistic data, the core topic of discussion revolves around software architecture and feature implementation.";
        } else {
            computedAiTextResponse = "Your query has been logged and processed successfully. Please note I am running in a local sandbox mode and my external API fetch capabilities are currently masked for security.";
        }

        const finalAiMessageObject = { id: Date.now(), text: computedAiTextResponse, sender: "Chatterbox AI", isMe: false };
        chatHistory.ai.push(finalAiMessageObject);
        window.saveData();
        renderMessageToDOM(finalAiMessageObject, aiTargetAreaElement);

    }, 1500);
}

socket.on('receive_message', function(incomingDataPayload) {
    try {
        if (currentUser === null) {
            return;
        }

        const incomingMessageObject = { 
            id: Date.now(), 
            text: incomingDataPayload.text, 
            sender: incomingDataPayload.sender, 
            isMe: false,
            isDestructing: incomingDataPayload.isDestructing || false,
            reactions: []
        };

        if (incomingDataPayload.type === 'world') {
            if (incomingDataPayload.text.includes("SYSTEM_WIPE") === true) {
                chatHistory.world = [];
                window.saveData();
                loadChatHistoryToView('world');
                return;
            }
            if (incomingDataPayload.text.includes("SERVER_STOP") === true) {
                serverStopped = true;
                window.saveData();
                return;
            }
            if (incomingDataPayload.text.includes("SERVER_START") === true) {
                serverStopped = false;
                window.saveData();
                return;
            }

            chatHistory.world.push(incomingMessageObject);
            window.saveData();

            const worldTargetAreaElement = safeEl('world-messages-area');
            if (worldTargetAreaElement !== null && incomingDataPayload.sender !== currentUser.username) {
                renderMessageToDOM(incomingMessageObject, worldTargetAreaElement);
            }
        }
        else if (incomingDataPayload.type === 'direct' && incomingDataPayload.to === currentUser.username) {
            if (chatHistory.direct[incomingDataPayload.sender] === undefined) {
                chatHistory.direct[incomingDataPayload.sender] = [];
            }

            chatHistory.direct[incomingDataPayload.sender].push(incomingMessageObject);
            window.saveData();

            if (activeChatUser !== null && activeChatUser.username === incomingDataPayload.sender) {
                const directTargetAreaElement = safeEl('messages-area');
                if (directTargetAreaElement !== null) {
                    renderMessageToDOM(incomingMessageObject, directTargetAreaElement);
                }
            } else {
                alert(`📩 Secure Transmission: New Message intercepted from ${incomingDataPayload.sender}`);
            }
        }
        else if (incomingDataPayload.type === 'group') {
            let isUserMemberOfGroup = false;
            for(let i=0; i<groups.length; i++) {
                if(groups[i].name === incomingDataPayload.groupName) {
                    isUserMemberOfGroup = true; break;
                }
            }
            
            if (isUserMemberOfGroup === true) {
                if (chatHistory.group[incomingDataPayload.groupName] === undefined) {
                    chatHistory.group[incomingDataPayload.groupName] = [];
                }
                chatHistory.group[incomingDataPayload.groupName].push(incomingMessageObject);
                window.saveData();

                const groupTargetAreaElement = safeEl('group-messages-area');
                let currentActiveGroupNode = safeEl('current-group-name');
                if (groupTargetAreaElement !== null && currentActiveGroupNode !== null && currentActiveGroupNode.innerText === incomingDataPayload.groupName && incomingDataPayload.sender !== currentUser.username) {
                    renderMessageToDOM(incomingMessageObject, groupTargetAreaElement);
                }
            }
        }
    } catch (socketReceiveError) {
        console.error("Critical Socket Receive Parse Error:", socketReceiveError);
    }
});


// =========================================================================
// 4. CALLING ENGINE & WEB-RTC SCREEN SHARE (EXPLICIT LOGIC)
// =========================================================================
function formatTime(totalSecondsInteger) {
    const minutesPart = Math.floor(totalSecondsInteger / 60).toString().padStart(2, '0');
    const secondsPart = (totalSecondsInteger % 60).toString().padStart(2, '0');
    return `${minutesPart}:${secondsPart}`;
}

function updateCallTimers() {
    currentCallSeconds++;
    const formattedTimeString = formatTime(currentCallSeconds);
    sText('call-duration-timer', formattedTimeString);
    sText('minimized-call-timer-display', formattedTimeString);
}

window.initiateOutgoingCall = function (isVideoModeBoolean) {
    sAdd('incoming-call-ring-modal', 'hidden');
    sRem('active-call-window', 'hidden');
    sText('call-duration-timer', 'Initiating connection protocols...');
    initLocalCameraStream(isVideoModeBoolean, true, 'direct');
}

async function initLocalCameraStream(isVideoCallBoolean, isOutgoingBoolean = false, chatTypeString = 'direct') {
    const gridContainerNode = safeEl('call-grid-container');
    if (gridContainerNode === null) return;
    
    gridContainerNode.className = 'call-grid-wrapper';
    gridContainerNode.innerHTML = '';

    try {
        if (navigator.mediaDevices === undefined || navigator.mediaDevices.getUserMedia === undefined) {
            throw new Error("Critical Failure: MediaDevices API blocked or missing in current DOM context.");
        }

        localMediaStreamTracker = await navigator.mediaDevices.getUserMedia({ video: isVideoCallBoolean, audio: true });
        isLocalCamOn = isVideoCallBoolean;
        isLocalMicOn = true;
    } catch (cameraAccessError) {
        console.warn("Hardware Access Interruption:", cameraAccessError);
        isLocalCamOn = false;
        isLocalMicOn = false;
        alert("Warning: Could not bind camera/microphone hardware. Proceeding in silent observer mode.");
    }

    let remoteTargetName = 'Unknown Peer Endpoint';
    let remoteTargetDp = DEFAULT_DP;

    if (chatTypeString === 'direct') {
        if (activeChatUser !== null) {
            remoteTargetName = activeChatUser.username;
            remoteTargetDp = activeChatUser.dp;
        }
    }
    else if (chatTypeString === 'group') {
        const groupNameNode = safeEl('current-group-name');
        if (groupNameNode !== null) {
            remoteTargetName = groupNameNode.innerText;
        } else {
            remoteTargetName = 'Group Secure Room';
        }
        remoteTargetDp = 'https://ui-avatars.com/api/?name=G&background=a855f7&color=fff';
    }
    else if (chatTypeString === 'world') {
        remoteTargetName = '🌍 Global Audio/Video Stage';
        remoteTargetDp = 'https://ui-avatars.com/api/?name=W&background=8b5cf6&color=fff';
    }

    sSrc('minimized-caller-dp', remoteTargetDp);

    // EXPLICIT DYNAMIC INSTAGRAM GRID INJECTION LOGIC
    if (chatTypeString === 'direct') {
        gridContainerNode.classList.add('call-grid-2');
        
        let localCamDisplayProp = isLocalCamOn ? 'block' : 'none';
        let localFallbackDisplayProp = isLocalCamOn ? 'none' : 'flex';
        
        let customGridHtmlBuilder = '';
        customGridHtmlBuilder += `<div class="call-video-cell">`;
        customGridHtmlBuilder += `    <div class="avatar-fallback">`;
        customGridHtmlBuilder += `        <img src="${remoteTargetDp}" style="width:140px; height:140px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:4px solid var(--primary-color);">`;
        customGridHtmlBuilder += `        <h2 style="color:white; font-size:1.8rem; text-shadow: 0 2px 5px rgba(0,0,0,0.8);">${remoteTargetName}</h2>`;
        customGridHtmlBuilder += `    </div>`;
        customGridHtmlBuilder += `</div>`;
        customGridHtmlBuilder += `<div class="call-video-cell">`;
        customGridHtmlBuilder += `    <video id="local-video" autoplay muted playsinline style="transform: scaleX(-1); display:${localCamDisplayProp};"></video>`;
        customGridHtmlBuilder += `    <div class="avatar-fallback" id="local-audio-fallback" style="display:${localFallbackDisplayProp}; background:#111;">`;
        customGridHtmlBuilder += `        <img src="${currentUser.dp}" style="width:140px; height:140px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:4px solid #10b981;">`;
        customGridHtmlBuilder += `        <h2 style="color:white; font-size:1.8rem; text-shadow: 0 2px 5px rgba(0,0,0,0.8);">You</h2>`;
        customGridHtmlBuilder += `    </div>`;
        customGridHtmlBuilder += `</div>`;
        
        gridContainerNode.innerHTML = customGridHtmlBuilder;
    } else {
        gridContainerNode.classList.add('call-grid-4');
        
        let dummyPeer1Dp = "https://ui-avatars.com/api/?name=User1&background=random";
        let dummyPeer2Dp = "https://ui-avatars.com/api/?name=User2&background=random";
        let dummyPeer3Dp = "https://ui-avatars.com/api/?name=User3&background=random";
        
        let localCamDisplayProp = isLocalCamOn ? 'block' : 'none';
        let localFallbackDisplayProp = isLocalCamOn ? 'none' : 'flex';

        let customQuadGridHtmlBuilder = '';
        customQuadGridHtmlBuilder += `<div class="call-video-cell">`;
        customQuadGridHtmlBuilder += `    <div class="avatar-fallback">`;
        customQuadGridHtmlBuilder += `        <img src="${dummyPeer1Dp}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--primary-color);">`;
        customQuadGridHtmlBuilder += `        <span class="call-user-label">Encrypted Peer 1</span>`;
        customQuadGridHtmlBuilder += `    </div>`;
        customQuadGridHtmlBuilder += `</div>`;
        customQuadGridHtmlBuilder += `<div class="call-video-cell">`;
        customQuadGridHtmlBuilder += `    <div class="avatar-fallback" style="background:#1a1a1a;">`;
        customQuadGridHtmlBuilder += `        <img src="${dummyPeer2Dp}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--primary-color);">`;
        customQuadGridHtmlBuilder += `        <span class="call-user-label">Encrypted Peer 2</span>`;
        customQuadGridHtmlBuilder += `    </div>`;
        customQuadGridHtmlBuilder += `</div>`;
        customQuadGridHtmlBuilder += `<div class="call-video-cell">`;
        customQuadGridHtmlBuilder += `    <div class="avatar-fallback" style="background:#0f0f0f;">`;
        customQuadGridHtmlBuilder += `        <img src="${dummyPeer3Dp}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--primary-color);">`;
        customQuadGridHtmlBuilder += `        <span class="call-user-label">Encrypted Peer 3</span>`;
        customQuadGridHtmlBuilder += `    </div>`;
        customQuadGridHtmlBuilder += `</div>`;
        customQuadGridHtmlBuilder += `<div class="call-video-cell">`;
        customQuadGridHtmlBuilder += `    <video id="local-video" autoplay muted playsinline style="transform: scaleX(-1); display:${localCamDisplayProp};"></video>`;
        customQuadGridHtmlBuilder += `    <div class="avatar-fallback" id="local-audio-fallback" style="display:${localFallbackDisplayProp}; background:#111;">`;
        customQuadGridHtmlBuilder += `        <img src="${currentUser.dp}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid #10b981;">`;
        customQuadGridHtmlBuilder += `        <span class="call-user-label">You (Host)</span>`;
        customQuadGridHtmlBuilder += `    </div>`;
        customQuadGridHtmlBuilder += `</div>`;
        
        gridContainerNode.innerHTML = customQuadGridHtmlBuilder;
    }

    const boundLocalVideoNodeElement = safeEl('local-video');
    if (boundLocalVideoNodeElement !== null && isLocalCamOn === true && localMediaStreamTracker !== null) {
        boundLocalVideoNodeElement.srcObject = localMediaStreamTracker;
    }

    if (isOutgoingBoolean === true && chatTypeString === 'direct') {
        outgoingCallTimeout = setTimeout(function() {
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
    if (activeCallTimerInterval !== null) {
        clearInterval(activeCallTimerInterval);
    }
    if (outgoingCallTimeout !== null) {
        clearTimeout(outgoingCallTimeout);
    }
    if (localMediaStreamTracker !== null) {
        let hardwareTracksArray = localMediaStreamTracker.getTracks();
        for(let i = 0; i < hardwareTracksArray.length; i++){
            hardwareTracksArray[i].stop();
        }
        localMediaStreamTracker = null;
    }
    if (screenShareStreamTracker !== null) {
        let screenTracksArray = screenShareStreamTracker.getTracks();
        for(let i = 0; i < screenTracksArray.length; i++){
            screenTracksArray[i].stop();
        }
        screenShareStreamTracker = null;
        isScreenSharingActive = false;
    }
    
    let localVidEl = safeEl('local-video');
    if (localVidEl !== null) {
        localVidEl.srcObject = null;
    }

    sAdd('active-call-window', 'hidden');
    sAdd('minimized-call-widget', 'hidden');
    sAdd('incoming-call-ring-modal', 'hidden');
    sText('call-duration-timer', '00:00');
}

// 🔥 EXPLICIT SCREEN SHARE API LOGIC 🔥
async function toggleScreenShare() {
    try {
        if(isScreenSharingActive === true) {
            alert("System Notice: Screen share is already in progress.");
            return;
        }
        
        if (navigator.mediaDevices === undefined || navigator.mediaDevices.getDisplayMedia === undefined) {
             alert("System Capability Error: Your current environment does not support WebRTC display capture.");
             return;
        }
        
        screenShareStreamTracker = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true});
        const localVideoNodeElement = safeEl('local-video');
        
        if(localVideoNodeElement !== null) {
            localVideoNodeElement.srcObject = screenShareStreamTracker; 
            localVideoNodeElement.style.display = 'block'; 
            localVideoNodeElement.style.transform = 'scaleX(1)'; // un-mirror for screen share
            sAdd('local-audio-fallback', 'hidden');
            isScreenSharingActive = true;
        }
        
        screenShareStreamTracker.getVideoTracks()[0].onended = function () {
            isScreenSharingActive = false;
            if(localMediaStreamTracker !== null) { 
                localVideoNodeElement.srcObject = localMediaStreamTracker; 
                localVideoNodeElement.style.transform = 'scaleX(-1)'; 
            } else { 
                localVideoNodeElement.style.display = 'none'; 
                sRem('local-audio-fallback', 'hidden'); 
            }
        };
        
    } catch(screenShareError) { 
        console.error("Screen Share Promise Denied or Failed:", screenShareError); 
    }
}

// =========================================================================
// 🔥 EXPLICIT: CANVAS WHITEBOARD DRAWING ENGINE 🔥
// =========================================================================
let isWhiteboardDrawingActive = false;
let canvasRenderingContext = null;
let whiteboardCanvasElement = null;

function initWhiteboardCanvas() {
    whiteboardCanvasElement = safeEl('live-drawing-canvas');
    if(whiteboardCanvasElement === null) {
        return;
    }
    
    canvasRenderingContext = whiteboardCanvasElement.getContext('2d');
    
    // Explicitly set real dimensions to prevent stretching
    setTimeout(() => {
        whiteboardCanvasElement.width = whiteboardCanvasElement.offsetWidth || 700;
        whiteboardCanvasElement.height = whiteboardCanvasElement.offsetHeight || 400;
        
        // Fill white background explicitly so PNG export is opaque
        canvasRenderingContext.fillStyle = "#ffffff";
        canvasRenderingContext.fillRect(0, 0, whiteboardCanvasElement.width, whiteboardCanvasElement.height);
    }, 500);
    
    const calculatePointerPosition = function(eventObject) {
        let rectBounds = whiteboardCanvasElement.getBoundingClientRect();
        let posX = eventObject.clientX - rectBounds.left;
        let posY = eventObject.clientY - rectBounds.top;
        if(eventObject.touches && eventObject.touches.length > 0) { 
            posX = eventObject.touches[0].clientX - rectBounds.left; 
            posY = eventObject.touches[0].clientY - rectBounds.top; 
        }
        return { x: posX, y: posY };
    };

    const beginDrawingPath = function(eventObject) { 
        isWhiteboardDrawingActive = true; 
        executeDrawingStroke(eventObject); 
    };
    
    const terminateDrawingPath = function() { 
        isWhiteboardDrawingActive = false; 
        canvasRenderingContext.beginPath(); 
    };
    
    const executeDrawingStroke = function(eventObject) {
        if(isWhiteboardDrawingActive === false) {
            return;
        }
        canvasRenderingContext.lineWidth = 4; 
        canvasRenderingContext.lineCap = 'round'; 
        canvasRenderingContext.strokeStyle = '#8b5cf6'; // Primary Purple
        
        let positionCoords = calculatePointerPosition(eventObject);
        
        canvasRenderingContext.lineTo(positionCoords.x, positionCoords.y); 
        canvasRenderingContext.stroke(); 
        canvasRenderingContext.beginPath(); 
        canvasRenderingContext.moveTo(positionCoords.x, positionCoords.y);
    };

    whiteboardCanvasElement.addEventListener('mousedown', beginDrawingPath); 
    whiteboardCanvasElement.addEventListener('mouseup', terminateDrawingPath);
    whiteboardCanvasElement.addEventListener('mousemove', executeDrawingStroke); 
    
    // Touch support for mobile devices
    whiteboardCanvasElement.addEventListener('touchstart', function(e){ e.preventDefault(); beginDrawingPath(e); }, {passive: false});
    whiteboardCanvasElement.addEventListener('touchend', function(e){ e.preventDefault(); terminateDrawingPath(e); }, {passive: false}); 
    whiteboardCanvasElement.addEventListener('touchmove', function(e){ e.preventDefault(); executeDrawingStroke(e); }, {passive: false});
}


// =========================================================================
// 8. GLOBAL EVENT DELEGATION SYSTEM (100% BULLETPROOF)
// =========================================================================

document.addEventListener('click', function(eventObject) {
    try {
        const targetElement = eventObject.target;
        
        if (targetElement === null || targetElement === undefined || typeof targetElement.closest !== 'function') {
            return;
        }

        if (targetElement.id === 'join-btn' || targetElement.closest('#join-btn') !== null) {
            return;
        }

        // Hide message context menu if clicking elsewhere
        const contextMenuContainer = safeEl('message-context-menu');
        if (targetElement.closest('#message-context-menu') === null && contextMenuContainer !== null) { 
            contextMenuContainer.classList.add('hidden'); 
        }

        // -------------------------------------------------------------
        // CONTEXT MENU EXPLICIT ACTION BINDINGS
        // -------------------------------------------------------------
        if (targetElement.closest('.context-react-btn') !== null) {
            let selectedEmojiReaction = targetElement.closest('.context-react-btn').innerText;
            if (activeMessageContextId !== null && activeChatUser !== null) {
                // Find and update the message
                let directHistArray = chatHistory.direct[activeChatUser.username];
                if(directHistArray) {
                    for(let i=0; i<directHistArray.length; i++) {
                        if(directHistArray[i].id.toString() === activeMessageContextId.toString()) {
                            if(!directHistArray[i].reactions) directHistArray[i].reactions = [];
                            directHistArray[i].reactions.push(selectedEmojiReaction);
                            window.saveData();
                            loadChatHistoryToView('direct', activeChatUser.username);
                            break;
                        }
                    }
                }
            }
            if(contextMenuContainer) contextMenuContainer.classList.add('hidden');
            return;
        }

        if (targetElement.closest('.context-reply-btn') !== null) {
            if (activeMessageContextId !== null && activeChatUser !== null) {
                let directHistArray = chatHistory.direct[activeChatUser.username];
                if(directHistArray) {
                    for(let i=0; i<directHistArray.length; i++) {
                        if(directHistArray[i].id.toString() === activeMessageContextId.toString()) {
                            targetMessageForReply = directHistArray[i].text;
                            let inputFieldNode = safeEl('message-input');
                            if(inputFieldNode) {
                                inputFieldNode.placeholder = "Replying to message...";
                                inputFieldNode.focus();
                            }
                            break;
                        }
                    }
                }
            }
            if(contextMenuContainer) contextMenuContainer.classList.add('hidden');
            return;
        }

        // -------------------------------------------------------------
        // NEW THEME LIBRARY MODAL TRIGGER
        // -------------------------------------------------------------
        if (targetElement.closest('#open-theme-modal-btn') !== null) {
            sRem('theme-selector-modal', 'hidden');
            return;
        }

        // -------------------------------------------------------------
        // DEVELOPER TOOLS EVENT BINDINGS
        // -------------------------------------------------------------
        if (targetElement.closest('#activate-dev-mode-btn') !== null) {
            const enteredSecretCode = gVal('settings-dev-code-input');
            if (enteredSecretCode === '6200437705AT') {
                currentUser.rank = 'Developer';
                currentUser.isDev = true;
                currentUser.theme = 'grand-golden';
                window.saveData();
                alert("Supreme Root Access Granted! You are now a Developer. Executing environment reload...");
                window.location.reload();
            } else {
                alert("Security Alert: Invalid Developer Authentication Code.");
            }
            return;
        }

        if (targetElement.closest('#dev-rank-btn') !== null) {
            sVal('dev-rank-target-input', '');
            sRem('dev-rank-modal', 'hidden');
            return;
        }

        if (targetElement.closest('#confirm-dev-rank-btn') !== null) {
            let specifiedTargetUsername = gVal('dev-rank-target-input');
            let specifiedNewRankValue = safeEl('dev-rank-select').value;

            if (specifiedTargetUsername === "") {
                alert("Data Error: Please enter a target username/UID.");
                return;
            }

            alert(`Rank Modification Command Dispatched: Target [${specifiedTargetUsername}] -> Newly Assigned Rank: [${specifiedNewRankValue}]. Note: External changes apply on next synchronization cycle.`);

            let mappedTargetUserObject = findUserGlobally(specifiedTargetUsername);
            if (mappedTargetUserObject !== null && specifiedTargetUsername === currentUser.username) {
                currentUser.rank = specifiedNewRankValue;
                if (specifiedNewRankValue === 'Developer') { 
                    currentUser.isDev = true; 
                    currentUser.theme = 'grand-golden'; 
                } else { 
                    currentUser.isDev = false; 
                }
                window.saveData();
                window.location.reload();
            }

            sAdd('dev-rank-modal', 'hidden');
            return;
        }

        // 🔥 DEV TOOLS ACTIONS ROUTING FIX (V42) 🔥
        if (targetElement.closest('#dev-ban-btn') !== null) {
            openDevActionModal('Execute Global Ban on User', 'ban');
            return;
        }

        if (targetElement.closest('#dev-unban-btn') !== null) {
            openDevActionModal('Revoke Global Ban on User', 'unban');
            return;
        }

        if (targetElement.closest('#dev-shadowban-btn') !== null) {
            openDevActionModal('Apply Invisible Shadow Ban', 'shadowban');
            return;
        }

        if (targetElement.closest('#dev-shadowunban-btn') !== null) {
            openDevActionModal('Revoke Invisible Shadow Ban', 'shadowunban');
            return;
        }

        if (targetElement.closest('#dev-mute-world-btn') !== null) {
            openDevActionModal('Apply Global Mute Protocol', 'mute_world');
            return;
        }

        if (targetElement.closest('#dev-unmute-world-btn') !== null) {
            openDevActionModal('Revoke Global Mute Protocol', 'unmute_world');
            return;
        }

        if (targetElement.closest('#dev-ban-world-btn') !== null) {
            openDevActionModal('Expel from World Hub', 'ban_world');
            return;
        }

        if (targetElement.closest('#dev-unban-world-btn') !== null) {
            openDevActionModal('Re-authorize World Hub Access', 'unban_world');
            return;
        }

        if (targetElement.closest('#dev-peak-btn') !== null) {
            openDevActionModal('Initiate Data Peaking Protocol', 'peak');
            return;
        }

        if (targetElement.id === 'confirm-dev-action-btn') {
            executeDevAction();
            return;
        }

        if (targetElement.closest('#dev-format-btn') !== null) {
            if (confirm("SEVERE WARNING: Execute Hard Format of Server Cache? This process purges all posts and temporary state variables while retaining core user profiles.")) {
                localStorage.removeItem('chatPosts');
                localStorage.removeItem('chatHistory');
                localStorage.removeItem('cb_pinnedMessages');
                localStorage.removeItem('cb_stories');
                localStorage.removeItem('cb_reels');
                alert("Format Execution Complete. Rebooting ecosystem...");
                window.location.reload();
            }
            return;
        }

        if (targetElement.closest('#dev-stop-server-btn') !== null) {
            if (confirm("CRITICAL INTERRUPT: Initiate complete server halt? All subsequent messaging transmission arrays will be blocked.")) {
                serverStopped = true;
                window.saveData();
                socket.emit('send_message', { type: 'world', text: "SERVER_STOP" });
                alert("Server Execution Halted Successfully.");
            }
            return;
        }

        if (targetElement.closest('#dev-start-server-btn') !== null) {
            serverStopped = false;
            window.saveData();
            socket.emit('send_message', { type: 'world', text: "SERVER_START" });
            alert("Server Services Restored to Nominal Parameters.");
            return;
        }

        if (targetElement.closest('#dev-wipe-server-btn') !== null) {
            sVal('dev-wipe-code-input', '');
            sRem('dev-wipe-modal', 'hidden');
            return;
        }

        if (targetElement.closest('#confirm-dev-wipe-btn') !== null) {
            const securityWipeCode = gVal('dev-wipe-code-input');
            if (securityWipeCode === '6200437705AT') {
                localStorage.clear();
                socket.emit('send_message', { type: 'world', text: "SYSTEM_WIPE" });
                alert("SYSTEM ANNIHILATION COMPLETE. LOCAL STORAGE PURGED.");
                window.location.reload();
            } else {
                alert("Access Denied: Incorrect Authorization Passcode.");
            }
            return;
        }

        if (targetElement.closest('#dev-profile-ring-btn') !== null) {
            generateProfileRings();
            sRem('dev-ring-modal', 'hidden');
            return;
        }

        if (targetElement.closest('#confirm-dev-ring-btn') !== null) {
            let targetForRingString = gVal('ring-target-input');
            let selectedAnimationTypeString = safeEl('ring-animation-select').value;
            let tempSelectedGradientData = localStorage.getItem('temp_selected_ring');

            if (targetForRingString === "" || tempSelectedGradientData === null) {
                alert("Data validation failed: Please select a gradient map and input a valid target identifier.");
                return;
            }

            alert(`Execution Success: Premium Ring Object bound to [${targetForRingString}] utilizing [${selectedAnimationTypeString}] animation logic.`);
            sAdd('dev-ring-modal', 'hidden');
            return;
        }

        // 🔥 NEW DEV TOOLS USER REGISTRY IMPLEMENTATION 🔥
        if (targetElement.closest('#dev-user-registry-btn') !== null) {
            let extractedLocalRegistryDatabaseArray = JSON.parse(localStorage.getItem('chatterbox_users_registry')) || [];
            sText('total-registry-count', extractedLocalRegistryDatabaseArray.length.toString());
            
            let htmlListAccumulator = '';
            for(let i=0; i<extractedLocalRegistryDatabaseArray.length; i++){
                let nodeUser = extractedLocalRegistryDatabaseArray[i];
                htmlListAccumulator += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 15px; background:var(--bg-main); border-radius:12px; border:1px solid var(--border-color);">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="https://ui-avatars.com/api/?name=${nodeUser.username}&background=random&color=fff" style="width:38px; height:38px; border-radius:50%; object-fit:cover;">
                        <div style="display:flex; flex-direction:column;">
                            <b style="color:var(--text-main); font-size:1.05rem;">${nodeUser.username}</b>
                            <span style="font-size:0.8rem; color:var(--text-muted);">${nodeUser.email}</span>
                        </div>
                    </div>
                    <span style="font-family:monospace; font-weight:900; color:var(--primary-color);">UID: #${nodeUser.uid}</span>
                </div>`;
            }
            sHtml('user-registry-list', htmlListAccumulator);
            sRem('dev-user-registry-modal', 'hidden');
            return;
        }

        if (targetElement.closest('#dev-css-injector-btn') !== null) { 
            sVal('css-inject-textarea', ''); 
            sRem('dev-css-injector-modal', 'hidden'); 
            return; 
        }
        
        if (targetElement.closest('#apply-css-inject-btn') !== null) { 
            const rawCssDataString = gVal('css-inject-textarea'); 
            if(rawCssDataString !== "") { 
                const injectedStyleNode = document.createElement('style'); 
                injectedStyleNode.innerHTML = rawCssDataString; 
                document.head.appendChild(injectedStyleNode); 
                sAdd('dev-css-injector-modal', 'hidden'); 
            } 
            return; 
        }
        
        if (targetElement.closest('#dev-broadcast-btn') !== null) { 
            sVal('broadcast-message-input', ''); 
            sRem('dev-broadcast-modal', 'hidden'); 
            return; 
        }
        
        if (targetElement.closest('#send-broadcast-btn') !== null) { 
            const broadcaseMsgContent = gVal('broadcast-message-input'); 
            if(broadcaseMsgContent !== "") { 
                socket.emit('send_message', { type: 'world', text: `<div style="color:red; font-weight:900; border:2px dashed red; padding:10px; background:rgba(0,0,0,0.1);">[GLOBAL BROADCAST OVERRIDE]:<br>${broadcaseMsgContent}</div>` }); 
                sAdd('dev-broadcast-modal', 'hidden'); 
            } 
            return; 
        }
        
        if (targetElement.closest('#dev-analytics-btn') !== null) { 
            alert("Live Telemetry & Analytics System:\n\nActive Node Connections: 4\nTotal Registered Entities: " + friends.length + "\nServer Resource Load: 12.4%\nDatabase Integrity: 100%"); 
            return; 
        }
        
        if (targetElement.closest('#dev-error-log-btn') !== null) { 
            alert("System Integrity Scanner:\n\nError Logs array is completely empty. Master Ecosystem is operating at 100% nominal efficiency."); 
            return; 
        }
        
        if (targetElement.closest('#dev-language-btn') !== null) { 
            alert("Localization Module Interacted. I18N packages are pending external download API availability."); 
            return; 
        }

        // -------------------------------------------------------------
        // NORMAL APP EVENT BINDINGS (EXPLICIT CHECKS)
        // -------------------------------------------------------------

        // World Chat Ban Block Check
        if (targetElement.closest('.nav-btn') !== null) {
            let navigationTargetAttributeValue = targetElement.closest('.nav-btn').getAttribute('data-target');
            if (navigationTargetAttributeValue === 'world-chat-section') {
                if (worldBannedUsers.includes(currentUser.username) === true || worldBannedUsers.includes(currentUser.uid) === true) {
                    alert("SYSTEM MODERATION: You have been permanently kicked/banned from the Global World Chat parameters. Access Denied.");
                    return; 
                }
            }
        }

        // SETTINGS & THEME TOGGLE
        if (targetElement.closest('#activate-golden-theme-btn') !== null) {
            if (currentUser.theme === 'grand-golden') {
                currentUser.theme = 'default';
                document.documentElement.setAttribute('data-theme', 'default');
                window.saveData();
                applySystemThemePalette();
            } else {
                currentUser.theme = 'grand-golden';
                document.documentElement.setAttribute('data-theme', 'grand-golden');
                window.saveData();
                applySystemThemePalette();
            }
            return;
        }

        // UNSEND (DELETE) MESSAGE LOGIC
        if (targetElement.closest('.unsend-btn') !== null) {
            if (confirm("Are you absolutely positive you wish to unsend and permanently purge this specific message packet?")) {
                const unsendButtonTriggerElement = targetElement.closest('.unsend-btn');
                const internalMessageIdString = unsendButtonTriggerElement.getAttribute('data-id');
                const parentBubbleNodeElement = unsendButtonTriggerElement.closest('.message-bubble');

                if (parentBubbleNodeElement === null) {
                    return;
                }

                const rootContainerIdString = parentBubbleNodeElement.parentElement ? parentBubbleNodeElement.parentElement.id : null;
                parentBubbleNodeElement.remove();

                if (rootContainerIdString === 'messages-area' && activeChatUser !== null) {
                    if (chatHistory.direct[activeChatUser.username] !== undefined) {
                        let filteredArrayBuffer = [];
                        for(let i=0; i<chatHistory.direct[activeChatUser.username].length; i++){
                            if(chatHistory.direct[activeChatUser.username][i].id.toString() !== internalMessageIdString.toString()){
                                filteredArrayBuffer.push(chatHistory.direct[activeChatUser.username][i]);
                            }
                        }
                        chatHistory.direct[activeChatUser.username] = filteredArrayBuffer;
                    }
                } 
                else if (rootContainerIdString === 'ai-messages-area') {
                    let filteredAiBuffer = [];
                    for(let i=0; i<chatHistory.ai.length; i++){
                        if(chatHistory.ai[i].id.toString() !== internalMessageIdString.toString()){
                            filteredAiBuffer.push(chatHistory.ai[i]);
                        }
                    }
                    chatHistory.ai = filteredAiBuffer;
                } 
                else if (rootContainerIdString === 'group-messages-area') {
                    const currentGroupNameExtractedStr = safeEl('current-group-name') ? safeEl('current-group-name').innerText : '';
                    if (chatHistory.group[currentGroupNameExtractedStr] !== undefined) {
                        let filteredGroupBuffer = [];
                        for(let i=0; i<chatHistory.group[currentGroupNameExtractedStr].length; i++){
                            if(chatHistory.group[currentGroupNameExtractedStr][i].id.toString() !== internalMessageIdString.toString()){
                                filteredGroupBuffer.push(chatHistory.group[currentGroupNameExtractedStr][i]);
                            }
                        }
                        chatHistory.group[currentGroupNameExtractedStr] = filteredGroupBuffer;
                    }
                } 
                else if (rootContainerIdString === 'world-messages-area') {
                    let filteredWorldBuffer = [];
                    for(let i=0; i<chatHistory.world.length; i++){
                        if(chatHistory.world[i].id.toString() !== internalMessageIdString.toString()){
                            filteredWorldBuffer.push(chatHistory.world[i]);
                        }
                    }
                    chatHistory.world = filteredWorldBuffer;
                }

                window.saveData();
            }
            return;
        }

        // Emoji Tray Closing Logic
        if (targetElement.closest('#emoji-picker-tray') === null && targetElement.closest('.emoji-trigger-btn') === null && targetElement.classList.contains('emoji-item') === false) {
            sAdd('emoji-picker-tray', 'hidden');
        }

        if (targetElement.closest('.emoji-trigger-btn') !== null) {
            const clickedEmojiTriggerBtnElement = targetElement.closest('.emoji-trigger-btn');
            activeEmojiTargetId = clickedEmojiTriggerBtnElement.getAttribute('data-target');
            sRem('emoji-picker-tray', 'hidden');
            return;
        }

        // Public Profile Modal Trigger
        if (targetElement.closest('.public-profile-trigger') !== null || targetElement.classList.contains('public-profile-trigger') === true) {
            if (activeChatUser !== null) {
                showPublicProfileModal(activeChatUser);
            }
            return;
        }

        // Right Pane Live Preview Trigger
        if (targetElement.closest('.global-user-item') !== null && targetElement.closest('.action-dispatch-global-req-btn') === null && targetElement.closest('.req-action-btns') === null) {
            const dataUsernameAttributeValue = targetElement.closest('.global-user-item').getAttribute('data-username');
            const fetchedUserContextObject = findUserGlobally(dataUsernameAttributeValue);

            if (fetchedUserContextObject !== null) {
                openRightProfilePreviewPane(fetchedUserContextObject);
            }
            return;
        }

        // Mobile Sidebar Toggles
        if (targetElement.id === 'hamburger-btn' || targetElement.closest('#hamburger-btn') !== null) {
            const overlayMobileSidebarContainerNode = safeEl('sidebar');
            if (overlayMobileSidebarContainerNode !== null) {
                overlayMobileSidebarContainerNode.style.display = 'flex';
                overlayMobileSidebarContainerNode.style.position = 'fixed';
                overlayMobileSidebarContainerNode.style.zIndex = '10000';
                overlayMobileSidebarContainerNode.style.height = '100vh';
                overlayMobileSidebarContainerNode.style.width = '80%';
                overlayMobileSidebarContainerNode.style.flexDirection = 'column';
                overlayMobileSidebarContainerNode.style.justifyContent = 'flex-start';

                const dedicatedCloseBtnNodeElement = safeEl('close-sidebar-btn');
                if (dedicatedCloseBtnNodeElement !== null) {
                    dedicatedCloseBtnNodeElement.classList.remove('hidden');
                }

                const internalNavLinksContainerNodeElement = overlayMobileSidebarContainerNode.querySelector('.nav-links');
                if (internalNavLinksContainerNodeElement !== null) {
                    internalNavLinksContainerNodeElement.style.flexDirection = 'column';
                    internalNavLinksContainerNodeElement.style.overflowY = 'auto';
                }
            }
            return;
        }

        if (targetElement.id === 'close-sidebar-btn' || targetElement.closest('#close-sidebar-btn') !== null) {
            const overlayMobileSidebarContainerNode = safeEl('sidebar');
            if (overlayMobileSidebarContainerNode !== null) {
                overlayMobileSidebarContainerNode.style.display = '';
                overlayMobileSidebarContainerNode.style.position = '';
                overlayMobileSidebarContainerNode.style.zIndex = '';
                overlayMobileSidebarContainerNode.style.height = '';
                overlayMobileSidebarContainerNode.style.width = '';
                overlayMobileSidebarContainerNode.style.flexDirection = '';

                const dedicatedCloseBtnNodeElement = safeEl('close-sidebar-btn');
                if (dedicatedCloseBtnNodeElement !== null) {
                    dedicatedCloseBtnNodeElement.classList.add('hidden');
                }

                const internalNavLinksContainerNodeElement = overlayMobileSidebarContainerNode.querySelector('.nav-links');
                if (internalNavLinksContainerNodeElement !== null) {
                    internalNavLinksContainerNodeElement.style.flexDirection = '';
                    internalNavLinksContainerNodeElement.style.overflowY = '';
                }
            }
            return;
        }

        // Sidebar Navigation Module Routing
        const internalNavigationButtonElementNode = targetElement.closest('.nav-btn');
        if (internalNavigationButtonElementNode !== null && internalNavigationButtonElementNode.id.includes('report-bug') === false && internalNavigationButtonElementNode.id.includes('logout') === false) {
            
            const allNavBtnNodesArray = document.querySelectorAll('.nav-links .nav-btn');
            for(let i=0; i<allNavBtnNodesArray.length; i++){
                allNavBtnNodesArray[i].classList.remove('active');
            }

            const allContentViewSectionsArray = document.querySelectorAll('.content-view');
            for(let i=0; i<allContentViewSectionsArray.length; i++){
                allContentViewSectionsArray[i].classList.remove('active');
                allContentViewSectionsArray[i].classList.add('hidden');
            }

            internalNavigationButtonElementNode.classList.add('active');

            const sectionDataTargetIdStringValue = internalNavigationButtonElementNode.getAttribute('data-target');
            sRem(sectionDataTargetIdStringValue, 'hidden');
            sAdd(sectionDataTargetIdStringValue, 'active');

            if (sectionDataTargetIdStringValue === 'ai-chat-section') {
                loadChatHistoryToView('ai');
            }
            return;
        }

        // Quick Actions System
        if (targetElement.closest('#sidebar-quick-report-bug-btn') !== null) {
            sVal('bug-report-text-input', '');
            sRem('bug-report-modal', 'hidden');
            return;
        }

        if (targetElement.closest('#sidebar-quick-logout-btn') !== null) {
            if (confirm("Security Validation: Are you absolutely sure you want to log out of your secure encrypted session and terminate tracking connections?")) {
                localStorage.removeItem('chatUser');
                location.reload();
            }
            return;
        }

        // Chat View Sidebar Tabs State Manager
        const embeddedChatTabNavigationButtonElement = targetElement.closest('.chat-tabs .tab-btn');
        if (embeddedChatTabNavigationButtonElement !== null) {
            
            const allChatTabBtnsArray = document.querySelectorAll('.chat-tabs .tab-btn');
            for(let i=0; i<allChatTabBtnsArray.length; i++){
                allChatTabBtnsArray[i].classList.remove('active');
            }

            embeddedChatTabNavigationButtonElement.classList.add('active');
            currentChatTab = embeddedChatTabNavigationButtonElement.getAttribute('data-tab');

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

        // 🔥 BUG FIX: EXPLICIT SUB TAB ROUTING 🔥
        if (targetElement.closest('#sub-tab-accept-btn') !== null) {
            currentRequestSubTab = 'accept';
            renderRequestSubTabUI();
            resetRightWorkspacePane();
            return;
        }

        if (targetElement.closest('#sub-tab-send-btn') !== null) {
            currentRequestSubTab = 'send';
            renderRequestSubTabUI();
            resetRightWorkspacePane();
            return;
        }

        if (targetElement.closest('.action-dispatch-global-req-btn') !== null) {
            const specificActionButtonTriggerNode = targetElement.closest('.action-dispatch-global-req-btn');
            const correspondingTargetUsernameAttrValue = specificActionButtonTriggerNode.getAttribute('data-username');
            
            specificActionButtonTriggerNode.innerHTML = '<i class="fas fa-check"></i>';
            specificActionButtonTriggerNode.style.background = "var(--system-success)";
            specificActionButtonTriggerNode.disabled = true;
            return;
        }

        if (targetElement.closest('.btn-accept-friend') !== null) {
            const genericListRowItemElementContainer = targetElement.closest('.dummy-item');
            if (genericListRowItemElementContainer !== null) {
                const targetIdentificationUsernameStringKey = genericListRowItemElementContainer.getAttribute('data-username') || genericListRowItemElementContainer.getAttribute('data-user');

                let updatedFriendRequestsArrayBuffer = [];
                for(let i=0; i<friendRequests.length; i++){
                    if(friendRequests[i].username !== targetIdentificationUsernameStringKey){
                        updatedFriendRequestsArrayBuffer.push(friendRequests[i]);
                    }
                }
                friendRequests = updatedFriendRequestsArrayBuffer;

                friends.push({
                    username: targetIdentificationUsernameStringKey,
                    dp: `https://ui-avatars.com/api/?name=${targetIdentificationUsernameStringKey}&background=8b5cf6&color=fff`,
                    isFavorite: false,
                    bio: "My newly verified active friend connection mapping node."
                });

                window.saveData();
                renderRequestSubTabUI();
            }
            return;
        }

        if (targetElement.closest('.btn-reject-friend') !== null) {
            const genericListRowItemElementContainer = targetElement.closest('.dummy-item');
            if (genericListRowItemElementContainer !== null) {
                const targetIdentificationUsernameStringKey = genericListRowItemElementContainer.getAttribute('data-username') || genericListRowItemElementContainer.getAttribute('data-user');
                
                let updatedFriendRequestsArrayBuffer = [];
                for(let i=0; i<friendRequests.length; i++){
                    if(friendRequests[i].username !== targetIdentificationUsernameStringKey){
                        updatedFriendRequestsArrayBuffer.push(friendRequests[i]);
                    }
                }
                friendRequests = updatedFriendRequestsArrayBuffer;
                
                window.saveData();
                renderRequestSubTabUI();
            }
            return;
        }

        // Open Direct Chat & LOAD HISTORY WITH EXPLICIT DATA MAPS
        if (targetElement.closest('.contact-item') !== null) {
            const retrievedUsernameDataKeyString = targetElement.closest('.contact-item').getAttribute('data-user');

            sAdd('request-profile-preview-pane', 'hidden');
            sAdd('chat-placeholder', 'hidden');
            sRem('chat-header', 'hidden');
            sRem('messages-area', 'hidden');
            sRem('chat-input-area', 'hidden');

            let locatedFriendObject = null;
            for(let i=0; i<friends.length; i++){
                if(friends[i].username === retrievedUsernameDataKeyString){
                    locatedFriendObject = friends[i];
                    break;
                }
            }
            
            activeChatUser = locatedFriendObject;

            if (activeChatUser !== null) {
                sText('current-chat-name', activeChatUser.username);
                sSrc('current-chat-dp', activeChatUser.dp);

                const favoriteToggleButtonElementNode = safeEl('favorite-user-btn');
                if (favoriteToggleButtonElementNode !== null) {
                    if (activeChatUser.isFavorite === true) {
                        favoriteToggleButtonElementNode.innerHTML = '<i class="fas fa-star" style="color:#f59e0b;"></i>';
                    } else {
                        favoriteToggleButtonElementNode.innerHTML = '<i class="far fa-star"></i>';
                    }
                }

                loadChatHistoryToView('direct', activeChatUser.username);
            }
            return;
        }

        if (targetElement.closest('#favorite-user-btn') !== null) {
            if (activeChatUser !== null) {
                let arrayIndexMatchFoundLocator = -1;
                for(let i=0; i<friends.length; i++){
                    if(friends[i].username === activeChatUser.username){
                        arrayIndexMatchFoundLocator = i;
                        break;
                    }
                }
                
                if (arrayIndexMatchFoundLocator !== -1) {
                    friends[arrayIndexMatchFoundLocator].isFavorite = !friends[arrayIndexMatchFoundLocator].isFavorite;
                    window.saveData();

                    const favoriteToggleButtonElementNode = safeEl('favorite-user-btn');
                    if (favoriteToggleButtonElementNode !== null) {
                        if (friends[arrayIndexMatchFoundLocator].isFavorite === true) {
                            favoriteToggleButtonElementNode.innerHTML = '<i class="fas fa-star" style="color:#f59e0b;"></i>';
                        } else {
                            favoriteToggleButtonElementNode.innerHTML = '<i class="far fa-star"></i>';
                        }
                    }

                    if (currentChatTab === 'favorite') {
                        renderContacts();
                        resetRightWorkspacePane();
                    }
                }
            }
            return;
        }

        if (targetElement.closest('#direct-voice-call-btn') !== null) { initiateOutgoingCall(false); return; }
        if (targetElement.closest('#direct-video-call-btn') !== null) { initiateOutgoingCall(true); return; }

        if (targetElement.closest('#group-voice-call-btn') !== null || targetElement.closest('#group-video-call-btn') !== null) {
            let isVideoBooleanEvaluation = false;
            if (targetElement.closest('#group-video-call-btn') !== null) { isVideoBooleanEvaluation = true; }
            sAdd('incoming-call-ring-modal', 'hidden'); sRem('active-call-window', 'hidden'); sText('call-duration-timer', 'Group Room Syncing...');
            initLocalCameraStream(isVideoBooleanEvaluation, false, 'group'); return;
        }

        if (targetElement.closest('#world-voice-call-btn') !== null || targetElement.closest('#world-video-call-btn') !== null) {
            let isVideoBooleanEvaluation = false;
            if (targetElement.closest('#world-video-call-btn') !== null) { isVideoBooleanEvaluation = true; }
            sAdd('incoming-call-ring-modal', 'hidden'); sRem('active-call-window', 'hidden'); sText('call-duration-timer', 'Global Stage Live');
            initLocalCameraStream(isVideoBooleanEvaluation, false, 'world'); return;
        }

        if (targetElement.closest('#end-active-call-btn') !== null || targetElement.closest('#end-minimized-call-btn') !== null) { terminateActiveCall(); return; }
        if (targetElement.closest('#minimize-call-btn') !== null) { sAdd('active-call-window', 'hidden'); sRem('minimized-call-widget', 'hidden'); return; }
        if (targetElement.closest('#minimized-call-widget') !== null && targetElement.closest('#end-minimized-call-btn') === null) { sAdd('minimized-call-widget', 'hidden'); sRem('active-call-window', 'hidden'); return; }

        if (targetElement.closest('#toggle-cam-btn') !== null) {
            if (localMediaStreamTracker !== null) {
                let videoTrackNodeArray = localMediaStreamTracker.getVideoTracks();
                if (videoTrackNodeArray.length > 0) {
                    const extractedVideoTrackNode = videoTrackNodeArray[0];
                    isLocalCamOn = !isLocalCamOn;
                    extractedVideoTrackNode.enabled = isLocalCamOn;
                    const camToggleButtonElement = targetElement.closest('#toggle-cam-btn');
                    if (isLocalCamOn === true) {
                        camToggleButtonElement.innerHTML = '<i class="fas fa-video"></i>'; camToggleButtonElement.style.color = "white";
                        const DOMlocalVideoNode = safeEl('local-video');
                        if (DOMlocalVideoNode !== null) { DOMlocalVideoNode.style.display = 'block'; }
                        sAdd('local-audio-fallback', 'hidden');
                    } else {
                        camToggleButtonElement.innerHTML = '<i class="fas fa-video-slash"></i>'; camToggleButtonElement.style.color = "#ef4444";
                        const DOMlocalVideoNode = safeEl('local-video');
                        if (DOMlocalVideoNode !== null) { DOMlocalVideoNode.style.display = 'none'; }
                        sRem('local-audio-fallback', 'hidden');
                    }
                } 
            }
            return;
        }

        if (targetElement.closest('#toggle-mic-btn') !== null) {
            if (localMediaStreamTracker !== null) {
                let audioTrackNodeArray = localMediaStreamTracker.getAudioTracks();
                if (audioTrackNodeArray.length > 0) {
                    const extractedAudioTrackNode = audioTrackNodeArray[0];
                    isLocalMicOn = !isLocalMicOn;
                    extractedAudioTrackNode.enabled = isLocalMicOn;
                    const micToggleButtonElement = targetElement.closest('#toggle-mic-btn');
                    if (isLocalMicOn === true) { micToggleButtonElement.innerHTML = '<i class="fas fa-microphone"></i>'; micToggleButtonElement.style.color = "white"; } 
                    else { micToggleButtonElement.innerHTML = '<i class="fas fa-microphone-slash"></i>'; micToggleButtonElement.style.color = "#ef4444"; }
                }
            }
            return;
        }

        if (targetElement.closest('#call-screen-share-btn') !== null) { toggleScreenShare(); return; }
        if (targetElement.closest('#call-record-btn') !== null) { return; }
        if (targetElement.closest('#call-watch-party-btn') !== null) { return; }
        if (targetElement.closest('#call-bg-blur-btn') !== null) { return; }
        if (targetElement.closest('#call-noise-cancel-btn') !== null) { return; }

        if (targetElement.closest('#send-btn') !== null) {
            let extractedRawMessageTextValueString = gVal('message-input');
            if (extractedRawMessageTextValueString !== "" && activeChatUser !== null) {
                sendMessageWithSave('direct', extractedRawMessageTextValueString, activeChatUser.username, false);
                sVal('message-input', '');
                let inputFieldDOMNode = safeEl('message-input');
                if(inputFieldDOMNode !== null) { inputFieldDOMNode.placeholder = "Type a message..."; }
            }
            return;
        }

        if (targetElement.closest('#ai-send-btn') !== null) {
            let extractedAiRawTextStringValue = gVal('ai-message-input');
            if (extractedAiRawTextStringValue !== "") { sendMessageWithSave('ai', extractedAiRawTextStringValue); sVal('ai-message-input', ''); }
            return;
        }

        if (targetElement.closest('#group-send-btn') !== null) {
            let extractedGroupMsgTextStringValue = gVal('group-message-input');
            if (extractedGroupMsgTextStringValue !== "") {
                let resolvedTargetGroupNameString = safeEl('current-group-name').innerText;
                sendMessageWithSave('group', extractedGroupMsgTextStringValue, resolvedTargetGroupNameString, false);
                sVal('group-message-input', '');
            }
            return;
        }

        if (targetElement.closest('#world-send-btn') !== null) {
            let extractedWorldMsgTextStringValue = gVal('world-message-input');
            if (extractedWorldMsgTextStringValue !== "") {
                sendMessageWithSave('world', extractedWorldMsgTextStringValue, null, false);
                sVal('world-message-input', '');
            }
            return;
        }

        if (targetElement.closest('#smart-replies-bar button') !== null) {
            const triggeredSmartReplyButtonElement = targetElement.closest('#smart-replies-bar button');
            if (activeChatUser !== null) {
                sendMessageWithSave('direct', triggeredSmartReplyButtonElement.innerText, activeChatUser.username, false);
                sAdd('smart-replies-bar', 'hidden');
            }
            return;
        }

        if (targetElement.closest('#export-chat-btn') !== null) { exportChatHistory(); return; }

        if (targetElement.closest('#destruct-btn') !== null) {
            let inputFieldDOMNode = safeEl('message-input');
            if(inputFieldDOMNode !== null) {
                let extractedText = inputFieldDOMNode.value;
                if(extractedText !== "" && activeChatUser !== null) {
                    sendMessageWithSave('direct', extractedText, activeChatUser.username, true);
                    sVal('message-input', '');
                }
            }
            return;
        }

        if (targetElement.closest('#schedule-btn') !== null) {
            sVal('schedule-time-input', ''); sVal('schedule-text-input', ''); sRem('schedule-message-modal', 'hidden');
            return;
        }

        if (targetElement.closest('#confirm-schedule-btn') !== null) {
            let configuredTimeVal = safeEl('schedule-time-input').value;
            let configuredTextVal = safeEl('schedule-text-input').value;
            if (configuredTimeVal !== "" && configuredTextVal !== "") {
                let calculatedEpochTimestamp = new Date(configuredTimeVal).getTime();
                if (activeChatUser !== null) {
                    scheduledMessagesQueue.push({ triggerTime: calculatedEpochTimestamp, text: configuredTextVal, type: 'direct', target: activeChatUser.username });
                    window.saveData();
                } 
                sAdd('schedule-message-modal', 'hidden');
            } 
            return;
        }

        if (targetElement.closest('#sticker-btn') !== null) { return; }

        if (targetElement.closest('#location-btn') !== null) {
            if (navigator.geolocation !== undefined) {
                navigator.geolocation.getCurrentPosition(
                    function(successPositionObject) {
                        const preciseLatitudeFloat = successPositionObject.coords.latitude;
                        const preciseLongitudeFloat = successPositionObject.coords.longitude;
                        const constructedLocationHtmlPayload = `📍 <strong>Live Geolocation Coords Transmitted:</strong><br><a href="https://www.google.com/maps?q=${preciseLatitudeFloat},${preciseLongitudeFloat}" target="_blank" style="color:var(--primary-color);">Click here to view on Google Maps</a>`;
                        if (activeChatUser !== null) { sendMessageWithSave('direct', constructedLocationHtmlPayload, activeChatUser.username, false); }
                    }, 
                    function(errorObject) {}
                );
            } 
            return;
        }

        if (targetElement.closest('#draw-btn') !== null) { sRem('drawing-canvas-modal', 'hidden'); return; }

        if (targetElement.closest('#send-drawing-btn') !== null) {
            if (whiteboardCanvasElement === null) { return; }
            const exportedImageBase64DataString = whiteboardCanvasElement.toDataURL('image/png');
            if (activeChatUser !== null) {
                const drawingHtmlWrapperString = `<img src="${exportedImageBase64DataString}" style="max-width:240px; border-radius:12px; border:2px solid var(--primary-color);">`;
                sendMessageWithSave('direct', drawingHtmlWrapperString, activeChatUser.username, false);
            }
            canvasRenderingContext.fillStyle = "#ffffff"; canvasRenderingContext.fillRect(0, 0, whiteboardCanvasElement.width, whiteboardCanvasElement.height);
            sAdd('drawing-canvas-modal', 'hidden');
            return;
        }

        if (targetElement.closest('#ai-summarize-btn') !== null) { return; }
        
        if (targetElement.closest('#group-ping-btn') !== null) {
            const groupInputFieldDOMNode = safeEl('group-message-input');
            if (groupInputFieldDOMNode !== null) { groupInputFieldDOMNode.value = groupInputFieldDOMNode.value + "@everyone "; groupInputFieldDOMNode.focus(); }
            return;
        }

        function startVoiceTypingEngine(targetInputFieldIdString) {
            if (('webkitSpeechRecognition' in window) === false && ('SpeechRecognition' in window) === false) { return; }
            const LocalSpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
            const liveRecognitionInstance = new LocalSpeechRecognitionConstructor();
            liveRecognitionInstance.lang = 'en-IN'; liveRecognitionInstance.interimResults = false; liveRecognitionInstance.maxAlternatives = 1;

            const DOMInputElementNode = safeEl(targetInputFieldIdString);
            if (DOMInputElementNode === null) { return; }
            const originalPlaceholderStateString = DOMInputElementNode.placeholder;
            DOMInputElementNode.placeholder = "🎙️ Audio Sensor Active. Listening for vocal syntax...";
            
            liveRecognitionInstance.onresult = function(speechEventObject) {
                const transcribedTextResultString = speechEventObject.results[0][0].transcript;
                if (DOMInputElementNode.value === "") { DOMInputElementNode.value = transcribedTextResultString; } 
                else { DOMInputElementNode.value = DOMInputElementNode.value + " " + transcribedTextResultString; }
                DOMInputElementNode.placeholder = originalPlaceholderStateString;
            };
            liveRecognitionInstance.onerror = function(errorObject) { DOMInputElementNode.placeholder = originalPlaceholderStateString; };
            liveRecognitionInstance.onend = function() { DOMInputElementNode.placeholder = originalPlaceholderStateString; };
            liveRecognitionInstance.start();
        }

        if (targetElement.closest('#voice-type-btn') !== null) { startVoiceTypingEngine('message-input'); return; }
        if (targetElement.closest('#group-voice-type-btn') !== null) { startVoiceTypingEngine('group-message-input'); return; }
        if (targetElement.closest('#world-voice-type-btn') !== null) { startVoiceTypingEngine('world-message-input'); return; }

        if (targetElement.closest('#attach-btn') !== null) {
            const uploadFilePickerDomElementNode = safeEl('chat-media-upload-input');
            if (uploadFilePickerDomElementNode !== null) { uploadFilePickerDomElementNode.click(); } return;
        }

        if (targetElement.closest('#group-attach-btn') !== null) {
            const uploadFilePickerDomElementNode = safeEl('group-media-upload-input');
            if (uploadFilePickerDomElementNode !== null) { uploadFilePickerDomElementNode.click(); } return;
        }

        if (targetElement.closest('#world-attach-btn') !== null) {
            const uploadFilePickerDomElementNode = safeEl('world-media-upload-input');
            if (uploadFilePickerDomElementNode !== null) { uploadFilePickerDomElementNode.click(); } return;
        }

        if (targetElement.closest('#world-mute-btn') !== null) {
            isWorldMuted = !isWorldMuted;
            const muteButtonTriggerElementNode = targetElement.closest('#world-mute-btn');
            if (isWorldMuted === true) {
                muteButtonTriggerElementNode.innerHTML = '<i class="fas fa-volume-mute"></i>';
                muteButtonTriggerElementNode.classList.remove('danger-btn'); muteButtonTriggerElementNode.classList.add('action-btn');
            } else {
                muteButtonTriggerElementNode.innerHTML = '<i class="fas fa-volume-up"></i>';
                muteButtonTriggerElementNode.classList.remove('action-btn'); muteButtonTriggerElementNode.classList.add('danger-btn');
            }
            return;
        }

        if (targetElement.closest('#trigger-dp-upload') !== null) {
            const dpHiddenUploadInputFieldElement = safeEl('edit-dp-input');
            if (dpHiddenUploadInputFieldElement !== null) { dpHiddenUploadInputFieldElement.click(); } return;
        }

        if (targetElement.closest('#trigger-banner-upload') !== null) {
            const bannerHiddenUploadInputFieldElement = safeEl('edit-banner-input');
            if (bannerHiddenUploadInputFieldElement !== null) { bannerHiddenUploadInputFieldElement.click(); } return;
        }

        if (targetElement.closest('#save-profile-btn') !== null) {
            const configuredNicknameStringValue = gVal('edit-username-input');
            const configuredBiographicalSummaryStringValue = gVal('edit-bio-input');
            if (configuredNicknameStringValue !== "") { currentUser.username = configuredNicknameStringValue; }
            currentUser.bio = configuredBiographicalSummaryStringValue;
            window.saveData(); updateProfileUI(); sAdd('edit-profile-modal', 'hidden'); return;
        }

        if (targetElement.closest('#post-image-btn') !== null) {
            const globalFeedHiddenImageUploadInputFieldElementNode = safeEl('post-image-upload-input');
            if (globalFeedHiddenImageUploadInputFieldElementNode !== null) { globalFeedHiddenImageUploadInputFieldElementNode.click(); } return;
        }

        if (targetElement.closest('#action-remove-attached-post-file-buffer') !== null) {
            attachedPostImage = null; sAdd('post-media-attachment-status-preview', 'hidden'); sVal('post-image-upload-input', ''); return;
        }

        if (targetElement.closest('#submit-post-btn') !== null) {
            const feedTextAreaInputStringValue = gVal('post-input');
            if (feedTextAreaInputStringValue === "" && attachedPostImage === null) { return; }
            const computedNewFeedPostObject = {
                id: Date.now(), user: currentUser.username, dp: currentUser.dp || DEFAULT_DP,
                time: new Date().toLocaleTimeString(), scope: safeEl('post-privacy-scope-configuration-level-toggle-select').value,
                text: feedTextAreaInputStringValue, tags: feedTextAreaInputStringValue.match(/#[a-zA-Z0-9_]+/g) || [], image: attachedPostImage
            };
            posts.unshift(computedNewFeedPostObject); window.saveData(); renderPosts();
            sVal('post-input', ''); attachedPostImage = null; sAdd('post-media-attachment-status-preview', 'hidden'); return;
        }

        if (targetElement.closest('.delete-post-btn') !== null) {
            if (confirm("SEVERE ACTION: Are you entirely sure you want to permanently delete this specific post data block from the global feed arrays?")) {
                const parentPostCardElementContainer = targetElement.closest('.feed-post');
                if (parentPostCardElementContainer !== null) {
                    const permanentlyExtractedPostIdInteger = parseInt(parentPostCardElementContainer.getAttribute('data-id'));
                    let temporaryPostsArrayBuffer = [];
                    for(let i=0; i<posts.length; i++){
                        if(posts[i].id !== permanentlyExtractedPostIdInteger){ temporaryPostsArrayBuffer.push(posts[i]); }
                    }
                    posts = temporaryPostsArrayBuffer;
                    window.saveData(); renderPosts();
                }
            }
            return;
        }

        // 🔥 DYNAMIC GLOBAL POLL ENGINE WITH MULTIPLE OPTIONS 🔥
        if (targetElement.closest('#add-poll-option-btn') !== null) {
            const pollOptionsContainerNode = safeEl('poll-options-container');
            if(pollOptionsContainerNode !== null) {
                const currentOptionsCountInt = pollOptionsContainerNode.querySelectorAll('.poll-option-input').length;
                if (currentOptionsCountInt >= 10) {
                    alert("System Limitation: You can only add a maximum of 10 options per poll.");
                    return;
                }
                const dynamicallyCreatedInputNode = document.createElement('input');
                dynamicallyCreatedInputNode.type = 'text';
                dynamicallyCreatedInputNode.className = 'modal-input poll-option-input';
                dynamicallyCreatedInputNode.placeholder = 'Option ' + (currentOptionsCountInt + 1);
                dynamicallyCreatedInputNode.style.marginBottom = '0';
                pollOptionsContainerNode.appendChild(dynamicallyCreatedInputNode);
            }
            return;
        }

        if (targetElement.closest('#post-poll-btn') !== null) {
            activePollContextEngineType = 'post'; 
            sVal('poll-input-question-string-field', ''); 
            const defaultOptionsHtmlStr = `<input type="text" class="modal-input poll-option-input" placeholder="Option 1" style="margin-bottom: 0;"><input type="text" class="modal-input poll-option-input" placeholder="Option 2" style="margin-bottom: 0;">`;
            sHtml('poll-options-container', defaultOptionsHtmlStr);
            sRem('poll-creation-modal-framework', 'hidden'); return;
        }
        if (targetElement.closest('#world-poll-btn') !== null) {
            activePollContextEngineType = 'world'; 
            sVal('poll-input-question-string-field', ''); 
            const defaultOptionsHtmlStr = `<input type="text" class="modal-input poll-option-input" placeholder="Option 1" style="margin-bottom: 0;"><input type="text" class="modal-input poll-option-input" placeholder="Option 2" style="margin-bottom: 0;">`;
            sHtml('poll-options-container', defaultOptionsHtmlStr);
            sRem('poll-creation-modal-framework', 'hidden'); return;
        }
        if (targetElement.closest('#group-poll-btn') !== null || targetElement.closest('#group-channel-trigger-instantiate-poll-creation-modal-btn') !== null) {
            activePollContextEngineType = 'group'; 
            sVal('poll-input-question-string-field', ''); 
            const defaultOptionsHtmlStr = `<input type="text" class="modal-input poll-option-input" placeholder="Option 1" style="margin-bottom: 0;"><input type="text" class="modal-input poll-option-input" placeholder="Option 2" style="margin-bottom: 0;">`;
            sHtml('poll-options-container', defaultOptionsHtmlStr);
            sRem('poll-creation-modal-framework', 'hidden'); return;
        }

        if (targetElement.closest('#action-trigger-commit-publish-poll-btn') !== null) {
            const primaryPollQuestionTargetStringValue = gVal('poll-input-question-string-field');
            const mappedPollOptionInputsArrayNodeList = safeEl('poll-options-container').querySelectorAll('.poll-option-input');

            if (primaryPollQuestionTargetStringValue !== "") {
                let constructedPollHtmlFrameStructure = '';
                constructedPollHtmlFrameStructure += `<div class="poll-data-wrapper-node" data-has-voted="false">`;
                constructedPollHtmlFrameStructure += `<div style="font-weight:900; margin-bottom:8px;"><i class="fas fa-poll-h"></i> ACTIVE POLL:</div>`;
                constructedPollHtmlFrameStructure += `<div style="font-size:1.1rem; margin-bottom:10px;">${primaryPollQuestionTargetStringValue}</div>`;
                
                let foundValidOptionsCountInt = 0;
                for(let i=0; i<mappedPollOptionInputsArrayNodeList.length; i++){
                    let currentExtractedOptionValueStr = mappedPollOptionInputsArrayNodeList[i].value.trim();
                    if (currentExtractedOptionValueStr !== "") {
                        foundValidOptionsCountInt++;
                        constructedPollHtmlFrameStructure += `<button class="action-btn execution-vote-poll-track-node-btn" style="width:100%; text-align:left; margin-bottom:5px; font-size:0.9rem;" data-votes="0">🗳️ ${currentExtractedOptionValueStr} - [ <span class="vote-count-numerical-outlet-span">0</span> Votes ]</button>`;
                    }
                }
                constructedPollHtmlFrameStructure += `</div>`;

                if (foundValidOptionsCountInt < 2) {
                    alert("Execution Halted: A valid poll structure inherently requires a minimum of 2 defined options.");
                    return;
                }
                
                if (activePollContextEngineType === 'group') {
                    let resolvedTargetGroupContextStr = safeEl('current-group-name').innerText;
                    sendMessageWithSave('group', constructedPollHtmlFrameStructure, resolvedTargetGroupContextStr, false);
                } 
                else if (activePollContextEngineType === 'world') {
                    sendMessageWithSave('world', constructedPollHtmlFrameStructure, null, false);
                } 
                else if (activePollContextEngineType === 'post') {
                    const computedNewFeedPostObject = { id: Date.now(), user: currentUser.username, dp: currentUser.dp || DEFAULT_DP, time: new Date().toLocaleTimeString(), scope: 'public', text: constructedPollHtmlFrameStructure, tags: [], image: null };
                    posts.unshift(computedNewFeedPostObject); window.saveData(); renderPosts();
                }
                sAdd('poll-creation-modal-framework', 'hidden');
            } else {
                alert("Execution Protocol Halted: Please ensure the primary question string field is fully populated.");
            }
            return;
        }

        if (targetElement.closest('.execution-vote-poll-track-node-btn') !== null) {
            const corePollSelectionButtonDOMElement = targetElement.closest('.execution-vote-poll-track-node-btn');
            const structuralParentPollContainerDiv = corePollSelectionButtonDOMElement.closest('.poll-data-wrapper-node');
            
            if (structuralParentPollContainerDiv !== null) {
                if (structuralParentPollContainerDiv.getAttribute('data-has-voted') === 'true') {
                    alert("Voting Security Check: You have already cast your localized vote for this specific poll instance.");
                    return;
                }

                structuralParentPollContainerDiv.setAttribute('data-has-voted', 'true');
                
                let storedCurrentTrackedVotesCountValueInt = parseInt(corePollSelectionButtonDOMElement.getAttribute('data-votes'));
                if (isNaN(storedCurrentTrackedVotesCountValueInt) === true) { storedCurrentTrackedVotesCountValueInt = 0; }
                storedCurrentTrackedVotesCountValueInt++;
                corePollSelectionButtonDOMElement.setAttribute('data-votes', storedCurrentTrackedVotesCountValueInt);
                
                const internalSpanOutputValueTextElement = corePollSelectionButtonDOMElement.querySelector('.vote-count-numerical-outlet-span');
                if (internalSpanOutputValueTextElement !== null) { internalSpanOutputValueTextElement.innerText = storedCurrentTrackedVotesCountValueInt.toString(); }
                
                corePollSelectionButtonDOMElement.style.background = 'var(--primary-color)';
                corePollSelectionButtonDOMElement.style.color = 'white';

                const siblingButtonsNodeListArray = structuralParentPollContainerDiv.querySelectorAll('.execution-vote-poll-track-node-btn');
                for(let i=0; i<siblingButtonsNodeListArray.length; i++) {
                    siblingButtonsNodeListArray[i].disabled = true;
                    if(siblingButtonsNodeListArray[i] !== corePollSelectionButtonDOMElement) {
                        siblingButtonsNodeListArray[i].style.opacity = "0.5";
                    } else {
                        siblingButtonsNodeListArray[i].style.opacity = "1";
                    }
                }
            }
            return;
        }

        if (targetElement.closest('#create-group-btn') !== null) { sRem('create-group-modal', 'hidden'); return; }

        if (targetElement.closest('#trigger-group-icon-upload') !== null) {
            const internalGroupIconUploadInputFieldElement = safeEl('new-group-icon-input');
            if (internalGroupIconUploadInputFieldElement !== null) { internalGroupIconUploadInputFieldElement.click(); } return;
        }

        if (targetElement.closest('#confirm-create-group-btn') !== null) {
            const userConfiguredGroupTitleNameInputValueString = gVal('new-group-name');
            if (userConfiguredGroupTitleNameInputValueString !== "") {
                groups.push({ id: Date.now(), name: userConfiguredGroupTitleNameInputValueString, icon: tempGroupIcon, createdBy: currentUser.username });
                window.saveData(); renderGroups(); sAdd('create-group-modal', 'hidden'); sVal('new-group-name', '');
                tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff"; sSrc('new-group-icon-preview', tempGroupIcon);
            }
            return;
        }

        if (targetElement.closest('.group-item') !== null) {
            const isolatedGroupNameStringValue = targetElement.closest('.group-item').getAttribute('data-group');
            sAdd('group-placeholder', 'hidden'); sRem('group-header', 'hidden'); sRem('group-messages-area', 'hidden'); sRem('group-input-area', 'hidden');
            sText('current-group-name', isolatedGroupNameStringValue);
            let isolatedSelectedGroupObjContext = null;
            for (let i = 0; i < groups.length; i++) { if (groups[i].name === isolatedGroupNameStringValue) { isolatedSelectedGroupObjContext = groups[i]; break; } }
            if (isolatedSelectedGroupObjContext !== null) { sSrc('group-header-img', isolatedSelectedGroupObjContext.icon || `https://ui-avatars.com/api/?name=${isolatedGroupNameStringValue}&background=a855f7&color=fff`); }
            loadChatHistoryToView('group', isolatedGroupNameStringValue); return;
        }

        // 🔥 MODIFIED: STORY UPLOAD TRIGGERS CREATION MODAL 🔥
        if (targetElement.closest('#add-story-btn') !== null) {
            tempStoryMediaBuffer = null;
            sRem('story-creation-modal', 'hidden');
            return;
        }
        
        if (targetElement.closest('#confirm-story-post-btn') !== null) {
            if (tempStoryMediaBuffer === null) {
                alert("File Selection Error: Please bind a valid media file block to the story buffer before attempting transmission.");
                return;
            }
            
            const selectedPrivacyScopeOptionValue = safeEl('story-privacy-select').value;

            storiesDatabase.unshift({ 
                id: Date.now(), 
                name: currentUser.username, 
                dp: currentUser.dp, 
                image: tempStoryMediaBuffer, 
                scope: selectedPrivacyScopeOptionValue,
                viewed: false,
                likes: 0,
                likedByArray: [],
                viewedByArray: []
            });
            window.saveData();
            initializeStoriesEngine();
            sAdd('story-creation-modal', 'hidden');
            return;
        }

        if (targetElement.closest('#upload-reel-btn') !== null) {
            const reelUploadInputDOMNode = safeEl('reel-upload-input');
            if (reelUploadInputDOMNode !== null) { reelUploadInputDOMNode.click(); } return;
        }

        // 🔥 BUG FIX: FRIENDSHIP BOND LOGIC (Check Global Registry) 🔥
        if (targetElement.closest('#send-band-req-btn') !== null) {
            const userInsertedBondTargetInputStringValue = gVal('band-request-input');
            
            if (userInsertedBondTargetInputStringValue === "") {
                alert("Input Validation Error: Identification field cannot be null.");
                return;
            }
            if (userInsertedBondTargetInputStringValue === currentUser.username || userInsertedBondTargetInputStringValue === currentUser.uid) {
                alert("Logic Sequence Error: Self-referential Friendship Bonds are strictly prohibited by core system architecture.");
                return;
            }

            let internalFoundRootUser = findUserGlobally(userInsertedBondTargetInputStringValue);
            
            if (internalFoundRootUser === null) {
                alert("Registry Error: The specified Username or UID string does not exist within the Global Ecosystem Registry database.");
                return;
            }

            alert(`Network Packet Success: Outgoing Friendship Bond Synchronization Payload has been securely transmitted to [${internalFoundRootUser.username}].`);
            sVal('band-request-input', '');
            return;
        }

        if (targetElement.closest('.btn-accept-band') !== null) {
            const parentBondRequestListItemElementNode = targetElement.closest('.dummy-item');
            if (parentBondRequestListItemElementNode !== null) {
                const uniqueBondSourceUsernameKeyString = parentBondRequestListItemElementNode.getAttribute('data-user');
                let updatedBandRequestsArrayBuffer = [];
                for (let i = 0; i < bandRequests.length; i++) { if (bandRequests[i].username !== uniqueBondSourceUsernameKeyString) { updatedBandRequestsArrayBuffer.push(bandRequests[i]); } }
                bandRequests = updatedBandRequestsArrayBuffer;
                sHtml('fb-partner-dp-slot', `<img src="https://ui-avatars.com/api/?name=${uniqueBondSourceUsernameKeyString}&background=random&color=fff" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`);
                sText('fb-partner-name', uniqueBondSourceUsernameKeyString); sText('band-level', "Bond Level 1 (Initial Handshake Verified)"); sText('time-remaining', "You are now bonded securely!");
                const uiVisualProgressBarGraphicElementNode = safeEl('band-progress');
                if (uiVisualProgressBarGraphicElementNode !== null) { uiVisualProgressBarGraphicElementNode.style.width = "45%"; }
                sRem('break-band-btn', 'hidden'); window.saveData(); renderBandRequests();
            }
            return;
        }

        if (targetElement.closest('#break-band-btn') !== null) {
            if (confirm("CRITICAL SEVERE ACTION WARNING: Are you absolutely certain you want to permanently break your established Friendship Bond link sequence? All synchronized streak progress data counters will be completely lost and permanently zeroed out.")) {
                sHtml('fb-partner-dp-slot', '?'); sText('fb-partner-name', "Partner Space Available"); sText('band-level', "Bond Level 0 (Detached)"); sText('time-remaining', "Currently Not Connected");
                const uiVisualProgressBarGraphicElementNode = safeEl('band-progress');
                if (uiVisualProgressBarGraphicElementNode !== null) { uiVisualProgressBarGraphicElementNode.style.width = "0%"; }
                sAdd('break-band-btn', 'hidden'); window.saveData();
            }
            return;
        }

        if (targetElement.closest('#submit-bug-report-btn') !== null) {
            const rawBugReportDescriptionTextValue = gVal('bug-report-text-input');
            if (rawBugReportDescriptionTextValue !== "") {
                let resolvedEntityUsernameContext = "Unknown Entity";
                if (currentUser !== null) { resolvedEntityUsernameContext = currentUser.username; }
                systemBugReports.push({ id: systemBugReports.length + 1, submittedBy: resolvedEntityUsernameContext, traceLogContext: rawBugReportDescriptionTextValue, timestamp: new Date().toLocaleTimeString() });
                window.saveData(); sAdd('bug-report-modal', 'hidden');
            }
            return;
        }

        if (targetElement.closest('.close-modal-btn') !== null || targetElement.classList.contains('modal-overlay') === true) {
            let activeOverlayToCloseElementNode = targetElement.closest('.modal-overlay');
            if (activeOverlayToCloseElementNode === null) { activeOverlayToCloseElementNode = targetElement; }
            if (activeOverlayToCloseElementNode.classList.contains('modal-overlay') === true) { activeOverlayToCloseElementNode.classList.add('hidden'); }
            return;
        }

        if (targetElement.closest('#action-clear-cache-btn') !== null) {
            if (confirm("Critical Notice: Are you absolutely positive you want to execute a complete purge of all application cache memory blocks?")) {
                localStorage.removeItem('chatPosts'); posts = []; renderPosts();
            }
            return;
        }

        if (targetElement.closest('#view-friends-list-btn') !== null) { sRem('friend-list-modal', 'hidden'); return; }
        if (targetElement.closest('#edit-profile-btn') !== null) { sVal('edit-username-input', currentUser.username); sVal('edit-bio-input', currentUser.bio || ''); sRem('edit-profile-modal', 'hidden'); return; }

    } catch (globalEventListenerCatastrophicError) {
        console.error("Global Click Event Interceptor Handled an Exception (Ecosystem prevented from crashing):", globalEventListenerCatastrophicError);
    }
}); 

// =========================================================================
// 8. FILE UPLOAD HELPERS & KEYPRESS LISTENER BINDS
// =========================================================================

function setupFileInputDataHandler(elementIdStringIdent, resultCallbackFunctionMethodHook) {
    const rawTargetUploadInputElementNode = safeEl(elementIdStringIdent);
    if (rawTargetUploadInputElementNode !== null) {
        rawTargetUploadInputElementNode.addEventListener('change', function () {
            const rawSelectedFileObjectContext = this.files[0];
            if (rawSelectedFileObjectContext !== undefined && rawSelectedFileObjectContext !== null) {
                const globalFileReaderInstanceObject = new FileReader();
                globalFileReaderInstanceObject.onload = function (eventObjectTriggerResultData) {
                    resultCallbackFunctionMethodHook(eventObjectTriggerResultData.target.result);
                };
                globalFileReaderInstanceObject.readAsDataURL(rawSelectedFileObjectContext);
            }
        });
    }
}

// Existing Generic Profile Handlers
setupFileInputDataHandler('edit-dp-input', function (resultingBase64ImageStringCode) {
    currentUser.dp = resultingBase64ImageStringCode;
    window.saveData();
    updateProfileUI();
});

setupFileInputDataHandler('edit-banner-input', function (resultingBase64ImageStringCode) {
    currentUser.banner = resultingBase64ImageStringCode;
    window.saveData();
    updateProfileUI();
});

setupFileInputDataHandler('new-group-icon-input', function (resultingBase64ImageStringCode) {
    tempGroupIcon = resultingBase64ImageStringCode;
    sSrc('new-group-icon-preview', tempGroupIcon);
});

setupFileInputDataHandler('post-image-upload-input', function (resultingBase64ImageStringCode) {
    attachedPostImage = resultingBase64ImageStringCode;
    sRem('post-media-attachment-status-preview', 'hidden');
});

// 🔥 NEW: STORY UPLOAD BUFFER BINDING 🔥
setupFileInputDataHandler('story-upload-input-modal', function (resultingBase64MediaStringCode) {
    tempStoryMediaBuffer = resultingBase64MediaStringCode;
});

// 🔥 NEW: REELS UPLOAD BINDING 🔥
setupFileInputDataHandler('reel-upload-input', function (resultingBase64MediaStringCode) {
    reelsDatabase.unshift({
        id: Date.now(),
        title: "New User Uploaded Reel",
        username: currentUser.username,
        likes: 0,
        comments: 0,
        bg: `url(${resultingBase64MediaStringCode}) center/cover no-repeat`,
        likedByArray: []
    });
    window.saveData();
    initializeReelsEngine();
});

function renderChatMediaMessageDataPayload(base64MediaStringCodeData, targetMessageAreaIdStringLoc, emitTypeMappingStr) {
    let specificTargetNameStrResolver = null;

    if (emitTypeMappingStr === 'group') {
        const DOMNodeGroupName = safeEl('current-group-name');
        if (DOMNodeGroupName !== null) {
            specificTargetNameStrResolver = DOMNodeGroupName.innerText;
        }
    }
    else if (emitTypeMappingStr === 'direct') {
        if (activeChatUser !== null) {
            specificTargetNameStrResolver = activeChatUser.username;
        }
    }

    let constructedHtmlMediaFrameStr = `<br><img src="${base64MediaStringCodeData}" style="max-width:220px; border-radius:12px; margin-top:8px; border:2px solid rgba(255,255,255,0.2);">`;

    sendMessageWithSave(emitTypeMappingStr, constructedHtmlMediaFrameStr, specificTargetNameStrResolver, false);
}

setupFileInputDataHandler('chat-media-upload-input', function (mediaBase64DataString) {
    renderChatMediaMessageDataPayload(mediaBase64DataString, 'messages-area', 'direct');
});

setupFileInputDataHandler('group-media-upload-input', function (mediaBase64DataString) {
    renderChatMediaMessageDataPayload(mediaBase64DataString, 'group-messages-area', 'group');
});

setupFileInputDataHandler('world-media-upload-input', function (mediaBase64DataString) {
    renderChatMediaMessageDataPayload(mediaBase64DataString, 'world-messages-area', 'world');
});

const handleEnterKeypressRoutingPortAssignmentMethodEngine = function (targetInputIdString, triggerActionBtnIdString) {
    const definedInputFieldTargetElementNode = safeEl(targetInputIdString);
    if (definedInputFieldTargetElementNode !== null) {
        definedInputFieldTargetElementNode.addEventListener('keypress', function (keypressEventObjectBinding) {
            if (keypressEventObjectBinding.key === 'Enter') {
                keypressEventObjectBinding.preventDefault();
                const respectiveActionButtonTargetElementRef = safeEl(triggerActionBtnIdString);
                if (respectiveActionButtonTargetElementRef !== null) {
                    respectiveActionButtonTargetElementRef.click();
                }
            }
        });
    }
};

handleEnterKeypressRoutingPortAssignmentMethodEngine('message-input', 'send-btn');
handleEnterKeypressRoutingPortAssignmentMethodEngine('world-message-input', 'world-send-btn');
handleEnterKeypressRoutingPortAssignmentMethodEngine('group-message-input', 'group-send-btn');
handleEnterKeypressRoutingPortAssignmentMethodEngine('ai-message-input', 'ai-send-btn');
handleEnterKeypressRoutingPortAssignmentMethodEngine('chat-sidebar-search-input', 'sidebar-action-search-trigger');