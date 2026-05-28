// js/services/api.js
const DataService = {
    async getBahanAjar() {
        try {
            console.log("Fetching data...");
            const response = await fetch('./data/dataBahanAjar.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Data fetched successfully:", data);
            return data;
            
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("❌ Gagal memuat data!\n\nPastikan:\n1. File JSON ada di folder /data\n2. Menggunakan Live Server (bukan double-click HTML)");
            return {
                upbjjList: ["Jakarta"],
                kategoriList: ["MK Wajib"],
                stok: [],
                tracking: []
            };
        }
    }
};
