// PDF Analysis Script to Extract Domains and Main Topics

async function extractTextFromPDF(file) {
    const pdfjsLib = await import('pdfjs-dist/webpack');
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    let textContent = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        text.items.forEach(item => {
            textContent += item.str + ' ';
        });
    }

    return textContent;
}

function extractDomainsAndTopics(text) {
    const domainKeywords = ['Prioritisation', 'Leadership', 'Management', 'Medical Expertise', 'Communication'];
    const topicKeywords = ['diagnosis', 'treatment', 'emergency', 'critical care', 'workflow', 'patient management'];

    const domains = domainKeywords.filter(keyword => text.includes(keyword));
    const mainTopics = topicKeywords.filter(keyword => text.includes(keyword));

    return { domains, mainTopics };
}

function handlePDFUpload(file, callback) {
    extractTextFromPDF(file).then(text => {
        const analysis = extractDomainsAndTopics(text);
        callback(analysis);
    }).catch(error => {
        console.error('Error extracting PDF text:', error);
        callback(null, error);
    });
}

// Example Usage
// Bind this to your file input element in your main application
const candidateInput = document.getElementById('candidateInstructionsPDF');

candidateInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        handlePDFUpload(file, (analysis, error) => {
            if (error) {
                alert('Failed to analyze the PDF. Please try again.');
            } else {
                console.log('Extracted Data:', analysis);
                alert(`Domains: ${analysis.domains.join(', ')}\nMain Topics: ${analysis.mainTopics.join(', ')}`);
            }
        });
    }
});
