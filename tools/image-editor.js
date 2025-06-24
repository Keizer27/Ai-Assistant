import { showToast, callGoogleAI, downloadAsFile } from '../scripts.js';

export function initializeImageEditor(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="tool-header">
            <h2>AI Image Editor</h2>
        </div>
        <div class="image-editor-container">
            <div class="image-upload" id="image-upload">
                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; margin-bottom: 15px;"></i>
                <p>Drag & drop image or click to browse</p>
                <input type="file" id="file-input" accept="image/*" style="display: none;">
            </div>
            <img id="image-preview" class="image-preview">
            <div class="image-controls" id="image-controls" style="display: none;">
                <div class="form-group">
                    <label>Edit Instructions</label>
                    <textarea id="edit-instructions" placeholder="Describe what changes you want to make"></textarea>
                </div>
                <button class="image-control" id="enhance-btn"><i class="fas fa-magic"></i> Enhance</button>
                <button class="image-control" id="remove-bg-btn"><i class="fas fa-cut"></i> Remove Background</button>
                <button class="image-control" id="colorize-btn"><i class="fas fa-palette"></i> Colorize</button>
                <button class="image-control" id="apply-changes-btn"><i class="fas fa-check"></i> Apply Changes</button>
            </div>
            <div class="tool-actions" id="image-actions" style="display: none;">
                <button class="action-btn copy-btn" id="copy-image">
                    <i class="fas fa-copy"></i> Copy Image
                </button>
                <button class="action-btn save-btn" id="save-image">
                    <i class="fas fa-save"></i> Save Image
                </button>
            </div>
        </div>
    `;
    
    const imageUpload = document.getElementById('image-upload');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const imageControls = document.getElementById('image-controls');
    const editInstructions = document.getElementById('edit-instructions');
    const enhanceBtn = document.getElementById('enhance-btn');
    const removeBgBtn = document.getElementById('remove-bg-btn');
    const colorizeBtn = document.getElementById('colorize-btn');
    const applyChangesBtn = document.getElementById('apply-changes-btn');
    const copyImageBtn = document.getElementById('copy-image');
    const saveImageBtn = document.getElementById('save-image');
    const imageActions = document.getElementById('image-actions');
    
    let currentImage = null;
    
    // Handle image upload
    imageUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleImageUpload);
    
    // Handle drag and drop
    imageUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUpload.style.borderColor = '#03dac6';
    });
    
    imageUpload.addEventListener('dragleave', () => {
        imageUpload.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    imageUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUpload.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleImageUpload();
        }
    });
    
    // Image edit buttons
    enhanceBtn.addEventListener('click', () => editImage('Enhance this image'));
    removeBgBtn.addEventListener('click', () => editImage('Remove the background from this image'));
    colorizeBtn.addEventListener('click', () => editImage('Colorize this image'));
    applyChangesBtn.addEventListener('click', () => {
        if (editInstructions.value.trim()) {
            editImage(editInstructions.value.trim());
        } else {
            showToast('Please enter edit instructions');
        }
    });
