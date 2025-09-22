
document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('api-key');
    const skillSelect = document.getElementById('skill-select');
    const promptInput = document.getElementById('prompt-input');
    const invokeBtn = document.getElementById('invoke-btn');
    const resultOutput = document.getElementById('result-output');
    const loader = document.getElementById('loader');

    // ---- DOM Element Selectors ----
    const userEmailDisplay = document.getElementById('user-email');
    const balanceAmount = document.getElementById('balance-amount');
    const historyBody = document.getElementById('history-body');
    const purchaseOptions = document.getElementById('purchase-options');
    const apiKeyTableBody = document.getElementById('api-key-body');
    const createApiKeyForm = document.getElementById('create-api-key-form');
    const apiKeyNoteInput = document.getElementById('api-key-note');
    // Modal elements
    const newKeyModal = document.getElementById('new-key-modal');
    const newKeyValue = document.getElementById('new-key-value');
    const copyKeyBtn = document.getElementById('copy-key-btn');
    const closeModalBtn = document.querySelector('.close-button');

    // ---- DOM Element Selectors ----
    const landingView = document.getElementById('landing-view');
    const authView = document.getElementById('auth-view');
    const dashboardView = document.getElementById('dashboard-view');
    const allViews = document.querySelectorAll('.view');
    // Buttons & Links
    const goToAuthBtn = document.getElementById('go-to-auth-btn');
    const backToLandingBtn = document.getElementById('back-to-landing-btn');

    // ---- API 调用逻辑 ----
    const apiCall = async (endpoint, method = 'GET', body = null) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        };
        try {
            const response = await fetch(`${apiBaseUrl}${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null,
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'API call failed');
            }
            return response.json();
        } catch (error) {
            console.error(`API call to ${endpoint} failed:`, error);
            throw error;
        }
    };

    // ---- View Switching Logic ----
    const showView = (viewId) => {
        allViews.forEach(view => {
            // @ts-ignore
            view.style.display = 'none';
        });
        // @ts-ignore
        document.getElementById(viewId).style.display = 'block';
    };

    // ---- Authentication Logic ----
    let accessToken = localStorage.getItem('accessToken');
    const handleLogout = () => {
        accessToken = null;
        localStorage.removeItem('accessToken');
        showView('landing-view'); // 登出后返回主页
    };

    // ---- Dashboard Logic ----
    const populateSkills = (skills) => {
        skillSelect.innerHTML = ''; // 清空现有选项
        skills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill.name;
            option.textContent = `${skill.provider} - ${skill.name} (${skill.costPerUnit}单元/次)`;
            skillSelect.appendChild(option);
        });
    };

    const populateHistory = (history) => {
        historyBody.innerHTML = '';
        if (history.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="4">暂无调用记录。</td></tr>';
            return;
        }
        history.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(log.timestamp).toLocaleString()}</td>
                <td>${log.skill.name}</td>
                <td>${log.cost}</td>
                <td class="status-${log.isSuccess ? 'success' : 'fail'}">${log.isSuccess ? '成功' : '失败'}</td>
            `;
            historyBody.appendChild(row);
        });
    };

    const populateApiKeys = (keys) => {
        apiKeyTableBody.innerHTML = '';
        if (keys.length === 0) {
            apiKeyTableBody.innerHTML = '<tr><td colspan="4">您还没有创建任何API密钥。</td></tr>';
            return;
        }
        keys.forEach(key => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${key.note || 'N/A'}</td>
                <td>${new Date(key.createdAt).toLocaleString()}</td>
                <td>${key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : '从未使用'}</td>
                <td><button class="delete-key-btn" data-key-id="${key.id}">删除</button></td>
            `;
            apiKeyTableBody.appendChild(row);
        });
    };

    const initializeDashboard = async () => {
        try {
            const [userData, skills, history, apiKeys] = await Promise.all([
                apiCall('/users/me'),
                apiCall('/data/skills'),
                apiCall('/data/history'),
                apiCall('/keys'), // 获取API密钥
            ]);
            
            userEmailDisplay.textContent = userData.email;
            balanceAmount.textContent = userData.skillUnits;
            populateSkills(skills);
            populateHistory(history);
            populateApiKeys(apiKeys);

            showView('dashboard-view');
        } catch (error) {
            console.error("Failed to initialize dashboard:", error);
            handleLogout();
        }
    };
    
    // ---- API 调用逻辑 ----
    const handleInvoke = async () => {
        loader.style.display = 'block';
        resultOutput.textContent = '';
        try {
            const skillName = skillSelect.value;
            const response = await apiCall(`/skill_invoke/${skillName}`, 'POST', {
                prompt: promptInput.value,
            });
            resultOutput.textContent = JSON.stringify(response, null, 2);

            // 调用成功后，刷新余额和历史记录
            const [userData, history] = await Promise.all([
                apiCall('/users/me'),
                apiCall('/data/history'),
            ]);
            balanceAmount.textContent = userData.skillUnits;
            populateHistory(history);

        } catch (error) {
             // @ts-ignore
            resultOutput.textContent = `错误: ${error.message}`;
        } finally {
            loader.style.display = 'none';
        }
    };

    const handleCreateApiKey = async (event) => {
        event.preventDefault();
        const note = apiKeyNoteInput.value;
        try {
            const data = await apiCall('/keys', 'POST', { note });
            newKeyValue.textContent = data.newKey;
            newKeyModal.style.display = 'flex';
            // 创建成功后刷新密钥列表
            const apiKeys = await apiCall('/keys');
            populateApiKeys(apiKeys);
            apiKeyNoteInput.value = ''; // 清空输入框
        } catch (error) {
            // @ts-ignore
            alert(`创建密钥失败: ${error.message}`);
        }
    };

    const handleDeleteApiKey = async (event) => {
        // @ts-ignore
        if (event.target.classList.contains('delete-key-btn')) {
            // @ts-ignore
            const keyId = event.target.dataset.keyId;
            if (confirm('您确定要删除这个API密钥吗？此操作不可撤销。')) {
                try {
                    await apiCall(`/keys/${keyId}`, 'DELETE');
                    // 删除成功后刷新密钥列表
                    const apiKeys = await apiCall('/keys');
                    populateApiKeys(apiKeys);
                } catch (error) {
                    // @ts-ignore
                    alert(`删除密钥失败: ${error.message}`);
                }
            }
        }
    };

    const handlePurchase = async (event) => {
        // @ts-ignore
        if (event.target.classList.contains('purchase-btn')) {
            // @ts-ignore
            const amount = parseInt(event.target.dataset.amount, 10);
            if (confirm(`您确定要购买 ${amount} 技能单元吗？`)) {
                try {
                    const data = await apiCall('/users/me/add-credits', 'POST', { amount });
                    balanceAmount.textContent = data.newBalance; // 更新显示的余额
                    alert('充值成功！');
                } catch (error) {
                     // @ts-ignore
                    alert(`充值失败: ${error.message}`);
                }
            }
        }
    };

    // ---- Event Listeners ----
    invokeBtn.addEventListener('click', handleInvoke);
    createApiKeyForm.addEventListener('submit', handleCreateApiKey);
    apiKeyTableBody.addEventListener('click', handleDeleteApiKey);
    purchaseOptions.addEventListener('click', handlePurchase);
    closeModalBtn.addEventListener('click', () => newKeyModal.style.display = 'none');
    copyKeyBtn.addEventListener('click', () => {
        // @ts-ignore
        navigator.clipboard.writeText(newKeyValue.textContent);
        copyKeyBtn.textContent = '已复制!';
        setTimeout(() => { copyKeyBtn.textContent = '复制'; }, 2000);
    });

    goToAuthBtn.addEventListener('click', () => showView('auth-view'));
    backToLandingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showView('landing-view');
    });

    // ---- App Initialization ----
    const autoLogin = async () => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            accessToken = storedToken;
            await initializeDashboard(); // 如果有token，直接进入仪表盘
        } else {
            showView('landing-view'); // 否则，显示主页
        }
    };

    autoLogin();
});
