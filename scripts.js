const fileName = document.getElementById('name');
const fileUpload = document.getElementById('file-input');
const fileNameDisplay = document.getElementById('file-name');

document.getElementById('convert-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const name = fileName.value;
    const centered = document.getElementById('centered').checked; // Check if the 'Centered' box is checked

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function() {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF();

                const pageWidth = pdf.internal.pageSize.getWidth();  // Width of PDF page in mm
                const pageHeight = pdf.internal.pageSize.getHeight(); // Height of PDF page in mm

                // Get original image dimensions in pixels
                let imgWidth = img.width; 
                let imgHeight = img.height;

                // Convert pixel dimensions to mm (assuming 96 DPI for the screen)
                const pxToMm = 25.4 / 96; // 1 inch = 25.4mm, 96 DPI screen
                let imgWidthMm = imgWidth * pxToMm;
                let imgHeightMm = imgHeight * pxToMm;

                // Only scale down if the image is larger than the page size
                if (imgWidthMm > pageWidth || imgHeightMm > pageHeight) {
                    const widthScale = pageWidth / imgWidthMm;
                    const heightScale = pageHeight / imgHeightMm;
                    const scale = Math.min(widthScale, heightScale); // Choose the smaller scale factor

                    imgWidthMm *= scale;
                    imgHeightMm *= scale;
                }

                // Calculate position
                let xOffset = 0;
                let yOffset = 0;

                if (centered) {
                    // Center the image on the PDF page if the 'Centered' box is checked
                    xOffset = (pageWidth - imgWidthMm) / 2;
                    yOffset = (pageHeight - imgHeightMm) / 2;
                }

                // Add the image at its original or scaled size
                pdf.addImage(img, 'JPEG', xOffset, yOffset, imgWidthMm, imgHeightMm);
                pdf.save(`${name}.pdf`);
            };
        };

        reader.readAsDataURL(file);
    } else {
        alert('Please select an image.');
    }
});

fileUpload.addEventListener('change', function() {
    const fileName = this.files[0]?.name || 'No file chosen';
    fileNameDisplay.textContent = '✅' + fileName; 
});
