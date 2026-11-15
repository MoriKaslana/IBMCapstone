/**
 * TestCase Genie - Test Case Generator
 * A tool for generating test cases from user stories
 * No external dependencies - Pure vanilla JavaScript
 */

// ===================================
// Translation Data
// ===================================

const translations = {
    en: {
        appTitle: 'TestCase Genie',
        appSubtitle: 'Generate comprehensive test cases from your user stories',
        inputTitle: 'Enter User Story or Feature Description',
        sample1: 'Sample 1: Login',
        sample2: 'Sample 2: Payment',
        inputPlaceholder: 'Example: As a user, I want to login to the system so that I can access my dashboard...',
        generateBtn: 'Generate Test Cases',
        resultsTitle: 'Generated Test Cases',
        filterLabel: 'Filter by Type:',
        filterAll: 'All Types',
        filterPositive: 'Positive',
        filterNegative: 'Negative',
        filterEdge: 'Edge Case',
        downloadBtn: 'Download CSV',
        colID: 'ID',
        colTitle: 'Title',
        colType: 'Type',
        colSteps: 'Steps',
        colExpected: 'Expected Result',
        colPriority: 'Priority',
        totalCases: 'Total Cases:',
        positiveCases: 'Positive:',
        negativeCases: 'Negative:',
        edgeCases: 'Edge:',
        footerText: 'Built for junior QA testers and developers',
        errorEmpty: 'Please enter a user story or feature description before generating test cases.',
        // Sample stories
        sampleLogin: 'As a user, I want to login to the system using my email and password so that I can access my personal dashboard and manage my account settings.',
        samplePayment: 'As a customer, I want to make a payment using my credit card so that I can complete my purchase and receive a confirmation email with the order details.'
    },
    id: {
        appTitle: 'TestCase Genie',
        appSubtitle: 'Buat test case komprehensif dari user story Anda',
        inputTitle: 'Masukkan User Story atau Deskripsi Fitur',
        sample1: 'Contoh 1: Login',
        sample2: 'Contoh 2: Pembayaran',
        inputPlaceholder: 'Contoh: Sebagai pengguna, saya ingin login ke sistem agar saya dapat mengakses dashboard saya...',
        generateBtn: 'Buat Test Case',
        resultsTitle: 'Test Case yang Dihasilkan',
        filterLabel: 'Filter berdasarkan Tipe:',
        filterAll: 'Semua Tipe',
        filterPositive: 'Positif',
        filterNegative: 'Negatif',
        filterEdge: 'Edge Case',
        downloadBtn: 'Unduh CSV',
        colID: 'ID',
        colTitle: 'Judul',
        colType: 'Tipe',
        colSteps: 'Langkah-langkah',
        colExpected: 'Hasil yang Diharapkan',
        colPriority: 'Prioritas',
        totalCases: 'Total Kasus:',
        positiveCases: 'Positif:',
        negativeCases: 'Negatif:',
        edgeCases: 'Edge:',
        footerText: 'Dibuat untuk QA tester dan developer pemula',
        errorEmpty: 'Silakan masukkan user story atau deskripsi fitur sebelum membuat test case.',
        // Sample stories
        sampleLogin: 'Sebagai pengguna, saya ingin login ke sistem menggunakan email dan password saya agar saya dapat mengakses dashboard pribadi dan mengelola pengaturan akun saya.',
        samplePayment: 'Sebagai pelanggan, saya ingin melakukan pembayaran menggunakan kartu kredit saya agar saya dapat menyelesaikan pembelian dan menerima email konfirmasi dengan detail pesanan.'
    }
};

// ===================================
// Global State
// ===================================

let currentLanguage = 'en';
let allTestCases = [];

// ===================================
// DOM Elements
// ===================================

const elements = {
    langBtn: document.getElementById('langBtn'),
    userStoryInput: document.getElementById('userStoryInput'),
    generateBtn: document.getElementById('generateBtn'),
    sample1Btn: document.getElementById('sample1Btn'),
    sample2Btn: document.getElementById('sample2Btn'),
    errorMessage: document.getElementById('errorMessage'),
    resultsSection: document.getElementById('resultsSection'),
    testCasesBody: document.getElementById('testCasesBody'),
    typeFilter: document.getElementById('typeFilter'),
    downloadBtn: document.getElementById('downloadBtn'),
    totalCases: document.getElementById('totalCases'),
    positiveCases: document.getElementById('positiveCases'),
    negativeCases: document.getElementById('negativeCases'),
    edgeCases: document.getElementById('edgeCases')
};

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateLanguage();
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    elements.langBtn.addEventListener('click', toggleLanguage);
    elements.generateBtn.addEventListener('click', generateTestCases);
    elements.sample1Btn.addEventListener('click', () => loadSample('sampleLogin'));
    elements.sample2Btn.addEventListener('click', () => loadSample('samplePayment'));
    elements.typeFilter.addEventListener('change', filterTestCases);
    elements.downloadBtn.addEventListener('click', downloadCSV);
}

// ===================================
// Language Management
// ===================================

/**
 * Toggle between English and Indonesian
 */
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'id' : 'en';
    updateLanguage();
}

/**
 * Update all UI text based on current language
 */
function updateLanguage() {
    const lang = translations[currentLanguage];
    
    // Update language button
    elements.langBtn.querySelector('.lang-text').textContent = 
        currentLanguage === 'en' ? '🇮🇩 ID' : '🇬🇧 EN';
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (lang[key]) {
            element.textContent = lang[key];
        }
    });
    
    // Update placeholder
    const placeholderKey = elements.userStoryInput.getAttribute('data-i18n-placeholder');
    if (placeholderKey && lang[placeholderKey]) {
        elements.userStoryInput.placeholder = lang[placeholderKey];
    }
    
    // Re-render test cases if they exist
    if (allTestCases.length > 0) {
        renderTestCases(allTestCases);
    }
}

// ===================================
// Sample Stories
// ===================================

/**
 * Load a sample user story
 * @param {string} sampleKey - Key for the sample story in translations
 */
function loadSample(sampleKey) {
    const sampleText = translations[currentLanguage][sampleKey];
    elements.userStoryInput.value = sampleText;
    hideError();
}

// ===================================
// Error Handling
// ===================================

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.add('show');
}

/**
 * Hide error message
 */
function hideError() {
    elements.errorMessage.classList.remove('show');
}

// ===================================
// Test Case Generation Logic
// ===================================

/**
 * Main function to generate test cases
 */
function generateTestCases() {
    const userStory = elements.userStoryInput.value.trim();
    
    // Validate input
    if (!userStory) {
        showError(translations[currentLanguage].errorEmpty);
        return;
    }
    
    hideError();
    
    // Detect feature type from keywords
    const featureType = detectFeatureType(userStory);
    
    // Generate test cases based on feature type
    allTestCases = generateTestCasesByType(featureType, userStory);
    
    // Reset filter
    elements.typeFilter.value = 'all';
    
    // Render results
    renderTestCases(allTestCases);
    updateStatistics(allTestCases);
    
    // Show results section
    elements.resultsSection.style.display = 'block';
    
    // Scroll to results
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Detect feature type from user story keywords
 * @param {string} text - User story text
 * @returns {string} - Detected feature type
 */
function detectFeatureType(text) {
    const lowerText = text.toLowerCase();
    
    // Define keyword patterns for different features
    const patterns = {
        login: /login|sign in|authenticate|credentials|password|username|email.*password/i,
        register: /register|sign up|create account|registration/i,
        form: /form|submit|input|field|validation/i,
        upload: /upload|file|attach|document|image|pdf/i,
        payment: /payment|pay|purchase|checkout|credit card|transaction|billing/i,
        search: /search|find|query|filter|lookup/i
    };
    
    // Check each pattern
    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(lowerText)) {
            return type;
        }
    }
    
    return 'generic';
}

/**
 * Generate test cases based on feature type
 * @param {string} type - Feature type
 * @param {string} userStory - Original user story
 * @returns {Array} - Array of test case objects
 */
function generateTestCasesByType(type, userStory) {
    const generators = {
        login: generateLoginTestCases,
        register: generateRegisterTestCases,
        form: generateFormTestCases,
        upload: generateUploadTestCases,
        payment: generatePaymentTestCases,
        search: generateSearchTestCases,
        generic: generateGenericTestCases
    };
    
    const generator = generators[type] || generators.generic;
    return generator(userStory);
}

/**
 * Generate login-specific test cases
 */
function generateLoginTestCases(userStory) {
    const isIndonesian = currentLanguage === 'id';
    
    return [
        // Positive cases
        {
            id: 'TC001',
            title: isIndonesian ? 'Login dengan kredensial valid' : 'Login with valid credentials',
            type: 'Positive',
            steps: isIndonesian 
                ? '1. Buka halaman login\n2. Masukkan email valid\n3. Masukkan password valid\n4. Klik tombol Login'
                : '1. Navigate to login page\n2. Enter valid email\n3. Enter valid password\n4. Click Login button',
            expected: isIndonesian
                ? 'Pengguna berhasil login dan diarahkan ke dashboard'
                : 'User successfully logs in and is redirected to dashboard',
            priority: 'High'
        },
        {
            id: 'TC002',
            title: isIndonesian ? 'Login dan tetap login (Remember Me)' : 'Login with Remember Me option',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Buka halaman login\n2. Masukkan kredensial valid\n3. Centang opsi "Ingat Saya"\n4. Klik Login\n5. Tutup browser\n6. Buka aplikasi lagi'
                : '1. Navigate to login page\n2. Enter valid credentials\n3. Check "Remember Me" option\n4. Click Login\n5. Close browser\n6. Reopen application',
            expected: isIndonesian
                ? 'Pengguna tetap login setelah membuka aplikasi kembali'
                : 'User remains logged in after reopening application',
            priority: 'Medium'
        },
        {
            id: 'TC003',
            title: isIndonesian ? 'Logout berhasil' : 'Successful logout',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Login dengan kredensial valid\n2. Klik tombol Logout\n3. Konfirmasi logout'
                : '1. Login with valid credentials\n2. Click Logout button\n3. Confirm logout',
            expected: isIndonesian
                ? 'Pengguna berhasil logout dan diarahkan ke halaman login'
                : 'User successfully logs out and is redirected to login page',
            priority: 'High'
        },
        // Negative cases
        {
            id: 'TC004',
            title: isIndonesian ? 'Login dengan email tidak valid' : 'Login with invalid email',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Buka halaman login\n2. Masukkan email tidak valid\n3. Masukkan password valid\n4. Klik Login'
                : '1. Navigate to login page\n2. Enter invalid email\n3. Enter valid password\n4. Click Login',
            expected: isIndonesian
                ? 'Sistem menampilkan pesan error "Email atau password salah"'
                : 'System displays error message "Invalid email or password"',
            priority: 'High'
        },
        {
            id: 'TC005',
            title: isIndonesian ? 'Login dengan password salah' : 'Login with incorrect password',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Buka halaman login\n2. Masukkan email valid\n3. Masukkan password salah\n4. Klik Login'
                : '1. Navigate to login page\n2. Enter valid email\n3. Enter incorrect password\n4. Click Login',
            expected: isIndonesian
                ? 'Sistem menampilkan pesan error dan login gagal'
                : 'System displays error message and login fails',
            priority: 'High'
        },
        {
            id: 'TC006',
            title: isIndonesian ? 'Login dengan field kosong' : 'Login with empty fields',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Buka halaman login\n2. Biarkan email dan password kosong\n3. Klik Login'
                : '1. Navigate to login page\n2. Leave email and password empty\n3. Click Login',
            expected: isIndonesian
                ? 'Sistem menampilkan pesan validasi untuk field yang wajib diisi'
                : 'System displays validation message for required fields',
            priority: 'Medium'
        },
        // Edge cases
        {
            id: 'TC007',
            title: isIndonesian ? 'Login dengan email mengandung spasi' : 'Login with email containing spaces',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Buka halaman login\n2. Masukkan email dengan spasi di awal/akhir\n3. Masukkan password valid\n4. Klik Login'
                : '1. Navigate to login page\n2. Enter email with leading/trailing spaces\n3. Enter valid password\n4. Click Login',
            expected: isIndonesian
                ? 'Sistem menghapus spasi otomatis atau menampilkan error validasi'
                : 'System automatically trims spaces or displays validation error',
            priority: 'Low'
        },
        {
            id: 'TC008',
            title: isIndonesian ? 'Login setelah beberapa kali gagal' : 'Login after multiple failed attempts',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Coba login dengan password salah 5 kali\n2. Tunggu periode lockout\n3. Coba login dengan kredensial valid'
                : '1. Attempt login with wrong password 5 times\n2. Wait for lockout period\n3. Attempt login with valid credentials',
            expected: isIndonesian
                ? 'Akun terkunci sementara, kemudian dapat login setelah periode lockout'
                : 'Account temporarily locked, then able to login after lockout period',
            priority: 'Medium'
        }
    ];
}

/**
 * Generate register-specific test cases
 */
function generateRegisterTestCases(userStory) {
    const isIndonesian = currentLanguage === 'id';
    
    return [
        // Positive cases
        {
            id: 'TC001',
            title: isIndonesian ? 'Registrasi dengan data valid' : 'Register with valid data',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Buka halaman registrasi\n2. Isi semua field dengan data valid\n3. Centang terms & conditions\n4. Klik Register'
                : '1. Navigate to registration page\n2. Fill all fields with valid data\n3. Check terms & conditions\n4. Click Register',
            expected: isIndonesian
                ? 'Akun berhasil dibuat dan email verifikasi dikirim'
                : 'Account successfully created and verification email sent',
            priority: 'High'
        },
        {
            id: 'TC002',
            title: isIndonesian ? 'Verifikasi email setelah registrasi' : 'Email verification after registration',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Registrasi dengan email valid\n2. Buka email verifikasi\n3. Klik link verifikasi\n4. Login dengan akun baru'
                : '1. Register with valid email\n2. Open verification email\n3. Click verification link\n4. Login with new account',
            expected: isIndonesian
                ? 'Email terverifikasi dan user dapat login'
                : 'Email verified and user can login',
            priority: 'High'
        },
        {
            id: 'TC003',
            title: isIndonesian ? 'Registrasi dengan social media' : 'Register with social media',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Klik tombol "Daftar dengan Google/Facebook"\n2. Authorize aplikasi\n3. Lengkapi profil jika diperlukan'
                : '1. Click "Sign up with Google/Facebook" button\n2. Authorize application\n3. Complete profile if required',
            expected: isIndonesian
                ? 'Akun berhasil dibuat menggunakan social media'
                : 'Account successfully created using social media',
            priority: 'Medium'
        },
        // Negative cases
        {
            id: 'TC004',
            title: isIndonesian ? 'Registrasi dengan email yang sudah terdaftar' : 'Register with already registered email',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Buka halaman registrasi\n2. Masukkan email yang sudah terdaftar\n3. Isi field lainnya\n4. Klik Register'
                : '1. Navigate to registration page\n2. Enter already registered email\n3. Fill other fields\n4. Click Register',
            expected: isIndonesian
                ? 'Sistem menampilkan error "Email sudah terdaftar"'
                : 'System displays "Email already registered" error',
            priority: 'High'
        },
        {
            id: 'TC005',
            title: isIndonesian ? 'Registrasi dengan password tidak memenuhi kriteria' : 'Register with password not meeting criteria',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Masukkan password kurang dari 8 karakter\n2. Atau password tanpa huruf besar/angka\n3. Coba register'
                : '1. Enter password less than 8 characters\n2. Or password without uppercase/numbers\n3. Attempt registration',
            expected: isIndonesian
                ? 'Sistem menampilkan error validasi password'
                : 'System displays password validation error',
            priority: 'High'
        },
        {
            id: 'TC006',
            title: isIndonesian ? 'Registrasi tanpa menyetujui terms & conditions' : 'Register without accepting terms & conditions',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Isi semua field dengan benar\n2. Jangan centang terms & conditions\n3. Klik Register'
                : '1. Fill all fields correctly\n2. Do not check terms & conditions\n3. Click Register',
            expected: isIndonesian
                ? 'Sistem menampilkan error "Harus menyetujui syarat dan ketentuan"'
                : 'System displays "Must accept terms and conditions" error',
            priority: 'Medium'
        },
        // Edge cases
        {
            id: 'TC007',
            title: isIndonesian ? 'Registrasi dengan email disposable' : 'Register with disposable email',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Gunakan email disposable (tempmail, guerrillamail)\n2. Isi data lainnya\n3. Coba register'
                : '1. Use disposable email (tempmail, guerrillamail)\n2. Fill other data\n3. Attempt registration',
            expected: isIndonesian
                ? 'Sistem menolak atau menampilkan warning untuk email disposable'
                : 'System rejects or displays warning for disposable email',
            priority: 'Low'
        },
        {
            id: 'TC008',
            title: isIndonesian ? 'Registrasi dengan username mengandung karakter khusus' : 'Register with username containing special characters',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Masukkan username dengan karakter khusus (!@#$%)\n2. Isi field lainnya\n3. Coba register'
                : '1. Enter username with special characters (!@#$%)\n2. Fill other fields\n3. Attempt registration',
            expected: isIndonesian
                ? 'Sistem menolak atau membersihkan karakter khusus'
                : 'System rejects or sanitizes special characters',
            priority: 'Medium'
        }
    ];
}

/**
 * Generate form-specific test cases
 */
function generateFormTestCases(userStory) {
    const isIndonesian = currentLanguage === 'id';
    
    return [
        {
            id: 'TC001',
            title: isIndonesian ? 'Submit form dengan data valid' : 'Submit form with valid data',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Buka form\n2. Isi semua field dengan data valid\n3. Klik Submit'
                : '1. Open form\n2. Fill all fields with valid data\n3. Click Submit',
            expected: isIndonesian
                ? 'Form berhasil disubmit dan menampilkan pesan sukses'
                : 'Form successfully submitted and success message displayed',
            priority: 'High'
        },
        {
            id: 'TC002',
            title: isIndonesian ? 'Edit dan submit form' : 'Edit and submit form',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Buka form yang sudah terisi\n2. Edit beberapa field\n3. Klik Submit'
                : '1. Open pre-filled form\n2. Edit some fields\n3. Click Submit',
            expected: isIndonesian
                ? 'Perubahan tersimpan dengan benar'
                : 'Changes saved correctly',
            priority: 'Medium'
        },
        {
            id: 'TC003',
            title: isIndonesian ? 'Reset form' : 'Reset form',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Isi beberapa field\n2. Klik tombol Reset\n3. Verifikasi form'
                : '1. Fill some fields\n2. Click Reset button\n3. Verify form',
            expected: isIndonesian
                ? 'Semua field kembali ke nilai default'
                : 'All fields return to default values',
            priority: 'Low'
        },
        {
            id: 'TC004',
            title: isIndonesian ? 'Submit form dengan field wajib kosong' : 'Submit form with required fields empty',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Buka form\n2. Biarkan field wajib kosong\n3. Klik Submit'
                : '1. Open form\n2. Leave required fields empty\n3. Click Submit',
            expected: isIndonesian
                ? 'Sistem menampilkan pesan validasi untuk field wajib'
                : 'System displays validation message for required fields',
            priority: 'High'
        },
        {
            id: 'TC005',
            title: isIndonesian ? 'Submit form dengan format data salah' : 'Submit form with invalid data format',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Buka form\n2. Isi field dengan format salah (misal: email tanpa @)\n3. Klik Submit'
                : '1. Open form\n2. Fill fields with invalid format (e.g., email without @)\n3. Click Submit',
            expected: isIndonesian
                ? 'Sistem menampilkan pesan error validasi format'
                : 'System displays format validation error message',
            priority: 'High'
        },
        {
            id: 'TC006',
            title: isIndonesian ? 'Submit form dengan data duplikat' : 'Submit form with duplicate data',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Submit form dengan data yang sudah ada\n2. Verifikasi response'
                : '1. Submit form with existing data\n2. Verify response',
            expected: isIndonesian
                ? 'Sistem menampilkan error "Data sudah ada"'
                : 'System displays "Data already exists" error',
            priority: 'Medium'
        },
        {
            id: 'TC007',
            title: isIndonesian ? 'Submit form dengan karakter spesial' : 'Submit form with special characters',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Isi field dengan karakter spesial (!@#$%)\n2. Klik Submit'
                : '1. Fill fields with special characters (!@#$%)\n2. Click Submit',
            expected: isIndonesian
                ? 'Sistem menangani karakter spesial dengan benar atau menampilkan validasi'
                : 'System handles special characters correctly or displays validation',
            priority: 'Medium'
        },
        {
            id: 'TC008',
            title: isIndonesian ? 'Submit form dengan data sangat panjang' : 'Submit form with very long data',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Isi field dengan data melebihi batas maksimal\n2. Klik Submit'
                : '1. Fill fields with data exceeding maximum length\n2. Click Submit',
            expected: isIndonesian
                ? 'Sistem membatasi input atau menampilkan pesan error'
                : 'System limits input or displays error message',
            priority: 'Low'
        }
    ];
}

/**
 * Generate upload-specific test cases
 */
function generateUploadTestCases(userStory) {
    const isIndonesian = currentLanguage === 'id';
    
    return [
        {
            id: 'TC001',
            title: isIndonesian ? 'Upload file dengan format valid' : 'Upload file with valid format',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Klik tombol Upload\n2. Pilih file dengan format yang didukung\n3. Klik Upload'
                : '1. Click Upload button\n2. Select file with supported format\n3. Click Upload',
            expected: isIndonesian
                ? 'File berhasil diupload dan ditampilkan konfirmasi'
                : 'File successfully uploaded and confirmation displayed',
            priority: 'High'
        },
        {
            id: 'TC002',
            title: isIndonesian ? 'Upload multiple file' : 'Upload multiple files',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Pilih beberapa file sekaligus\n2. Klik Upload\n3. Verifikasi semua file'
                : '1. Select multiple files at once\n2. Click Upload\n3. Verify all files',
            expected: isIndonesian
                ? 'Semua file berhasil diupload'
                : 'All files successfully uploaded',
            priority: 'Medium'
        },
        {
            id: 'TC003',
            title: isIndonesian ? 'Hapus file yang sudah diupload' : 'Delete uploaded file',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Upload file\n2. Klik tombol Delete pada file\n3. Konfirmasi penghapusan'
                : '1. Upload file\n2. Click Delete button on file\n3. Confirm deletion',
            expected: isIndonesian
                ? 'File berhasil dihapus dari sistem'
                : 'File successfully deleted from system',
            priority: 'Medium'
        },
        {
            id: 'TC004',
            title: isIndonesian ? 'Upload file dengan format tidak didukung' : 'Upload file with unsupported format',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Pilih file dengan format tidak didukung (.exe)\n2. Coba upload'
                : '1. Select file with unsupported format (.exe)\n2. Attempt upload',
            expected: isIndonesian
                ? 'Sistem menampilkan error "Format file tidak didukung"'
                : 'System displays "Unsupported file format" error',
            priority: 'High'
        },
        {
            id: 'TC005',
            title: isIndonesian ? 'Upload file melebihi ukuran maksimal' : 'Upload file exceeding maximum size',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Pilih file dengan ukuran > batas maksimal\n2. Coba upload'
                : '1. Select file with size > maximum limit\n2. Attempt upload',
            expected: isIndonesian
                ? 'Sistem menampilkan error "Ukuran file terlalu besar"'
                : 'System displays "File size too large" error',
            priority: 'High'
        },
        {
            id: 'TC006',
            title: isIndonesian ? 'Upload tanpa memilih file' : 'Upload without selecting file',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Klik tombol Upload tanpa memilih file\n2. Verifikasi response'
                : '1. Click Upload button without selecting file\n2. Verify response',
            expected: isIndonesian
                ? 'Sistem menampilkan pesan "Pilih file terlebih dahulu"'
                : 'System displays "Please select a file" message',
            priority: 'Medium'
        },
        {
            id: 'TC007',
            title: isIndonesian ? 'Upload file dengan nama sangat panjang' : 'Upload file with very long name',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Pilih file dengan nama > 255 karakter\n2. Coba upload'
                : '1. Select file with name > 255 characters\n2. Attempt upload',
            expected: isIndonesian
                ? 'Sistem memotong nama file atau menampilkan error'
                : 'System truncates filename or displays error',
            priority: 'Low'
        },
        {
            id: 'TC008',
            title: isIndonesian ? 'Upload file dengan koneksi terputus' : 'Upload file with interrupted connection',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Mulai upload file besar\n2. Putuskan koneksi internet\n3. Sambungkan kembali'
                : '1. Start uploading large file\n2. Disconnect internet\n3. Reconnect',
            expected: isIndonesian
                ? 'Sistem menampilkan error atau melanjutkan upload'
                : 'System displays error or resumes upload',
            priority: 'Medium'
        }
    ];
}

/**
 * Generate payment-specific test cases
 */
function generatePaymentTestCases(userStory) {
    const isIndonesian = currentLanguage === 'id';
    
    return [
        {
            id: 'TC001',
            title: isIndonesian ? 'Pembayaran dengan kartu kredit valid' : 'Payment with valid credit card',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Pilih metode pembayaran kartu kredit\n2. Masukkan detail kartu valid\n3. Klik Bayar\n4. Verifikasi OTP'
                : '1. Select credit card payment method\n2. Enter valid card details\n3. Click Pay\n4. Verify OTP',
            expected: isIndonesian
                ? 'Pembayaran berhasil dan email konfirmasi dikirim'
                : 'Payment successful and confirmation email sent',
            priority: 'High'
        },
        {
            id: 'TC002',
            title: isIndonesian ? 'Pembayaran dengan saldo cukup' : 'Payment with sufficient balance',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Pilih metode pembayaran e-wallet\n2. Verifikasi saldo mencukupi\n3. Konfirmasi pembayaran'
                : '1. Select e-wallet payment method\n2. Verify sufficient balance\n3. Confirm payment',
            expected: isIndonesian
                ? 'Pembayaran berhasil dan saldo berkurang'
                : 'Payment successful and balance deducted',
            priority: 'High'
        },
        {
            id: 'TC003',
            title: isIndonesian ? 'Lihat riwayat transaksi' : 'View transaction history',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Login ke akun\n2. Buka halaman riwayat transaksi\n3. Verifikasi data'
                : '1. Login to account\n2. Open transaction history page\n3. Verify data',
            expected: isIndonesian
                ? 'Semua transaksi ditampilkan dengan detail lengkap'
                : 'All transactions displayed with complete details',
            priority: 'Medium'
        },
        {
            id: 'TC004',
            title: isIndonesian ? 'Pembayaran dengan kartu expired' : 'Payment with expired card',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Masukkan detail kartu yang sudah expired\n2. Coba proses pembayaran'
                : '1. Enter expired card details\n2. Attempt payment',
            expected: isIndonesian
                ? 'Sistem menampilkan error "Kartu sudah kadaluarsa"'
                : 'System displays "Card expired" error',
            priority: 'High'
        },
        {
            id: 'TC005',
            title: isIndonesian ? 'Pembayaran dengan saldo tidak cukup' : 'Payment with insufficient balance',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Pilih metode pembayaran\n2. Coba bayar dengan saldo < total'
                : '1. Select payment method\n2. Attempt payment with balance < total',
            expected: isIndonesian
                ? 'Sistem menampilkan error "Saldo tidak mencukupi"'
                : 'System displays "Insufficient balance" error',
            priority: 'High'
        },
        {
            id: 'TC006',
            title: isIndonesian ? 'Pembayaran dengan CVV salah' : 'Payment with incorrect CVV',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Masukkan detail kartu dengan CVV salah\n2. Coba proses pembayaran'
                : '1. Enter card details with incorrect CVV\n2. Attempt payment',
            expected: isIndonesian
                ? 'Sistem menampilkan error validasi CVV'
                : 'System displays CVV validation error',
            priority: 'High'
        },
        {
            id: 'TC007',
            title: isIndonesian ? 'Pembayaran dengan jumlah 0' : 'Payment with amount 0',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Coba proses pembayaran dengan jumlah Rp 0\n2. Verifikasi response'
                : '1. Attempt payment with amount $0\n2. Verify response',
            expected: isIndonesian
                ? 'Sistem menolak atau menampilkan pesan error'
                : 'System rejects or displays error message',
            priority: 'Low'
        },
        {
            id: 'TC008',
            title: isIndonesian ? 'Pembayaran dengan jumlah sangat besar' : 'Payment with very large amount',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Coba proses pembayaran dengan jumlah > batas maksimal\n2. Verifikasi response'
                : '1. Attempt payment with amount > maximum limit\n2. Verify response',
            expected: isIndonesian
                ? 'Sistem menampilkan error atau meminta verifikasi tambahan'
                : 'System displays error or requests additional verification',
            priority: 'Medium'
        }
    ];
}

/**
 * Generate search-specific test cases
 */
function generateSearchTestCases(userStory) {
    const isIndonesian = currentLanguage === 'id';
    
    return [
        {
            id: 'TC001',
            title: isIndonesian ? 'Pencarian dengan keyword valid' : 'Search with valid keyword',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Masukkan keyword di search box\n2. Klik tombol Search\n3. Verifikasi hasil'
                : '1. Enter keyword in search box\n2. Click Search button\n3. Verify results',
            expected: isIndonesian
                ? 'Hasil pencarian relevan ditampilkan'
                : 'Relevant search results displayed',
            priority: 'High'
        },
        {
            id: 'TC002',
            title: isIndonesian ? 'Pencarian dengan filter' : 'Search with filters',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Masukkan keyword\n2. Pilih filter kategori\n3. Klik Search'
                : '1. Enter keyword\n2. Select category filter\n3. Click Search',
            expected: isIndonesian
                ? 'Hasil ditampilkan sesuai filter yang dipilih'
                : 'Results displayed according to selected filters',
            priority: 'Medium'
        },
        {
            id: 'TC003',
            title: isIndonesian ? 'Pencarian dengan sorting' : 'Search with sorting',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Lakukan pencarian\n2. Pilih opsi sorting (A-Z, harga, dll)\n3. Verifikasi urutan'
                : '1. Perform search\n2. Select sorting option (A-Z, price, etc)\n3. Verify order',
            expected: isIndonesian
                ? 'Hasil diurutkan sesuai pilihan'
                : 'Results sorted according to selection',
            priority: 'Medium'
        },
        {
            id: 'TC004',
            title: isIndonesian ? 'Pencarian dengan keyword tidak ditemukan' : 'Search with no results',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Masukkan keyword yang tidak ada\n2. Klik Search'
                : '1. Enter non-existent keyword\n2. Click Search',
            expected: isIndonesian
                ? 'Sistem menampilkan "Tidak ada hasil ditemukan"'
                : 'System displays "No results found"',
            priority: 'High'
        },
        {
            id: 'TC005',
            title: isIndonesian ? 'Pencarian dengan field kosong' : 'Search with empty field',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Biarkan search box kosong\n2. Klik Search'
                : '1. Leave search box empty\n2. Click Search',
            expected: isIndonesian
                ? 'Sistem menampilkan pesan "Masukkan keyword pencarian"'
                : 'System displays "Enter search keyword" message',
            priority: 'Medium'
        },
        {
            id: 'TC006',
            title: isIndonesian ? 'Pencarian dengan karakter spesial' : 'Search with special characters',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Masukkan karakter spesial (!@#$%)\n2. Klik Search'
                : '1. Enter special characters (!@#$%)\n2. Click Search',
            expected: isIndonesian
                ? 'Sistem menangani dengan benar atau menampilkan error'
                : 'System handles correctly or displays error',
            priority: 'Low'
        },
        {
            id: 'TC007',
            title: isIndonesian ? 'Pencarian dengan keyword sangat panjang' : 'Search with very long keyword',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Masukkan keyword > 100 karakter\n2. Klik Search'
                : '1. Enter keyword > 100 characters\n2. Click Search',
            expected: isIndonesian
                ? 'Sistem membatasi input atau menampilkan hasil'
                : 'System limits input or displays results',
            priority: 'Low'
        },
        {
            id: 'TC008',
            title: isIndonesian ? 'Pencarian dengan typo' : 'Search with typo',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Masukkan keyword dengan typo\n2. Klik Search'
                : '1. Enter keyword with typo\n2. Click Search',
            expected: isIndonesian
                ? 'Sistem menampilkan saran "Mungkin maksud Anda: ..."'
                : 'System displays suggestion "Did you mean: ..."',
            priority: 'Medium'
        }
    ];
}

/**
 * Generate generic test cases (fallback)
 */
function generateGenericTestCases(userStory) {
    const isIndonesian = currentLanguage === 'id';
    
    return [
        {
            id: 'TC001',
            title: isIndonesian ? 'Akses fitur dengan user valid' : 'Access feature with valid user',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Login sebagai user valid\n2. Navigasi ke fitur\n3. Gunakan fitur sesuai deskripsi'
                : '1. Login as valid user\n2. Navigate to feature\n3. Use feature as described',
            expected: isIndonesian
                ? 'Fitur berfungsi sesuai ekspektasi'
                : 'Feature works as expected',
            priority: 'High'
        },
        {
            id: 'TC002',
            title: isIndonesian ? 'Verifikasi tampilan UI' : 'Verify UI display',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Buka halaman fitur\n2. Verifikasi semua elemen UI\n3. Check responsiveness'
                : '1. Open feature page\n2. Verify all UI elements\n3. Check responsiveness',
            expected: isIndonesian
                ? 'Semua elemen ditampilkan dengan benar'
                : 'All elements displayed correctly',
            priority: 'Medium'
        },
        {
            id: 'TC003',
            title: isIndonesian ? 'Operasi CRUD berhasil' : 'Successful CRUD operations',
            type: 'Positive',
            steps: isIndonesian
                ? '1. Create data baru\n2. Read/view data\n3. Update data\n4. Delete data'
                : '1. Create new data\n2. Read/view data\n3. Update data\n4. Delete data',
            expected: isIndonesian
                ? 'Semua operasi CRUD berhasil dilakukan'
                : 'All CRUD operations completed successfully',
            priority: 'High'
        },
        {
            id: 'TC004',
            title: isIndonesian ? 'Akses fitur tanpa autentikasi' : 'Access feature without authentication',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Logout dari sistem\n2. Coba akses fitur langsung via URL'
                : '1. Logout from system\n2. Try to access feature directly via URL',
            expected: isIndonesian
                ? 'Sistem redirect ke halaman login'
                : 'System redirects to login page',
            priority: 'High'
        },
        {
            id: 'TC005',
            title: isIndonesian ? 'Akses fitur dengan user tidak berwenang' : 'Access feature with unauthorized user',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Login sebagai user tanpa akses\n2. Coba akses fitur'
                : '1. Login as user without access\n2. Try to access feature',
            expected: isIndonesian
                ? 'Sistem menampilkan error "Akses ditolak"'
                : 'System displays "Access denied" error',
            priority: 'High'
        },
        {
            id: 'TC006',
            title: isIndonesian ? 'Input data tidak valid' : 'Invalid data input',
            type: 'Negative',
            steps: isIndonesian
                ? '1. Coba input data dengan format salah\n2. Submit data'
                : '1. Try to input data with wrong format\n2. Submit data',
            expected: isIndonesian
                ? 'Sistem menampilkan pesan validasi error'
                : 'System displays validation error message',
            priority: 'Medium'
        },
        {
            id: 'TC007',
            title: isIndonesian ? 'Operasi dengan koneksi lambat' : 'Operation with slow connection',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Simulasi koneksi lambat\n2. Lakukan operasi pada fitur\n3. Verifikasi behavior'
                : '1. Simulate slow connection\n2. Perform operation on feature\n3. Verify behavior',
            expected: isIndonesian
                ? 'Sistem menampilkan loading indicator dan menangani timeout'
                : 'System displays loading indicator and handles timeout',
            priority: 'Medium'
        },
        {
            id: 'TC008',
            title: isIndonesian ? 'Operasi bersamaan (concurrent)' : 'Concurrent operations',
            type: 'Edge',
            steps: isIndonesian
                ? '1. Buka fitur di 2 tab berbeda\n2. Lakukan operasi bersamaan\n3. Verifikasi data consistency'
                : '1. Open feature in 2 different tabs\n2. Perform operations simultaneously\n3. Verify data consistency',
            expected: isIndonesian
                ? 'Sistem menangani operasi concurrent dengan benar'
                : 'System handles concurrent operations correctly',
            priority: 'Low'
        }
    ];
}

// ===================================
// Rendering Functions
// ===================================

/**
 * Render test cases to the table
 * @param {Array} testCases - Array of test case objects
 */
function renderTestCases(testCases) {
    const tbody = elements.testCasesBody;
    tbody.innerHTML = '';
    
    testCases.forEach(testCase => {
        const row = createTestCaseRow(testCase);
        tbody.appendChild(row);
    });
}

/**
 * Create a table row for a test case
 * @param {Object} testCase - Test case object
 * @returns {HTMLElement} - Table row element
 */
function createTestCaseRow(testCase) {
    const row = document.createElement('tr');
    
    // ID column
    const idCell = document.createElement('td');
    idCell.textContent = testCase.id;
    row.appendChild(idCell);
    
    // Title column
    const titleCell = document.createElement('td');
    titleCell.textContent = testCase.title;
    row.appendChild(titleCell);
    
    // Type column with badge
    const typeCell = document.createElement('td');
    const typeBadge = document.createElement('span');
    typeBadge.className = `type-badge type-${testCase.type.toLowerCase()}`;
    typeBadge.textContent = testCase.type;
    typeCell.appendChild(typeBadge);
    row.appendChild(typeCell);
    
    // Steps column
    const stepsCell = document.createElement('td');
    stepsCell.textContent = testCase.steps;
    row.appendChild(stepsCell);
    
    // Expected Result column
    const expectedCell = document.createElement('td');
    expectedCell.textContent = testCase.expected;
    row.appendChild(expectedCell);
    
    // Priority column with badge
    const priorityCell = document.createElement('td');
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `priority-badge priority-${testCase.priority.toLowerCase()}`;
    priorityBadge.textContent = testCase.priority;
    priorityCell.appendChild(priorityBadge);
    row.appendChild(priorityCell);
    
    return row;
}

/**
 * Update statistics display
 * @param {Array} testCases - Array of test case objects
 */
function updateStatistics(testCases) {
    const stats = {
        total: testCases.length,
        positive: testCases.filter(tc => tc.type === 'Positive').length,
        negative: testCases.filter(tc => tc.type === 'Negative').length,
        edge: testCases.filter(tc => tc.type === 'Edge').length
    };
    
    // Update bottom summary stats
    elements.totalCases.textContent = stats.total;
    elements.positiveCases.textContent = stats.positive;
    elements.negativeCases.textContent = stats.negative;
    elements.edgeCases.textContent = stats.edge;
    
    // Update summary bar above table
    const summaryPositive = document.getElementById('summaryPositive');
    const summaryNegative = document.getElementById('summaryNegative');
    const summaryEdge = document.getElementById('summaryEdge');
    
    if (summaryPositive) summaryPositive.textContent = stats.positive;
    if (summaryNegative) summaryNegative.textContent = stats.negative;
    if (summaryEdge) summaryEdge.textContent = stats.edge;
}

// ===================================
// Filtering
// ===================================

/**
 * Filter test cases by type
 */
function filterTestCases() {
    const filterValue = elements.typeFilter.value;
    
    let filteredCases = allTestCases;
    
    if (filterValue !== 'all') {
        filteredCases = allTestCases.filter(tc => tc.type === filterValue);
    }
    
    renderTestCases(filteredCases);
    updateStatistics(filteredCases);
}

// ===================================
// CSV Download
// ===================================

/**
 * Download test cases as CSV file
 */
function downloadCSV() {
    if (allTestCases.length === 0) {
        return;
    }
    
    const isIndonesian = currentLanguage === 'id';
    
    // CSV Headers
    const headers = [
        translations[currentLanguage].colID,
        translations[currentLanguage].colTitle,
        translations[currentLanguage].colType,
        translations[currentLanguage].colSteps,
        translations[currentLanguage].colExpected,
        translations[currentLanguage].colPriority
    ];
    
    // Build CSV content
    let csvContent = headers.join(',') + '\n';
    
    allTestCases.forEach(testCase => {
        const row = [
            testCase.id,
            `"${testCase.title.replace(/"/g, '""')}"`,
            testCase.type,
            `"${testCase.steps.replace(/"/g, '""').replace(/\n/g, ' | ')}"`,
            `"${testCase.expected.replace(/"/g, '""')}"`,
            testCase.priority
        ];
        csvContent += row.join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'test_cases.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}