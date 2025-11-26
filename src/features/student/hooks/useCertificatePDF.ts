import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { type Certificate } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useGenerateCertificatePDF() {
    return useMutation({
        mutationFn: async (certificate: Certificate) => {
            // Create a temporary container for the certificate
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.width = '800px';
            container.style.padding = '40px';
            container.style.backgroundColor = 'white';
            container.style.fontFamily = 'Arial, sans-serif';

            container.innerHTML = `
                <div style="border: 10px solid #2563eb; padding: 60px; text-align: center;">
                    <h1 style="font-size: 48px; color: #1e40af; margin-bottom: 20px; text-transform: uppercase;">
                        Certificate of Completion
                    </h1>
                    <div style="height: 2px; width: 200px; background: #2563eb; margin: 20px auto;"></div>
                    <p style="font-size: 20px; margin: 30px 0;">This is to certify that</p>
                    <h2 style="font-size: 36px; color: #1e40af; margin: 20px 0;">
                        ${certificate.user?.name}
                    </h2>
                    <p style="font-size: 20px; margin: 30px 0;">has successfully completed</p>
                    <h3 style="font-size: 28px; color: #374151; margin: 20px 0;">
                        ${certificate.course?.title}
                    </h3>
                    <p style="font-size: 16px; color: #6b7280; margin: 40px 0 20px 0;">
                        Awarded on ${new Date(certificate.issued_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            })}
                    </p>
                    <div style="margin-top: 60px;">
                        <p style="font-size: 14px; color: #9ca3af;">
                            Certificate ID: ${certificate.certificate_number}
                        </p>
                    </div>
                </div>
            `;

            document.body.appendChild(container);

            try {
                // Convert HTML to canvas
                const canvas = await html2canvas(container, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                });

                // Create PDF
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });

                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

                // Download PDF
                pdf.save(`certificate-${certificate.certificate_number}.pdf`);

                return true;
            } finally {
                document.body.removeChild(container);
            }
        },
    });
}

export function useShareCertificateLinkedIn() {
    return (certificate: Certificate) => {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            `${window.location.origin}/certificates/verify/${certificate.certificate_number}`
        )}`;

        window.open(linkedInUrl, '_blank', 'width=600,height=600');
    };
}
