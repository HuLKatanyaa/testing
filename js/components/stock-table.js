Vue.component('ba-stock-table', {
    props: {
        items: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    template: `
        <div class="table-wrap">
            <table v-if="items.length > 0">
                <thead>
                    <tr>
                        <th>Kode</th>
                        <th>Judul</th>
                        <th>Kategori</th>
                        <th>UPBJJ</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.kode">
                        <td><span class="kode-badge">{{ item.kode }}</span></td>
                        <td>
                            <div class="judul-text">{{ item.judul }}</div>
                            <div class="rak-text">{{ item.lokasiRak }}</div>
                        </td>
                        <td><span class="kategori-badge">{{ item.kategori }}</span></td>
                        <td class="upbjj-text">{{ item.upbjj }}</td>
                        <td class="harga-text">{{ formatRupiah(item.harga) }}</td>
                        <td>
                            <ba-status-badge :qty="item.qty" :safety="item.safety"></ba-status-badge>
                        </td>
                        <td>
                            <button 
                                class="btn-pilih" 
                                @click="$emit('pilih', item)"
                                :disabled="item.qty === 0">
                                {{ item.qty === 0 ? 'Tidak Ada' : 'Pilih' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-else class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>Tidak ada data buku</p>
            </div>
        </div>
    `,
    methods: {
        formatRupiah: function(value) {
            if (typeof value !== 'number') return 'Rp 0';
            return 'Rp ' + value.toLocaleString('id-ID');
        }
    }
});

// js/components/stock-table.js
const StockTable = {
    props: {
        rawData: {
            type: Array,
            default: () => []
        },
        upbjjList: {
            type: Array,
            default: () => []
        },
        kategoriList: {
            type: Array,
            default: () => []
        }
    },
    emits: ['add-new', 'edit-item', 'delete-item'],
    data() {
        return {
            filterUPBJJ: '',
            filterKat: '',
            showLowStock: false,
            sortKey: 'judul',
            sortAsc: true
        };
    },
    computed: {
        filteredData() {
            console.log("Filtering data, total:", this.rawData.length);
            
            let data = [...this.rawData]; // Create copy

            // Filter UPBJJ
            if (this.filterUPBJJ) {
                data = data.filter(i => i.upbjj === this.filterUPBJJ);
            }

            // Filter Kategori
            if (this.filterKat) {
                data = data.filter(i => i.kategori === this.filterKat);
            }

            // Filter Stok Rendah
            if (this.showLowStock) {
                data = data.filter(i => i.qty < i.safety || i.qty === 0);
            }

            // Sorting
            data.sort((a, b) => {
                let valA = a[this.sortKey];
                let valB = b[this.sortKey];
                
                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA < valB) return this.sortAsc ? -1 : 1;
                if (valA > valB) return this.sortAsc ? 1 : -1;
                return 0;
            });

            return data;
        }
    },
    methods: {
        formatCurrency(val) {
            return new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR',
                minimumFractionDigits: 0 
            }).format(val);
        },
        getStatus(item) {
            if (item.qty === 0) return { label: 'Kosong', class: 'status-kosong', icon: '❌' };
            if (item.qty < item.safety) return { label: 'Menipis', class: 'status-menipis', icon: '⚠️' };
            return { label: 'Aman', class: 'status-aman', icon: '✅' };
        },
        doSort(key) {
            if (this.sortKey === key) {
                this.sortAsc = !this.sortAsc;
            } else {
                this.sortKey = key;
                this.sortAsc = true;
            }
        },
        triggerEdit(item) {
            this.$emit('edit-item', { ...item });
        },
        triggerDelete(kode) {
            if(confirm('Yakin hapus "' + kode + '"?')) {
                this.$emit('delete-item', kode);
            }
        }
    },
    template: `
    <div>
        <!-- Loading State -->
        <div v-if="rawData.length === 0" class="empty-state">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-color);"></i>
            <p>Memuat data...</p>
        </div>

        <!-- Filters -->
        <div class="controls" v-else>
            <select v-model="filterUPBJJ">
                <option value="">Semua UPBJJ</option>
                <option v-for="u in upbjjList" :key="u" :value="u">{{ u }}</option>
            </select>
            
            <select v-model="filterKat">
                <option value="">Semua Kategori</option>
                <option v-for="k in kategoriList" :key="k" :value="k">{{ k }}</option>
            </select>

            <label class="checkbox-label">
                <input type="checkbox" v-model="showLowStock"> 
                <i class="fas fa-exclamation-triangle"></i> Stok Menipis/Kosong
            </label>

            <button @click="$emit('add-new')" style="margin-left: auto;">
                <i class="fas fa-plus"></i> Tambah
            </button>
        </div>

        <!-- Table -->
        <div class="table-wrapper" v-if="rawData.length > 0">
            <table>
                <thead>
                    <tr>
                        <th @click="doSort('kode')">Kode <i class="fas fa-sort"></i></th>
                        <th @click="doSort('judul')">Mata Kuliah <i class="fas fa-sort"></i></th>
                        <th @click="doSort('kategori')">Kategori <i class="fas fa-sort"></i></th>
                        <th @click="doSort('upbjj')">UT-Daerah <i class="fas fa-sort"></i></th>
                        <th>Lokasi</th>
                        <th @click="doSort('harga')">Harga</th>
                        <th @click="doSort('qty')">Stok</th>
                        <th>Safety</th>
                        <th>Status (Hover)</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredData" :key="item.kode">
                        <td><strong>{{ item.kode }}</strong></td>
                        <td>{{ item.judul }}</td>
                        <td>{{ item.kategori }}</td>
                        <td>{{ item.upbjj }}</td>
                        <td>{{ item.lokasiRak }}</td>
                        <td>{{ formatCurrency(item.harga) }}</td>
                        <td>{{ item.qty }} buah</td>
                        <td>{{ item.safety }} buah</td>
                        <td>
                            <div class="tooltip">
                                <span :class="getStatus(item).class" style="font-size: 1.2rem;">
                                    {{ getStatus(item).icon }}
                                </span>
                                <span class="tooltiptext" v-html="item.catatanHTML || ' Tidak ada catatan'"></span>
                            </div>
                        </td>
                        <td>
                            <button @click="triggerEdit(item)" style="background: #3498db; margin-right: 5px;">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="danger" @click="triggerDelete(item.kode)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Empty Filter -->
        <div v-if="rawData.length > 0 && filteredData.length === 0" class="empty-state">
            <i class="fas fa-filter"></i>
            <p>Tidak ada data yang cocok dengan filter</p>
        </div>
    </div>
    `
};
