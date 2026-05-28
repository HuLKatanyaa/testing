Vue.component('ba-status-badge', {
    props: {
        qty: {
            type: Number,
            required: true
        },
        safety: {
            type: Number,
            default: 10
        }
    },
    template: `
        <span :class="badgeClass">
            <span class="badge-dot"></span>
            {{ statusText }}
        </span>
    `,
    computed: {
        badgeClass: function() {
            if (this.qty === 0) return 'badge-status badge-danger';
            if (this.qty <= this.safety) return 'badge-status badge-warning';
            return 'badge-status badge-success';
        },
        statusText: function() {
            if (this.qty === 0) return 'Habis';
            if (this.qty <= this.safety) return 'Terbatas (' + this.qty + ')';
            return 'Tersedia (' + this.qty + ')';
        }
    }
});
