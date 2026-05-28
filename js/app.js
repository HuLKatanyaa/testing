// js/app.js
const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentView: 'stok', // Default view
            bahanAjarData: [],
            trackingData: [],
            meta: {
                upbjjList: [],
                kategoriList: []
            },
            // Modal State
            showModal: false,
            isEditing: false,
            formData: null,
            // For Tracking
            lastDoSequence: 2
        }
    },
    async mounted() {
        console.log("App mounted, loading data...");
        await this.loadData();
    },
    methods: {
        // Ganti menu
        changeView(view) {
            this.currentView = view;
            console.log("View changed to:", view);
        },
        
        // Load Data dari JSON
        async loadData() {
            const data = await DataService.getBahanAjar(); // Menggunakan Variabel dari api.js
            if (data) {
                this.bahanAjarData = data.stok || [];
                this.meta.upbjjList = data.upbjjList || [];
                this.meta.kategoriList = data.kategoriList || [];
                this.lastDoSequence = this.generateSequence();
                console.log("Data loaded:", this.bahanAjarData.length, "items");
            }
        },

        generateSequence() {
            // Cari sequence terakhir dari tracking yang ada atau default
            return 2; 
        },
        
        // --- Stok Functions ---
        openForm(item = null) {
            if (item) {
                this.isEditing = true;
                this.formData = { ...item }; // Copy object
            } else {
                this.isEditing = false;
                this.formData = { 
                    kode: '', 
                    judul: '', 
                    kategori: '', 
                    upbjj: '', 
                    lokasiRak: '', 
                    harga: 0, 
                    qty: 0, 
                    safety: 0, 
                    catatanHTML: '' 
                };
            }
            this.showModal = true;
        },
        
        saveItem(data) {
            if (this.isEditing) {
                // Update
                const index = this.bahanAjarData.findIndex(x => x.kode === data.kode);
                if (index !== -1) {
                    this.bahanAjarData[index] = data;
                }
            } else {
                // Create (Check exists)
                if (!this.bahanAjarData.find(x => x.kode === data.kode)) {
                    this.bahanAjarData.push(data);
                } else {
                    alert("Kode sudah ada!");
                    return;
                }
            }
            this.showModal = false;
        },
        
        deleteItem(kode) {
            this.bahanAjarData = this.bahanAjarData.filter(item => item.kode !== kode);
        },

        // --- Tracking Functions ---
        handleCreateDo(newDoData) {
            this.trackingData.unshift({
                id: newDoData.id,
                nim: newDoData.nim,
                nama: newDoData.nama,
                status: 'Menunggu Konfirmasi',
                ekspedisi: newDoData.ekspedisi,
                tanggalKirim: new Date().toISOString().split('T')[0],
                paket: newDoData.paket,
                total: 0,
                perjalanan: []
            });
            this.lastDoSequence++;
        }
    }
});

// Mount Aplikasi
app.mount('#app');

// js/app.js
const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentView: 'stok',
            bahanAjarData: [],
            trackingData: [],
            meta: {
                upbjjList: [],
                kategoriList: []
            },
            // Modal State
            showModal: false,
            isEditing: false,
            formData: null,
            // Loading State
            isLoading: true,
            errorMessage: '',
            // For Tracking
            lastDoSequence: 2
        }
    },
    async mounted() {
        console.log("✅ App Mounted, loading data...");
        await this.loadData();
    },
    methods: {
        changeView(view) {
            this.currentView = view;
            console.log("View changed to:", view);
        },
        
        async loadData() {
            this.isLoading = true;
            this.errorMessage = '';
            
            try {
                const data = await DataService.getBahanAjar();
                
                if (data) {
                    // Assign Data
                    this.bahanAjarData = data.stok || [];
                    this.meta.upbjjList = data.upbjjList || [];
                    this.meta.kategoriList = data.kategoriList || [];
                    
                    // Process Tracking Data
                    if (data.tracking && data.tracking.length > 0) {
                        this.trackingData = data.tracking.map(obj => {
                            const key = Object.keys(obj)[0];
                            return { id: key, ...obj[key] };
                        });
                    } else {
                        this.trackingData = [];
                    }
                    
                    console.log("✅ Data loaded:", {
                        stok: this.bahanAjarData.length,
                        tracking: this.trackingData.length,
                        upbjj: this.meta.upbjjList
                    });
                }
            } catch (err) {
                console.error("❌ Error:", err);
                this.errorMessage = "Gagal memuat data";
            } finally {
                this.isLoading = false;
            }
        },
        
        // --- Stok Functions ---
        openForm(item = null) {
            if (item) {
                this.isEditing = true;
                this.formData = { ...item };
            } else {
                this.isEditing = false;
                this.formData = { 
                    kode: '', 
                    judul: '', 
                    kategori: '', 
                    upbjj: '', 
                    lokasiRak: '', 
                    harga: 0, 
                    qty: 0, 
                    safety: 0, 
                    catatanHTML: '' 
                };
            }
            this.showModal = true;
        },
        
        saveItem(data) {
            if (this.isEditing) {
                const index = this.bahanAjarData.findIndex(x => x.kode === data.kode);
                if (index !== -1) {
                    this.bahanAjarData[index] = data;
                }
            } else {
                if (!this.bahanAjarData.find(x => x.kode === data.kode)) {
                    this.bahanAjarData.push(data);
                } else {
                    alert("Kode sudah ada!");
                    return;
                }
            }
            this.showModal = false;
        },
        
        deleteItem(kode) {
            if(confirm('Yakin hapus data ini?')) {
                this.bahanAjarData = this.bahanAjarData.filter(item => item.kode !== kode);
            }
        },

        // --- Tracking Functions ---
        handleCreateDo(newDoData) {
            this.trackingData.unshift({
                id: newDoData.id,
                nim: newDoData.nim,
                nama: newDoData.nama,
                status: 'Menunggu Konfirmasi',
                ekspedisi: newDoData.ekspedisi,
                tanggalKirim: new Date().toISOString().split('T')[0],
                paket: newDoData.paket,
                total: 0,
                perjalanan: []
            });
            this.lastDoSequence++;
        }
    }
});

app.mount('#app');
