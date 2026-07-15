console.log("🔥 CHATTERBOX VIP ECOSYSTEM OS - PYTHON AI INTEGRATED ENGINE V15 (LOGIN FIXED) 🔥");

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 0. CORE CRASH-PROOF DOM INTERFACE POINTERS LOGIC
    // =========================================================================
    const safeEl = id => document.getElementById(id);
    const sAdd = (id, cls) => { const el = safeEl(id); if(el) el.classList.add(cls); };
    const sRem = (id, cls) => { const el = safeEl(id); if(el) el.classList.remove(cls); };
    const sText = (id, txt) => { const el = safeEl(id); if(el) el.innerText = txt; };
    const sHtml = (id, html) => { const el = safeEl(id); if(el) el.innerHTML = html; };
    const sVal = (id, val) => { const el = safeEl(id); if(el) el.value = val; };
    const gVal = (id) => { const el = safeEl(id); return el ? el.value.trim() : ''; };
    const sSrc = (id, src) => { const el = safeEl(id); if(el) el.src = src; };

    // =========================================================================
    // 1. DYNAMIC SYSTEM DATABASE & PARAMETERS CONFIGURATIONS STATE
    // =========================================================================
    let currentUser = null;
    let friends = [];
    let friendRequests = []; 
    let bandRequests = [];   
    let posts = [];
    let groups = [];
    
    let systemBugReports = [];
    let activeChatPinnedMessages = {}; 
    let activeDisappearingMessagesMode = false;
    let currentSystemLanguage = 'en';

    const systemVerifiedUserDirectory = [
        { username: "Atifullah Azhar", dp: "https://ui-avatars.com/api/?name=Atifullah+Azhar&background=ffd700&color=000", bio: "Supreme Root Developer & Owner of Chatterbox VIP Architecture Matrix.", rank: "Developer" },
        { username: "Nauras Daniyal", dp: "https://ui-avatars.com/api/?name=Nauras&background=eaddff&color=8b5cf6", bio: "Verified Operations Specialist Platform Node Administrator.", rank: "Operator" },
        { username: "Rahul Sharma", dp: "https://ui-avatars.com/api/?name=Rahul&background=ffedd5&color=f97316", bio: "Premium Core Beta Tester & Systems Optimization Analyst.", rank: "Elite" },
        { username: "Sneha_007", dp: "https://ui-avatars.com/api/?name=Sneha&background=fce7f3&color=ec4899", bio: "Secured encrypted network endpoint data communication pipeline.", rank: "Member" }
    ];

    try {
        currentUser = JSON.parse(localStorage.getItem('chatUser')) || null;
        friends = JSON.parse(localStorage.getItem('chatFriends')) || [];
        friendRequests = JSON.parse(localStorage.getItem('chatRequests')) || [];
        bandRequests = JSON.parse(localStorage.getItem('bandRequests')) || [];
        posts = JSON.parse(localStorage.getItem('chatPosts')) || [];
        groups = JSON.parse(localStorage.getItem('chatGroups')) || [];
        systemBugReports = JSON.parse(localStorage.getItem('chatBugReports')) || [];
    } catch (error) {
        console.error("Critical System Registry Parsing Exception:", error);
    }
    
    let activeChatUser = null;
    let currentChatTab = 'general'; 
    let currentRequestSubTab = 'accept'; 
    let searchedUserContext = null;

    let isWorldMuted = false;
    let devStates = { shadowban: false, globalMute: false, maintenance: false };
    
    let tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff";
    let attachedPostImage = null;

    const socket = (typeof io !== 'undefined') ? io() : { on: () => {}, emit: () => {} };
    const DEFAULT_DP = "https://ui-avatars.com/api/?name=User&background=eaddff&color=8b5cf6";

    if (currentUser && currentUser.username) {
        sRem('login-screen', 'active');
        sAdd('login-screen', 'hidden');
        sRem('main-app', 'hidden');
        sAdd('main-app', 'active');
        
        applySystemThemePalette();
        updateProfileUI();
        renderContacts();
        updateBadgesAndCounts();
        renderPosts();
        renderGroups();
        renderBandRequests();
        triggerAutomatedWelcomeBroadcast();
    }

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
        const paletteSelector = safeEl('settings-theme-palette-spectrum-engine-selector-dropdown-field');
        
        if (currentUser.theme) {
            document.documentElement.setAttribute('data-theme', currentUser.theme);
            if (paletteSelector) paletteSelector.value = currentUser.theme;
            
            if (currentUser.theme === 'grand-golden') {
                document.body.classList.add('dev-theme-active');
            } else {
                document.body.classList.remove('dev-theme-active');
            }
        }
    }

    function triggerAutomatedWelcomeBroadcast() {
        if (!currentUser) return;
        setTimeout(() => {
            const area = safeEl('world-messages-area');
            if (area) {
                const div = document.createElement('div');
                div.className = "message-bubble system-msg";
                div.innerText = `👋 Welcome back online, [${currentUser.username}]. Your secured transmission nodes are actively mapping global stream sequences.`;
                area.appendChild(div);
                area.scrollTop = area.scrollHeight;
            }
        }, 1500);
    }

    // =========================================================================
    // 2. PRIMARY AUTHENTICATION PROCESS REGISTRY HOOKS (LOGIN LOGIC)
    // =========================================================================
    function performLoginProcess() {
        const username = gVal('username-input');
        const email = gVal('email-input');
        const devCode = gVal('dev-code');
        const tosChecked = safeEl('tos-checkbox-matrix') ? safeEl('tos-checkbox-matrix').checked : false;

        if (!tosChecked) {
            alert("REGISTRY ERROR: You must read and accept the Terms of Service Agreement coordinates before initializing connection matrix portal routes.");
            return;
        }

        if (username && email) {
            currentUser = { 
                username: username, dp: DEFAULT_DP, banner: null, 
                rank: 'Member', isDev: false, bio: "Operational tracking systems online. Ready to monitor streams.", 
                theme: "default", presence: "online"
            };
            
            if (devCode === "6200437705AT") {
                currentUser.rank = 'Developer';
                currentUser.isDev = true;
                currentUser.theme = 'grand-golden';
            }
            
            saveData();
            
            sRem('login-screen', 'active');
            sAdd('login-screen', 'hidden');
            sRem('main-app', 'hidden');
            sAdd('main-app', 'active');
            
            applySystemThemePalette();
            updateProfileUI();
            renderContacts();
            updateBadgesAndCounts();
            renderPosts();
            renderGroups();
            renderBandRequests();
            triggerAutomatedWelcomeBroadcast();
        } else {
            alert("CRITICAL LOG: Verification processing failed. Username handle fields and Email coordinates strings cannot contain empty allocations data nodes rows.");
        }
    }

    // =========================================================================
    // 🔥 DIRECT BUTTON BINDINGS (YE FIX HAI JO BUTTON KO CLICKABLE BANAYEGA) 🔥
    // =========================================================================
    
    // 1. Login Button Fix
    const loginButton = safeEl('join-btn');
    if (loginButton) {
        loginButton.onclick = function(e) {
            e.preventDefault();
            performLoginProcess();
        };
    }

    // 2. OTP Button Fix
    const otpButton = safeEl('action-switch-to-otp-mode-btn');
    if (otpButton) {
        otpButton.onclick = function(e) {
            e.preventDefault();
            const otpBlock = safeEl('otp-login-verification-block');
            if (otpBlock) {
                if (otpBlock.classList.contains('hidden')) {
                    otpBlock.classList.remove('hidden');
                    otpButton.innerText = "Cancel OTP Verification Process";
                    otpButton.style.background = "#ef4444";
                    otpButton.style.color = "#fff";
                } else {
                    otpBlock.classList.add('hidden');
                    otpButton.innerText = "Verify via Secure Mobile SMS OTP Channel Port";
                    otpButton.style.background = "var(--bg-panel)";
                    otpButton.style.color = "var(--text-main)";
                }
            }
        };
    }

    // =========================================================================
    // 3. 🤖 PYTHON AI INTEGRATION ASYNC FUNCTIONS (SENTIMENT & SPAM) 🤖
    // =========================================================================

    async function processAndSendDirectMessage() {
        const inputFieldTextElementPointer = safeEl('message-input');
        let messagePacketStringText = gVal('message-input');
        
        if (messagePacketStringText !== "" && activeChatUser) {
            try {
                const aiResponse = await fetch('http://127.0.0.1:8000/api/ai/sentiment-analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: messagePacketStringText, sender: currentUser.username })
                });
                const aiData = await aiResponse.json();
                if (aiData.classification && aiData.classification.is_toxic) {
                    alert(`🚨 PYTHON AI SECURITY SHIELD: Toxic language detected! (Toxicity Confidence: ${aiData.classification.toxicity_rating}). Transmission Blocked automatically by Server to prevent shadowban.`);
                    return; 
                }
            } catch (err) {
                console.warn("Python AI Engine not reachable. Ensure uvicorn is running. Bypassing AI filter.", err);
            }

            const messagesAreaCanvasGridOutputOutlet = safeEl('messages-area');
            const singleMessageBubbleRowWrapperDiv = document.createElement('div');
            singleMessageBubbleRowWrapperDiv.className = "message-bubble my-msg";
            
            if (activeDisappearingMessagesMode) {
                singleMessageBubbleRowWrapperDiv.style.borderRight = "4px dashed #f59e0b";
                singleMessageBubbleRowWrapperDiv.innerHTML = `<strong>[VOLATILE EPHEMERAL PAK - 10s TIME TO PURGE] Me:</strong> ${messagePacketStringText}`;
                
                setTimeout(() => {
                    singleMessageBubbleRowWrapperDiv.style.opacity = "0.3";
                    singleMessageBubbleRowWrapperDiv.innerText = "✖️ This communication packet sequence trace has evaporated safely due to strict disappearing mode constraints.";
                }, 10000);
            } else {
                singleMessageBubbleRowWrapperDiv.innerHTML = `<strong>Me:</strong> ${messagePacketStringText}`;
            }

            if (messagesAreaCanvasGridOutputOutlet) {
                messagesAreaCanvasGridOutputOutlet.appendChild(singleMessageBubbleRowWrapperDiv);
                messagesAreaCanvasGridOutputOutlet.scrollTop = messagesAreaCanvasGridOutputOutlet.scrollHeight;
            }

            if(inputFieldTextElementPointer) inputFieldTextElementPointer.value = "";
        }
    }

    async function processAndPublishFeedPost() {
        const contentText = gVal('post-input');
        const privacySelect = safeEl('post-privacy-scope-configuration-level-toggle-select');
        const privacyScopeStr = privacySelect ? privacySelect.value : 'public';

        if (contentText !== "" || attachedPostImage) {
            if (contentText !== "") {
                try {
                    const spamResponse = await fetch('http://127.0.0.1:8000/api/ai/spam-detection', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: contentText, sender: currentUser.username })
                    });
                    const spamData = await spamResponse.json();
                    if (spamData.verdict && spamData.verdict.is_spam) {
                        alert(`🚨 PYTHON AI ANTI-SPAM ENGINE: This post looks like automated bot spam! (Spam Score: ${spamData.verdict.spam_probability_score}%). \n\nTriggers: ${spamData.verdict.trigger_reasons_identified.join(', ')}. \n\nPost Injection Rejected!`);
                        return; 
                    }
                } catch (err) {
                    console.warn("Python AI Spam Engine offline. Bypassing.", err);
                }
            }

            const hashTagsFoundArray = contentText.match(/#\w+/g) || [];
            
            posts.unshift({
                id: Date.now(),
                user: currentUser.username,
                dp: currentUser.dp,
                text: contentText,
                image: attachedPostImage,
                scope: privacyScopeStr,
                tags: hashTagsFoundArray,
                time: "Just initialized via node uplink"
            });
            saveData(); renderPosts();
            sVal('post-input', ''); attachedPostImage = null;
            sAdd('post-media-attachment-status-preview', 'hidden'); sVal('post-image-upload-input', '');
        } else {
            alert("POST COMPILATION FAILURE: Text parameter contents or image file binaries payload must be initialized.");
        }
    }

    // =========================================================================
    // 4. 🔥 GLOBAL CORE CLICK EVENT DELEGATION FRAMEWORK ROUTING ENGINE 🔥
    // =========================================================================
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;

        // Skip directly bounded buttons to prevent double-clicks
        if (target.id === 'join-btn' || target.closest('#join-btn') || target.id === 'action-switch-to-otp-mode-btn' || target.closest('#action-switch-to-otp-mode-btn')) return;

        if (target.closest('#trigger-view-tos-modal')) { sRem('tos-documentation-framework-overlay-modal', 'hidden'); return; }

        const navBtn = target.closest('.nav-btn');
        if (navBtn && !navBtn.id.includes('report-bug') && !navBtn.id.includes('logout')) {
            document.querySelectorAll('.nav-links .nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.content-view').forEach(c => { c.classList.remove('active'); c.classList.add('hidden'); });
            navBtn.classList.add('active');
            const targetId = navBtn.getAttribute('data-target');
            sRem(targetId, 'hidden'); sAdd(targetId, 'active');
            return;
        }

        if (target.closest('#sidebar-quick-report-bug-btn') || target.closest('#report-bug-trigger-btn')) {
            sVal('bug-report-text-input', '');
            sRem('bug-report-modal', 'hidden');
            return;
        }

        if (target.closest('#sidebar-quick-logout-btn') || target.closest('#logout-btn')) {
            if (confirm("SESSION CONTROL: Are you completely certain you want to terminate your current application interface state session tokens data rows?")) {
                localStorage.removeItem('chatUser');
                location.reload();
            }
            return;
        }

        const chatTab = target.closest('.chat-tabs .tab-btn');
        if (chatTab) {
            document.querySelectorAll('.chat-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            chatTab.classList.add('active');
            currentChatTab = chatTab.getAttribute('data-tab');
            
            if (currentChatTab === 'requests') {
                sRem('request-sub-tabs-container', 'hidden');
                sAdd('search-friend-field-block', 'hidden');
                renderRequestSubTabUI();
            } else {
                sAdd('request-sub-tabs-container', 'hidden');
                sRem('search-friend-field-block', 'hidden');
                resetRightWorkspacePane();
                renderContacts();
            }
            return;
        }

        if (target.closest('#sub-tab-accept-btn')) { currentRequestSubTab = 'accept'; renderRequestSubTabUI(); resetRightWorkspacePane(); return; }
        if (target.closest('#sub-tab-send-btn')) { currentRequestSubTab = 'send'; renderRequestSubTabUI(); return; }

        if (target.closest('#sidebar-action-search-trigger') && currentChatTab === 'requests' && currentRequestSubTab === 'send') {
            const queryPattern = gVal('chat-sidebar-search-input').toLowerCase();
            if (queryPattern !== "") {
                const searchResultMatchNode = systemVerifiedUserDirectory.find(user => user.username.toLowerCase().includes(queryPattern));
                
                if (searchResultMatchNode) {
                    searchedUserContext = searchResultMatchNode;
                    openRightProfilePreviewPane(searchedUserContext);
                } else {
                    alert(`TRACE FAILURE: Directory Query pattern [${queryPattern}] returned 0 matches entries rows across monitored platform user index charts tables.`);
                    resetRightWorkspacePane();
                }
            } else {
                alert("SYSTEM ERROR: Search target input parameters string row field allocation data cannot look up null pointers indices.");
            }
            return;
        }

        if (target.closest('#action-dispatch-friend-request-btn')) {
            if (searchedUserContext) {
                alert(`PACKET ROUTE: Friend Handshake Invitation payload array sequence compiled and dispatched securely to [${searchedUserContext.username}].`);
                sVal('chat-sidebar-search-input', '');
                resetRightWorkspacePane();
            }
            return;
        }

        if (target.closest('.btn-accept-friend')) {
            const rowItem = target.closest('.dummy-item');
            if (rowItem) {
                const userHandleKey = rowItem.getAttribute('data-user');
                friendRequests = friendRequests.filter(req => req.username !== userHandleKey);
                friends.push({ 
                    username: userHandleKey, 
                    dp: `https://ui-avatars.com/api/?name=${userHandleKey}&background=8b5cf6&color=fff`, 
                    isFavorite: false, bio: "Active synchronized network peer destination node." 
                });
                saveData(); renderRequestSubTabUI(); alert(`Handshake verified. Channel established with [${userHandleKey}].`);
            }
            return;
        }

        if (target.closest('.btn-reject-friend')) {
            const rowItem = target.closest('.dummy-item');
            if (rowItem) {
                const userHandleKey = rowItem.getAttribute('data-user');
                friendRequests = friendRequests.filter(req => req.username !== userHandleKey);
                saveData(); renderRequestSubTabUI();
            }
            return;
        }

        if (target.closest('.contact-item')) {
            const userHandleKey = target.closest('.contact-item').getAttribute('data-user');
            openChatWindow(userHandleKey);
            return;
        }

        if (target.closest('#favorite-user-btn')) {
            if (activeChatUser) {
                const indexMatch = friends.findIndex(f => f.username === activeChatUser.username);
                if (indexMatch !== -1) {
                    friends[indexMatch].isFavorite = !friends[indexMatch].isFavorite;
                    saveData(); updateFavoriteButtonUI();
                    if (currentChatTab === 'favorite') { renderContacts(); resetRightWorkspacePane(); }
                }
            }
            return;
        }

        if (target.closest('#trigger-dp-upload')) { const input = safeEl('edit-dp-input'); if(input) input.click(); return; }
        if (target.closest('#trigger-banner-upload')) { const input = safeEl('edit-banner-input'); if(input) input.click(); return; }
        
        if (target.closest('#save-profile-btn')) {
            const nameVal = gVal('edit-username-input');
            const bioVal = gVal('edit-bio-input');
            if (nameVal) currentUser.username = nameVal;
            currentUser.bio = bioVal;
            saveData(); updateProfileUI(); sAdd('edit-profile-modal', 'hidden');
            alert("METADATA WRITE SUCCESS: Profile local representation registers refreshed accurately.");
            return;
        }

        if (target.closest('#post-image-btn')) { const input = safeEl('post-image-upload-input'); if(input) input.click(); return; }
        if (target.closest('#action-remove-attached-post-file-buffer')) { attachedPostImage = null; sAdd('post-media-attachment-status-preview', 'hidden'); sVal('post-image-upload-input', ''); return; }

        if (target.closest('#submit-post-btn')) {
            processAndPublishFeedPost();
            return;
        }

        if (target.closest('#trigger-group-icon-upload')) { const input = safeEl('new-group-icon-input'); if(input) input.click(); return; }
        if (target.closest('#confirm-create-group-btn')) {
            const grpName = gVal('new-group-name');
            if (grpName) {
                groups.push({ id: Date.now(), name: grpName, icon: tempGroupIcon, createdBy: currentUser.username });
                saveData(); renderGroups(); sAdd('create-group-modal', 'hidden'); sVal('new-group-name', '');
                tempGroupIcon = "https://ui-avatars.com/api/?name=G&background=a855f7&color=fff"; sSrc('new-group-icon-preview', tempGroupIcon);
            }
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
            const qStr = gVal('group-poll-input-question-string-field');
            const o1Str = gVal('group-poll-input-option-string-field-1');
            const o2Str = gVal('group-poll-input-option-string-field-2');

            if (qStr && o1Str && o2Str) {
                const groupChatArea = safeEl('group-messages-area');
                if (groupChatArea) {
                    const pollDivCardBlockNode = document.createElement('div');
                    pollDivCardBlockNode.className = "message-bubble other-msg";
                    pollDivCardBlockNode.style.borderLeft = "4px solid var(--primary-color)";
                    pollDivCardBlockNode.innerHTML = `
                        <div style="font-weight:900; margin-bottom:8px;"><i class="fas fa-poll-h"></i> ACTIVE CONSENSUS POLL:</div>
                        <div style="font-size:1.1rem; margin-bottom:10px;">${qStr}</div>
                        <button class="action-btn execution-vote-poll-track-node-btn" style="width:100%; text-align:left; margin-bottom:5px; font-size:0.9rem;" data-votes="0">🗳️ A: ${o1Str} - [ <span class="vote-count-numerical-outlet-span">0</span> votes ]</button>
                        <button class="action-btn execution-vote-poll-track-node-btn" style="width:100%; text-align:left; font-size:0.9rem;" data-votes="0">🗳️ B: ${o2Str} - [ <span class="vote-count-numerical-outlet-span">0</span> votes ]</button>
                    `;
                    groupChatArea.appendChild(pollDivCardBlockNode);
                    groupChatArea.scrollTop = groupChatArea.scrollHeight;
                }
                sAdd('group-channel-poll-creation-modal-framework-overlay-window', 'hidden');
            } else {
                alert("POLL CONFIG ENGINE TIMEOUT: All query strings parameters fields choices values must contain explicit textual metadata definitions.");
            }
            return;
        }

        if (target.closest('.execution-vote-poll-track-node-btn')) {
            const voteBtnNode = target.closest('.execution-vote-poll-track-node-btn');
            let numericalCurrentVotesCount = parseInt(voteBtnNode.getAttribute('data-votes')) || 0;
            numericalCurrentVotesCount++;
            voteBtnNode.setAttribute('data-votes', numericalCurrentVotesCount);
            const countSpanOutlet = voteBtnNode.querySelector('.vote-count-numerical-outlet-span');
            if(countSpanOutlet) countSpanOutlet.innerText = numericalCurrentVotesCount;
            voteBtnNode.disabled = true;
            voteBtnNode.style.opacity = "0.7";
            return;
        }

        if (target.closest('#send-band-req-btn')) {
            const targetAccountInputString = gVal('band-request-input');
            if (targetAccountInputString !== "") {
                bandRequests.push({ username: targetAccountInputString });
                saveData(); renderBandRequests(); sVal('band-request-input', '');
                alert("HANDSHAKE SYNCHRONIZATION OUTBOUND: Link verification sequence packets broadcasted safely.");
            }
            return;
        }

        if (target.closest('.btn-accept-band')) {
            const closestRowItemBoxNode = target.closest('.dummy-item');
            if (closestRowItemBoxNode) {
                const targetAccountInputString = closestRowItemBoxNode.getAttribute('data-user');
                bandRequests = bandRequests.filter(req => req.username !== targetAccountInputString);
                
                sHtml('fb-partner-dp-slot', `<img src="https://ui-avatars.com/api/?name=${targetAccountInputString}&background=random&color=fff" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`);
                sText('fb-partner-name', targetAccountInputString);
                sText('band-level', "Synchronization Tier: Tier Level 1");
                sText('time-remaining', "Active Matrix Stream Link Coordinates Mapped Securely");
                
                const progressIndicatorElement = safeEl('band-progress');
                if (progressIndicatorElement) progressIndicatorElement.style.width = "45%";
                
                sRem('break-band-btn', 'hidden'); 
                saveData(); renderBandRequests();
            }
            return;
        }

        if (target.closest('#break-band-btn')) {
            if (confirm("DESTRUCTIVE ACTION ADVISORY: Are you completely certain you intend to forcefully split, terminate, and sever the current synchronization coordinate alignment bounds vectors? This will destroy stream statistics calculations rows.")) {
                sHtml('fb-partner-dp-slot', '?');
                sText('fb-partner-name', "Partner Node Space");
                sText('band-level', "Synchronization Tier Level 0");
                sText('time-remaining', "Synchronization Signal Line Unlinked Completely");
                const progressIndicatorElement = safeEl('band-progress');
                if (progressIndicatorElement) progressIndicatorElement.style.width = "0%";
                sAdd('break-band-btn', 'hidden');
                saveData();
                alert("DE-SYNC CORE EXECUTED: Account synchronization bonds severed completely.");
            }
            return;
        }

        if (target.closest('#send-btn')) {
            processAndSendDirectMessage();
            return;
        }

        if (target.closest('#chat-input-toggle-secret-disappearing-messages-mode-btn')) {
            activeDisappearingMessagesMode = !activeDisappearingMessagesMode;
            const toggleClockBtnPointer = safeEl('chat-input-toggle-secret-disappearing-messages-mode-btn');
            if (toggleClockBtnPointer) {
                if (activeDisappearingMessagesMode) {
                    toggleClockBtnPointer.style.color = "#fbbf24";
                    alert("CONFIGURATION ADJUSTMENT: Ephemeral Volatile Disappearing Packet Modes activated. Subsequent message block payloads will disintegrate 10 seconds post injection lifecycle frame grids loops.");
                } else {
                    toggleClockBtnPointer.style.color = "var(--text-muted)";
                    alert("CONFIGURATION ADJUSTMENT: Epappearing Message Constraints detached. Standard historical records storage parameters re-engaged.");
                }
            }
            return;
        }

        if (target.closest('#submit-bug-report-btn')) {
            const textBugNarrativeValueData = gVal('bug-report-text-input');
            if (textBugNarrativeValueData !== "") {
                const packagedBugReportJsonObjectNodeRecord = {
                    id: systemBugReports.length + 1,
                    submittedBy: currentUser ? currentUser.username : "Anonymous Node",
                    traceLogContext: textBugNarrativeValueData,
                    timestamp: new Date().toLocaleTimeString()
                };
                systemBugReports.push(packagedBugReportJsonObjectNodeRecord);
                saveData();
                renderDeveloperBugReportsAggregationPanelList();
                sAdd('bug-report-modal', 'hidden');
                alert(`BUG REPORTING SECURED: Algorithmic defect index packaging verified and logged. Packet ID allocated: [${packagedBugReportJsonObjectNodeRecord.id}] dispatched directly to Supreme Admin Control dashboards pipelines grids.`);
            } else {
                alert("COMPILATION FAILURE: Bug trace narrative summary field value data cannot occupy null space records rows entries arrays.");
            }
            return;
        }

        if (target.closest('.close-modal-btn') || target.closest('.modal-overlay')) {
            if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('close-modal-btn') || e.target.parentElement.classList.contains('close-modal-btn')) {
                const activeOpenOverlayModalDivSelectorElement = e.target.closest('.modal-overlay');
                if (activeOpenOverlayModalDivSelectorElement) activeOpenOverlayModalDivSelectorElement.classList.add('hidden');
            }
            return;
        }

        if (target.closest('#action-clear-cache-btn')) {
            if (confirm("CACHE CLEANUP INITIATION: Are you certain you desire to execute memory buffer deallocation routine parameters switches controls flags rules maps rows tables index loops?")) {
                localStorage.removeItem('chatPosts');
                posts = [];
                renderPosts();
                alert("STORAGE ENGINE LOG: Cache segment arrays blocks tables unlinked and garbage collection sequences parsed safely. Local system space optimized rows layers cleared metrics charts.");
            }
            return;
        }

        if (target.closest('#dev-assign-rank-btn')) { sText('dev-modal-title', "Modify Security Privileges Framework (Rank Selection)"); sRem('dev-assign-modal', 'hidden'); generateDevOptionsGrid('rank'); return; }
        if (target.closest('#dev-assign-ring-btn')) { sText('dev-modal-title', "Modify Visual Profile Avatar Particle Geometry Ring Border"); sRem('dev-assign-modal', 'hidden'); generateDevOptionsGrid('ring'); return; }
        if (target.closest('#dev-assign-theme-btn')) { sText('dev-modal-title', "Modify Application Environment Interface Color Spectrum Stylesheet CSS Themes Sheets"); sRem('dev-assign-modal', 'hidden'); generateDevOptionsGrid('theme'); return; }
        if (target.closest('#dev-ban-user-execution-btn')) { openDevActionModal('Execute Account Authorization Revocation Protocol (Permanent Ban)'); return; }
        if (target.closest('#dev-unban-user-execution-btn')) { openDevActionModal('Execute Suspended clearance Credentials Restoration Vector (Reverse Profile Unban)'); return; }
        
        if (target.closest('#dev-view-bug-reports-btn')) {
            renderDeveloperBugReportsAggregationPanelList();
            sRem('dev-bug-viewer-modal', 'hidden');
            return;
        }

        if (target.closest('#dev-shadowban-toggle-btn')) {
            devStates.shadowban = !devStates.shadowban;
            const btn = safeEl('dev-shadowban-toggle-btn');
            const icon = safeEl('dev-shadowban-icon-display');
            if (devStates.shadowban) {
                if(btn) btn.style.borderColor = '#ef4444'; if(icon) icon.style.textShadow = '0 0 20px #ef4444';
                sHtml('dev-shadowban-desc-display', '<b style="color:white; background:#ef4444; padding:2px 6px; border-radius:4px;">OVERRIDE STATUS FLAG: SHADOWBAN ISOLATION FILTERS ENGAGED</b> // Targeted profiles outbound packet parsing indices routes are secretly drops.');
            } else {
                if(btn) btn.style.borderColor = '#a855f7'; if(icon) icon.style.textShadow = '0 0 15px #a855f7';
                sText('dev-shadowban-desc-display', 'CURRENT STATUS MODE: RUNNING MONITORING SAFE SYSTEM NORMAL // Execute silent transmission routing filter isolation layer over target handle entries parameters.');
            }
            return;
        }

        if (target.closest('#dev-global-mute-toggle-btn')) {
            devStates.globalMute = !devStates.globalMute;
            const btn = safeEl('dev-global-mute-toggle-btn');
            const icon = safeEl('dev-global-mute-icon-display');
            if (devStates.globalMute) {
                if(btn) btn.style.borderColor = '#ef4444'; if(icon) { icon.style.textShadow = '0 0 20px #ef4444'; icon.innerText = '🔇'; }
                sHtml('dev-global-mute-desc-display', '<b style="color:white; background:#ef4444; padding:2px 6px; border-radius:4px;">OVERRIDE STATUS FLAG: GLOBAL BROADS SPACE CHANNEL TRANSMISSIONS FROZEN MUTE LOCK</b> // Global chat inputs stream strings are blocked.');
            } else {
                if(btn) btn.style.borderColor = '#a855f7'; if(icon) { icon.style.textShadow = '0 0 15px #a855f7'; icon.innerText = '🤐'; }
                sText('dev-global-mute-desc-display', 'CURRENT STATUS MODE: TRANSMISSIONS OPEN UNRESTRICTED // Freeze or activate packet line parsing pipelines processes across all client transmission data systems slots buffers.');
            }
            return;
        }

        if (target.closest('#dev-maintenance-toggle-mode-btn')) {
            devStates.maintenance = !devStates.maintenance;
            const btn = safeEl('dev-maintenance-toggle-mode-btn');
            const icon = safeEl('dev-maintenance-icon-display');
            if (devStates.maintenance) {
                if(btn) btn.style.borderColor = '#ef4444'; if(icon) icon.style.textShadow = '0 0 20px #ef4444';
                sHtml('dev-maintenance-desc-display', '<b style="color:white; background:#ef4444; padding:2px 6px; border-radius:4px;">OVERRIDE STATUS FLAG: ECOSYSTEM ARCHITECTURE ISOLATED IN MAINTENANCE STACK TIERS MODE</b> // Traffic redirected completely.');
            } else {
                if(btn) btn.style.borderColor = '#f97316'; if(icon) icon.style.textShadow = '0 0 15px #f97316';
                sText('dev-maintenance-desc-display', 'CURRENT STATUS MODE: SYSTEM LIVE OPERATIONAL // Shut down client view screens pipelines displays layers and redirect target incoming traffic to architecture error grids blocks layouts windows items fields framework.');
            }
            return;
        }

        if (target.closest('#dev-wipe-server-data-btn')) {
            if (confirm("SUPREME ADMIN MASTER DESTRUCTIVE SYSTEM PROTOCOL INITIALIZATION: Wipe local memory indexes repositories entirely tables rows layers mapping chart bounds?")) {
                localStorage.clear();
                location.reload();
            }
            return;
        }

    }); 


    // =========================================================================
    // 4. CORE SYSTEM ENVIRONMENT PRESENTATION LOGIC LAYER HANDLERS (MODALS RE-RENDER)
    // =========================================================================
    
    const dynamicThemeSelectorSelectTagPointerElement = safeEl('settings-theme-palette-spectrum-engine-selector-dropdown-field');
    if (dynamicThemeSelectorSelectTagPointerElement) {
        dynamicThemeSelectorSelectTagPointerElement.addEventListener('change', (event) => {
            const targetStylesSheetThemePalettesValueNameString = event.target.value;
            if (currentUser) {
                currentUser.theme = targetStylesSheetThemePalettesValueNameString;
                saveData();
                applySystemThemePalette();
                alert(`THEME ENGINE CONFIG DISPATCH: Spectrum color grid overridden to state archetype name: [${targetStylesSheetThemePalettesValueNameString}].`);
            }
        });
    }

    function renderFriendsListModal() {
        const container = safeEl('modal-friend-list-container');
        if (!container) return;
        container.innerHTML = '';
        
        if (friends.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:1.05rem; padding: 20px; font-weight: bold; font-family: inherit;">You have no friends added to your profile list yet. Connect with other users through the Request tab to populate your contact roster directory rows logs entries layers models maps frames grids cells tabs elements.</p>`;
            return;
        }
        
        friends.forEach(friend => {
            container.innerHTML += `
                <div class="dummy-item" style="border-bottom: 1px solid var(--border-color); padding: 12px; background: var(--bg-main); border-radius: 12px; display: flex; align-items: center; gap: 15px;">
                    <img src="${friend.dp || DEFAULT_DP}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color);">
                    <div style="display:flex; flex-direction:column;">
                        <b style="font-size:1.15rem; color:var(--text-main);">${friend.username}</b>
                        <span style="font-size:0.8rem; color:var(--text-muted); font-weight:bold;">Status: Connected & Mapped Active Peer Node</span>
                    </div>
                </div>
            `;
        });
    }

    function renderDeveloperBugReportsAggregationPanelList() {
        const targetOutletListWrapperDivPointerElement = safeEl('dev-bug-reports-list-target-outlet-wrapper');
        const overlayDashboardViewContainerListPointerElement = safeEl('dev-bug-reports-container');
        
        let constructedHtmlPayloadRowsBlocksSequenceString = "";
        
        if (systemBugReports.length === 0) {
            constructedHtmlPayloadRowsBlocksSequenceString = `<p style="text-align: center; color: #64748b; font-family: monospace; padding: 20px;">[ROUTING TRACE STATUS LOGS: QUEUE BUFFER EMPTY // NO ACTIVE SYSTEM DEFECT PACKETS DISPATCHED IN STACK MATRIX RECORDS ROWS]</p>`;
        } else {
            systemBugReports.forEach(report => {
                constructedHtmlPayloadRowsBlocksSequenceString += `
                    <div style="background: #000; border-left: 4px solid #ef4444; padding: 15px; border-radius: 8px; color: #fff; font-family: monospace; font-size: 0.85rem; box-shadow: inset 0 0 10px rgba(255,0,0,0.1);">
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:#ef4444; font-weight:bold;">
                            <span>➡️ PACKET REPORT TARGET TRANS-ID: #${report.id}</span>
                            <span>⏱️ TIME: ${report.timestamp}</span>
                        </div>
                        <div style="margin-bottom:4px; color:#60a5fa;"><b>👤 RE-SOURCE ORIGIN NODE HANDLE:</b> ${report.submittedBy}</div>
                        <div style="color:#e2e8f0; word-wrap:break-word; white-space:pre-wrap; background:rgba(255,255,255,0.05); padding:8px; border-radius:4px; border:1px solid #1e293b;"><b>📝 TRACE DIAGNOSTIC CONTENT META:</b> ${report.traceLogContext}</div>
                    </div>
                `;
            });
        }
        
        if (targetOutletListWrapperDivPointerElement) targetOutletListWrapperDivPointerElement.innerHTML = constructedHtmlPayloadRowsBlocksSequenceString;
        if (overlayDashboardViewContainerListPointerElement) overlayDashboardViewContainerListPointerElement.innerHTML = constructedHtmlPayloadRowsBlocksSequenceString;
    }

    // =========================================================================
    // 5. FILE UPLOADS PARSING SYSTEM STACK PORT ENTRY PORTS INTERFACES PIPELINES
    // =========================================================================
    function setupFileInput(id, callback) {
        const el = safeEl(id);
        if(el) {
            el.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = e => callback(e.target.result);
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    setupFileInput('edit-dp-input', (res) => { currentUser.dp = res; saveData(); updateProfileUI(); alert("Logo updated!"); });
    setupFileInput('edit-banner-input', (res) => { currentUser.banner = res; saveData(); updateProfileUI(); alert("Banner updated!"); });
    setupFileInput('new-group-icon-input', (res) => { tempGroupIcon = res; sSrc('new-group-icon-preview', tempGroupIcon); });
    setupFileInput('post-image-upload-input', (res) => { attachedPostImage = res; sRem('post-media-attachment-status-preview', 'hidden'); });

    // =========================================================================
    // 6. KEYBOARD ENTER SUBMISSIONS PROTOCOLS KEYPRESS LISTENERS HOOKS
    // =========================================================================
    const handleEnterKeypressRoutingPort = (id, triggerId) => {
        const el = safeEl(id);
        if(el) {
            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); 
                    const btn = safeEl(triggerId);
                    if(btn) btn.click();
                }
            });
        }
    };
    handleEnterKeypressRoutingPort('username-input', 'join-btn');
    handleEnterKeypressRoutingPort('email-input', 'join-btn');
    handleEnterKeypressRoutingPort('dev-code', 'join-btn');
    handleEnterKeypressRoutingPort('message-input', 'send-btn');
    handleEnterKeypressRoutingPort('world-message-input', 'world-send-btn');
    handleEnterKeypressRoutingPort('chat-sidebar-search-input', 'sidebar-action-search-trigger');

    // =========================================================================
    // 7. CORE COMPONENT PRESENTATION DOM DATA RENDERING FLOW SCHEMAS (STANDARDS METHODS)
    // =========================================================================
    async function sendWorldMessage() {
        const inputVal = gVal('world-message-input');
        if (inputVal !== "") {
            
            // --- 🐍 PYTHON FASTAPI AI SENTIMENT ANALYSIS INTERCEPTOR 🐍 ---
            try {
                const aiRes = await fetch('http://127.0.0.1:8000/api/ai/sentiment-analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: inputVal, sender: currentUser.username })
                });
                const aiData = await aiRes.json();
                if (aiData.classification && aiData.classification.is_toxic) {
                    alert("⚠️ PYTHON AI FIREWALL: Toxic language detected in Global Chat. Packet Dropped!");
                    return; 
                }
            } catch (err) {
                console.warn("Python AI Server offline, proceeding without AI filtering.");
            }
            // ---------------------------------------------------------------

            socket.emit('send_message', { sender: currentUser.username, text: inputVal });
            const area = safeEl('world-messages-area');
            if(area) {
                const div = document.createElement('div');
                div.className = `message-bubble my-msg`;
                div.innerHTML = `<strong>${currentUser.username}:</strong> ${inputVal}`;
                area.appendChild(div);
                area.scrollTop = area.scrollHeight;
            }
            sVal('world-message-input', '');
        }
    }

    socket.on('receive_message', (data) => {
        if (!isWorldMuted && currentUser && data.sender !== currentUser.username) {
            const area = safeEl('world-messages-area');
            if(area) {
                const div = document.createElement('div');
                div.className = `message-bubble other-msg`;
                div.innerHTML = `<strong>${data.sender}:</strong> ${data.text}`;
                area.appendChild(div);
                area.scrollTop = area.scrollHeight;
            }
        }
    });

    function updateProfileUI() {
        if (!currentUser) return;
        sText('display-username', currentUser.username);
        sText('user-bio', currentUser.bio || "No data.");
        sSrc('user-dp', currentUser.dp || DEFAULT_DP);
        sSrc('fb-my-dp', currentUser.dp || DEFAULT_DP);
        
        if (currentUser.banner) { sSrc('banner-img', currentUser.banner); sRem('banner-img', 'hidden'); }
        else { sAdd('banner-img', 'hidden'); }
        
        sText('display-rank', currentUser.rank);

        const usernameDisplay = safeEl('display-username');
        const rankBadge = safeEl('display-rank');

        if (currentUser.isDev) {
            if(usernameDisplay) usernameDisplay.classList.add('shiny-dev-text');
            if(rankBadge) rankBadge.className = 'rank-badge rank-developer';
            sRem('dev-nav-item', 'hidden');
        } else {
            if(usernameDisplay) usernameDisplay.classList.remove('shiny-dev-text');
        }
    }

    function updateBadgesAndCounts() {
        const reqBadge = safeEl('req-badge');
        if(reqBadge) {
            if (friendRequests.length > 0) {
                reqBadge.innerText = friendRequests.length; sRem('req-badge', 'hidden');
            } else { sAdd('req-badge', 'hidden'); }
        }
        sText('total-friends-count', friends.length);
    }

    function renderContacts() {
        const container = safeEl('contact-list-container');
        if(!container) return; container.innerHTML = '';
        let list = currentChatTab === 'favorite' ? friends.filter(f => f.isFavorite) : friends;
        
        if (list.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px; font-weight:bold;">No operational terminal communication nodes matched indices.</p>`;
            return;
        }
        list.forEach(friend => {
            let star = friend.isFavorite ? `<i class="fas fa-star" style="color:#f59e0b; margin-left: 5px;"></i>` : '';
            container.innerHTML += `
                <div class="dummy-item contact-item" data-user="${friend.username}">
                    <img src="${friend.dp}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:1px solid var(--primary-color);">
                    <b>${friend.username} ${star}</b>
                </div>
            `;
        });
    }

    function renderRequestSubTabUI() {
        const container = safeEl('contact-list-container');
        if(!container) return; container.innerHTML = '';
        const acceptBtn = safeEl('sub-tab-accept-btn');
        const sendBtn = safeEl('sub-tab-send-btn');
        
        if (currentRequestSubTab === 'accept') {
            if(acceptBtn) acceptBtn.classList.add('active-sub-tab'); if(sendBtn) sendBtn.classList.remove('active-sub-tab');
            sAdd('search-friend-field-block', 'hidden');
            
            if (friendRequests.length === 0) {
                container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px; padding: 20px;">No inbound verification requests detected inside local repository cache table frames grids rows lines data nodes.</p>`;
                return;
            }
            friendRequests.forEach(req => {
                container.innerHTML += `
                    <div class="dummy-item" data-user="${req.username}" style="background:var(--bg-main); border:1px solid var(--border-color);">
                        <img src="${req.dp}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                        <b style="font-size:0.9rem;">${req.username}</b>
                        <div class="req-action-btns">
                            <button class="btn-accept-friend btn-accept" title="Accept"><i class="fas fa-check"></i></button>
                            <button class="btn-reject-friend btn-reject" title="Reject"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                `;
            });
        } else if (currentRequestSubTab === 'send') {
            if(acceptBtn) acceptBtn.classList.remove('active-sub-tab'); if(sendBtn) sendBtn.classList.add('active-sub-tab');
            sRem('search-friend-field-block', 'hidden');
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px; padding: 20px; font-weight:bold;"><i class="fas fa-search"></i> Input precise target system identity handle string character values above to locate active records rows in database registers matrix.</p>`;
        }
    }

    function renderPosts() {
        const container = safeEl('feed-container');
        if(!container) return; container.innerHTML = '';
        posts.forEach(post => {
            let imgHtml = post.image ? `<img src="${post.image}" class="post-media-img">` : '';
            let tagsHtml = (post.tags && post.tags.length > 0) ? `<div style="color: var(--primary-color); font-weight: bold; margin-bottom: 8px; font-size:0.9rem;">${post.tags.join(' ')}</div>` : '';
            container.innerHTML += `
                <div class="feed-post" data-id="${post.id}">
                    <div class="post-header">
                        <div class="post-user-info">
                            <img src="${post.dp}" class="post-user-dp">
                            <div><b style="font-size:1.15rem;">${post.user}</b><span style="color:var(--text-muted); font-size:0.85rem; display:block;">${post.time} [Scope: ${post.scope}]</span></div>
                        </div>
                        ${post.user === currentUser.username ? `<button class="delete-post-btn"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                    ${post.text ? `<div class="post-text-content">${post.text}</div>` : ''}
                    ${tagsHtml}
                    ${imgHtml}
                    <div class="post-footer">
                        <button class="action-btn like-btn"><i class="far fa-heart"></i> Endorse</button>
                    </div>
                </div>
            `;
        });
    }

    function renderGroups() {
        const container = safeEl('group-list-container');
        if(!container) return; container.innerHTML = '';
        groups.forEach(group => {
            let icon = group.icon || `https://ui-avatars.com/api/?name=${group.name}&background=a855f7&color=fff`;
            container.innerHTML += `
                <div class="dummy-item" style="padding: 15px;">
                    <img src="${icon}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:1px solid var(--border-color);">
                    <b style="font-size: 1.15rem;">${group.name}</b>
                </div>
            `;
        });
    }

    function renderBandRequests() {
        const container = safeEl('band-incoming-requests');
        const emptyPlaceholder = safeEl('band-incoming-requests-empty-placeholder-string-element');
        if(!container) return; container.innerHTML = '';
        
        if (bandRequests.length === 0) {
            if(emptyPlaceholder) emptyPlaceholder.classList.remove('hidden');
            container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 10px;">No inbound synchronization requests queue active buffer line area storage room stack channels.</p>`;
            return;
        }
        if(emptyPlaceholder) emptyPlaceholder.classList.add('hidden');
        bandRequests.forEach(req => {
            container.innerHTML += `
                <div class="dummy-item" data-user="${req.username}" style="margin-top:10px; background:var(--bg-main); padding: 15px; border: 1px solid var(--border-color); border-radius:12px;">
                    <b style="flex:1; font-size:0.95rem; color:var(--text-main);"><i class="fas fa-satellite-dish"></i> Incoming Link Handshake Matrix Vector Signature From: [ ${req.username} ]</b>
                    <button class="btn-accept-band btn-accept" style="width:45px; height:45px; border-radius:50%;"><i class="fas fa-check"></i></button>
                </div>
            `;
        });
    }

    function openChatWindow(username) {
        sAdd('request-profile-preview-pane', 'hidden');
        sAdd('chat-placeholder', 'hidden');
        sRem('chat-header', 'hidden');
        sRem('messages-area', 'hidden');
        sRem('chat-input-area', 'hidden');
        
        activeChatUser = friends.find(f => f.username === username);
        if(activeChatUser) {
            sText('current-chat-name', activeChatUser.username);
            sSrc('current-chat-dp', activeChatUser.dp);
            updateFavoriteButtonUI();
        }
    }

    function updateFavoriteButtonUI() {
        const favBtn = safeEl('favorite-user-btn');
        if(favBtn) {
            if (activeChatUser && activeChatUser.isFavorite) {
                favBtn.classList.add('starred');
                favBtn.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                favBtn.classList.remove('starred');
                favBtn.innerHTML = '<i class="far fa-star"></i>';
            }
        }
    }

    function openRightProfilePreviewPane(userContext) {
        sAdd('chat-placeholder', 'hidden'); sAdd('chat-header', 'hidden'); sAdd('messages-area', 'hidden'); sAdd('chat-input-area', 'hidden');
        sRem('request-profile-preview-pane', 'hidden');
        sSrc('preview-search-user-dp', userContext.dp); sText('preview-search-user-name', userContext.username); sText('preview-search-user-bio', userContext.bio);
        sText('preview-search-user-rank', userContext.rank || "Member");
    }

    function resetRightWorkspacePane() {
        sAdd('request-profile-preview-pane', 'hidden'); sAdd('chat-header', 'hidden'); sAdd('messages-area', 'hidden'); sAdd('chat-input-area', 'hidden');
        sRem('chat-placeholder', 'hidden');
    }

    function openDevActionModal(title) { sRem('dev-action-modal', 'hidden'); sText('action-modal-title', title); }

    function generateDevOptionsGrid(type) {
        currentDevActionType = type; const grid = safeEl('dev-options-grid'); if(!grid) return; grid.innerHTML = ''; selectedDevOptionValue = null;
        if (type === 'rank') {
            ['Developer', 'Operator', 'Elite', 'Legend', 'Pro', 'Member'].forEach(r => {
                const btn = document.createElement('button'); btn.className = 'action-btn'; btn.style.width = '100%'; btn.innerText = r;
                btn.onclick = () => { selectedDevOptionValue = r; Array.from(grid.children).forEach(c => c.style.border = '1px solid var(--border-color)'); btn.style.border = '2px solid #fbbf24'; };
                grid.appendChild(btn);
            }); return;
        }
        if (type === 'theme') {
            ['default', 'dark', 'grand-golden', 'matrix-neon'].forEach(t => {
                const btn = document.createElement('button'); btn.className = 'action-btn'; btn.style.width = '100%'; btn.innerText = t.toUpperCase() + " Mode Sheet";
                btn.onclick = () => { selectedDevOptionValue = t; Array.from(grid.children).forEach(c => c.style.outline = 'none'); btn.style.outline = '3px solid #fbbf24'; };
                grid.appendChild(btn);
            }); return;
        }
    }

});