// js/components/do-tracking.js
const DoTracking = {
    props: {
        trackingData: Array,
        lastSequence: Number
    },
    emits: ['create-do'],
    data() {
        return {
            searchQuery: '',
            showAddForm: false,
            form: {
                nim: '',
                nama: '',
                ekspedisi: 'JNE',
                paket: 'PAKET-UT-001'
            }
        };
    },
    computed: {
        filteredList() {
            if (!this.searchQuery) return this.trackingData;
            const q = this.searchQuery.toLowerCase();
            return this.trackingData.filter(t => 
                String(t.id).toLowerCase().includes(q) || 
                String(t.nim).toLowerCase().includes(q)
            );
        }
    },
    methods: {
        generateId() {
            const year = new Date().getFullYear();
            const seq = String(this.lastSequence).padStart(4, '0');
            return `DO${year}-${seq}`;
        },
        handleKey(e) {
            if (e.key === 'Enter') {
                if (this.showAddForm) this.submit();
                else this.search();
            }
            if (e.key === 'Escape') {
                this.showAddForm = false;
                this.searchQuery = '';
            }
        },
        search() {
            // Logic pencarian
            console.log("Searching:", this.searchQuery);
        },
        submit() {
            if(!this.form.nim || !this.form.nama) {
                alert("NIM dan Nama wajib diisi!");
                return;
            }
            this.$emit('create-do', {
                ...this.form,
                id: this.generateId()
            });
            
            // Reset form
            this.form.nim = '';
            this.form.nama = '';
            this.showAddForm = false;
            alert("Nomor DO Berhasil Dibuat!");
        }
    },
    template: `
    <div>
        <div class="controls">
            <h2><i class="fas fa-truck"></i> Tracking Delivery Order</h2>
            
            <div class="search-box">
                <input 
                    v-model="searchQuery" 
                    @keydown="handleKey"
                    placeholder="Cari No. DO atau NIM..." 
                >
                <button @click="searchQuery = ''" v-if="searchQuery">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <button @click="showAddForm = !showAddForm">
                <i class="fas fa-plus"></i> {{ showAddForm ? 'Tutup' : 'Input DO Baru' }}
            </button>
        </div>

        <!-- Form Tambah DO -->
        <div v-if="showAddForm" class="panel-add-do" style="background:#f8fafc; padding:20px; border-radius:12px; margin-bottom:25px; border:2px solid #eef2f7;">
            <h3 style="margin-top:0;"><i class="fas fa-plus-circle"></i> Input Delivery Order Baru</h3>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
                <div class="form-group">
                    <label>No. DO (Otomatis)</label>
                    <input :value="generateId()" disabled style="background:#eef2f7; font-weight:bold;">
                </div>
                <div class="form-group">
                    <label>NIM *</label>
                    <input v-model="form.nim" placeholder="01234...">
                </div>
                <div class="form-group">
                    <label>Nama Mahasiswa *</label>
                    <input v-model="form.nama" placeholder="Nama Lengkap">
                </div>
                <div class="form-group">
                    <label>Ekspedisi</label>
                    <select v-model="form.ekspedisi">
                        <option>JNE</option>
                        <option>TIKI</option>
                        <option>POS Indonesia</option>
                    </select>
                </div>
            </div>
            
            <div style="margin-top:15px;">
                <button @click="submit">
                    <i class="fas fa-save"></i> Simpan DO
                </button>
                <button class="danger" @click="showAddForm = false" style="background:#95a5a6; margin-left:10px;">
                    <i class="fas fa-times"></i> Batal
                </button>
            </div>
            <p style="font-size:12px; color:#7f8c8d; margin-top:10px;">
                * Tekan <strong>Enter</strong> untuk menyimpan, <strong>Esc</strong> untuk membatalkan
            </p>
        </div>

        <!-- Tabel Tracking -->
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Nomor DO</th>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th>Status</th>
                        <th>Ekspedisi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredList" :key="item.id">
                        <td><strong>{{ item.id }}</strong></td>
                        <td>{{ item.nim }}</td>
                        <td>{{ item.nama }}</td>
                        <td>
                            <span :class="{
                                'status-badge status-aman': item.status === 'Telah sampai',
                                'status-badge status-menipis': item.status === 'Dalam Perjalanan',
                                'status-badge status-kosong': item.status === 'Menunggu Konfirmasi'
                            }">
                                {{ item.status }}
                            </span>
                        </td>
                        <td>{{ item.ekspedisi }}</td>
                    </tr>
                    <tr v-if="filteredList.length === 0">
                        <td colspan="5" style="text-align:center; padding:40px;">
                            <i class="fas fa-inbox" style="font-size:2rem; color:#ccc;"></i>
                            <p>Data tidak ditemukan</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
};
