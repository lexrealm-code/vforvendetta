// --- KRİTİK AYARLAR (Bu alanları kendi sunucunuzla değiştirin!) ---
const BACKEND_API_URL = 'YOUR_BOT_SERVER_API_URL/validate-key'; 
const ADMIN_API_URL = 'YOUR_BOT_SERVER_API_URL/admin';
const CONTENT_API_URL = 'YOUR_BOT_SERVER_API_URL/content';
// -------------------------------------------------------------------

// Global Değişkenler
let CURRENT_USER_ROLE = 'guest'; // Kullanıcının oturum açtıktan sonraki rolü
let CURRENT_USER_ID = null;
const ADMIN_ROLES = ['admin', 'owner']; 

// DOM Elementleri
const loginForm = document.getElementById('login-form');
const discordIdLogin = document.getElementById('discord-id-login');
const accessKeyLogin = document.getElementById('access-key-login');
const rememberMeCheckbox = document.getElementById('remember-me');
const loginMessageArea = document.getElementById('login-message-area');
const adminPanelBtn = document.getElementById('admin-panel-btn');
const contentAdminModule = document.getElementById('content-admin-module');
const dynamicContentList = document.getElementById('dynamic-content-list');
const targetChannelSelect = document.getElementById('target-channel-select');


// --- SAYFA YÜKLEME VE OLAY DİNLEYİCİLERİ ---

document.addEventListener('DOMContentLoaded', () => {
    loadRememberedCredentials();
    loginForm.addEventListener('submit', handleLoginSubmit);
    // İlk açılışta sadece login ekranını göster
    showScreen('login-screen'); 
});


// --- SAYFA GEÇİŞİ VE GÖRÜNÜRLÜK ---

/**
 * Belirtilen ID'ye sahip ekranı gösterir ve diğerlerini gizler (SPA Mantığı).
 */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        // Eğer yönetim ekranına geçiliyorsa, sidebar boşluğunu ayarla
        if (screenId === 'management-screen' || screenId === 'admin-screen') {
            document.querySelector('.container').style.justifyContent = 'flex-start';
        } else {
             document.querySelector('.container').style.justifyContent = 'center';
        }

        targetScreen.style.display = 'block';
        targetScreen.classList.add('active');
    }
}


// --- OTURUM YÖNETİMİ VE HATIRLAMA ---

function loadRememberedCredentials() {
    const rememberedID = localStorage.getItem('v_vendetta_id');
    if (rememberedID) {
        discordIdLogin.value = rememberedID;
        rememberMeCheckbox.checked = true;
    }
}

function saveCredentials(id) {
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('v_vendetta_id', id);
    } else {
        localStorage.removeItem('v_vendetta_id');
    }
}

function logout() {
    localStorage.removeItem('v_vendetta_id');
    // Oturum/token temizleme
    CURRENT_USER_ROLE = 'guest';
    CURRENT_USER_ID = null;
    showScreen('login-screen');
}


// --- GİRİŞ İŞLEMİ (Discord / Backend Konuşması) ---

async function handleLoginSubmit(event) {
    event.preventDefault(); 
    
    const discordId = discordIdLogin.value.trim();
    const accessKey = accessKeyLogin.value.trim();
    
    if (!discordId || !accessKey) {
        loginMessageArea.textContent = 'HATA: Lütfen tüm alanları doldurunuz.';
        loginMessageArea.style.color = '#CC0000';
        return;
    }

    saveCredentials(discordId);
    loginMessageArea.textContent = 'Erişim doğrulama başlatıldı...';
    loginMessageArea.style.color = '#FFDD00';

    // *** BU KISIM GERÇEK BACKEND API ÇAĞRISI İLE DEĞİŞTİRİLMELİDİR ***
    // try { await fetch(BACKEND_API_URL, ...); } catch(e) { ... }

    // *** Backend Simülasyonu ***
    setTimeout(() => {
        const API_RESPONSE_ROLE = 'owner'; // Örnek: 'owner', 'admin', 'premium'
        
        CURRENT_USER_ROLE = API_RESPONSE_ROLE; 
        CURRENT_USER_ID = discordId;
        
        loginMessageArea.textContent = 'Doğrulama başarılı! Yönlendiriliyorsunuz...';
        loginMessageArea.style.color = '#00FF00';

        initializeManagementPanel(CURRENT_USER_ROLE); 
        showScreen('management-screen'); 
        
        // Hata durumunda: loginMessageArea.textContent = 'HATA: Geçersiz Key.';
    }, 2000);
}


// --- YÖNETİM PANELİ HAZIRLIĞI ---

function initializeManagementPanel(role) {
    document.getElementById('user-role').textContent = role.toUpperCase();
    
    // Admin Paneli Butonunu Göster/Gizle
    adminPanelBtn.style.display = ADMIN_ROLES.includes(role) ? 'block' : 'none';

    // Owner/Admin İçin Yorum Alanlarını Göster/Gizle
    const commentSections = document.querySelectorAll('.comment-section');
    commentSections.forEach(section => {
        section.style.display = ADMIN_ROLES.includes(role) ? 'block' : 'none';
    });
    
    // Owner İçin Admin Modülünü Göster/Gizle
    contentAdminModule.style.display = (role === 'owner') ? 'block' : 'none';

    // İlk kanalı yükle
    loadChannelContent('guard');
}


// --- İÇERİK YÜKLEME VE YÖNETİM ---

function loadChannelContent(channel, event) {
    if(event) event.preventDefault();
    
    // Sidebar'da aktif sınıfını ayarla
    document.querySelectorAll('.channel-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`.channel-link[data-channel="${channel}"]`).classList.add('active');
    
    document.getElementById('current-channel-title').textContent = `# ${channel.toUpperCase()} Bot`;
    
    // *** API Çağrısı: CONTENT_API_URL/get-content?channel=... ***
    dynamicContentList.innerHTML = '<p style="color:#AAAAAA; text-align: center; margin-top: 50px;">İçerikler Bot Sunucusundan yükleniyor...</p>';

    // *** Simülasyon: İçeriği Yeniden Yükleme (Gerçekte API yanıtından gelir) ***
    setTimeout(() => {
        // Burada API'dan gelen verilerle dynamicContentList doldurulur.
        // Aşağıdaki HTML, örnek bir karttır.
        dynamicContentList.innerHTML = `
        <div class="content-card">
            <h3 class="card-title">Son ${channel.toUpperCase()} Kodu: V4.1</h3>
            <p class="card-meta">Ekleyen: SYSTEM | ${new Date().toLocaleDateString()}</p>
            <p class="card-description">Güncellenen bu sürümde küçük güvenlik açıkları kapatılmıştır.</p>
            <div class="card-actions">
                <button class="btn btn-red btn-small" onclick="window.open('https://link_to_code_for_${channel}', '_blank')">ACCESS CODE</button>
                <button class="btn btn-ghost btn-small like-btn" data-content-id="1" onclick="handleReaction(this)">
                    ❤️ Beğen (13)
                </button>
            </div>
            <div class="comment-section" style="display: ${ADMIN_ROLES.includes(CURRENT_USER_ROLE) ? 'block' : 'none'};">
                <p class="comment-count">Yorumlar (3)</p>
                <textarea placeholder="Admin/Owner yorumu..." rows="2"></textarea>
                <button class="btn btn-red btn-small" onclick="postComment(this)">Yorum Yap</button>
            </div>
        </div>`;
    }, 500);
}

// Admin Panel Butonuna Tıklanınca
function showAdminPanel() {
    if (ADMIN_ROLES.includes(CURRENT_USER_ROLE)) {
        showScreen('admin-screen');
    } else {
        alert("Erişim Reddedildi: Yüksek yetki gerekli.");
    }
}


// --- ADMIN İŞLEMLERİ (Tümü API Çağrısı Olmalıdır) ---

function handleRoleAssignment() {
    const userId = document.getElementById('manage-user-id').value;
    const role = document.getElementById('user-role-select').value;
    if (!userId || !role) return alert("Lütfen ID ve Rol seçiniz.");
    alert(`[API CALL: Rol Atama] ID: ${userId} kişisine ${role} rolü atanıyor...`);
    // fetch(ADMIN_API_URL + '/assign-role', {method: 'POST', body: JSON.stringify({userId, role})});
}

function handleBanUser() {
    const userId = document.getElementById('ban-user-id').value;
    if (!userId) return alert("Lütfen Banlanacak ID giriniz.");
    alert(`[API CALL: Ban] ID: ${userId} Ban Protokolü Başlatıldı!`);
}

function handleChannelCreation() {
    if(CURRENT_USER_ROLE !== 'owner') return alert("Erişim Reddedildi: Sadece Owner.");
    const channelName = document.getElementById('new-channel-name').value;
    if (!channelName) return alert("Lütfen kanal adı giriniz.");
    alert(`[API CALL: Kanal Oluşturma] #${channelName} oluşturuluyor.`);
}

function handleContentCreation() {
    // Tüm input değerleri alınıp API'a gönderilmelidir.
    alert(`[API CALL: İçerik Yükleme] Yeni kod içeriği yayınlanıyor.`);
}

function handleAnnouncement() {
    const announcementText = document.getElementById('announcement-text').value;
    if (!announcementText) return alert("Lütfen duyuru mesajı yazınız.");
    // API'a POST isteği: ADMIN_API_URL/publish-announcement
    document.getElementById('announcement-bar').textContent = `YENİ DUYURU: ${announcementText}`;
    alert(`[API CALL: Duyuru] Duyuru başarıyla yayınlandı.`);
}

function handleReaction(button) {
    // API'a POST isteği: CONTENT_API_URL/like-content
    alert(`[API CALL: Beğeni] Beğeni kaydedildi!`);
    // Beğeni sayısını güncelleme mantığı buraya gelir.
}

function postComment(button) {
    if (!ADMIN_ROLES.includes(CURRENT_USER_ROLE)) return;
    const commentText = button.previousElementSibling.value; // Textarea içeriği
    if (!commentText) return alert("Lütfen yorum yazınız.");
    // API'a POST isteği: CONTENT_API_URL/post-comment
    alert(`[API CALL: Yorum] Yorum yayınlandı.`);
    button.previousElementSibling.value = ''; // Yorum alanını temizle
}
