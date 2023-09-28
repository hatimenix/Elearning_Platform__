import React, { useEffect, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocViewer = ({ url, onLastPageRendered }) => {
    const [numPages, setNumPages] = useState(null);
    const [lastPageRendered, setLastPageRendered] = useState(false);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                const pdf = await pdfjs.getDocument(url).promise;
                const pagesCount = pdf.numPages;
                setNumPages(pagesCount);

                for (let pageNumber = 1; pageNumber <= pagesCount; pageNumber++) {
                    const page = await pdf.getPage(pageNumber);
                    const scale = 1.5;
                    const viewport = page.getViewport({ scale });

                    const canvas = document.getElementById(`pdf-render-${pageNumber}`);
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport,
                    };

                    await page.render(renderContext).promise;

                    if (pageNumber === pagesCount) {
                        setLastPageRendered(true);
                        if (onLastPageRendered) {
                            onLastPageRendered();
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading PDF:', error);
            }
        };

        loadPDF();
    }, [url]);

    return (
        <div>
            {numPages && (
                <>
                    {Array.from(new Array(numPages), (el, index) => (
                        <canvas
                            key={`page_${index + 1}`}
                            id={`pdf-render-${index + 1}`}
                        ></canvas>
                    ))}
                    {lastPageRendered && onLastPageRendered && onLastPageRendered()}
                </>
            )}
        </div>
    );
};

export default DocViewer;
