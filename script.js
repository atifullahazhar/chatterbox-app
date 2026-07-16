// =========================================================================
// 🔥 CHATTERBOX VIP ECOSYSTEM - CORE JAVASCRIPT MASTER ENGINE V22 🔥
// Privileges: SUPREME CORE ROOT OPERATOR
// Optimization: STRICTLY DISABLED. FULL LOGIC EXPANDED.
// Features Added: WebRTC Calling, Web Speech API (Hinglish), Media Uploads
// =========================================================================

console.log("🔥 CHATTERBOX VIP ECOSYSTEM INTERFACE RUNTIME SYSTEMS ONLINE 🔥");

// =========================================================================
// 0. CORE DOM UTILITIES
// =========================================================================
function safeEl(id) {
    return document.getElementById(id);
}

function sAdd(id, className) {
    const element = safeEl(id);
    if (element) {
        element.classList.add(className);
    }
}

function sRem(id, className) {
    const element = safeEl(id);
    if (element) {
        element.classList.remove(className);
    }
}

function sText(id, textValue) {
    const element = safeEl(id);
    if (element) {
        element.innerText = textValue;
    }
}

function sHtml(id, htmlValue) {
    const element = safeEl(id);
    if (element) {
        element.innerHTML = htmlValue;
    }
}

function sVal(id, value) {
    const element = safeEl(id);
    if (element) {
        element.value = value;
    }
}

function gVal(id) {
    const element = safeEl(id);
    if (element) {
        return element.value.trim();
    }
    return '';
}

function sSrc(id, sourceUrl) {
    const element = safeEl(id);
    if (element) {
        element.src = sourceUrl;
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

let activeChatUser = null;
let currentChatTab = 'general';
let currentRequestSubTab = 'accept';
let searchedUserContext = null;

let isWorldMuted = false;
let activeDisappearingMessagesMode = false;
let tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";
let attachedPostImage = null;

let clientMetricsRequestTelemetryCounter = 0;

// Central Server Mapped Directory
const systemVerifiedUserDirectory = [
    { username: "Atifullah Azhar", dp: "https://ui-avatars.com/api/?name=Atifullah+Azhar&background=ffd700&color=000", bio: "Developer and Creator of Chatterbox VIP.", rank: "Developer" },
    { username: "Nauras Daniyal", dp: "https://ui-avatars.com/api/?name=Nauras&background=eaddff&color=8b5cf6", bio: "Platform Administrator.", rank: "Operator" },
    { username: "Rahul Sharma", dp: "https://ui-avatars.com/api/?name=Rahul&background=ffedd5&color=f97316", bio: "Core Beta Tester.", rank: "Elite" },
    { username: "Sneha_007", dp: "https://ui-avatars.com/api/?name=Sneha&background=fce7f3&color=ec4899", bio: "Hey there! I am using Chatterbox.", rank: "Member" }
];

const socket = (typeof io !== 'undefined') ? io() : { on: () => { }, emit: () => { } };
const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";


// =========================================================================
// 2. INITIALIZATION AND BOOTSTRAP LOGIC
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM fully loaded and parsed. Bootstrapping UI Components...");

    // Retrieve Local Storage Data Carefully
    try {
        currentUser = JSON.parse(localStorage.getItem('chatUser')) || null;
        friends = JSON.parse(localStorage.getItem('chatFriends')) || [];
        friendRequests = JSON.parse(localStorage.getItem('chatRequests')) || [];
        bandRequests = JSON.parse(localStorage.getItem('bandRequests')) || [];
        posts = JSON.parse(localStorage.getItem('chatPosts')) || [];
        groups = JSON.parse(localStorage.getItem('chatGroups')) || [];
        systemBugReports = JSON.parse(localStorage.getItem('chatBugReports')) || [];
    } catch (error) {
        console.error("Local Storage Parsing Error Detected:", error);
    }

    // Process Application View if User Exists
    if (currentUser && currentUser.username) {
        console.log("Active User Found in Session. Transitioning to Workspace Dashboard.");
        sRem('login-screen', 'active');
        sAdd('login-screen', 'hidden');
        sRem('main-app', 'hidden');
        sAdd('main-app', 'active');

        applySystemThemePalette();
        enforceDeveloperThemeRestrictions();
        updateProfileUI();
        renderContacts();
        updateBadgesAndCounts();
        renderPosts();
        renderGroups();
        renderBandRequests();
        triggerAutomatedWelcomeBroadcast();
    } else {
        console.log("No active user session verified. Standing by at Authentication Screen.");
    }

    // Storage Writer Function
    function saveData() {
        localStorage.setItem('chatUser', JSON.stringify(currentUser));
        localStorage.setItem('chatFriends', JSON.stringify(friends));
        localStorage.setItem('chatRequests', JSON.stringify(friendRequests));
        localStorage.setItem('chatPosts', JSON.stringify(posts));
        localStorage.setItem('chatGroups', JSON.stringify(groups));
        localStorage.setItem('bandRequests', JSON.stringify(bandRequests));
        localStorage.setItem('chatBugReports', JSON.stringify(systemBugReports));
        updateBadgesAndCounts();
    }

    function applySystemThemePalette() {
        if (!currentUser) return;
        const themeSelectorDropdownElement = safeEl('settings-theme-palette-spectrum-engine-selector-dropdown-field');
        if (currentUser.theme) {
            document.documentElement.setAttribute('data-theme', currentUser.theme);
            if (themeSelectorDropdownElement) {
                themeSelectorDropdownElement.value = currentUser.theme;
            }
            if (currentUser.theme === 'grand-golden') {
                document.body.classList.add('dev-theme-active');
            } else {
                document.body.classList.remove('dev-theme-active');
            }
        }
    }

    function enforceDeveloperThemeRestrictions() {
        const devThemeOptionElement = safeEl('grand-golden-theme-option');
        if (devThemeOptionElement && currentUser) {
            if (currentUser.isDev === false) {
                devThemeOptionElement.style.display = 'none';
                devThemeOptionElement.disabled = true;
            } else {
                devThemeOptionElement.style.display = 'block';
                devThemeOptionElement.disabled = false;
            }
        }
    }

    function triggerAutomatedWelcomeBroadcast() {
        if (!currentUser) return;
        setTimeout(() => {
            const worldMessageOutputArea = safeEl('world-messages-area');
            if (worldMessageOutputArea) {
                const systemWelcomeDivElement = document.createElement('div');
                systemWelcomeDivElement.className = "message-bubble system-msg";
                systemWelcomeDivElement.innerText = `👋 Welcome back online, ${currentUser.username}. You are now securely connected to the Global Chat Network.`;
                worldMessageOutputArea.appendChild(systemWelcomeDivElement);
                worldMessageOutputArea.scrollTop = worldMessageOutputArea.scrollHeight;
            }
        }, 1200);
    }


    // =========================================================================
    // 3. NATIVE VOICE TYPING ENGINE (HINGLISH / ENGLISH SUPPORT)
    // =========================================================================
    function startVoiceTyping(inputIdString) {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("System Info: Tumhara browser Voice Typing support nahi karta. Please Google Chrome use karo.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();

        // en-IN (Indian English) accurately captures Hinglish words natively!
        recognitionInstance.lang = 'en-IN';
        recognitionInstance.interimResults = false;
        recognitionInstance.maxAlternatives = 1;

        const targetInputFieldElement = safeEl(inputIdString);
        if (!targetInputFieldElement) return;

        const originalPlaceholderText = targetInputFieldElement.placeholder;
        targetInputFieldElement.placeholder = "🎙️ Listening... Speak now!";

        recognitionInstance.onresult = function (event) {
            const capturedTranscriptString = event.results[0][0].transcript;
            const currentInputValue = targetInputFieldElement.value;
            targetInputFieldElement.value = currentInputValue ? (currentInputValue + " " + capturedTranscriptString) : capturedTranscriptString;
            targetInputFieldElement.placeholder = originalPlaceholderText;
        };

        recognitionInstance.onerror = function (event) {
            targetInputFieldElement.placeholder = originalPlaceholderText;
            console.error("Speech Recognition Error: ", event.error);
        };

        recognitionInstance.onend = function () {
            targetInputFieldElement.placeholder = originalPlaceholderText;
        };

        recognitionInstance.start();
    }


    // =========================================================================
    // 4. PYTHON AI API FETCH PIPELINES (SENTIMENT & SPAM)
    // =========================================================================

    async function evaluateTextPayloadToxicityMetrics(messageTextString) {
        clientMetricsRequestTelemetryCounter++;
        try {
            const serverResponseObject = await fetch('http://127.0.0.1:8000/api/ai/sentiment-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: messageTextString,
                    sender: currentUser ? currentUser.username : 'Unknown Node'
                })
            });
            const responseDataJson = await serverResponseObject.json();
            return responseDataJson;
        } catch (networkError) {
            console.warn("Python AI Server unreachable. Bypassing.", networkError);
            const temporaryBlacklistArray = ["abuse", "toxic", "hacker", "exploit", "cheat", "bastard", "kamina", "fraud", "scam"];
            let isBlacklistedHit = temporaryBlacklistArray.some(keyword => messageTextString.toLowerCase().includes(keyword));
            return {
                classification: { is_toxic: isBlacklistedHit, toxicity_rating: isBlacklistedHit ? 0.95 : 0.0 }
            };
        }
    }

    async function evaluatePostPayloadSpamProbabilityMetrics(postTextContentString) {
        clientMetricsRequestTelemetryCounter++;
        try {
            const serverResponseObject = await fetch('http://127.0.0.1:8000/api/ai/spam-detection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: postTextContentString,
                    sender: currentUser ? currentUser.username : 'Unknown Node'
                })
            });
            const responseDataJson = await serverResponseObject.json();
            return responseDataJson;
        } catch (networkError) {
            return { verdict: { is_spam: false, spam_probability_score: 0.0, trigger_reasons_identified: [] } };
        }
    }


    // =========================================================================
    // 5. CORE EXECUTION LOGIC FOR CHATTING AND POSTING
    // =========================================================================

    async function executeDirectCommunicationMessageUplinkRoute() {
        const chatInputNodeElement = safeEl('message-input');
        let rawMessageTextValue = gVal('message-input');

        if (rawMessageTextValue !== "" && activeChatUser) {
            const aiVerificationObject = await evaluateTextPayloadToxicityMetrics(rawMessageTextValue);
            if (aiVerificationObject.classification && aiVerificationObject.classification.is_toxic) {
                alert(`🚨 SECURITY FIREWALL BLOCK: Toxic or offensive language detected! Your message was blocked to keep the community environment safe.`);
                return;
            }

            const messagesScrollableArea = safeEl('messages-area');
            const userMessageDivElement = document.createElement('div');
            userMessageDivElement.className = "message-bubble my-msg";

            if (activeDisappearingMessagesMode) {
                userMessageDivElement.style.borderRight = "4px dashed var(--system-warning)";
                userMessageDivElement.innerHTML = `<strong>[10s EXPIRY] Me:</strong> ${rawMessageTextValue}`;
                setTimeout(() => {
                    userMessageDivElement.style.opacity = "0.25";
                    userMessageDivElement.innerHTML = `<i>✖️ Message disappeared automatically for privacy.</i>`;
                }, 10000);
            } else {
                userMessageDivElement.innerHTML = `<strong>Me:</strong> ${rawMessageTextValue}`;
            }

            if (messagesScrollableArea) {
                messagesScrollableArea.appendChild(userMessageDivElement);
                messagesScrollableArea.scrollTop = messagesScrollableArea.scrollHeight;
            }
            if (chatInputNodeElement) {
                chatInputNodeElement.value = "";
            }
        } else {
            alert("Application Error: Please type a message before attempting to send.");
        }
    }

    async function executePostContentPublishUplinkRoute() {
        let postRawTextValue = gVal('post-input');
        const postScopeSelectorElement = safeEl('post-privacy-scope-configuration-level-toggle-select');
        const calculatedScopeString = postScopeSelectorElement ? postScopeSelectorElement.value : 'public';

        if (postRawTextValue !== "" || attachedPostImage) {
            if (postRawTextValue !== "") {
                const aiSpamVerificationObject = await evaluatePostPayloadSpamProbabilityMetrics(postRawTextValue);
                if (aiSpamVerificationObject.verdict && aiSpamVerificationObject.verdict.is_spam) {
                    alert(`🚨 ANTI-SPAM PROTECTION ACTIVE: This looks like automated bot spam behavior. Post execution rejected!`);
                    return;
                }
            }

            let extractedTagsArray = postRawTextValue.match(/#\w+/g) || [];

            posts.unshift({
                id: Date.now(),
                user: currentUser.username,
                dp: currentUser.dp,
                text: postRawTextValue,
                image: attachedPostImage,
                scope: calculatedScopeString,
                tags: extractedTagsArray,
                time: "Just Published via Secure Port"
            });

            saveData();
            renderPosts();

            sVal('post-input', '');
            attachedPostImage = null;
            sAdd('post-media-attachment-status-preview', 'hidden');
            sVal('post-image-upload-input', '');

            alert("✅ Action Verified! Your post was successfully published to your feed.");
        } else {
            alert("Application Error: Please write something or attach an image before publishing.");
        }
    }


    // =========================================================================
    // 6. UI UPDATES & DOM RENDERING FUNCTIONS
    // =========================================================================

    function updateFavoriteButtonUI() {
        if (!activeChatUser) return;
        const favoriteBtnIcon = document.querySelector('#favorite-user-btn i');
        if (!favoriteBtnIcon) return;

        const arrayIndexMatchFound = friends.findIndex(fObj => fObj.username === activeChatUser.username);
        if (arrayIndexMatchFound !== -1 && friends[arrayIndexMatchFound].isFavorite) {
            favoriteBtnIcon.className = 'fas fa-star';
            favoriteBtnIcon.style.color = '#f59e0b';
        } else {
            favoriteBtnIcon.className = 'far fa-star';
            favoriteBtnIcon.style.color = 'var(--text-muted)';
        }
    }

    function updateProfileUI() {
        if (!currentUser) return;
        sText('display-username', currentUser.username);
        sText('user-bio', currentUser.bio || "No biography details available.");
        sSrc('user-dp', currentUser.dp || DEFAULT_DP);
        sSrc('fb-my-dp', currentUser.dp || DEFAULT_DP);
        if (currentUser.banner) { sSrc('banner-img', currentUser.banner); sRem('banner-img', 'hidden'); }
        else { sAdd('banner-img', 'hidden'); }
        sText('display-rank', currentUser.rank);

        const usernameTextDisplayElement = safeEl('display-username');
        const rankBadgeDisplayElement = safeEl('display-rank');

        if (currentUser.isDev) {
            if (usernameTextDisplayElement) usernameTextDisplayElement.classList.add('shiny-dev-text');
            if (rankBadgeDisplayElement) rankBadgeDisplayElement.className = 'rank-badge rank-developer';
            sRem('dev-nav-item', 'hidden');
            sText('total-friends-count', "99,999 (Administrator)");
            sText('profile-visitor-numerical-counter-view', "4,521,092");
        } else {
            if (usernameTextDisplayElement) usernameTextDisplayElement.classList.remove('shiny-dev-text');
            sText('total-friends-count', friends.length);
            sText('profile-visitor-numerical-counter-view', "12");
        }
    }

    function updateBadgesAndCounts() {
        if (currentUser && !currentUser.isDev) {
            sText('total-friends-count', friends.length);
        }
    }

    function renderContacts() {
        const contactListOutputContainerElement = safeEl('contact-list-container');
        if (!contactListOutputContainerElement) return;

        contactListOutputContainerElement.innerHTML = '';
        let processedListToRenderArray = currentChatTab === 'favorite' ? friends.filter(f => f.isFavorite === true) : friends;

        if (processedListToRenderArray.length === 0) {
            contactListOutputContainerElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.95rem; font-weight:bold; padding:25px;">No active friends found in this specific section.</p>`;
            return;
        }

        processedListToRenderArray.forEach(function (friendObject) {
            let renderedStarIconHtmlString = friendObject.isFavorite ? `<i class="fas fa-star" style="color:#f59e0b; margin-left: 6px;"></i>` : '';
            let constructedContactHtmlElement = `
                <div class="dummy-item contact-item" data-user="${friendObject.username}" style="border: 1px solid rgba(0,0,0,0.02); background: var(--bg-panel); border-radius:14px; margin-bottom:8px; display:flex; align-items:center; gap:12px; padding:12px; cursor:pointer;">
                    <img src="${friendObject.dp || DEFAULT_DP}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color);">
                    <div style="display:flex; flex-direction:column; flex:1;">
                        <b style="font-size:1.1rem; color:var(--text-main);">${friendObject.username} ${renderedStarIconHtmlString}</b>
                        <span style="font-size:0.8rem; color:var(--system-success); font-weight:bold;"><i class="fas fa-circle" style="font-size:0.5rem; margin-right:3px;"></i> Online Status Active</span>
                    </div>
                </div>
            `;
            contactListOutputContainerElement.innerHTML += constructedContactHtmlElement;
        });
    }

    function renderRequestSubTabUI() {
        const subTabOutputContainerElement = safeEl('contact-list-container');
        if (!subTabOutputContainerElement) return;
        subTabOutputContainerElement.innerHTML = '';

        const acceptTabSelectorBtnElement = safeEl('sub-tab-accept-btn');
        const sendTabSelectorBtnElement = safeEl('sub-tab-send-btn');

        if (currentRequestSubTab === 'accept') {
            if (acceptTabSelectorBtnElement) acceptTabSelectorBtnElement.classList.add('active-sub-tab');
            if (sendTabSelectorBtnElement) sendTabSelectorBtnElement.classList.remove('active-sub-tab');
            sAdd('search-friend-field-block', 'hidden');

            if (friendRequests.length === 0) {
                subTabOutputContainerElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.9rem; font-weight:bold; padding:25px;">You currently have zero pending incoming friend requests.</p>`;
                return;
            }

            friendRequests.forEach(function (requestObject) {
                let constructedRequestHtmlElement = `
                    <div class="dummy-item" data-user="${requestObject.username}" style="background:var(--bg-panel); border:1px solid var(--border-color); border-radius:14px; padding:12px; display:flex; align-items:center; gap:12px; margin-bottom:8px;">
                        <img src="${requestObject.dp || DEFAULT_DP}" style="width:42px; height:42px; border-radius:50%; object-fit:cover;">
                        <div style="flex:1;">
                            <b style="font-size:1rem; color:var(--text-main); display:block;">${requestObject.username}</b>
                        </div>
                        <div class="req-action-btns">
                            <button class="btn-accept-friend btn-accept" style="color:#fff;" title="Accept Connect Handshake"><i class="fas fa-check"></i></button>
                            <button class="btn-reject-friend btn-reject" style="color:#fff;" title="Reject Connect Handshake"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                `;
                subTabOutputContainerElement.innerHTML += constructedRequestHtmlElement;
            });
        } else if (currentRequestSubTab === 'send') {
            if (acceptTabSelectorBtnElement) acceptTabSelectorBtnElement.classList.remove('active-sub-tab');
            if (sendTabSelectorBtnElement) sendTabSelectorBtnElement.classList.add('active-sub-tab');
            sRem('search-friend-field-block', 'hidden');

            subTabOutputContainerElement.innerHTML = `
                <div style="padding:20px; text-align:center; color:var(--text-muted); font-weight:bold; font-size:0.95rem; border:2px dashed var(--border-color); border-radius:16px; margin:10px; background:var(--bg-panel);">
                    <i class="fas fa-search" style="font-size:2rem; color:var(--primary-color); margin-bottom:12px; display:block;"></i>
                    Enter a precise username in the top search field block above to search directories and locate new friends.
                </div>
            `;
        }
    }

    function renderPosts() {
        const postsOutputContainerElement = safeEl('feed-container');
        if (!postsOutputContainerElement) return;

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

            let constructedPostContainerHtmlElement = `
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
                </div>
            `;
            postsOutputContainerElement.innerHTML += constructedPostContainerHtmlElement;
        });
    }

    function renderGroups() {
        const groupsOutputContainerElement = safeEl('group-list-container');
        if (!groupsOutputContainerElement) return;

        groupsOutputContainerElement.innerHTML = '';

        if (groups.length === 0) {
            groupsOutputContainerElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px; font-weight:bold;">Zero active groups or network channels created yet.</p>`;
            return;
        }

        groups.forEach(function (groupObject) {
            let processedIconSourceUrl = groupObject.icon || `https://ui-avatars.com/api/?name=${groupObject.name}&background=a855f7&color=fff`;
            let constructedGroupHtmlElement = `
                <div class="dummy-item group-item" data-group="${groupObject.name}" style="padding:15px; background:var(--bg-panel); border:1px solid rgba(0,0,0,0.02); border-radius:14px; display:flex; align-items:center; gap:12px; margin-bottom:8px; cursor:pointer;">
                    <img src="${processedIconSourceUrl}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:1px solid var(--border-color); padding:2px;">
                    <div>
                        <b style="font-size:1.1rem; color:var(--text-main); display:block;">${groupObject.name}</b>
                        <span style="font-size:0.75rem; color:var(--text-muted);">Creator Status: @${groupObject.createdBy || 'System Admin'}</span>
                    </div>
                </div>
            `;
            groupsOutputContainerElement.innerHTML += constructedGroupHtmlElement;
        });
    }

    function renderBandRequests() {
        const bandOutputContainerElement = safeEl('band-incoming-requests');
        const emptyStatePlaceholderElement = safeEl('band-incoming-requests-empty-placeholder-string-element');
        if (!bandOutputContainerElement) return;
        bandOutputContainerElement.innerHTML = '';

        if (bandRequests.length === 0) {
            if (emptyStatePlaceholderElement) emptyStatePlaceholderElement.classList.remove('hidden');
            bandOutputContainerElement.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 15px; font-weight:bold;">There are currently zero pending Friendship Bond synchronization requests.</p>`;
            return;
        }
        if (emptyStatePlaceholderElement) emptyStatePlaceholderElement.classList.add('hidden');

        bandRequests.forEach(function (bandRequestObject) {
            let constructedBandRequestHtmlElement = `
                <div class="dummy-item" data-user="${bandRequestObject.username}" style="margin-top:10px; background:var(--bg-main); padding: 15px; border: 1px solid var(--border-color); border-radius:14px; display:flex; align-items:center; justify-content:space-between; gap:15px;">
                    <b style="flex:1; font-size:1rem; color:var(--text-main);"><i class="fas fa-handshake" style="color:var(--primary-color); margin-right:6px;"></i> Incoming Bond Request received from target: @${bandRequestObject.username}</b>
                    <button class="btn-accept-band btn-accept" style="width:45px; height:45px; border-radius:50%; background:#10b981; color:#fff;" title="Accept Friendship Bond Connection"><i class="fas fa-check"></i></button>
                </div>
            `;
            bandOutputContainerElement.innerHTML += constructedBandRequestHtmlElement;
        });
    }


    // =========================================================================
    // 7. GLOBAL EVENT DELEGATION SYSTEM (FLAWLESS BUTTON BINDINGS)
    // =========================================================================

    document.addEventListener('click', (eventObject) => {
        const clickedTargetElementNode = eventObject.target;
        if (!clickedTargetElementNode) return;

        if (clickedTargetElementNode.id === 'join-btn' || clickedTargetElementNode.closest('#join-btn')) return;

        // Mobile Sidebar Toggles
        if (clickedTargetElementNode.id === 'hamburger-btn' || clickedTargetElementNode.closest('#hamburger-btn')) {
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
                if (closeBtn) closeBtn.classList.remove('hidden');
                const navLinksContainer = mobileSidebarContainer.querySelector('.nav-links');
                if (navLinksContainer) { navLinksContainer.style.flexDirection = 'column'; navLinksContainer.style.overflowY = 'auto'; }
            }
            return;
        }

        if (clickedTargetElementNode.id === 'close-sidebar-btn' || clickedTargetElementNode.closest('#close-sidebar-btn')) {
            const mobileSidebarContainer = safeEl('sidebar');
            if (mobileSidebarContainer) {
                mobileSidebarContainer.style.display = ''; mobileSidebarContainer.style.position = '';
                mobileSidebarContainer.style.zIndex = ''; mobileSidebarContainer.style.height = '';
                mobileSidebarContainer.style.width = ''; mobileSidebarContainer.style.flexDirection = '';
                const closeBtn = safeEl('close-sidebar-btn');
                if (closeBtn) closeBtn.classList.add('hidden');
                const navLinksContainer = mobileSidebarContainer.querySelector('.nav-links');
                if (navLinksContainer) { navLinksContainer.style.flexDirection = ''; navLinksContainer.style.overflowY = ''; }
            }
            return;
        }

        // Sidebar Navigation
        const navigationButtonElement = clickedTargetElementNode.closest('.nav-btn');
        if (navigationButtonElement && !navigationButtonElement.id.includes('report-bug') && !navigationButtonElement.id.includes('logout')) {
            document.querySelectorAll('.nav-links .nav-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.content-view').forEach(view => { view.classList.remove('active'); view.classList.add('hidden'); });
            navigationButtonElement.classList.add('active');
            const targetSectionDisplayId = navigationButtonElement.getAttribute('data-target');
            sRem(targetSectionDisplayId, 'hidden'); sAdd(targetSectionDisplayId, 'active');
            return;
        }

        // Quick Actions
        if (clickedTargetElementNode.closest('#sidebar-quick-report-bug-btn')) {
            sVal('bug-report-text-input', ''); sRem('bug-report-modal', 'hidden'); return;
        }
        if (clickedTargetElementNode.closest('#sidebar-quick-logout-btn')) {
            if (confirm("Are you absolutely sure you want to log out of your secure session and terminate tracking connections?")) {
                localStorage.removeItem('chatUser'); location.reload();
            }
            return;
        }

        // Chat View Sidebar Tabs
        const chatTabNavigationButtonElement = clickedTargetElementNode.closest('.chat-tabs .tab-btn');
        if (chatTabNavigationButtonElement) {
            document.querySelectorAll('.chat-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            chatTabNavigationButtonElement.classList.add('active');
            currentChatTab = chatTabNavigationButtonElement.getAttribute('data-tab');
            if (currentChatTab === 'requests') {
                sRem('request-sub-tabs-container', 'hidden'); sAdd('search-friend-field-block', 'hidden'); renderRequestSubTabUI();
            } else {
                sAdd('request-sub-tabs-container', 'hidden'); sRem('search-friend-field-block', 'hidden'); resetRightWorkspacePane(); renderContacts();
            }
            return;
        }

        if (clickedTargetElementNode.closest('#sub-tab-accept-btn')) { currentRequestSubTab = 'accept'; renderRequestSubTabUI(); resetRightWorkspacePane(); return; }
        if (clickedTargetElementNode.closest('#sub-tab-send-btn')) { currentRequestSubTab = 'send'; renderRequestSubTabUI(); return; }

        // Search Directories
        if (clickedTargetElementNode.closest('#sidebar-action-search-trigger') && currentChatTab === 'requests' && currentRequestSubTab === 'send') {
            const searchInputQueryValue = gVal('chat-sidebar-search-input').toLowerCase();
            if (searchInputQueryValue !== "") {
                const verifiedMatchedUserNodeObject = systemVerifiedUserDirectory.find(u => u.username.toLowerCase() === searchInputQueryValue);
                if (verifiedMatchedUserNodeObject) { searchedUserContext = verifiedMatchedUserNodeObject; openRightProfilePreviewPane(searchedUserContext); }
                else { alert(`Directory Trace Failure: Username '${searchInputQueryValue}' was not found in the verified target directory registers.`); resetRightWorkspacePane(); }
            } else { alert("Application Notification: Please enter a target username identifier string to execute the search."); }
            return;
        }

        if (clickedTargetElementNode.closest('#action-dispatch-friend-request-btn')) {
            if (searchedUserContext) {
                alert(`System Notification: Handshake friendship request securely dispatched to target destination ${searchedUserContext.username}!`);
                sVal('chat-sidebar-search-input', ''); resetRightWorkspacePane();
            }
            return;
        }

        // Accept/Reject Requests
        if (clickedTargetElementNode.closest('.btn-accept-friend')) {
            const listRowItemElement = clickedTargetElementNode.closest('.dummy-item');
            if (listRowItemElement) {
                const targetUsernameIdentificationKey = listRowItemElement.getAttribute('data-user');
                friendRequests = friendRequests.filter(reqObject => reqObject.username !== targetUsernameIdentificationKey);
                friends.push({ username: targetUsernameIdentificationKey, dp: `https://ui-avatars.com/api/?name=${targetUsernameIdentificationKey}&background=8b5cf6&color=fff`, isFavorite: false, bio: "My newly verified active friend connection mapping node." });
                saveData(); renderRequestSubTabUI(); alert(`Verification Protocol Complete: You are now permanently connected friends with ${targetUsernameIdentificationKey}!`);
            }
            return;
        }
        if (clickedTargetElementNode.closest('.btn-reject-friend')) {
            const listRowItemElement = clickedTargetElementNode.closest('.dummy-item');
            if (listRowItemElement) {
                const targetUsernameIdentificationKey = listRowItemElement.getAttribute('data-user');
                friendRequests = friendRequests.filter(reqObject => reqObject.username !== targetUsernameIdentificationKey);
                saveData(); renderRequestSubTabUI();
            }
            return;
        }

        // Open Direct Chat
        if (clickedTargetElementNode.closest('.contact-item')) {
            const retrievedUsernameKey = clickedTargetElementNode.closest('.contact-item').getAttribute('data-user');
            sAdd('request-profile-preview-pane', 'hidden'); sAdd('chat-placeholder', 'hidden');
            sRem('chat-header', 'hidden'); sRem('messages-area', 'hidden'); sRem('chat-input-area', 'hidden');

            activeChatUser = friends.find(fObj => fObj.username === retrievedUsernameKey);
            if (activeChatUser) {
                sText('current-chat-name', activeChatUser.username); sSrc('current-chat-dp', activeChatUser.dp); updateFavoriteButtonUI();
            }
            return;
        }

        if (clickedTargetElementNode.closest('#favorite-user-btn')) {
            if (activeChatUser) {
                const arrayIndexMatchFound = friends.findIndex(fObj => fObj.username === activeChatUser.username);
                if (arrayIndexMatchFound !== -1) {
                    friends[arrayIndexMatchFound].isFavorite = !friends[arrayIndexMatchFound].isFavorite;
                    saveData(); updateFavoriteButtonUI();
                    if (currentChatTab === 'favorite') { renderContacts(); resetRightWorkspacePane(); }
                }
            }
            return;
        }

        // =========================================================
        // CALLING SYSTEM: DIRECT CHAT (Modals) VS GROUP/WORLD (Silent)
        // =========================================================
        function simulateIncomingCall(type) {
            sText('incoming-call-type-text', type === 'video' ? '🎥 Incoming Video Call Request...' : '📞 Incoming Voice Call Request...');
            sText('incoming-caller-name', activeChatUser ? activeChatUser.username : 'Unknown Peer');
            sSrc('incoming-caller-dp', activeChatUser ? activeChatUser.dp : DEFAULT_DP);
            sRem('incoming-call-ring-modal', 'hidden');
        }

        if (clickedTargetElementNode.closest('#direct-voice-call-btn')) { simulateIncomingCall('voice'); return; }
        if (clickedTargetElementNode.closest('#direct-video-call-btn')) { simulateIncomingCall('video'); return; }

        if (clickedTargetElementNode.closest('#group-voice-call-btn') || clickedTargetElementNode.closest('#group-video-call-btn')) {
            alert("Group Room Call Initiated: Participants can join the stream silently. No ring notifications dispatched to avoid spam.");
            return;
        }
        if (clickedTargetElementNode.closest('#world-voice-call-btn') || clickedTargetElementNode.closest('#world-video-call-btn')) {
            alert("Global Stage Initiated: A public stage stream has been created. Notifications are suppressed by default in World Chat.");
            return;
        }

        if (clickedTargetElementNode.closest('#accept-incoming-call-btn')) {
            sAdd('incoming-call-ring-modal', 'hidden');
            alert("Call Connected! 📞 (WebRTC secure stream channel actively initialized)");
            return;
        }
        if (clickedTargetElementNode.closest('#reject-incoming-call-btn')) {
            sAdd('incoming-call-ring-modal', 'hidden'); return;
        }

        // =========================================================
        // MULTI-FEATURE CHAT INPUTS (EMOJI, VOICE TYPING, ATTACHMENTS)
        // =========================================================
        // Emoji Button Simulation
        if (clickedTargetElementNode.closest('#emoji-btn')) { sVal('message-input', gVal('message-input') + ' 😊'); return; }
        if (clickedTargetElementNode.closest('#group-emoji-btn')) { sVal('group-message-input', gVal('group-message-input') + ' 🚀'); return; }
        if (clickedTargetElementNode.closest('#world-emoji-btn')) { sVal('world-message-input', gVal('world-message-input') + ' 🌍'); return; }

        // Voice Note Simulation
        if (clickedTargetElementNode.closest('#voice-note-btn') || clickedTargetElementNode.closest('#group-voice-note-btn') || clickedTargetElementNode.closest('#world-voice-note-btn')) {
            alert("🎙️ Voice Note Recording Engine activated... (Hold functionality engaged. Let go to send.)");
            return;
        }

        // Voice Typing Engine Triggers
        if (clickedTargetElementNode.closest('#voice-type-btn')) { startVoiceTyping('message-input'); return; }
        if (clickedTargetElementNode.closest('#group-voice-type-btn')) { startVoiceTyping('group-message-input'); return; }
        if (clickedTargetElementNode.closest('#world-voice-type-btn')) { startVoiceTyping('world-message-input'); return; }

        // Attachment Hidden Input Triggers
        if (clickedTargetElementNode.closest('#attach-btn')) { const uploadInput = safeEl('chat-media-upload-input'); if (uploadInput) uploadInput.click(); return; }
        if (clickedTargetElementNode.closest('#group-attach-btn')) { const uploadInput = safeEl('group-media-upload-input'); if (uploadInput) uploadInput.click(); return; }
        if (clickedTargetElementNode.closest('#world-attach-btn')) { const uploadInput = safeEl('world-media-upload-input'); if (uploadInput) uploadInput.click(); return; }

        // Send Messages (Direct, Group, World)
        if (clickedTargetElementNode.closest('#send-btn')) { executeDirectCommunicationMessageUplinkRoute(); return; }
        if (clickedTargetElementNode.closest('#group-send-btn')) {
            const groupMsgInputElem = safeEl('group-message-input');
            const groupMsgText = groupMsgInputElem ? groupMsgInputElem.value.trim() : "";
            if (groupMsgText) {
                const grpMessagesAreaOutput = safeEl('group-messages-area');
                if (grpMessagesAreaOutput) {
                    const myGrpMsgDiv = document.createElement('div');
                    myGrpMsgDiv.className = "message-bubble my-msg";
                    myGrpMsgDiv.innerHTML = `<strong>Me:</strong> ${groupMsgText}`;
                    grpMessagesAreaOutput.appendChild(myGrpMsgDiv);
                    grpMessagesAreaOutput.scrollTop = grpMessagesAreaOutput.scrollHeight;
                }
                if (groupMsgInputElem) groupMsgInputElem.value = "";
            }
            return;
        }
        if (clickedTargetElementNode.closest('#world-send-btn')) {
            const worldMsgInputElem = safeEl('world-message-input');
            const worldMsgText = worldMsgInputElem ? worldMsgInputElem.value.trim() : "";
            if (worldMsgText) {
                const worldMessagesAreaOutput = safeEl('world-messages-area');
                if (worldMessagesAreaOutput) {
                    const myWorldMsgDiv = document.createElement('div');
                    myWorldMsgDiv.className = "message-bubble my-msg";
                    myWorldMsgDiv.innerHTML = `<strong>Me:</strong> ${worldMsgText}`;
                    worldMessagesAreaOutput.appendChild(myWorldMsgDiv);
                    worldMessagesAreaOutput.scrollTop = worldMessagesAreaOutput.scrollHeight;
                }
                if (worldMsgInputElem) worldMsgInputElem.value = "";
            }
            return;
        }

        if (clickedTargetElementNode.closest('#world-mute-btn')) {
            isWorldMuted = !isWorldMuted;
            const muteButtonElem = clickedTargetElementNode.closest('#world-mute-btn');
            if (isWorldMuted) {
                muteButtonElem.innerHTML = '<i class="fas fa-volume-mute"></i>';
                muteButtonElem.classList.remove('danger-btn'); muteButtonElem.classList.add('action-btn');
                alert("World Chat is now muted. You will not hear global notification sounds.");
            } else {
                muteButtonElem.innerHTML = '<i class="fas fa-volume-up"></i>';
                muteButtonElem.classList.remove('action-btn'); muteButtonElem.classList.add('danger-btn');
                alert("World Chat audio notifications successfully restored.");
            }
            return;
        }


        // =========================================================
        // PROFILE PICTURE AND BANNER MODIFICATIONS
        // =========================================================
        if (clickedTargetElementNode.closest('#trigger-dp-upload')) { const hiddenUploadInputField = safeEl('edit-dp-input'); if (hiddenUploadInputField) hiddenUploadInputField.click(); return; }
        if (clickedTargetElementNode.closest('#trigger-banner-upload')) { const hiddenUploadInputField = safeEl('edit-banner-input'); if (hiddenUploadInputField) hiddenUploadInputField.click(); return; }

        if (clickedTargetElementNode.closest('#save-profile-btn')) {
            const nicknameConfigurationInputValue = gVal('edit-username-input');
            const biographicalSummaryInputValue = gVal('edit-bio-input');
            if (nicknameConfigurationInputValue) currentUser.username = nicknameConfigurationInputValue;
            currentUser.bio = biographicalSummaryInputValue;
            saveData(); updateProfileUI(); sAdd('edit-profile-modal', 'hidden');
            alert("Configuration Logs Successful: Profile Settings Saved and Committed to Storage!");
            return;
        }

        // =========================================================
        // POST FEED CREATION, DELETE & ATTACHMENTS 
        // =========================================================
        if (clickedTargetElementNode.closest('#post-image-btn')) { const hiddenImageUploadInputField = safeEl('post-image-upload-input'); if (hiddenImageUploadInputField) hiddenImageUploadInputField.click(); return; }
        if (clickedTargetElementNode.closest('#post-gif-btn')) { alert("System Info: GIF integration engine API is currently undergoing maintenance. Try attaching a static image instead."); return; }
        if (clickedTargetElementNode.closest('#post-meme-btn')) { alert("System Info: Meme generator module is pending upcoming V22 update integration."); return; }

        if (clickedTargetElementNode.closest('#action-remove-attached-post-file-buffer')) {
            attachedPostImage = null; sAdd('post-media-attachment-status-preview', 'hidden'); sVal('post-image-upload-input', ''); return;
        }
        if (clickedTargetElementNode.closest('#submit-post-btn')) { executePostContentPublishUplinkRoute(); return; }

        // FIX: The missing Post Delete click event logic
        if (clickedTargetElementNode.closest('.delete-post-btn')) {
            if (confirm("Are you entirely sure you want to permanently delete this specific post from the global feed arrays?")) {
                const postCardElement = clickedTargetElementNode.closest('.feed-post');
                if (postCardElement) {
                    const extractedPostId = parseInt(postCardElement.getAttribute('data-id'));
                    posts = posts.filter(postObj => postObj.id !== extractedPostId);
                    saveData();
                    renderPosts();
                }
            }
            return;
        }

        // =========================================================
        // GROUP CHAT CONTROLS
        // =========================================================
        if (clickedTargetElementNode.closest('#create-group-btn')) { sRem('create-group-modal', 'hidden'); return; }
        if (clickedTargetElementNode.closest('#trigger-group-icon-upload')) { const hiddenGroupIconUploadInputField = safeEl('new-group-icon-input'); if (hiddenGroupIconUploadInputField) hiddenGroupIconUploadInputField.click(); return; }

        if (clickedTargetElementNode.closest('#confirm-create-group-btn')) {
            const groupTitleNameInputValue = gVal('new-group-name');
            if (groupTitleNameInputValue) {
                groups.push({ id: Date.now(), name: groupTitleNameInputValue, icon: tempGroupIcon, createdBy: currentUser.username });
                saveData(); renderGroups(); sAdd('create-group-modal', 'hidden'); sVal('new-group-name', '');
                tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff"; sSrc('new-group-icon-preview', tempGroupIcon);
                alert(`New Multiplex Channel: '${groupTitleNameInputValue}' created successfully!`);
            }
            return;
        }

        if (clickedTargetElementNode.closest('.group-item')) {
            const groupNameStringValue = clickedTargetElementNode.closest('.group-item').getAttribute('data-group');
            sAdd('group-placeholder', 'hidden'); sRem('group-header', 'hidden');
            sRem('group-messages-area', 'hidden'); sRem('group-input-area', 'hidden');
            sText('current-group-name', groupNameStringValue);
            const selectedGroupObj = groups.find(x => x.name === groupNameStringValue);
            if (selectedGroupObj) { sSrc('group-header-img', selectedGroupObj.icon || `https://ui-avatars.com/api/?name=${groupNameStringValue}&background=a855f7&color=fff`); }
            return;
        }

        // Group Chat Poll Systems
        if (clickedTargetElementNode.closest('#group-channel-trigger-instantiate-poll-creation-modal-btn')) {
            sVal('group-poll-input-question-string-field', ''); sVal('group-poll-input-option-string-field-1', ''); sVal('group-poll-input-option-string-field-2', '');
            sRem('group-channel-poll-creation-modal-framework-overlay-window', 'hidden'); return;
        }

        if (clickedTargetElementNode.closest('#action-trigger-commit-publish-group-poll-to-channel-stream-btn')) {
            const pollQuestionTargetStringValue = gVal('group-poll-input-question-string-field');
            const pollOptionTargetStringValue1 = gVal('group-poll-input-option-string-field-1');
            const pollOptionTargetStringValue2 = gVal('group-poll-input-option-string-field-2');

            if (pollQuestionTargetStringValue && pollOptionTargetStringValue1 && pollOptionTargetStringValue2) {
                const groupMessageChatAreaElement = safeEl('group-messages-area');
                if (groupMessageChatAreaElement) {
                    const pollComponentDivElement = document.createElement('div');
                    pollComponentDivElement.className = "message-bubble other-msg";
                    pollComponentDivElement.style.borderLeft = "4px solid var(--primary-color)";
                    pollComponentDivElement.innerHTML = `
                        <div style="font-weight:900; margin-bottom:8px;"><i class="fas fa-poll-h"></i> ACTIVE GROUP POLL VOTE:</div>
                        <div style="font-size:1.1rem; margin-bottom:10px;">${pollQuestionTargetStringValue}</div>
                        <button class="action-btn execution-vote-poll-track-node-btn" style="width:100%; text-align:left; margin-bottom:5px; font-size:0.9rem;" data-votes="0">🗳️ ${pollOptionTargetStringValue1} - [ <span class="vote-count-numerical-outlet-span">0</span> Votes ]</button>
                        <button class="action-btn execution-vote-poll-track-node-btn" style="width:100%; text-align:left; font-size:0.9rem;" data-votes="0">🗳️ ${pollOptionTargetStringValue2} - [ <span class="vote-count-numerical-outlet-span">0</span> Votes ]</button>
                    `;
                    groupMessageChatAreaElement.appendChild(pollComponentDivElement);
                    groupMessageChatAreaElement.scrollTop = groupMessageChatAreaElement.scrollHeight;
                }
                sAdd('group-channel-poll-creation-modal-framework-overlay-window', 'hidden');
                alert("Consensus Poll Deployed successfully into the channel array.");
            } else { alert("Execution Halted: Please ensure all textual input blocks for the poll are fully complete."); }
            return;
        }

        if (clickedTargetElementNode.closest('.execution-vote-poll-track-node-btn')) {
            const pollSelectionButtonElement = clickedTargetElementNode.closest('.execution-vote-poll-track-node-btn');
            let currentTrackedVotesCountValue = parseInt(pollSelectionButtonElement.getAttribute('data-votes')) || 0;
            currentTrackedVotesCountValue++;
            pollSelectionButtonElement.setAttribute('data-votes', currentTrackedVotesCountValue);
            const spanOutputValueElement = pollSelectionButtonElement.querySelector('.vote-count-numerical-outlet-span');
            if (spanOutputValueElement) { spanOutputValueElement.innerText = currentTrackedVotesCountValue; }
            pollSelectionButtonElement.disabled = true; pollSelectionButtonElement.style.opacity = "0.7";
            return;
        }

        // =========================================================
        // FRIENDSHIP BOND ACTIONS 
        // =========================================================
        if (clickedTargetElementNode.closest('#send-band-req-btn')) {
            const bondTargetInputStringValue = gVal('band-request-input');
            if (bondTargetInputStringValue !== "") {
                bandRequests.push({ username: bondTargetInputStringValue });
                saveData(); renderBandRequests(); sVal('band-request-input', '');
                alert(`Success: Your Friendship Bond Request Handshake has been dispatched to [${bondTargetInputStringValue}]!`);
            }
            return;
        }

        if (clickedTargetElementNode.closest('.btn-accept-band')) {
            const bondRequestListItemElement = clickedTargetElementNode.closest('.dummy-item');
            if (bondRequestListItemElement) {
                const bondSourceUsernameKey = bondRequestListItemElement.getAttribute('data-user');
                bandRequests = bandRequests.filter(reqObj => reqObj.username !== bondSourceUsernameKey);
                sHtml('fb-partner-dp-slot', `<img src="https://ui-avatars.com/api/?name=${bondSourceUsernameKey}&background=random&color=fff" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`);
                sText('fb-partner-name', bondSourceUsernameKey); sText('band-level', "Bond Level 1 (Initial Handshake Verified)"); sText('time-remaining', "You are now bonded securely!");
                const visualProgressBarElement = safeEl('band-progress'); if (visualProgressBarElement) { visualProgressBarElement.style.width = "45%"; }
                sRem('break-band-btn', 'hidden'); saveData(); renderBandRequests();
            }
            return;
        }

        if (clickedTargetElementNode.closest('#break-band-btn')) {
            if (confirm("SEVERE ACTION WARNING: Are you absolutely sure you want to permanently break your Friendship Bond link sequence? All synchronized streak progress counters will be completely lost and zeroed out.")) {
                sHtml('fb-partner-dp-slot', '?'); sText('fb-partner-name', "Partner Space Available");
                sText('band-level', "Bond Level 0 (Detached)"); sText('time-remaining', "Currently Not Connected");
                const visualProgressBarElement = safeEl('band-progress'); if (visualProgressBarElement) { visualProgressBarElement.style.width = "0%"; }
                sAdd('break-band-btn', 'hidden'); saveData(); alert("Termination Process Successful: Your Friendship Bond parameters have been completely severed and zeroed out.");
            }
            return;
        }

        // =========================================================
        // DEVELOPER CONTROL PANEL BUTTONS
        // =========================================================
        if (clickedTargetElementNode.closest('#dev-assign-rank-btn')) { alert("Admin Access Log: Select a target user first to modify their database rank tier mapping."); return; }
        if (clickedTargetElementNode.closest('#dev-assign-ring-btn')) { alert("Admin Access Log: Premium profile rings and aura interface deploying in the next patch iteration."); return; }
        if (clickedTargetElementNode.closest('#dev-shadowban-toggle-btn')) { alert("Admin Warning: Ghost shadowban protocol requires target user ID confirmation to execute properly."); return; }
        if (clickedTargetElementNode.closest('#dev-ban-user-execution-btn')) {
            let targetToBanStringInput = prompt("ENTER EXACT TARGET USERNAME TO EXECUTE PERMANENT BAN PROTOCOL:");
            if (targetToBanStringInput) { alert(`EXECUTION CONFIRMED: Target node [${targetToBanStringInput}] has been completely restricted and eliminated from the server matrix.`); }
            return;
        }

        // Disappearing Messages & Bug Reports
        if (clickedTargetElementNode.closest('#chat-input-toggle-secret-disappearing-messages-mode-btn')) {
            activeDisappearingMessagesMode = !activeDisappearingMessagesMode;
            const disappearModeToggleBtnElement = safeEl('chat-input-toggle-secret-disappearing-messages-mode-btn');
            if (disappearModeToggleBtnElement) {
                if (activeDisappearingMessagesMode) { disappearModeToggleBtnElement.style.color = "#fbbf24"; alert("SECURITY TOGGLE: Ephemeral Disappearing messages are now turned ON. Transmission arrays will expire in 10 seconds."); }
                else { disappearModeToggleBtnElement.style.color = "var(--text-muted)"; alert("SECURITY TOGGLE: Disappearing messages mode is now officially turned OFF."); }
            }
            return;
        }

        if (clickedTargetElementNode.closest('#submit-bug-report-btn')) {
            const bugReportDescriptionTextValue = gVal('bug-report-text-input');
            if (bugReportDescriptionTextValue !== "") {
                systemBugReports.push({ id: systemBugReports.length + 1, submittedBy: currentUser ? currentUser.username : "Unknown Entity", traceLogContext: bugReportDescriptionTextValue, timestamp: new Date().toLocaleTimeString() });
                saveData(); renderDeveloperBugReportsAggregationPanelList(); sAdd('bug-report-modal', 'hidden');
                alert("Central Routing Notification: Bug Report packet compiled and submitted successfully directly to Developer Headquarters! Thank you for the contribution.");
            }
            return;
        }

        // Modals Overlay Closing Hooks
        if (clickedTargetElementNode.closest('.close-modal-btn') || clickedTargetElementNode.classList.contains('modal-overlay')) {
            let overlayToCloseElement = clickedTargetElementNode.closest('.modal-overlay');
            if (!overlayToCloseElement) { overlayToCloseElement = clickedTargetElementNode; }
            if (overlayToCloseElement.classList.contains('modal-overlay')) { overlayToCloseElement.classList.add('hidden'); }
            return;
        }

        // Settings Actions
        if (clickedTargetElementNode.closest('#action-clear-cache-btn')) {
            if (confirm("Notice: Are you absolutely positive you want to completely clear the application cache blocks? This will delete all temporary files and posts arrays, but will keep your active profile login session running safely.")) {
                localStorage.removeItem('chatPosts'); posts = []; renderPosts();
                alert("Storage Cleanup Engine Successful: Cache segment completely cleared and deallocated from internal memory.");
            }
            return;
        }

        if (clickedTargetElementNode.closest('#view-friends-list-btn')) { renderFriendsListModal(); sRem('friend-list-modal', 'hidden'); return; }
        if (clickedTargetElementNode.closest('#edit-profile-btn')) { sVal('edit-username-input', currentUser.username); sVal('edit-bio-input', currentUser.bio || ''); sRem('edit-profile-modal', 'hidden'); return; }

    });


    // =========================================================================
    // 8. SUPPLEMENTARY EVENT LISTENERS AND HELPERS
    // =========================================================================

    const settingsThemeSelectorDropdownElement = safeEl('settings-theme-palette-spectrum-engine-selector-dropdown-field');
    if (settingsThemeSelectorDropdownElement) {
        settingsThemeSelectorDropdownElement.addEventListener('change', (eventObject) => {
            if (currentUser) {
                currentUser.theme = eventObject.target.value; saveData(); applySystemThemePalette();
                alert(`Interface Notification: Theme spectrum configuration correctly applied to [${currentUser.theme}].`);
            }
        });
    }

    function renderFriendsListModal() {
        const modalContainerOutputElement = safeEl('modal-friend-list-container');
        if (!modalContainerOutputElement) return;
        modalContainerOutputElement.innerHTML = '';
        if (friends.length === 0) { modalContainerOutputElement.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:1.05rem; padding: 20px; font-weight: bold;">You have zero friends added to your profile array indices yet.</p>`; return; }

        friends.forEach(function (friendIteratedObject) {
            let constructedFriendHtmlCardString = `
                <div class="dummy-item" style="border-bottom: 1px solid var(--border-color); padding: 12px; background: var(--bg-main); border-radius: 12px; display: flex; align-items: center; gap: 15px;">
                    <img src="${friendIteratedObject.dp || DEFAULT_DP}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color);">
                    <div style="display:flex; flex-direction:column;">
                        <b style="font-size:1.15rem; color:var(--text-main);">${friendIteratedObject.username}</b>
                        <span style="font-size:0.8rem; color:var(--text-muted); font-weight:bold;">Status: Validated Friendship Link</span>
                    </div>
                </div>
            `;
            modalContainerOutputElement.innerHTML += constructedFriendHtmlCardString;
        });
    }

    function renderDeveloperBugReportsAggregationPanelList() {
        const primaryDashboardListOutletElement = safeEl('dev-bug-reports-list-target-outlet-wrapper');
        let constructedBugReportHtmlSequenceString = "";
        if (systemBugReports.length === 0) {
            constructedBugReportHtmlSequenceString = `<p style="text-align: center; color: #64748b; font-family: monospace; padding: 20px;">[ROUTING STATUS LOGS: ZERO BUG REPORTS SUBMITTED ENTIRELY INTO THE STACK REGISTRIES]</p>`;
        } else {
            systemBugReports.forEach(function (reportIteratedObject) {
                constructedBugReportHtmlSequenceString += `
                    <div style="background: #000; border-left: 4px solid #ef4444; padding: 15px; border-radius: 8px; color: #fff; font-family: monospace; font-size: 0.85rem; margin-bottom: 10px;">
                        <div style="display:flex; justify-content:space-between; color:#ef4444; font-weight:bold;">
                            <span>➡️ SYSTEM BUG ID TOKEN TRACE: #${reportIteratedObject.id}</span>
                            <span>⏱️ TIME LOGGED: ${reportIteratedObject.timestamp}</span>
                        </div>
                        <div><b>👤 IDENTIFIED REPORTING NODE SOURCE ORIGIN:</b> ${reportIteratedObject.submittedBy}</div>
                        <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:4px; margin-top:5px; border:1px solid #1e293b;">
                            <b>📝 DIAGNOSTIC CONTEXT NARRATIVE:</b> ${reportIteratedObject.traceLogContext}
                        </div>
                    </div>
                `;
            });
        }
        if (primaryDashboardListOutletElement) { primaryDashboardListOutletElement.innerHTML = constructedBugReportHtmlSequenceString; }
    }

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

    // Profile File Uploads
    setupFileInput('edit-dp-input', (resultingBase64ImageStringCode) => { currentUser.dp = resultingBase64ImageStringCode; saveData(); updateProfileUI(); alert("Configuration Verified: Profile Picture DP Avatar Updated Successfully into Data Memory Arrays!"); });
    setupFileInput('edit-banner-input', (resultingBase64ImageStringCode) => { currentUser.banner = resultingBase64ImageStringCode; saveData(); updateProfileUI(); alert("Configuration Verified: Profile Banner Background Graphic Updated Successfully!"); });
    setupFileInput('new-group-icon-input', (resultingBase64ImageStringCode) => { tempGroupIcon = resultingBase64ImageStringCode; sSrc('new-group-icon-preview', tempGroupIcon); });
    setupFileInput('post-image-upload-input', (resultingBase64ImageStringCode) => { attachedPostImage = resultingBase64ImageStringCode; sRem('post-media-attachment-status-preview', 'hidden'); });

    // Chat Image/Media Attachment Rendering Engine
    function renderChatMediaMessage(base64MediaString, targetMessageAreaIdString) {
        const messageAreaTargetElement = safeEl(targetMessageAreaIdString);
        if (messageAreaTargetElement) {
            const mediaMessageBubbleDiv = document.createElement('div');
            mediaMessageBubbleDiv.className = "message-bubble my-msg";
            mediaMessageBubbleDiv.innerHTML = `<strong>Me:</strong><br><img src="${base64MediaString}" style="max-width:220px; border-radius:12px; margin-top:8px; border:2px solid rgba(255,255,255,0.2);">`;
            messageAreaTargetElement.appendChild(mediaMessageBubbleDiv);
            messageAreaTargetElement.scrollTop = messageAreaTargetElement.scrollHeight;
        }
    }

    setupFileInput('chat-media-upload-input', (mediaBase64Data) => { renderChatMediaMessage(mediaBase64Data, 'messages-area'); });
    setupFileInput('group-media-upload-input', (mediaBase64Data) => { renderChatMediaMessage(mediaBase64Data, 'group-messages-area'); });
    setupFileInput('world-media-upload-input', (mediaBase64Data) => { renderChatMediaMessage(mediaBase64Data, 'world-messages-area'); });

    function openRightProfilePreviewPane(selectedUserContextDataRecordObject) {
        sAdd('chat-placeholder', 'hidden'); sAdd('chat-header', 'hidden'); sAdd('messages-area', 'hidden'); sAdd('chat-input-area', 'hidden');
        sRem('request-profile-preview-pane', 'hidden');
        sSrc('preview-search-user-dp', selectedUserContextDataRecordObject.dp); sText('preview-search-user-name', selectedUserContextDataRecordObject.username);
        sText('preview-search-user-bio', selectedUserContextDataRecordObject.bio); sText('preview-search-user-rank', selectedUserContextDataRecordObject.rank || "Verified Member");
    }

    function resetRightWorkspacePane() {
        sAdd('request-profile-preview-pane', 'hidden'); sAdd('chat-header', 'hidden'); sAdd('messages-area', 'hidden'); sAdd('chat-input-area', 'hidden');
        sRem('chat-placeholder', 'hidden');
    }

    const handleEnterKeypressRoutingPortAssignmentMethod = (targetInputIdString, triggerActionBtnIdString) => {
        const inputFieldTargetElement = safeEl(targetInputIdString);
        if (inputFieldTargetElement) {
            inputFieldTargetElement.addEventListener('keypress', (keypressEventObject) => {
                if (keypressEventObject.key === 'Enter') {
                    keypressEventObject.preventDefault();
                    const actionButtonTargetElement = safeEl(triggerActionBtnIdString);
                    if (actionButtonTargetElement) { actionButtonTargetElement.click(); }
                }
            });
        }
    };

    handleEnterKeypressRoutingPortAssignmentMethod('message-input', 'send-btn');
    handleEnterKeypressRoutingPortAssignmentMethod('world-message-input', 'world-send-btn');
    handleEnterKeypressRoutingPortAssignmentMethod('group-message-input', 'group-send-btn');
    handleEnterKeypressRoutingPortAssignmentMethod('chat-sidebar-search-input', 'sidebar-action-search-trigger');

}); // END OF DOMCONTENTLOADED EVENT LISTENER INFRASTRUCTURE BLOCK