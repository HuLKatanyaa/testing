// js/components/order-form.js
const OrderForm = {
    props: {
        isEdit: Boolean,
        initialData: Object
    },
    emits: ['save', 'cancel'],
    data() {
        return {
            form: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            }
        };
    },
    watch: {
        initialData: {
            immediate: true,
            handler(newVal) {
                if (newVal) this.form = { ...newVal };
            }
        }
    },
    methods: {
        saveData() {
            if(!this.form.kode || !this.form.judul) {
                alert("Kode dan Judul wajib diisi!");
                return;
            }
            this.$emit('save', this.form);
        },
        handleKey(e) {
            if(e.key === 'Enter') this.saveData();
            if(e.key === 'Escape') this.$emit('cancel');
        }
    },
    template: `
    <div class="modal-content">
        <div class="modal-header">
            <h3>
                <i :class="isEdit ? 'fas fa-edit' : 'fas fa-plus-circle'"></i> 
                {{ isEdit ? 'Edit' : 'Tambah' }} Bahan Ajar
            </h3>
            <button class="modal-close" @click="$emit('cancel')">&times;</button>
        </div>
        
        <div @keydown="handleKey">
            <div class="form-group">
                <label>Kode Mata Kuliah</label>
                <input v-model="form.kode" placeholder="Contoh: ISIP4216">
            </div>
            
            <div class="form-group">
                <label>Nama Mata Kuliah</label>
                <input v-model="form.judul" placeholder="Judul lengkap mata kuliah">
            </div>

            <div style="display: flex; gap: 15px;">
                <div class="form-group" style="flex: 1;">
                    <label>Kategori</label>
                    <select v-model="form.kategori">
                        <option value="">Pilih Kategori</option>
                        <option>MK Wajib</option>
                        <option>MK Pilihan</option>
                        <option>Praktikum</option>
                        <option>Problem-Based</option>
                    </select>
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>UT Daerah (UPBJJ)</label>
                    <select v-model="form.upbjj">
                        <option value="">Pilih UPBJJ</option>
                        <option>Jakarta</option>
                        <option>Surabaya</option>
                        <option>Makassar</option>
                        <option>Padang</option>
                        <option>Denpasar</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Lokasi Rak</label>
                <input v-model="form.lokasiRak" placeholder="Contoh: R1-A3">
            </div>

            <div style="display: flex; gap: 15px;">
                <div class="form-group" style="flex: 1;">
                    <label>Harga (Rp)</label>
                    <input type="number" v-model="form.harga" placeholder="0">
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>Stok Saat Ini</label>
                    <input type="number" v-model="form.qty" placeholder="0">
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>Safety Stok</label>
                    <input type="number" v-model="form.safety" placeholder="0">
                </div>
            </div>

            <div class="form-group">
                <label>Catatan (HTML supported)</label>
                <input v-model="form.catatanHTML" placeholder="Catatan khusus...">
            </div>

            <div class="form-actions">
                <button class="btn-batal" @click="$emit('cancel')">
                    <i class="fas fa-times"></i> Batal (Esc)
                </button>
                <button class="btn-simpan" @click="saveData">
                    <i class="fas fa-save"></i> Simpan (Enter)
                </button>
            </div>
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 15px;">
                Tekan <strong>Enter</strong> untuk menyimpan, <strong>Esc</strong> untuk membatalkan
            </p>
        </div>
    </div>
    `
};
