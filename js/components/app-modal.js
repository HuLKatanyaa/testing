const AppModal = {
    emits: ['close'],
    template: `
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
            <slot></slot>
        </div>
    </div>
    `
};
