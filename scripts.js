// Selecting necessary DOM elements
const fileInput = document.getElementById('file-input');
const fileNameDisplay = document.getElementById('file-name');
const dropArea = document.getElementById('file-drop-area');
const convertBtn = document.getElementById('convert-btn');
const fileNameInput = document.getElementById('name');
const centeredCheckbox = document.getElementById('centered');

// Handle file drop events for drag-and-drop functionality
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();  // Prevent default behavior to allow drop
    dropArea.classList.add('dragover');  // Add class to indicate the area is ready for dropping
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');  // Remove dragover class when leaving the area
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragover');  // Remove dragover class after dropping
    const files = event.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;  // Set the dropped files to the hidden file input
        fileNameDisplay.textContent = '✅ ' + files[0].name;  // Display file name
    }
});

// Handle file selection via "Choose File" button
fileInput.addEventListener('change', function() {
    const fileName = this.files[0]?.name || 'No file chosen';
    fileNameDisplay.textContent = '✅ ' + fileName;  // Display selected file name
});

// Convert selected JPEG to PDF when "Convert" button is clicked
convertBtn.addEventListener('click', function() {
    const file = fileInput.files[0];  // Get the selected file
    const fileName = fileNameInput.value || 'untitled';  // Get the name input or use 'untitled'
    const centered = centeredCheckbox.checked;  // Check if the image should be centered

    // Add a check to ensure a file has been selected
    if (!file) {
        alert('Please select a JPEG image before converting.');
        return;  // Stop the function execution if no file is selected
    }

    // Now that we are sure the file is valid, proceed
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Get image dimensions in pixels
            let imgWidth = img.width;
            let imgHeight = img.height;

            // Convert image dimensions from px to mm (assuming 96 DPI)
            const pxToMm = 25.4 / 96;
            let imgWidthMm = imgWidth * pxToMm;
            let imgHeightMm = imgHeight * pxToMm;

            // Scale image if it’s larger than the page
            if (imgWidthMm > pageWidth || imgHeightMm > pageHeight) {
                const scaleFactor = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm);
                imgWidthMm *= scaleFactor;
                imgHeightMm *= scaleFactor;
            }

            // Calculate position for centering
            let xOffset = centered ? (pageWidth - imgWidthMm) / 2 : 0;
            let yOffset = centered ? (pageHeight - imgHeightMm) / 2 : 0;

            // Add the image to the PDF
            pdf.addImage(img, 'JPEG', xOffset, yOffset, imgWidthMm, imgHeightMm);
            pdf.save(`${fileName}.pdf`);  // Save the PDF with the provided name
        };
    };

    reader.readAsDataURL(file);  // Convert file to DataURL
});
